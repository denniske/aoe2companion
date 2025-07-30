import { makeQueryString, removeReactQueryParams } from './util';
import { camelizeKeys, decamelizeKeys } from 'humps';
import {
    IAnalysis,
    IAssetsResult,
    IFetchLeaderboardParams,
    IFetchMatchesParams,
    IFetchMatchParams,
    IFetchProfileParams,
    ILeaderboard,
    ILeaderboardDef,
    IMatchesResult,
    IMatchNew,
    IProfileResult,
    IProfilesResult,
} from './api.types';
import { dateReviver, getHost } from '@nex/data';
import { fetchJson } from '@app/api/util';
import { getInternalLanguage } from '@app/helper/translate';

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
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/profiles/${profileId}?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as IProfileResult;
}

export async function fetchProfiles(params: IFetchProfileParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
            language: getInternalLanguage(),
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
            language: getInternalLanguage(),
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
            language: getInternalLanguage(),
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
            language: getInternalLanguage(),
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
            page: restParams.page || restParams.pageParam || 1,
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards/${leaderboardId}?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as ILeaderboard;
}

export async function fetchLeaderboards() {
    const queryString = makeQueryString(
        decamelizeKeys({
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards?${queryString}`;
    return camelizeKeys(await fetchJson(url, undefined, dateReviver)) as ILeaderboardDef[];
}
