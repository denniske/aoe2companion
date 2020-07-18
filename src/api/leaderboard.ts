import { makeQueryString } from '../helper/util';
import {ILeaderboard, ILeaderboardRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {Platform} from "react-native";


function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
    return {
        ...leaderboardRaw,
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


export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });


    const host = Platform.select({ios: 'localhost', android: '10.0.2.2'});
    const screenshotsEndpoint = `http://${host}:3000/dev/`;

    const url = screenshotsEndpoint + `api/leaderboard?${queryString}`;
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
