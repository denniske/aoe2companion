import {dateReviver, getHost, makeQueryString} from '@nex/data';
import {fetchJson, fetchJson2} from "./util";
import {appConfig} from "@nex/dataset";
import {IMatchesResponse, IMatchNew, IProfilesResponse} from "@nex/data/api";
import {camelizeKeys} from "humps";

export interface IFetchLeaderboardParams {
    page?: number;
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
    const url = getHost('aoe2companion-data') + `api/profiles?${queryString}`;

    let json = camelizeKeys(await fetchJson2('fetchProfile', url, undefined, dateReviver)) as IProfilesResponse;

    // console.log('=========> RESPONSE <==========');
    // console.log(json);

    return json;
}



