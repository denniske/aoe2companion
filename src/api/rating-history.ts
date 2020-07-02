import { makeQueryString } from '../helper/util';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "../helper/data";

const fromUnixTime = require('date-fns/fromUnixTime');


function convertTimestampsToDates(json: IRatingHistoryEntryRaw): IRatingHistoryEntry {
    return {
        ...json,
        timestamp: json.timestamp ? fromUnixTime(json.timestamp):null,
    };
}


export interface IFetchRatingHistoryParams {
    steam_id?: string;
    profile_id?: number;
}

export async function fetchRatingHistory(game: string, leaderboard_id: number, start: number, count: number, params: IFetchRatingHistoryParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        start,
        count,
        ...params,
    });
    const response = await fetch(`https://aoe2.net/api/player/ratinghistory?${queryString}`);
    const json = await response.json() as IRatingHistoryEntryRaw[];
    // console.log("response.json()", json);

    return json.map(match => convertTimestampsToDates(match));
}
