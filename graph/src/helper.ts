import fetch from "node-fetch";
import {uniqBy} from 'lodash';
import {KeyValue} from "./entity/keyvalue";
import {Connection} from "typeorm";
import {getUnixTime} from 'date-fns';
import {IMatchRaw, IRatingHistoryEntryRaw} from '@nex/data/api';

const appConfigGame = process.env.APP;
const host = process.env.APP === 'aoe2de' ? 'aoe2.net' : 'aoeiv.net';

export async function setValue(connection: Connection, id: string, value: any) {
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

export async function getValue(connection: Connection, id: string) {
    const keyValue = await connection.manager.findOne(KeyValue, id);
    return JSON.parse(keyValue?.value ?? null);
}

export const corsHeader = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

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

export interface ILeaderboardLegacyListRaw {
    recordsFiltered: number;
    draw: number;
    recordsTotal: number;
    data: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        number,
        number,
        number,
        number,
        boolean,
        number,
    ][];
}

export interface IFetchRatingHistoryParams {
    steam_id?: string;
    profile_id?: number;
}

export async function fetchRatingHistoryUniqueByTimestamp(game: string, leaderboard_id: number, start: number, count: number, params: IFetchRatingHistoryParams) {
    const queryString = makeQueryString({
        game: appConfigGame,
        leaderboard_id,
        start,
        count,
        ...params,
    });
    const url = `http://${host}/api/player/ratinghistory?${queryString}`;
    console.log('URL', url);
    const response = await fetch(url);
    try {
        return uniqBy(await response.json() as IRatingHistoryEntryRaw[], h => h.timestamp);
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game: appConfigGame,
        leaderboard_id,
        ...params,
    });

    const url = `http://${host}/api/leaderboard?${queryString}`;
    console.log(url);
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

export async function fetchMatches(game: string, start: number, count: number, since?: number): Promise<IMatchRaw[]> {
    let query: any = {
        game: appConfigGame,
        start,
        count,
    };
    if (since != null) {
        query.since = since;
    }
    const queryString = makeQueryString(query);

    const url = `http://${host}/api/matches?${queryString}`;
    console.log(url);
    const response = await fetch(url, { timeout: 60 * 1000 });
    try {
        const text = await response.text();
        // console.log(text);
        const json = JSON.parse(text);

        // Map new aoe2net civs to game civs
        json.forEach(match => {
            match.players.forEach(player => {
                player.civ = player.civ_alpha;
            })
        });

        return json;
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

export interface IFetchMatchParams {
    match_id?: string;
    uuid?: string;
}

export async function fetchMatch(game: string, params: IFetchMatchParams): Promise<IMatchRaw> {
    let query: any = {
        game: appConfigGame,
        ...params,
    };
    const queryString = makeQueryString(query);

    const url = `https://${host}/api/match?${queryString}`;
    console.log(url);
    const response = await fetch(url, { timeout: 60 * 1000 });
    try {
        const text = await response.text();
        // console.log(text);
        const json = JSON.parse(text);

        // Map new aoe2net civs to game civs
        json.players.forEach(player => {
            player.civ = player.civ_alpha;
        })

        return json;
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

interface IOngoingMatch extends Omit<IMatchRaw, 'match_id'> {
    id: string;
}

interface IOngoingMatches {
    draw: number,
    recordsTotal: number;
    data: IOngoingMatch[];
}

export async function fetchOngoingMatches(): Promise<IOngoingMatches> {
    const url = `https://${host}/matches/aoe2de/ongoing?_=?${getUnixTime(new Date())}`;
    console.log(url);
    const response = await fetch(url, { timeout: 60 * 1000 });
    try {
        const text = await response.text();
        // console.log(text);
        return JSON.parse(text);
        // return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

const leaderboardUrls = {
    0: 'unranked',
    1: 'dm-1v1',
    2: 'dm-team',
    3: 'rm-1v1',
    4: 'rm-team',
    13: 'ew-1v1',
    14: 'ew-team',
};

export interface ILeaderboardListRaw {
    recordsFiltered: number;
    draw: number;
    recordsTotal: number;
    data: {
        steam_id: string;
        profile_id: number;
        rank: number;
        rating: number;
        highest_rating: number;
        previous_rating: number;
        country_code: string;
        name: string;
        known_name: string;
        avatar: string;
        avatarfull: string;
        avatarmedium: string;
        num_games: number;
        streak: number;
        num_wins: number;
        win_percent: number;
        rating24h: number;
        games24h: number;
        wins24h: number;
        last_match: number;
    }[];
}

export async function fetchLeaderboardRecentMatches(leaderboardId: number, count: number): Promise<ILeaderboardListRaw> {
    let query: any = {
        'order[0][column]': 21,
        'order[0][dir]': 'desc',
        start: 0,
        length: count,
    };
    const queryString = makeQueryString(query);

    const url = `https://${host}/leaderboard/aoe2de/${leaderboardUrls[leaderboardId]}?${queryString}`;
    console.log(url);
    const response = await fetch(url, { timeout: 60 * 1000 });
    try {
        const text = await response.text();
        // console.log(text);
        return JSON.parse(text);
        // return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

export async function fetchLeaderboardRecentMatchesLegacy(leaderboardId: number, count: number): Promise<ILeaderboardLegacyListRaw> {
    let query: any = {
        'order[0][column]': 21,
        'order[0][dir]': 'desc',
        start: 0,
        length: count,
    };
    const queryString = makeQueryString(query);

    const url = `https://${host}/leaderboard/aoe2de/${leaderboardUrls[leaderboardId]}?${queryString}`;
    console.log(url);
    const response = await fetch(url, { timeout: 60 * 1000 });
    try {
        const text = await response.text();
        // console.log(text);
        return JSON.parse(text);
        // return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}
