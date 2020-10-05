import { makeQueryString } from '@nex/data';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {LeaderboardId} from "../helper/leaderboards";
import {getHost} from "./host";
import {fetchJson} from "./util";


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
    const json = await fetchJson('fetchRatingHistory', url) as IRatingHistoryEntryRaw[];
    return json.map(match => convertTimestampsToDates(match));
}
