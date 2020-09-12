import express from 'express';
import {createDB} from "./db";
import {Following} from "../../serverless/entity/following";
import {asyncHandler, time} from "./util";
import {PrismaClient} from "@prisma/client";
import {differenceInMinutes, fromUnixTime, getUnixTime, subDays, subMinutes} from "date-fns";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();

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
    const connection = await createDB();

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

app.listen(process.env.PORT || 3015, () => console.log(`Server listening on port ${process.env.PORT || 3015}!`));

