import express from 'express';
import {createDB} from "./helper/db";
import {Match} from "../../serverless/entity/match";
import {In} from "typeorm";
import {fetchLeaderboardRecentMatches, fetchMatch, fetchMatches} from "../../serverless/src/helper";
import {groupBy} from "lodash";
import {PrismaClient} from "@prisma/client"

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();


const prisma = new PrismaClient()


export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

interface ILastMatchEntry {
    profile_id: number;
    finished: number;
}

async function refetchMatchesSinceLastTime() {
    const connection = await createDB();

    console.log(new Date(), "Refetch leaderboard recent matches");

    const unfinishedMatches = await prisma.match.findMany({
        where: {
            AND: [
                { maybe_finished: { not: null } },
                { finished: { not: null } },
                // { finished: null },
            ],
        },
        orderBy: { maybe_finished: 'desc' },
        take: 10,
    })

    console.log(unfinishedMatches.length);

    for (const match of unfinishedMatches) {

        console.log(new Date(), 'fetchMatch', match.match_id);
        const updatedMatch = await fetchMatches('aoe2de', 0, 10, match.started-1);
        console.log(new Date(), 'GOT IT');

        console.log(updatedMatch.findIndex(m => m.match_id === match.match_id), updatedMatch.filter(m => m.match_id === match.match_id));

        // console.log(JSON.stringify({
        //     where: {
        //         match_id: updatedMatch.match_id,
        //     },
        //     data: {
        //         ...updatedMatch,
        //         players: {
        //             update: updatedMatch.players.map(p => ({
        //                 data: p,
        //                 where: { match_id: p.match_id, profile_id: p.profile_id },
        //             })),
        //         }
        //     },
        // }));

        await sleep(20 * 1000);

        // const res = await prisma.match.update({
        //     where: {
        //         match_id: updatedMatch.match_id,
        //     },
        //     data: {
        //         ...updatedMatch,
        //         players: {
        //             update: updatedMatch.players.map(p => ({
        //                 data: p,
        //                 where: { match_id_profile_id: { match_id: updatedMatch.match_id, profile_id: p.profile_id } },
        //             })),
        //         }
        //     },
        // });
        //
        // console.log('COUNT', res);

    }
}

async function refetchMatches() {
    // await createDB();
    try {
        const done = await refetchMatchesSinceLastTime();
        console.log('Waiting 30s');
        setTimeout(refetchMatches, 30 * 1000);
    } catch (e) {
        console.error(e);
        setTimeout(refetchMatches, 60 * 1000);
    }
}

refetchMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));














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
