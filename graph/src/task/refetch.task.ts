import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {differenceInHours, fromUnixTime, getUnixTime, subDays} from "date-fns";
import {formatDayAndTime} from "../util";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatch, fetchMatches} from "../helper";
import {IMatchRaw, myTodoList} from "@nex/data";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";


const FETCH_COUNT = 300;

@Injectable()
export class RefetchTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchTask.name);

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

        let unfinishedMatches = await this.prisma.match.findMany({
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

        // if (unfinishedMatches.length === 0) return false;

        while(unfinishedMatches.length > 0) {
            console.log('TO PROCESS', unfinishedMatches.length)
            const firstUnfinishedMatch = unfinishedMatches[0];

            // How many matches are in the next 10min from firstUnfinishedMatch?
            const matchesInNext10Min = unfinishedMatches.filter(m => m.started < firstUnfinishedMatch.started + 10 * 60).length;
            console.log(new Date(), 'matchesInNext10Min', matchesInNext10Min);

            let updatedMatches: IMatchRaw[];
            if (matchesInNext10Min < 5) {
                console.log(new Date(), "Fetch match", firstUnfinishedMatch.match_id, formatDayAndTime(fromUnixTime(firstUnfinishedMatch.started)));
                updatedMatches = [await fetchMatch('aoe2de', {
                    uuid: firstUnfinishedMatch.match_uuid,
                    match_id: firstUnfinishedMatch.match_id
                })];
            } else {
                console.log(new Date(), "Fetch matches dataset", firstUnfinishedMatch.started - 1, formatDayAndTime(fromUnixTime(firstUnfinishedMatch.started - 1)));
                updatedMatches = await fetchMatches('aoe2de', 0, FETCH_COUNT, firstUnfinishedMatch.started - 1);
            }
            console.log(new Date(), 'GOT', updatedMatches.length);

            const neededMatches = updatedMatches.filter(m => unfinishedMatches.find(um => um.match_id === m.match_id));
            console.log(new Date(), 'ONLY NEEDED GOT', neededMatches.length);

            const updatedButNotFinishedMatches = neededMatches.filter(m => !m.finished);
            console.log(new Date(), 'UPDATED BUT NOT FINISHED', updatedButNotFinishedMatches.length);

            const oneDayAgo = subDays(new Date(), 1);

            await this.prisma.match.updateMany({
                where: {
                    match_id: {in: updatedButNotFinishedMatches.map(m => m.match_id)},
                },
                data: {
                    maybe_finished: -1,
                },
            });

            await this.prisma.match.updateMany({
                where: {
                    match_id: {in: updatedButNotFinishedMatches.map(m => m.match_id)},
                    started: {lt: getUnixTime(oneDayAgo)},
                },
                data: {
                    maybe_finished: -5,
                },
            });

            const updatedAndFinishedMatches = neededMatches.filter(m => m.finished);
            console.log(new Date(), 'UPDATED AND FINISHED', updatedAndFinishedMatches.length);

            if (updatedAndFinishedMatches.length > 0) {
                await upsertMatchesWithPlayers(this.connection, updatedAndFinishedMatches, false);
                console.log(new Date(), 'SAVED ALL');
            } else {
                // Sometimes matches are not returned by /api/matches but only by /api/match?uuid=...
                const firstMatch = await fetchMatch('aoe2de', {
                    uuid: firstUnfinishedMatch.match_uuid,
                    match_id: firstUnfinishedMatch.match_id
                });
                if (firstMatch) {
                    await upsertMatchesWithPlayers(this.connection, [firstMatch], false);
                    console.log(new Date(), 'SAVED FIRST');
                }
            }

            unfinishedMatches = unfinishedMatches.filter(m => !updatedMatches.map(m2 => m2.match_id).includes(m.match_id));
        }


        // for (const unfinishedMatch of unfinishedMatches) {
        //     console.log(new Date(), "Fetch match", unfinishedMatch.match_id, formatDayAndTime(fromUnixTime(unfinishedMatch.started)));
        //     let updatedMatch = await fetchMatch('aoe2de', {
        //         uuid: unfinishedMatch.match_uuid,
        //         match_id: unfinishedMatch.match_id
        //     });
        //     const hoursAgo = differenceInHours(new Date(), fromUnixTime(unfinishedMatch.started));
        //     console.log(new Date(), "Fetched match", hoursAgo + 'h ago');
        //     if (updatedMatch) {
        //         if (updatedMatch.finished) {
        //             // console.log('WANT', updatedMatch);
        //             await upsertMatchesWithPlayers(this.connection, [updatedMatch], false);
        //             console.log(new Date(), 'SAVED');
        //         } else {
        //             await this.prisma.match.update({
        //                 where: {
        //                     match_id: unfinishedMatch.match_id,
        //                 },
        //                 data: {
        //                     maybe_finished: hoursAgo >= 24 ? -5 : -1,
        //                 },
        //             });
        //             console.log(new Date(), hoursAgo >= 24 ? 'UNFINISHED FOREVER' : 'UNFINISHED');
        //         }
        //     } else {
        //         console.log(new Date(), 'NOT FOUND');
        //     }
        // }

        return true;
    }
}
