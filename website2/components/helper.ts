import { fromUnixTime } from "date-fns";

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

export type Host = 'aoe2companion' | 'aoe2companion-api' | 'aoe2net';

export interface IParams {
    [key: string]: any;
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export function getHost(host: Host) {
    switch (host) {
        case "aoe2companion": {
            // if (__DEV__ && !Constants.isDevice) {
            //     const platformHost = Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3000/dev/`;
            // }
            // if (__DEV__) {
            //     const platformHost = Constants.isDevice ? '192.168.178.41' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3004/`;
            // }
            // if (__DEV__) {
            //     const platformHost = Constants.isDevice ? '192.168.178.41' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3000/dev/`;
            // }
            // return `http://localhost:3000/dev/`;
            return `https://function.aoe2companion.com/`;
        }
        case "aoe2companion-api": {
            // if (__DEV__ && Constants.isDevice) {
            //     const platformHost = '192.168.178.41';
            //     return `http://${platformHost}:3003/`;
            // }
            return `https://api.aoe2companion.com/`;
        }
        case "aoe2net": {
            if (Platform.OS === 'web') {
                return 'https://powerful-gorge-32054.herokuapp.com/http://aoe2.net/';
            }
            return `http://aoe2.net/`;
        }
    }
}

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
    if (init) {
        console.log(input, init);
    } else {
        console.log(input);
    }

    let response = null;
    try {
        response = await fetch(input, init);
        return await response.json();
    } catch (e) {
        console.log(input, 'failed', response?.status);
        throw e;
    }
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