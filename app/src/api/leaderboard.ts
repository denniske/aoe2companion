import {getHost, ILeaderboardPlayer, makeQueryString, sleep, time} from '@nex/data';
import {ILeaderboard, ILeaderboardRaw} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {fetchJson} from "./util";
import {appConfig} from "@nex/dataset";
import {Aoe4WorldGame, Aoe4WorldLeaderboard} from "../../../data/src/api/api4.types";


function mapEventLeaderboardIdToLeaderboardId(leaderboard_id: any) {
    if (leaderboard_id === 1) return 1001;
    return -1;
}

function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
    return {
        ...leaderboardRaw,
        leaderboard_id: leaderboardRaw.leaderboard_id ?? mapEventLeaderboardIdToLeaderboardId(leaderboardRaw.event_leaderboard_id),
        updated: leaderboardRaw.updated ? fromUnixTime(leaderboardRaw.updated) : undefined,
        leaderboard: leaderboardRaw.leaderboard.map(leaderboardPlayerRaw => ({
            ...leaderboardPlayerRaw,
            leaderboard_id: leaderboardRaw.leaderboard_id ?? mapEventLeaderboardIdToLeaderboardId(leaderboardRaw.event_leaderboard_id),
            last_match: fromUnixTime(leaderboardPlayerRaw.last_match),
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

function mapLeaderboardIdToEventLeaderboardId(leaderboard_id: any) {
    if (leaderboard_id === 1001) return 1;
    return -1;
}

// https://aoe4world.com/api/v0/leaderboards/:leaderboard

const aoe4WorldLeaderboardMapReverse = {
    0: 'custom',
    17: 'qm_1v1',
    18: 'qm_2v2',
    19: 'qm_3v3',
    20: 'qm_4v4',
    1001: 'rm_1v1',
};

const aoe4WorldLeaderboardMap = {
    'custom': 0,
    'qm_1v1': 17,
    'qm_2v2': 18,
    'qm_3v3': 19,
    'qm_4v4': 20,
    'rm_1v1': 1001,
};

function aoe4worldLeaderboardToAoe2NetLeaderboard(leaderboard4: Aoe4WorldLeaderboard) {
    const result: ILeaderboard = {
        count: leaderboard4.count,
        event_leaderboard_id: 0,
        leaderboard: leaderboard4.players.map(p4 => ({
            clan: "",
            country: undefined,
            drops: 0,
            games: p4.games_count,
            highest_rating: 0,
            highest_streak: 0,
            icon: undefined,
            last_match: undefined,
            last_match_time: p4.last_game_at,
            losses: p4.losses_count,
            lowest_streak: 0,
            name: p4.name,
            previous_rating: 0,
            profile_id: p4.profile_id,
            rank: p4.rank,
            rating: p4.rating,
            steam_id: p4.steam_id,
            streak: p4.streak,
            wins: p4.wins_count
        })),
        leaderboard_id: aoe4WorldLeaderboardMap[leaderboard4.key],
        start: leaderboard4.offset,
        total: leaderboard4.total_count,
        updated: undefined,
    };
    return result;
}

async function fetchLeaderboardInternal4(leaderboard_id: number, params: IFetchLeaderboardParams) {

    const page = params.start ? Math.ceil(params.start / 50) : 1;
    const query: any = {
        per_page: 50,
        page,
    };
    if (params.profile_id) {
        query.profile_id = params.profile_id;
    }
    const leaderboard = aoe4WorldLeaderboardMapReverse[leaderboard_id];
    const queryString = makeQueryString(query);
    const url = `https://aoe4world.com/api/v0/leaderboards/${leaderboard}?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);

    console.log('fetchLeaderboard', json);

    // time();
    return aoe4worldLeaderboardToAoe2NetLeaderboard(json);
}

async function fetchLeaderboardInternal(baseUrl: string, game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    if (appConfig.game == 'aoe4') return fetchLeaderboardInternal4(leaderboard_id, params);

    const query: any = {
        game: appConfig.game,
        leaderboard_id,
        ...params,
    };
    const queryString = makeQueryString(query);
    const url = baseUrl + `api/leaderboard?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);

    return convertTimestampsToDates(json);
}

export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    // await sleep(4000);
    try {
        return await fetchLeaderboardInternal(getHost('aoe2net'), game, leaderboard_id, params);
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
