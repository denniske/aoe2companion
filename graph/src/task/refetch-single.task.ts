import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {differenceInHours, fromUnixTime} from "date-fns";
import {formatDayAndTime} from "../util";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatch} from "../helper";
import {myTodoList} from "@nex/data";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";


const FETCH_COUNT = 300;

@Injectable()
export class RefetchSingleTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchSingleTask.name);

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    async onModuleInit() {
        console.log('REFETCH LEN:', myTodoList.length);
        await this.refetchMatches();
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

        console.log(new Date(), "Refetch unfinished matches");

        const unfinishedMatches = await this.prisma.match.findMany({
            where: {
                AND: [
                    {maybe_finished: null},
                    {finished: null},
                ],
            },
            orderBy: {started: 'asc'},
            take: FETCH_COUNT,
            include: {
                players: true,
            }
        })

        console.log('GOT', unfinishedMatches.length);

        if (unfinishedMatches.length === 0) return false;

        for (const unfinishedMatch of unfinishedMatches) {
            console.log(new Date(), "Fetch match", unfinishedMatch.match_id, formatDayAndTime(fromUnixTime(unfinishedMatch.started)));
            let updatedMatch = await fetchMatch('aoe2de', {
                uuid: unfinishedMatch.match_uuid,
                match_id: unfinishedMatch.match_id
            });
            const hoursAgo = differenceInHours(new Date(), fromUnixTime(unfinishedMatch.started));
            console.log(new Date(), "Fetched match", hoursAgo + 'h ago');
            if (updatedMatch) {
                if (updatedMatch.finished) {
                    // console.log('WANT', updatedMatch);
                    await upsertMatchesWithPlayers(this.connection, [updatedMatch], false);
                    console.log(new Date(), 'SAVED');
                } else {
                    await this.prisma.match.update({
                        where: {
                            match_id: unfinishedMatch.match_id,
                        },
                        data: {
                            maybe_finished: hoursAgo >= 24 ? -5 : -1,
                        },
                    });
                    console.log(new Date(), hoursAgo >= 24 ? 'UNFINISHED FOREVER' : 'UNFINISHED');
                }
            } else {
                console.log(new Date(), 'NOT FOUND');
            }
        }

        return true;
    }
}
