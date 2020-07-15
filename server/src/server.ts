import "reflect-metadata";
import express from 'express';

const cors = require('cors');
const bodyParser = require('body-parser');

import {createConnection} from "typeorm";
import {User} from "./entity/user";
import fetch from 'node-fetch';
import {getUnixTime} from "date-fns";

require('dotenv').config()


interface IParams {
    [key: string]: any;
}

function makeQueryString(params: IParams) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

interface IFetchLeaderboardParams {
    start?: number;
    count: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
}


export interface ILeaderboardPlayerRaw {
    clan: string;
    country: string;
    drops: number;
    games: number;
    highest_rating: number;
    highest_streak: number;
    icon: any;
    last_match: any;
    last_match_time: any;
    losses: number;
    lowest_streak: number;
    name: string;
    previous_rating: number;
    profile_id: number;
    rank: number;
    rating: number;
    steam_id: string;
    streak: number;
    wins: number;
}

async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });

    // console.log("fetchLeaderboard", `https://aoe2.net/api/leaderboard?${queryString}`);
    const response = await fetch(`https://aoe2.net/api/leaderboard?${queryString}`);
    try {
        const json = await response.json();
        return json;
    } catch (e) {
        console.log("FAILED", `https://aoe2.net/api/leaderboard?${queryString}`);
        throw e;
    }
}


createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [
        User,
    ],
    synchronize: true,
    logging: false
}).then(async connection => {

    // console.log("Clear user table...");
    // await connection.getRepository(User).clear(); // remove all users
    //
    // let start = new Date();
    //
    // const data = await fetchLeaderboard('aoe2de', 3, { count: 10000 });
    // const entries: ILeaderboardPlayerRaw[] = data.leaderboard;
    // console.log(entries.length);
    //
    // console.log('==> ', (new Date().getTime() - start.getTime()));
    // start = new Date();
    //
    // let currentId = 1;
    //
    // console.log("Inserting a new user into the database...");
    // const rows = entries.map(entry => {
    //     const user = new User();
    //     user.id = currentId++;
    //     user.name = entry.name;
    //     user.country = entry.country;
    //     user.rank = entry.rank;
    //     user.data = entry;
    //     return user;
    // });
    //
    // const query = connection.createQueryBuilder()
    //     .insert()
    //     .into(User)
    //     .values(rows);
    // await query.execute();
    //
    // // await connection.manager.save(rows);
    // console.log("Saved a new user with id...");
    //
    // console.log('==> ', (new Date().getTime() - start.getTime()));
    // start = new Date();

    const updated = new Date();

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users.length);

    const app = express();
    app.use(bodyParser.json({limit: '100mb', extended: true}));

    app.use(cors());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/api/leaderboard', async (req, res) => {
        const { country, start, count } = req.query;

        // @ts-ignore
        const users = await connection.manager.find(User, {where: { country: country }, skip: start, take: count });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            updated: getUnixTime(updated),
            users: users.map(u => u.data),
        }));
    });

    app.listen(3000, () => console.log('Image server listening on port 3000!'));

}).catch(error => console.log(error));
