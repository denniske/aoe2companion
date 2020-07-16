import "reflect-metadata";

import { NowRequest, NowResponse } from '@vercel/node'

// const cors = require('cors');
// const bodyParser = require('body-parser');

// import {createConnection, getConnectionManager} from "typeorm";
import fetch from 'node-fetch';
import {getUnixTime} from "date-fns";
import {User} from "./entity/user";
import {createDB} from "./db/db";

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



let counter = 0;
export default async (req: NowRequest, res: NowResponse) => {
    try {

        counter++;

        console.log('Counter: ', counter);

        const connection = await createDB();

        // const { name = 'World' } = request.query
        // response.status(200).send(`${process.env.TEMP} ${name}!`)

        const { country = 'DE', start = 0, count = 10 } = req.query;

        // @ts-ignore

        const users = await connection.manager.find(User, {where: { country: country }, skip: start, take: count });

        res.json({
            // updated: getUnixTime(updated),
            counter: counter,
            users: users.map(u => u.data),
        });
    } catch(err) {
        res.json({
            error: err,
        });
    }
}
