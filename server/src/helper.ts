import {createDB} from "./handler";
import {KeyValue} from "../entity/keyvalue";
import fetch from "node-fetch";

export async function setValue(id: string, value: any) {
    const connection = await createDB();

    const keyValue = new KeyValue();
    keyValue.id = id;
    keyValue.value = JSON.stringify(value);

    const query = connection.createQueryBuilder()
        .insert()
        .into(KeyValue)
        .values([keyValue])
        .orUpdate({conflict_target: ['id'], overwrite: ['value']});

    await query.execute();
}

export async function getValue(id: string) {
    const connection = await createDB();
    const keyValue = await connection.manager.findOne(KeyValue, id);
    return JSON.parse(keyValue?.value ?? null);
}



export interface IParams {
    [key: string]: any;
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export interface IFetchLeaderboardParams {
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

export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
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
