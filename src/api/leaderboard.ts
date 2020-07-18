import { makeQueryString } from '../helper/util';
import {ILeaderboard, ILeaderboardRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {Platform} from "react-native";


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

export type Host = 'aoe2companion' | 'aoe2net';

function getHost(host: Host) {
    if (__DEV__) {
        const platformHost = Platform.select({ios: 'localhost', android: '10.0.2.2'});
        return `http://${platformHost}:3000/dev/`;
    }
    switch (host) {
        case "aoe2companion":
            return `https://function.aoe2companion.com/`;
        case "aoe2net":
            return `http://aoe2.net/`;
    }
}

export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });

    const url = getHost('aoe2companion') + `api/leaderboard?${queryString}`;
    console.log("fetchLeaderboard", url);
    const response = await fetch(url);
    try {
        const json = await response.json();
        // console.log("fetchLeaderboard", leaderboard_id, params, json);
        console.log("fetchLeaderboard response", json);
        return convertTimestampsToDates(json);
    } catch (e) {
        console.log("FAILED", e);
        throw e;
    }
}
