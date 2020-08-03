import express from 'express';
import WebSocket from 'ws';
import {ILastMatchRaw, ILobbyMatchRaw, IMatchRaw, makeQueryString, minifyUserId} from "./server.type";
import fetch from "node-fetch";
import {myfunsi} from "../../serverless/entity/myfuns";
import {createDB} from "./db";
import {User} from "../../serverless/entity/user";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {Following} from "../../serverless/entity/following";
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

let checkCount = 0;

const matches: ILobbyMatchRaw[] = [];

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const ws = new WebSocket('wss://aoe2.net/ws', {
    origin: 'https://aoe2.net',
});

async function fetchIntoJson(url: string) {
    const result = await fetch(url);
    if (result.status != 200) {
        return null;
    }
    return await result.json();
}

async function insertUsers(match: IMatchRaw) {
    const connection = await createDB();

    const userRows = match.players.filter(p => p.profile_id).map(entry => {
        const user = new User();
        user.profile_id = entry.profile_id;
        user.steam_id = entry.steam_id;
        user.name = entry.name;
        user.live_country = entry.country;
        user.live_clan = entry.clan;
        user.live_wins = entry.wins;
        user.live_drops = entry.drops;
        user.live_games = entry.games;
        user.live_rating = entry.rating;
        user.live_streak = entry.streak;
        user.live_last_match = parseInt(match.match_id);
        user.live_last_match_time = match.started;
        return user;
    });

    const query = connection.createQueryBuilder()
        .insert()
        .into(User)
        .values(userRows)
        .orUpdate({
            conflict_target: ['profile_id'], overwrite: [
                'live_country',
                'live_clan',
                'live_wins',
                'live_drops',
                'live_games',
                'live_rating',
                'live_streak',
                'live_last_match',
                'live_last_match_time',
            ]
        });
    await query.execute();

    console.log('Inserted', userRows.map(u => u.profile_id));
}

async function sendPushNotification(expoPushToken: string, body: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Match started',
        body,
        data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function notify(match: IMatchRaw) {
    const connection = await createDB();

    const players = match.players.filter(p => p.profile_id);

    for (const player of players) {
        const following = await connection.manager.find(Following, {where: { profile_id: player.profile_id }});
        const tokens = following.map(f => f.push_token);
        console.log('tokens', tokens);
        for (const token of tokens) {
            await sendPushNotification(token, match.name + ' - ' + match.match_id);
        }
    }
}

console.log('test myfunsi');
myfunsi();

console.log('db');
createDB();

async function checkExistance(match: ILobbyMatchRaw) {
    console.log();
    console.log('Existance New', match.name, '-> ', match.id);

    for (const player of match.players.filter(p => p.profileId || p.steamId)) {
        const queryString = makeQueryString({
            game: 'aoe2de',
            // profile_id: 3169763,
            ...minifyUserId(player),
        });
        const url = `http://aoe2.net/api/player/lastmatch?${queryString}`;
        console.log(url);
        console.log();
        const playerLastMatch = await fetchIntoJson(url) as ILastMatchRaw;
        if (playerLastMatch == null) {
            console.log('SKIP', match.name);
            continue;
        }
        // if (!playerLastMatch.last_match?.match_id) continue;
        // console.log(playerLastMatch.last_match);
        // await sleep(2000);
        if (match.id == playerLastMatch.last_match.match_id) {
            console.log('NOTIFY', match.name, '-> ', match.id);
            await insertUsers(playerLastMatch.last_match);
            await notify(playerLastMatch.last_match);
            return;
        } else {
            console.log('NO MATCH FOUND', match.name, '-> ', match.id);
            return;
        }
    }

}

function onUpdate(updates: ILobbyMatchRaw[]) {
    console.log(updates.length);

    for (const update of updates) {

        if (update.name.indexOf('ice cube') >= 0) {
            console.log('ICE', update);
        }

        const existingMatchIndex = matches.findIndex(m => m.id === update.id);
        if (existingMatchIndex >= 0) {
            if (update.active) {
                matches.splice(existingMatchIndex, 1, update);
            } else {
                console.log('Removing ', update.name);
                matches.splice(existingMatchIndex, 1);

                // checkCount++;
                // if (checkCount > 6) return;

                if (update.name.indexOf('ice cube') < 0) return;

                // setTimeout(() => checkExistance(update), 5000);
                setTimeout(() => checkExistance(update), 15000);
            }
        } else {
            if (update.active) {
                matches.push(update);
            }
        }
    }


}

ws.on('open', () => {
    // ws.send(JSON.stringify({"message":"subscribe","subscribe":[0]})); // subscribe chat
    if (process.env.LOCAL === 'true') {
        ws.send(JSON.stringify({"message":"subscribe","subscribe":[813780]})); // subscribe de lobbies
    }
});

ws.on('message', (data) => {
    const message = JSON.parse(data as any);
    // console.log(message.data);

    if (message.message === "ping") {
        console.log('SEND', JSON.stringify(message));
        ws.send(JSON.stringify(message));
        return;
    }

    if (message.message === 'chat') {
        return;
    }

    if (message.message === 'lobbies') {
        const updates = message.data;
        onUpdate(updates);
    }
});

ws.on('error', (e) => {
    console.log('error', (e as any).message);
});

ws.on('close', (e: any) => {
    console.log('close', e.code, e.reason);
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/status', (req, res) => {
    res.send({
        matches: matches,
        openMatches: matches.filter(m => m.numSlots > 1),
    });
});

app.post('/', async (req, res) => {
    console.log(req.body);

    const { path, data } = req.body;

    res.send('Hello World!');

    console.log('Received screenshot:', path);
});

app.listen(process.env.PORT || 3000, () => console.log(`Image server listening on port ${process.env.PORT || 3000}!`));
