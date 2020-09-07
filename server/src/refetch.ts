import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {fetchMatches} from "../../serverless/src/helper";
import {chunk, uniqBy} from "lodash";
import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";
import {Player} from "../../serverless/entity/player";
import {createMatchEntity, upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();


const prisma = new PrismaClient()

function formatDayAndTime(date: Date) {
    console.log(date);
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

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
                { maybe_finished: null },
                // { finished: null },
                { finished: null },
            ],
        },
        orderBy: { started: 'asc' },
        take: 800,
        include: {
            players: true,
        }
    })

    console.log(unfinishedMatches.length);

    if (unfinishedMatches.length === 0) return false;

    const firstUnfinishedMatch = unfinishedMatches[0];

    console.log(new Date(), "Fetch matches dataset", firstUnfinishedMatch.started-1, formatDayAndTime(fromUnixTime(firstUnfinishedMatch.started-1)));
    let updatedMatches = await fetchMatches('aoe2de', 0, 800, firstUnfinishedMatch.started-1);
    console.log(new Date(), 'GOT', updatedMatches.length);

    updatedMatches = updatedMatches.filter(m => unfinishedMatches.find(um => um.match_id === m.match_id));
    console.log(new Date(), 'ONLY NEEDED GOT', updatedMatches.length);

    const updatedButNotFinishedMatches = updatedMatches.filter(m => !m.finished);
    console.log(new Date(), 'UPDATED BUT NOT FINISHED', updatedButNotFinishedMatches.length);

    const updatedAndFinishedMatches = updatedMatches.filter(m => m.finished);
    console.log(new Date(), 'UPDATED AND FINISHED', updatedAndFinishedMatches.length);

    await prisma.match.updateMany({
        where: {
            match_id: { in: updatedButNotFinishedMatches.map(m => m.match_id) },
        },
        data: {
            maybe_finished: -1,
        },
    });

    console.log('WON', updatedAndFinishedMatches.filter(m => m.players.some(p => p.won != null)).length, '/', updatedAndFinishedMatches.length);

    await upsertMatchesWithPlayers(connection, updatedAndFinishedMatches);

    console.log(new Date(), 'SAVED');

    // const res = await prisma.match.update({
    //     where: {
    //         match_id: updatedMatch.match_id,
    //     },
    //     data: {
    //         ...updatedMatch,
    //         players: {
    //             update: updatedMatch.players.filter(p => p.profile_id).map(p => ({
    //                 data: {
    //                     ...p,
    //                     profile_id: p.profile_id || 0,
    //                 },
    //                 where: { match_id_profile_id_slot: { match_id: updatedMatch.match_id, profile_id: p.profile_id || 0, slot: p.slot } },
    //             })),
    //         }
    //     },
    // });

    // console.log('COUNT', res);

    // await sleep(60 * 1000);
    return true;
}

async function refetchMatches() {
    // await createDB();
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

refetchMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3010, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));














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
