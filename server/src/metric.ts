import {createDB} from "./helper/db";
import {asyncHandler, time} from "./helper/util";
import {PrismaClient} from "@prisma/client";
import {differenceInMinutes, fromUnixTime, getUnixTime, subDays, subMinutes} from "date-fns";
import {createExpress} from "./helper/express";

const app = createExpress();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

// (prisma.$on as any)('query', (e: any) => {
//     e.timestamp;
//     e.query;
//     e.params;
//     e.duration;
//     e.target;
//     console.log(e);
// });

app.get('/', asyncHandler(async (req, res) => {
    time(1);
    const fiveMinutesAgo = subMinutes(new Date(), 5);
    console.log('fiveMinutesAgo', fiveMinutesAgo);

    const sentPushNotifications = await prisma.push.aggregate({
        count: true,
        where: {
            AND: [
                { created_at: { gt: fiveMinutesAgo } },
                { status: 'ok' },
            ],
        },
    });

    const importedMatches = await prisma.match.aggregate({
        count: true,
        where: {
            AND: [
                { started: { gt: getUnixTime(fiveMinutesAgo) } },
            ],
        },
    });

    const oneDayAgo = subDays(new Date(), 1);
    console.log('oneDayAgo', oneDayAgo);

    const unfinishedMatches = await prisma.match.aggregate({
        count: true,
        where: {
            AND: [
                { finished: null },
                { started: { gt: getUnixTime(oneDayAgo) } },
            ],
        },
    });

    const finishedMatches = await prisma.match.aggregate({
        count: true,
        where: {
            AND: [
                { finished: { not: null } },
                { started: { gt: getUnixTime(oneDayAgo) } },
            ],
        },
    });

    const finishedButUndecidedMatches = await prisma.match.aggregate({
        count: true,
        where: {
            AND: [
                { finished: { not: null } },
                { started: { gt: getUnixTime(oneDayAgo) } },
                {
                    players: { some: { won: null }},
                },
            ],
        },
    });

    const leaderboardLastMatchTime = await prisma.leaderboard_row.aggregate({
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
        finishedButUndecidedMatches: finishedButUndecidedMatches.count,
        leaderboardLastMatchTimeDiffInMinutes: leaderboardLastMatchTimeDiffInMinutes,
    };

    console.log(result);

    res.send(result);
    time();
}));

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3015, () => console.log(`Server listening on port ${process.env.PORT || 3015}!`));
}

main();
