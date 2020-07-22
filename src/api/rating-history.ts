import { makeQueryString } from '../helper/util';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {LeaderboardId} from "../helper/leaderboards";
import {getHost} from "./host";


function convertTimestampsToDates(json: IRatingHistoryEntryRaw): IRatingHistoryEntry {
    return {
        ...json,
        timestamp: json.timestamp ? fromUnixTime(json.timestamp) : undefined,
    };
}


export interface IFetchRatingHistoryParams {
    steam_id?: string;
    profile_id?: number;
}

export async function fetchRatingHistory(game: string, leaderboard_id: LeaderboardId, start: number, count: number, params: IFetchRatingHistoryParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        start,
        count,
        ...params,
    });
    const url = getHost('aoe2net') + `api/player/ratinghistory?${queryString}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json() as IRatingHistoryEntryRaw[];
    // console.log("response.json()", json);

    return json.map(match => convertTimestampsToDates(match));
}
