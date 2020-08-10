import {makeQueryString, sleep} from '../helper/util';
import {ILeaderboard, ILeaderboardRaw, IRatingHistoryEntryRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import { getHost } from './host';
import {fetchJson} from "./util";


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
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });
    const url = baseUrl + `api/leaderboard?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);
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
