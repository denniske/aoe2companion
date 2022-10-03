import {getHost, makeQueryString } from '@nex/data';
import {fetchJson} from "./util";
import {appConfig} from "@nex/dataset";

export interface IFetchLeaderboardParams {
    start?: number;
    count: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
}

export async function fetchProfile(params: IFetchLeaderboardParams) {
    const query: any = {
        game: appConfig.game,
        ...params,
    };
    const queryString = makeQueryString(query);
    const url = getHost('aoe2net') + `api/profile?${queryString}`;
    const json = await fetchJson('fetchProfile', url);

    return json;
}
