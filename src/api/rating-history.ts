import { makeQueryString } from '../helper/util';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {LeaderboardId} from "../helper/leaderboards";


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
    const response = await fetch(`https://powerful-gorge-32054.herokuapp.com/http://aoe2.net/api/player/ratinghistory?${queryString}`);
    const json = await response.json() as IRatingHistoryEntryRaw[];
    // console.log("response.json()", json);

    return json.map(match => convertTimestampsToDates(match));
}
