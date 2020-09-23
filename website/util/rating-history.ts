import {fromUnixTime} from "date-fns";
import {fetchJson, makeQueryString} from "./player-matches";
import {IRatingHistoryEntry, IRatingHistoryEntryRaw, LeaderboardId} from "./api.types";

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
  const url = 'https://powerful-gorge-32054.herokuapp.com/http://aoe2.net/' + `api/player/ratinghistory?${queryString}`;
  const json = await fetchJson('fetchRatingHistory', url) as IRatingHistoryEntryRaw[];
  return json.map(match => convertTimestampsToDates(match));
}
