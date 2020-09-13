import {createDB} from "./helper/db";
import {groupBy} from "lodash";
import {PrismaClient} from "@prisma/client"
import {createExpress} from "./helper/express";

const app = createExpress();

const prisma = new PrismaClient()

async function fetchMatchesSinceLastTime() {
    console.log(new Date(), "Fetch recent matches all leaderboards");

    const recentMatches = await prisma.leaderboard_row.findMany({
        orderBy: {
            last_match_time: 'desc',
        },
        take: 50,
    });

    const lastMatchesFinished = groupBy(recentMatches, m => m.last_match_time);
    console.log(lastMatchesFinished.length);

    for (const [finishedStr, players] of Object.entries(lastMatchesFinished)) {
        const finished = parseInt(finishedStr);
        const playerProfileIds = players.map(p => p.profile_id);

        const res = await prisma.match.updateMany({
            where: {
                AND: [
                    { started: { lt: finished } },
                    { finished: null },
                    { players: { some: { profile_id: { in: playerProfileIds } } } },
                ],
            },
            data: { maybe_finished: null },
            // data: { maybe_finished: finished },
        })

        console.log('COUNT', res, finished, playerProfileIds);
    }
}

async function importMatches() {
    try {
        await fetchMatchesSinceLastTime();
        console.log('Waiting 30s');
        setTimeout(importMatches, 30 * 1000);
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3012, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
    await importMatches();
}

main();













// const res = await prisma.match.findMany({
//     include: {
//         players: true,
//     },
//     where: {
//         AND: [
//             { players: { some: { profile_id: { in: [196240, 197930] } } } },
//             // { players: { some: { OR: [{ profile_id: 196240 }, { profile_id: 197930 }] } } },
//             // { players: { some: { profile_id: 197930 } } },
//             // { players: { some: { profile_id: 199325 } } },
//         ],
//     },
//     skip: 0,
//     take: 5,
//     orderBy: { started: 'desc' },
// });
// console.log('res', res);
//
// return;
