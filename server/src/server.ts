import express from 'express';
import WebSocket from 'ws';
import {ILastMatchRaw, ILobbyMatchRaw, IMatchRaw, makeQueryString, minifyUserId} from "./server.type";
import fetch from "node-fetch";
import {createDB} from "./db";
import {User} from "../../serverless/entity/user";
import {setValue} from "../../serverless/src/helper";
import {Player} from "../../serverless/entity/player";
import {Match} from "../../serverless/entity/match";
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

let sentRequests = 0;
let serverStarted = new Date();

const matches: ILobbyMatchRaw[] = [];

setInterval(async () => {
    if (!process.env.K8S_POD_NAME) return;
    console.log('Writing keyvalue', process.env.K8S_POD_NAME);
    await setValue(process.env.K8S_POD_NAME + '_uptime', ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60).toFixed(2));
}, 5000);

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const ws = new WebSocket('wss://aoe2.net/ws', {
    origin: 'https://aoe2.net',
});

async function fetchIntoJson(url: string) {
    sentRequests++;
    const result = await fetch(url);
    if (result.status != 200) {
        return null;
    }
    return await result.json();
}

async function insertUsers(match: IMatchRaw) {
    console.log('Insert Users', match.name, '-> ', match.match_id);

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

async function insertMatch(match: IMatchRaw) {
    console.log('Insert Match', match.name, '-> ', match.match_id);

    const connection = await createDB();

    const matchRows = [match].map(entry => {
        const match = new Match();
        match.id = entry.match_id;
        match.match_uuid = entry.match_uuid;
        match.lobby_id = entry.lobby_id;
        match.name = entry.name;
        match.opened = entry.opened;
        match.started = entry.started;
        match.finished = entry.finished;
        match.leaderboard_id = entry.leaderboard_id;
        match.num_slots = entry.num_slots;
        match.has_password = entry.has_password;
        match.server = entry.server;
        match.map_type = entry.map_type;
        match.average_rating = entry.average_rating;
        match.cheats = entry.cheats;
        match.ending_age = entry.ending_age;
        match.expansion = entry.expansion;
        match.full_tech_tree = entry.full_tech_tree;
        match.game_type = entry.game_type;
        match.has_custom_content = entry.has_custom_content;
        match.lock_speed = entry.lock_speed;
        match.lock_teams = entry.lock_teams;
        match.map_size = entry.map_size;
        match.num_players = entry.num_players;
        match.pop = entry.pop;
        match.ranked = entry.ranked;
        match.rating_type = entry.rating_type;
        match.resources = entry.resources;
        match.rms = entry.rms;
        match.scenario = entry.scenario;
        match.shared_exploration = entry.shared_exploration;
        match.speed = entry.speed;
        match.starting_age = entry.starting_age;
        match.team_positions = entry.team_positions;
        match.team_together = entry.team_together;
        match.treaty_length = entry.treaty_length;
        match.turbo = entry.turbo;
        match.version = entry.version;
        match.victory = entry.victory;
        match.victory_time = entry.victory_time;
        match.visibility = entry.visibility;
        return match;
    });

    let queryMatch = connection.createQueryBuilder()
        .insert()
        .into(Match)
        .values(matchRows)
        .orUpdate({
            conflict_target: ['match_id'], overwrite: []
        });
    await queryMatch.execute();

    const playerRows = match.players.filter(p => p.profile_id).map(entry => {
        const user = new Player();
        user.match = { id: match.match_id } as Match;
        user.profile_id = entry.profile_id;
        user.steam_id = entry.steam_id;
        user.civ = entry.civ;
        user.clan = entry.clan;
        user.color = entry.color;
        user.country = entry.country;
        user.drops = entry.drops;
        user.games = entry.games;
        user.name = entry.name;
        user.rating = entry.rating;
        user.rating_change = entry.rating_change;
        user.slot = entry.slot;
        user.slot_type = entry.slot_type;
        user.streak = entry.streak;
        user.team = entry.team;
        user.wins = entry.wins;
        user.won = entry.won;
        return user;
    });

    const queryPlayer = connection.createQueryBuilder()
        .insert()
        .into(Player)
        .values(playerRows)
        .orUpdate({
            conflict_target: ['profile_id'], overwrite: []
        });
    await queryPlayer.execute();
}

console.log('db');
createDB();

async function checkExistance(match: ILobbyMatchRaw, attempt: number = 0) {
    if (attempt > 2) return;

    console.log();
    console.log('Existance', attempt, match.name, '-> ', match.id);

    const connection = await createDB();

    const existingMatch = await connection.manager.findOne(Match, {where: { id: match.id }});

    if (existingMatch) {
        console.log('Match already in DB', match.name, '-> ', match.id);
        return;
    }

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
        if (playerLastMatch != null) {
            if (match.id == playerLastMatch.last_match.match_id) {
                if (attempt > 0) {
                    console.log('FOUND AFTER TIME !!!!!!!!!!!!!!!!', match.name, '-> ', match.id);
                }
                await insertUsers(playerLastMatch.last_match);
                await insertMatch(playerLastMatch.last_match);
                return;
            } else {
                console.log('NO MATCH FOUND', match.name, '-> ', match.id);
                // setTimeout(() => checkExistance(match, attempt+1), 5000);
                return;
            }
        }
        console.log('NEXT PLAYER', match.name);
    }
    console.log('NO MATCH FOUND', match.name, '-> ', match.id);
    // setTimeout(() => checkExistance(match, attempt+1), 5000);
}

function onUpdate(updates: ILobbyMatchRaw[]) {
    console.log(updates.length);

    for (const update of updates) {
        const existingMatchIndex = matches.findIndex(m => m.id === update.id);

        if (update.name.indexOf('ice cube') >= 0) {
            console.log('ICE', existingMatchIndex, update);
        }

        if (existingMatchIndex >= 0) {
            if (update.active) {
                matches.splice(existingMatchIndex, 1, update);
            } else {
                // console.log('Removing ', update.name);
                matches.splice(existingMatchIndex, 1);

                // if (update.name.indexOf('ice cube') < 0) return;

                setTimeout(() => checkExistance(update), 4000 + 6000 * Math.random());
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
    // if (process.env.LOCAL === 'true') {
        ws.send(JSON.stringify({"message":"subscribe","subscribe":[813780]})); // subscribe de lobbies
    // }
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
        podName: process.env.K8S_POD_NAME,
        sentRequests: sentRequests,
        sentRequestsPerMinute: (sentRequests / ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60)).toFixed(2),
        uptime: ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60).toFixed(2),
        matches: matches.length,
        openMatches: matches.filter(m => m.numSlots > 1).length,
    });
});

app.get('/status2', (req, res) => {
    res.send({
        podName: process.env.K8S_POD_NAME,
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

app.listen(process.env.PORT || 3000, () => console.log(`Server listening on port ${process.env.PORT || 3000}!`));
