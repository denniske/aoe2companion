import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {getRepository, In, Not} from "typeorm";
import {getUnixTime} from 'date-fns';
import {Player} from "../../serverless/entity/player";
import {fetchLeaderboardRecentMatches, fetchMatches, getValue, setValue} from "../../serverless/src/helper";
import {chunk, uniqBy} from "lodash";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import * as fs from "fs";
import {max} from "lodash";
import {groupBy} from "lodash";
import {Account} from "../../serverless/entity/account";
import {Following} from "../../serverless/entity/following";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();



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

    let entries = await fetchLeaderboardRecentMatches();
    console.log(new Date(), 'GOT', entries.data.length);

    // console.log(entries.map(m => {
    //     return m.players.map(p => [m.match_id, p.profile_id]);
    // }));
    //
    // throw "asdas";

    // fs.writeFileSync(`/Volumes/External/json/matches-${matchesFetchedLastStarted}.json`, JSON.stringify(entries));

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
        const playerProfileIds = [3125132];// players.map(p => p.profile_id);

        // const rawData = await connection.manager.find(Match, {
        //     join: {  }
        //     where: {
        //         profile_id: In(players.map(p => p.profile_id)), enabled: true
        //     },
        //     relations: ["account"]
        // });

        const match = await connection.createQueryBuilder()
            .select('match.match_id')
            .from(Match, 'match')
            .innerJoin("match.players", "player")
            .where({ finished: null, profile_id: In(playerProfileIds) })
            .getOne();


//         const rawData = await connection.manager.query(`
//             UPDATE match as m
//                 SET maybe_finished = $1
//             WHERE
//                 EXISTS (SELECT COUNT(*) FROM player WHERE match_id=m.match_id AND profile_id = ANY ($2))
// `, [finished, playerProfileIds]);

        console.log(match);

//         const rawData = await connection.manager.query(`
//             UPDATE match as m
//                 SET maybe_finished = $1
//             WHERE
//                 EXISTS (SELECT COUNT(*) FROM player WHERE match_id=m.match_id AND profile_id = ANY ($2))
// `, [finished, playerProfileIds]);
//
//         console.log(rawData);
        break;


        // const query = connection.createQueryBuilder()
        //     .update(Match)
        //     .set({
        //         maybeFinished: finished,
        //     })
        //     .where({ finished: null, players: Not(account_id) });
        // await query.execute();
    }

    //
    // await setValue('matchesFetchedLastStarted', max(entries.map(e => e.started)));
    //
    // const total2 = await connection.manager.count(Match);
    //
    // console.log(new Date(), "Saved entries:", total2-total1);
    //
    // if (entriesGreater.length === 0) {
    //     console.log('DONE', entriesGreater.length);
    // }
    //
    // return entriesGreater.length === 0;
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

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
