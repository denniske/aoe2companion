import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {In} from "typeorm";
import {fetchLeaderboardRecentMatches} from "../../serverless/src/helper";
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

async function fetchMatchesSinceLastTime() {
    const connection = await createDB();

    console.log(new Date(), "Fetch leaderboard recent matches");

    let entries = await fetchLeaderboardRecentMatches(50);
    console.log(new Date(), 'GOT', entries.data.length);

    if (entries.data.length > 0) {
        console.log(entries.data[0][21], '-', entries.data[entries.data.length-1][21]);
    }

    const lastMatches = entries.data.map(d => ({
        profile_id: parseInt(d[1].toString()),
        finished: d[21],
    } as ILastMatchEntry));

    const lastMatchesFinished = groupBy(lastMatches, m => m.finished);

    console.log(lastMatchesFinished);

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
    // await createDB();
    try {
        const done = await fetchMatchesSinceLastTime();
        console.log('Waiting 30s');
        setTimeout(importMatches, 30 * 1000);
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

importMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3012, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));














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
