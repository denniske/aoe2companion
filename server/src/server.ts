import express from 'express';
// @ts-ignore
import imageDataURI from "image-data-uri";
import WebSocket from 'ws';
import {ILastMatchRaw, ILobbyMatchRaw, IMatchRaw, makeQueryString, minifyUserId} from "./server.type";
import fetch from "node-fetch";
import {myfunsi} from "../../serverless/entity/myfuns";
import {createDB} from "./db";
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

async function notify(match: IMatchRaw) {


}

console.log('test myfunsi');
myfunsi();

console.log('db', process.env.DATABASE_URL);
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
        const existingMatchIndex = matches.findIndex(m => m.id === update.id);
        if (existingMatchIndex >= 0) {
            if (update.active && update.numSlots > 1) {
                matches.splice(existingMatchIndex, 1, update);
            } else {
                // console.log('Removing ', update.name);
                matches.splice(existingMatchIndex, 1);
                checkCount++;
                if (checkCount > 6) return;
                // setTimeout(() => checkExistance(update), 5000);
                setTimeout(() => checkExistance(update), 15000);
            }
        } else {
            if (update.active && update.numSlots > 1) {
                matches.push(update);
            }
        }
    }


}

ws.on('open', () => {
    // ws.send(JSON.stringify({"message":"subscribe","subscribe":[0]})); // subscribe chat
    ws.send(JSON.stringify({"message":"subscribe","subscribe":[813780]})); // subscribe de lobbies
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
    res.send('Hello World 2!');
});

console.log('Hello console 2!');

app.post('/', async (req, res) => {
    console.log(req.body);

    const { path, data } = req.body;

    res.send('Hello World!');

    console.log('Received screenshot:', path);

    let filePath = './screenshots/' + path;
    await imageDataURI.outputFile(data, filePath);
});

app.listen(process.env.PORT || 3000, () => console.log(`Image server listening on port ${process.env.PORT || 3000}!`));
