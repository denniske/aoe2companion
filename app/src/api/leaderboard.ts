import {dateReviver, getHost, makeQueryString} from '@nex/data';
import {fetchJson, fetchJson2} from "./util";
import {appConfig} from "@nex/dataset";
import {camelizeKeys, decamelize, decamelizeKeys} from "humps";
import {ILeaderboardResponse, ILeaderboardsResponse, IMatchesResponse} from "@nex/data/api";

export interface IFetchLeaderboardParams {
    // start?: number;
    // count: number;
    page: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
    country?: string;
}

export async function fetchLeaderboard(leaderboard_id: number, params: IFetchLeaderboardParams): Promise<ILeaderboardResponse> {
    const query: any = decamelizeKeys({
        game: appConfig.game,
        ...params,
    });
    const queryString = makeQueryString(query);
    const url = getHost('aoe2companion-data') + `api/leaderboards/${leaderboard_id}?${queryString}`;
    let json = camelizeKeys(await fetchJson2('fetchLeaderboard', url, undefined, dateReviver)) as ILeaderboardResponse;

    // console.log(json);

    return json;
}

export async function fetchLeaderboards(): Promise<ILeaderboardsResponse> {
    const url = getHost('aoe2companion-data') + `api/leaderboards`;
    let json = camelizeKeys(await fetchJson2('fetchLeaderboards', url, undefined, dateReviver)) as ILeaderboardsResponse;

    // console.log(json);

    return json;
}
