import { makeQueryString, removeReactQueryParams } from './util';
import { camelizeKeys, decamelizeKeys } from 'humps';
import {
    IAnalysis,
    IAssetsResult, IBuildsResult, IFetchBuildsParams,
    IFetchLeaderboardParams,
    IFetchLeaderboardsParams,
    IFetchMapsParams,
    IFetchMapsPollParams,
    IFetchMapsRankedParams,
    IFetchMatchesParams,
    IFetchMatchParams,
    IFetchProfileParams,
    IFetchProfilesParams,
    ILeaderboard,
    ILeaderboardDef,
    IMapsPollResult,
    IMapsRankedResult,
    IMapsResult,
    IMatchesResult,
    IMatchNew,
    INewsResult,
    IProfileResult,
    IProfilesResult,
    IVideosResult,
} from './api.types';
import { dateReviver, getHost } from '@nex/data';
import { fetchJson } from '@app/api/util';

export async function fetchAssets() {
    const url = `${getHost('aoe2companion-data')}api/assets`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IAssetsResult;
}

export async function fetchProfile(params: IFetchProfileParams) {
    const { profileId, ...restParams } = params;
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(restParams),
            page: restParams.page || restParams.pageParam || 1,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/profiles/${profileId}?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IProfileResult;
}

export async function fetchProfiles(params: IFetchProfilesParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/profiles?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IProfilesResult;
}

export async function fetchMatch(params: IFetchMatchParams) {
    const { matchId, ...restParams } = params;
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(restParams),
            useEnums: true,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches/${matchId}?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IMatchNew;
}

export async function fetchMatchAnalysis(params: IFetchMatchParams) {
    const { matchId, ...restParams } = params;
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(restParams),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches/${matchId}/analysis?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IAnalysis;
}

export async function fetchMatchAnalysisSvg(params: IFetchMatchParams) {
    return `${getHost('aoe2companion-data')}api/matches/${params.matchId}/analysis/svg`;
}

export async function fetchMatches(params: IFetchMatchesParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            useEnums: true,
            page: params.page || params.pageParam || 1,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IMatchesResult;
}

export async function fetchLeaderboard(params: IFetchLeaderboardParams) {
    const { leaderboardId, ...restParams } = params;
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(restParams),
            extend: 'players.avatar_small_url',
            page: restParams.page || restParams.pageParam || 1,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards/${leaderboardId}?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as ILeaderboard;
}

export async function fetchLeaderboards(params: IFetchLeaderboardsParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as ILeaderboardDef[];
}

export async function fetchNews() {
    const url = `${getHost('aoe2companion-data')}api/news`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as INewsResult;
}

export async function fetchVideos(civ?: string) {
    let queryString = '';
    if (civ) {
        queryString += `civ=${civ}`
    }
    const url = `${getHost('aoe2companion-data')}api/videos?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IVideosResult;
}

export async function fetchMaps(params: IFetchMapsParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/maps?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IMapsResult;
}

export async function fetchMapsRanked(params: IFetchMapsRankedParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/maps/ranked?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IMapsRankedResult;
}

export async function fetchMapsPoll(params: IFetchMapsPollParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/maps/poll?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IMapsPollResult | null;
}

export async function fetchBuilds(params: IFetchBuildsParams) {
    // Fast return if user has no favorites
    if (params.build_ids && params.build_ids.length === 0) {
        return {
            builds: [],
            page: 1,
            perPage: 50,
        }
    }

    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
        })
    );
    const url = `${getHost('aoe2companion-data')}api/builds?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IBuildsResult;
}
