import {getHost, makeQueryString, sleep, time} from '@nex/data';
import {ILeaderboard, ILeaderboardRaw} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {fetchJson} from "./util";
import {appConfig} from "@nex/dataset";


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

async function fetchLeaderboardInternal(baseUrl: string, game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    // time('fetchLeaderboard');
    const query: any = {
        game: appConfig.game,
        ...params,
    };
    if (leaderboard_id > 1000) {
        query.event_leaderboard_id = mapLeaderboardIdToEventLeaderboardId(leaderboard_id);
    } else {
        query.leaderboard_id = leaderboard_id;
    }
    const queryString = makeQueryString(query);
    const url = baseUrl + `api/leaderboard?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);

    // console.log('fetchLeaderboard', json);

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
