import {getHost, makeQueryString, sleep, time} from '@nex/data';
import {ILeaderboard, ILeaderboardRaw} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {fetchJson} from "./util";
import {appConfig} from "@nex/dataset";


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
        game: appConfig.game,
        leaderboard_id,
        ...params,
    });
    const url = baseUrl + `api/leaderboard?${queryString}`;
    const json = await fetchJson('fetchLeaderboard', url);

    console.log('fetchLeaderboard', json);

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
