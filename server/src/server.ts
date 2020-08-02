import express from 'express';
// @ts-ignore
import imageDataURI from "image-data-uri";
import WebSocket from 'ws';
import {ILobbyMatchRaw, makeQueryString, minifyUserId} from "./server.type";
import fetch from "node-fetch";
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

let checkCount = 0;

const matches: ILobbyMatchRaw[] = [];

const ws = new WebSocket('wss://aoe2.net/ws', {
    origin: 'https://aoe2.net',
});

async function fetchIntoJson(url: string) {
    const result = await fetch(url);
    return await result.json();
}

async function checkExistance(match: ILobbyMatchRaw) {
    checkCount++;
    if (checkCount > 1) return;

    console.log('Existance ', match.name);

    const requests = [];
    for (const player of match.players.filter(p => p.profileId || p.steamId)) {
        const queryString = makeQueryString({
            game: 'aoe2de',
            ...minifyUserId(player),
        });
        const url = `http://aoe2.net/api/player/lastmatch?${queryString}`;
        console.log(url);
        requests.push(fetchIntoJson(url));
    }

    let results = await Promise.all(requests);
    console.log(results);
}

function onUpdate(updates: ILobbyMatchRaw[]) {
    console.log(updates.length);

    for (const update of updates) {
        const existingMatchIndex = matches.findIndex(m => m.id === update.id);
        if (existingMatchIndex >= 0) {
            if (update.active && update.numSlots > 1) {
                matches.splice(existingMatchIndex, 1, update);
            } else {
                console.log('Removing ', update.name);
                matches.splice(existingMatchIndex, 1);
                setTimeout(() => checkExistance(update), 5000);
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
