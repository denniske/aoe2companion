import {createDB} from "./helper/db";
import {fetchMatch, fetchMatches} from "../../serverless/src/helper";
import {PrismaClient} from "@prisma/client"
import {fromUnixTime} from "date-fns";
import {upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";
import {createExpress} from "./helper/express";
import {formatDayAndTime} from './helper/util';

const app = createExpress();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

const FETCH_COUNT = 300;

async function refetchMatchesSinceLastTime() {
    const connection = await createDB();

    console.log(new Date(), "Refetch leaderboard recent matches");

    const unfinishedMatches = await prisma.match.findMany({
        where: {
            AND: [
                { maybe_finished: null },
                { finished: null },
            ],
        },
        orderBy: { started: 'asc' },
        take: FETCH_COUNT,
        include: {
            players: true,
        }
    })

    console.log(unfinishedMatches.length);

    if (unfinishedMatches.length === 0) return false;

    const firstUnfinishedMatch = unfinishedMatches[0];

    console.log(new Date(), "Fetch matches dataset", firstUnfinishedMatch.started-1, formatDayAndTime(fromUnixTime(firstUnfinishedMatch.started-1)));
    let updatedMatches = await fetchMatches('aoe2de', 0, FETCH_COUNT, firstUnfinishedMatch.started-1);
    console.log(new Date(), 'GOT', updatedMatches.length);

    updatedMatches = updatedMatches.filter(m => unfinishedMatches.find(um => um.match_id === m.match_id));
    console.log(new Date(), 'ONLY NEEDED GOT', updatedMatches.length);

    const updatedButNotFinishedMatches = updatedMatches.filter(m => !m.finished);
    console.log(new Date(), 'UPDATED BUT NOT FINISHED', updatedButNotFinishedMatches.length);

    await prisma.match.updateMany({
        where: {
            match_id: { in: updatedButNotFinishedMatches.map(m => m.match_id) },
        },
        data: {
            maybe_finished: -1,
        },
    });

    const updatedAndFinishedMatches = updatedMatches.filter(m => m.finished);
    console.log(new Date(), 'UPDATED AND FINISHED', updatedAndFinishedMatches.length);

    if (updatedAndFinishedMatches.length > 0) {
        await upsertMatchesWithPlayers(connection, updatedAndFinishedMatches);
        console.log(new Date(), 'SAVED ALL');
    } else {
        // Sometimes matches are not returned by /api/matches but only by /api/match?uuid=...
        const firstMatch = await fetchMatch('aoe2de', { uuid: firstUnfinishedMatch.match_uuid, match_id: firstUnfinishedMatch.match_id });
        if (firstMatch) {
            await upsertMatchesWithPlayers(connection, [firstMatch]);
            console.log(new Date(), 'SAVED FIRST');
        }
    }

    return true;

    // console.log('WON', updatedAndFinishedMatches.filter(m => m.players.some(p => p.won != null)).length, '/', updatedAndFinishedMatches.length);
    // await sleep(60 * 1000);
}

async function refetchMatches() {
    try {
        const matchesProcessed = await refetchMatchesSinceLastTime();
        if (matchesProcessed) {
            console.log('Waiting 0s');
            setTimeout(refetchMatches, 0 * 1000);
        } else {
            console.log('Waiting 10s');
            setTimeout(refetchMatches, 10 * 1000);
        }
    } catch (e) {
        console.error(e);
        setTimeout(refetchMatches, 60 * 1000);
    }
}

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3010, () => console.log(`Server listening on port ${process.env.PORT || 3010}!`));
    await refetchMatches();
}

main();

























// console.log('--------');
// const used = process.memoryUsage() as any;
// for (let key in used) {
//     console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
// console.log('--------');

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
