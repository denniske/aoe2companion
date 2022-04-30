import {getHost, makeQueryString } from '@nex/data';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {LeaderboardId} from "@nex/data";
import {fetchJson} from "./util";
import {appConfig} from "@nex/dataset";


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

function mapLeaderboardIdToEventLeaderboardId(leaderboard_id: any) {
    if (leaderboard_id === 1001) return 1;
    return -1;
}

export async function fetchRatingHistory(game: string, leaderboard_id: LeaderboardId, start: number, count: number, params: IFetchRatingHistoryParams) {
    const query: any = {
        game: appConfig.game,
        start,
        count,
        ...params,
    };
    if (leaderboard_id > 1000) {
        query.event_leaderboard_id = mapLeaderboardIdToEventLeaderboardId(leaderboard_id);
    } else {
        query.leaderboard_id = leaderboard_id;
    }
    const queryString = makeQueryString(query);
    const url = getHost('aoe2net') + `api/player/ratinghistory?${queryString}`;
    const json = await fetchJson('fetchRatingHistory', url) as IRatingHistoryEntryRaw[];
    return json.map(match => convertTimestampsToDates(match));
}
