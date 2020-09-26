import {Controller, Get} from '@nestjs/common';
import {differenceInMinutes, fromUnixTime, getUnixTime, subDays, subMinutes} from "date-fns";
import {time} from "../util";
import {PrismaService} from "../service/prisma.service";


@Controller()
export class MetricController {

    constructor(
        private prisma: PrismaService
    ) {}

    @Get()
    async get() {
        time(1);
        const fiveMinutesAgo = subMinutes(new Date(), 5);
        console.log('fiveMinutesAgo', fiveMinutesAgo);

        const sentPushNotifications = await this.prisma.push.aggregate({
            count: true,
            where: {
                AND: [
                    {created_at: {gt: fiveMinutesAgo}},
                    {status: 'ok'},
                ],
            },
        });

        const importedMatches = await this.prisma.match.aggregate({
            count: true,
            where: {
                AND: [
                    {started: {gt: getUnixTime(fiveMinutesAgo)}},
                ],
            },
        });

        const oneDayAgo = subDays(new Date(), 1);
        console.log('oneDayAgo', oneDayAgo);

        const unfinishedMatches = await this.prisma.match.aggregate({
            count: true,
            where: {
                AND: [
                    {finished: null},
                    {started: {gt: getUnixTime(oneDayAgo)}},
                ],
            },
        });

        const finishedMatches = await this.prisma.match.aggregate({
            count: true,
            where: {
                AND: [
                    {finished: {not: null}},
                    {started: {gt: getUnixTime(oneDayAgo)}},
                ],
            },
        });

        // const finishedButUndecidedMatches = await this.prisma.match.aggregate({
        //     count: true,
        //     where: {
        //         AND: [
        //             {finished: {not: null}},
        //             {started: {gt: getUnixTime(oneDayAgo)}},
        //             {
        //                 players: {some: {won: null}},
        //             },
        //         ],
        //     },
        // });

        const leaderboardLastMatchTime = await this.prisma.leaderboard_row.aggregate({
            max: {
                last_match_time: true,
            },
        });

        const leaderboardLastMatchTimeDiffInMinutes = differenceInMinutes(new Date(), fromUnixTime(leaderboardLastMatchTime.max.last_match_time));

        const result = {
            sentPushNotifications: sentPushNotifications.count,
            importedMatches: importedMatches.count,
            unfinishedMatches: unfinishedMatches.count,
            finishedMatches: finishedMatches.count,
            finishedButUndecidedMatches: 10,//finishedButUndecidedMatches.count,
            leaderboardLastMatchTimeDiffInMinutes: leaderboardLastMatchTimeDiffInMinutes,
        };

        console.log(result);

        time();
        return result;
    }
}
