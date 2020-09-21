import {fromUnixTime} from "date-fns";
import { getHost } from './host';
import {fetchJson} from "./fetch-json";
import {makeQueryString} from "./util";


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

export interface ILeaderboardRaw {
    count: number;
    leaderboard: ILeaderboardPlayerRaw[];
    length: number;
    leaderboard_id: number;
    start: number;
    total: number;
    updated?: any;
}

export interface ILeaderboardPlayer extends ILeaderboardPlayerRaw {
    last_match: Date;
    last_match_time: Date;
}

export interface ILeaderboard extends ILeaderboardRaw{
    leaderboard: ILeaderboardPlayer[];
    updated?: Date;
}

function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
    return {
        ...leaderboardRaw,
        updated: leaderboardRaw.updated ? fromUnixTime(leaderboardRaw.updated) : undefined,
        leaderboard: leaderboardRaw.leaderboard.map(playerRaw => ({
            ...playerRaw,
            last_match: fromUnixTime(playerRaw.last_match),
        })),
    };
}

export interface IFetchLeaderboardParams {
    start?: number;
    count: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
    country?: string;
}

async function fetchLeaderboardInternal(baseUrl: string, game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    // time('fetchLeaderboard');
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });
    const url = baseUrl + `api/leaderboard?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);
    // time();
    return convertTimestampsToDates(json);
}

export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    // await sleep(4000);
    try {
        return await fetchLeaderboardInternal(getHost('aoe2companion'), game, leaderboard_id, params);
    } catch (e) {
        if (params.country == null) {
            return await fetchLeaderboardInternal(getHost('aoe2net'), game, leaderboard_id, params);
        }
        throw e;
    }
}

export async function fetchLeaderboardLegacy(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    return await fetchLeaderboardInternal(getHost('aoe2net'), game, leaderboard_id, params);
}
