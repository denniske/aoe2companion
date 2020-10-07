import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {fromUnixTime, getUnixTime, subDays, subHours} from "date-fns";
import {fetchOngoingMatches} from "../helper";
import {
    Environment, fetchPlayerMatchesLegacyRaw, formatDayAndTime, IHostService, IHttpService, OS, registerService,
    SERVICE_NAME
} from "@nex/data";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";
import {flatMap} from 'lodash';
import fetch from "node-fetch";
import {IMatchBase} from '../entity/entity.type';
import {upsertMatchesWithPlayers} from '../entity/entity-helper';


class HostService implements IHostService {
    getPlatform(): OS {
        return 'ios';
    }

    getEnvironment(): Environment {
        return process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
    }
}

class HttpService implements IHttpService {
    async fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
        if (init) {
            console.log(input, init);
        } else {
            console.log(input);
        }
        let response = null;
        try {
            response = await fetch(input as any, init as any);
            return await response.json();
        } catch (e) {
            console.log(input, 'failed', response?.status);
        }
    }
}

registerService(SERVICE_NAME.HOST_SERVICE, new HostService());
registerService(SERVICE_NAME.HTTP_SERVICE, new HttpService());

// type MatchWithPlayers = match & {
//     players: player[],
// }

const FETCH_COUNT = 500;

@Injectable()
export class RefetchMultipleTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchMultipleTask.name);

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    async onModuleInit() {
        // Wait until dev server started
        setTimeout(() => this.refetchMatches(), 1000);
    }

    async refetchMatches() {
        try {
            const matchesProcessed = await this.refetchMatchesSinceLastTime();
            if (matchesProcessed) {
                console.log('Waiting 0s');
                setTimeout(() => this.refetchMatches(), 0 * 1000);
            } else {
                console.log('Waiting 10s');
                setTimeout(() => this.refetchMatches(), 10 * 1000);
            }
        } catch (e) {
            console.error(e);
            setTimeout(() => this.refetchMatches(), 60 * 1000);
        }
    }

    async refetchMatchesSinceLastTime() {
        console.log(new Date(), "Fetch ongoing matches");
        const ongoingMatchesResult = await fetchOngoingMatches();
        const ongoingMatches = ongoingMatchesResult.data;
        const ongoingMatchIds = ongoingMatches.map(m => m.id);
        console.log(new Date(), 'GOT', ongoingMatches.length);

        const twoHoursAgo = subHours(new Date(), 2);

        console.log(new Date(), "Refetch unfinished matches");
        let unfinishedMatches = await this.prisma.match.findMany({
            where: {
                AND: [
                    {maybe_finished: -1},
                    {finished: null},
                    {started: {gt: getUnixTime(twoHoursAgo)}},
                ],
            },
            orderBy: {started: 'desc'},
            // take: 500,
            include: {
                players: true,
            }
        });

        console.log(new Date(), 'GOT', unfinishedMatches.length);

        unfinishedMatches = unfinishedMatches.filter(m => !ongoingMatchIds.includes(m.match_id));

        console.log(new Date(), 'REMOVED ONGOING NOW GO', unfinishedMatches.length);

        if (unfinishedMatches.length === 0) return false;

        while(unfinishedMatches.length > 0) {
            console.log();
            console.log('UNFINISHED LENGTH', unfinishedMatches.length);
            console.log();
            let returnedMatchIds = await this.refetchMatchesFromServer(unfinishedMatches.filter((m, i) => i < FETCH_COUNT));
            unfinishedMatches = unfinishedMatches.filter(m => !returnedMatchIds.includes(m.match_id));

            // console.log('AGAIN LENGTH', unfinishedMatches.length);
            // if (returnedMatchIds.length < 100) {
            //     returnedMatchIds = await this.refetchMatchesFromServer(unfinishedMatches.filter((m, i) => i < 200));
            //     unfinishedMatches = unfinishedMatches.filter(m => !returnedMatchIds.includes(m.match_id));
            // }

            console.log();
            // await sleep(20);
        }

        return true;
    }

    async refetchMatchesFromServer(unfinishedMatches: IMatchBase[], offset: number = 0, alreadyProcessedMatchIds: string[] = []) {
        const unfinishedPlayers = unfinishedMatches.map(m => m.players.filter(p => p.profile_id)[0]);
        const params = unfinishedPlayers.map(p => ({ profile_id: p.profile_id }));
        const matches = await fetchPlayerMatchesLegacyRaw('aoe2de', 0, FETCH_COUNT, params);
        console.log(new Date(), 'GOT', matches.length);

        const queriedPlayers = unfinishedPlayers.map(p => p.profile_id);

        // const matchLists = queriedPlayers.map(qpId => matches.filter(m => m.players.some(p => p.profile_id == qpId)));

        const matchLists = queriedPlayers.map(qpId => {
            return matches.filter(m => m.players.some(p => p.profile_id == qpId)).map(m => ({
                    profile_id: qpId,
                    match_id: m.match_id,
                    started: formatDayAndTime(fromUnixTime(m.started)),
                    finished: m.finished ? formatDayAndTime(fromUnixTime(m.finished)) : null,
                    // maybe_finished: m.maybe_finished,
                }));
        });

        // console.log(matchLists);
        // console.log(matchLists.map(ml => ml.map(m => ({
        //     match_id: m.match_id,
        //     fin: m.finished,
        //     mfin: m.maybe_finished,
        // }))));



        const returnedPlayers = flatMap(matches, m => m.players).map(p => p.profile_id);
        const samePlayers = queriedPlayers.filter(qp => returnedPlayers.includes(qp)).length;
        const sameMatches = matches.filter(qm => unfinishedMatches.map(m => m.match_id).includes(qm.match_id));
        console.log('SAME PLAYERS COUNT', samePlayers);
        console.log('SAME MATCH COUNT', sameMatches.length);

        const finishedMatches = sameMatches.filter(m => m.finished);
        console.log('Same and finished matches', finishedMatches.length);

        console.log(new Date());

        for (const m of finishedMatches) {
            console.log(fromUnixTime(m.finished), m.match_id, ((new Date().getTime() - fromUnixTime(m.finished).getTime())/1000).toFixed(2), 's late');
        }

        await upsertMatchesWithPlayers(this.connection, finishedMatches, false);

        // const result = [...alreadyProcessedMatchIds, ...sameMatches.map(m => m.match_id)];
        //
        // if (sameMatches.length < 100) {
        //     return this.refetchMatchesFromServer(unfinishedMatches, offset+1, result)
        // }
        //
        // return result;

        return sameMatches.map(m => m.match_id);
    }
}
