// import express from 'express';
// import WebSocket from 'ws';
// import {ILastMatchRaw, ILobbyMatchRaw, IMatchRaw, makeQueryString, minifyUserId} from "./util";
// import fetch from "node-fetch";
// import {createDB} from "./db";
// import {User} from "../../serverless/entity/user";
// import {setValue} from "../../serverless/src/helper";
// import {Player} from "../../serverless/entity/player";
// import {Match} from "../../serverless/entity/match";
// import {Push} from "../../serverless/entity/push";
// import {getRepository} from 'typeorm';
// const cors = require('cors');
// const app = express();
//
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
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({limit: '100mb', extended: true}));
//
// app.use(cors());
//
// // Initialize DB with correct entities
// createDB();
//
// let sentRequests = 0;
// let serverStarted = new Date();
//
// const matches: ILobbyMatchRaw[] = [];
//
// setInterval(async () => {
//     if (!process.env.K8S_POD_NAME) return;
//     console.log('Writing keyvalue', process.env.K8S_POD_NAME);
//     await setValue(process.env.K8S_POD_NAME + '_uptime', ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60).toFixed(2));
// }, 5000);
//
// export function sleep(ms: number) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }
//
// const ws = new WebSocket('wss://aoe2.net/ws', {
//     origin: 'https://aoe2.net',
// });
//
// async function fetchIntoJson(url: string) {
//     sentRequests++;
//     const result = await fetch(url);
//     if (result.status != 200) {
//         return null;
//     }
//     return await result.json();
// }
//
// async function insertUsers(match: IMatchRaw) {
//     console.log('Insert Users', match.name, '-> ', match.match_id);
//
//     const connection = await createDB();
//
//     const userRows = match.players.filter(p => p.profile_id).map(entry => {
//         const user = new User();
//         user.profile_id = entry.profile_id;
//         user.steam_id = entry.steam_id;
//         user.name = entry.name;
//         user.live_country = entry.country;
//         user.live_clan = entry.clan;
//         user.live_wins = entry.wins;
//         user.live_drops = entry.drops;
//         user.live_games = entry.games;
//         user.live_rating = entry.rating;
//         user.live_streak = entry.streak;
//         user.live_last_match = parseInt(match.match_id);
//         user.live_last_match_time = match.started;
//         return user;
//     });
//
//     const query = connection.createQueryBuilder()
//         .insert()
//         .into(User)
//         .values(userRows)
//         .orUpdate({
//             conflict_target: ['profile_id'], overwrite: [
//                 'live_country',
//                 'live_clan',
//                 'live_wins',
//                 'live_drops',
//                 'live_games',
//                 'live_rating',
//                 'live_streak',
//                 'live_last_match',
//                 'live_last_match_time',
//             ]
//         });
//     await query.execute();
//
//     console.log('Inserted', userRows.map(u => u.profile_id));
// }
//
// async function insertMatch(matchRaw: IMatchRaw) {
//     console.log('Insert Match', matchRaw.name, '-> ', matchRaw.match_id);
//
//     const matchRepo = getRepository(Match);
//
//     const matchRows = [matchRaw].map(matchEntry => {
//         const match = new Match();
//         match.id = matchEntry.match_id;
//         match.match_uuid = matchEntry.match_uuid;
//         match.lobby_id = matchEntry.lobby_id;
//         match.name = matchEntry.name;
//         match.opened = matchEntry.opened;
//         match.started = matchEntry.started;
//         match.finished = matchEntry.finished;
//         match.leaderboard_id = matchEntry.leaderboard_id;
//         match.num_slots = matchEntry.num_slots;
//         match.has_password = matchEntry.has_password;
//         match.server = matchEntry.server;
//         match.map_type = matchEntry.map_type;
//         match.average_rating = matchEntry.average_rating;
//         match.cheats = matchEntry.cheats;
//         match.ending_age = matchEntry.ending_age;
//         match.expansion = matchEntry.expansion;
//         match.full_tech_tree = matchEntry.full_tech_tree;
//         match.game_type = matchEntry.game_type;
//         match.has_custom_content = matchEntry.has_custom_content;
//         match.lock_speed = matchEntry.lock_speed;
//         match.lock_teams = matchEntry.lock_teams;
//         match.map_size = matchEntry.map_size;
//         match.num_players = matchEntry.num_players;
//         match.pop = matchEntry.pop;
//         match.ranked = matchEntry.ranked;
//         match.rating_type = matchEntry.rating_type;
//         match.resources = matchEntry.resources;
//         match.rms = matchEntry.rms;
//         match.scenario = matchEntry.scenario;
//         match.shared_exploration = matchEntry.shared_exploration;
//         match.speed = matchEntry.speed;
//         match.starting_age = matchEntry.starting_age;
//         match.team_positions = matchEntry.team_positions;
//         match.team_together = matchEntry.team_together;
//         match.treaty_length = matchEntry.treaty_length;
//         match.turbo = matchEntry.turbo;
//         match.version = matchEntry.version;
//         match.victory = matchEntry.victory;
//         match.victory_time = matchEntry.victory_time;
//         match.visibility = matchEntry.visibility;
//
//         match.players = matchEntry.players.filter(p => p.profile_id).map(playerEntry => {
//             const user = new Player();
//             user.match = { id: matchEntry.match_id } as Match;
//             user.profile_id = playerEntry.profile_id;
//             user.steam_id = playerEntry.steam_id;
//             user.civ = playerEntry.civ;
//             user.clan = playerEntry.clan;
//             user.color = playerEntry.color;
//             user.country = playerEntry.country;
//             user.drops = playerEntry.drops;
//             user.games = playerEntry.games;
//             user.name = playerEntry.name;
//             user.rating = playerEntry.rating;
//             user.rating_change = playerEntry.rating_change;
//             user.slot = playerEntry.slot;
//             user.slot_type = playerEntry.slot_type;
//             user.streak = playerEntry.streak;
//             user.team = playerEntry.team;
//             user.wins = playerEntry.wins;
//             user.won = playerEntry.won;
//             return user;
//         });
//
//         return match;
//     });
//
//     await matchRepo.save(matchRows);
// }
//
// async function checkExistance(match: ILobbyMatchRaw, attempt: number = 0) {
//     if (attempt > 2) return;
//
//     console.log();
//     console.log('Existance', attempt, match.name, '-> ', match.id);
//
//     const connection = await createDB();
//
//     const existingMatch = await connection.manager.findOne(Match, {where: { id: match.id }});
//
//     if (existingMatch) {
//         console.log('Match already in DB', match.name, '-> ', match.id);
//         return;
//     }
//
//     for (const player of match.players.filter(p => p.profileId || p.steamId)) {
//         const queryString = makeQueryString({
//             game: 'aoe2de',
//             ...minifyUserId(player),
//         });
//         const url = `http://aoe2.net/api/player/lastmatch?${queryString}`;
//         console.log(url);
//         console.log();
//         const playerLastMatch = await fetchIntoJson(url) as ILastMatchRaw;
//         if (playerLastMatch != null) {
//             if (match.id == playerLastMatch.last_match.match_id) {
//                 if (attempt > 0) {
//                     console.log('FOUND AFTER TIME !!!!!!!!!!!!!!!!', match.name, '-> ', match.id);
//                 }
//                 await insertUsers(playerLastMatch.last_match);
//                 await insertMatch(playerLastMatch.last_match);
//                 return;
//             } else {
//                 console.log('NO MATCH FOUND', match.name, '-> ', match.id);
//                 // setTimeout(() => checkExistance(match, attempt+1), 5000);
//                 return;
//             }
//         }
//         console.log('NEXT PLAYER', match.name);
//     }
//     console.log('NO MATCH FOUND', match.name, '-> ', match.id);
//     // setTimeout(() => checkExistance(match, attempt+1), 5000);
// }
//
// function onUpdate(updates: ILobbyMatchRaw[]) {
//     console.log(updates.length);
//
//     for (const update of updates) {
//         const existingMatchIndex = matches.findIndex(m => m.id === update.id);
//
//         if (update.name.indexOf('ice cube') >= 0) {
//             console.log('ICE', existingMatchIndex, update);
//         }
//
//         if (existingMatchIndex >= 0) {
//             if (update.active) {
//                 matches.splice(existingMatchIndex, 1, update);
//             } else {
//                 // console.log('Removing ', update.name);
//                 matches.splice(existingMatchIndex, 1);
//
//                 // if (update.name.indexOf('ice cube') < 0) return;
//
//                 setTimeout(() => checkExistance(update), 4000 + 6000 * Math.random());
//             }
//         } else {
//             if (update.active) {
//                 matches.push(update);
//                 console.log('NOT IN LIST ACTIVE', update.name)
//             }
//             if (!update.active) {
//                 console.log('NOT IN LIST NOT ACTIVE', update.name)
//             }
//         }
//     }
// }
//
// ws.on('open', () => {
//     // ws.send(JSON.stringify({"message":"subscribe","subscribe":[0]})); // subscribe chat
//     // if (process.env.LOCAL === 'true') {
//         ws.send(JSON.stringify({"message":"subscribe","subscribe":[813780]})); // subscribe de lobbies
//     // }
// });
//
// ws.on('message', (data) => {
//     const message = JSON.parse(data as any);
//     // console.log(message.data);
//
//     if (message.message === "ping") {
//         console.log('SEND', JSON.stringify(message));
//         ws.send(JSON.stringify(message));
//         return;
//     }
//
//     if (message.message === 'chat') {
//         return;
//     }
//
//     if (message.message === 'lobbies') {
//         const updates = message.data;
//         onUpdate(updates);
//     }
// });
//
// ws.on('error', (e) => {
//     console.log('error', (e as any).message);
// });
//
// ws.on('close', (e: any) => {
//     console.log('close', e.code, e.reason);
// });
//
//
//
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
//
// app.get('/status', (req, res) => {
//     res.send({
//         podName: process.env.K8S_POD_NAME,
//         sentRequests: sentRequests,
//         sentRequestsPerMinute: (sentRequests / ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60)).toFixed(2),
//         uptime: ((new Date().getTime() - serverStarted.getTime()) / 1000 / 60).toFixed(2),
//         matches: matches.length,
//         openMatches: matches.filter(m => m.numSlots > 1).length,
//     });
// });
//
// app.get('/status2', (req, res) => {
//     res.send({
//         podName: process.env.K8S_POD_NAME,
//         matches: matches,
//         openMatches: matches.filter(m => m.numSlots > 1),
//     });
// });
//
// app.listen(process.env.PORT || 3001, () => console.log(`Server listening on port ${process.env.PORT || 3001}!`));
