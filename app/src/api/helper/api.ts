import { fromUnixTime } from 'date-fns';
import { makeQueryString, removeReactQueryParams } from './util';
import { camelizeKeys, decamelizeKeys } from 'humps';
import {
    IAssetsResult,
    IFetchLeaderboardParams,
    IFetchMatchesParams, IFetchMatchParams,
    IFetchProfileParams,
    IFetchProfileRatingParams,
    ILeaderboard,
    ILeaderboardDef,
    IMatchesResult, IMatchNew,
    IProfileRatingsResult,
    IProfileResult,
    IProfilesResult,
} from './api.types';
import { dateReviver, getHost } from '@nex/data';
import { getInternalLanguage } from '../../redux/statecache';
import { fetchJson } from '@app/api/util';

export async function fetchProfileRatings(params: IFetchProfileRatingParams) {
    console.log('fetchProfileRatings', params);
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/profile/${params.profileId}/ratings?${queryString}`;
    return camelizeKeys(await fetchJson('fetchProfileRatings', url, undefined, dateReviver)) as IProfileRatingsResult;
}

// export async function fetchProfileLeaderboard(params: IFetchProfileRatingParams) {
//     console.log('fetchProfileLeaderboard', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.page || params.pageParam || 1,
//     }));
//     const url = `${getHost('aoe2companion-data')}api/profile/ratings?${queryString}`;
//     return camelizeKeys(await fetchJson('fetchProfileLeaderboard', url, undefined, dateReviver)) as IProfileRatingsResult;
// }

export async function fetchAssets() {
    const url = `${getHost('aoe2companion-data')}api/assets`;
    return camelizeKeys(await fetchJson('fetchAssets', url, undefined, dateReviver)) as IAssetsResult;
}

export async function fetchProfile(params: IFetchProfileParams) {
    console.log('fetchProfile', params);
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/profiles/${params.profileId}?${queryString}`;
    return camelizeKeys(await fetchJson('fetchProfile', url, undefined, dateReviver)) as IProfileResult;
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
    return camelizeKeys(await fetchJson('fetchProfile', url, undefined, dateReviver)) as IProfilesResult;
}

// export async function fetchProfile(params: IFetchProfileParams) {
//     console.log('fetchProfile', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.page || params.pageParam || 1,
//     }));
//     const url = `${getHost('aoe2companion-data')}api/profile?${queryString}`;
//     return camelizeKeys(await fetchJson('fetchProfile', url, undefined, dateReviver)) as IProfilesResult;
// }

export async function fetchMatch(params: IFetchMatchParams) {
    //    console.log('fetchMatch', params);
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches/${params.matchId}?${queryString}`;
    return camelizeKeys(await fetchJson('fetchMatch', url, undefined, dateReviver)) as IMatchNew;
}

export async function fetchMatchAnalysis(params: IFetchMatchParams) {
    //    console.log('fetchMatchAnalysis', params);
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches/${params.matchId}/analysis?${queryString}`;
    return camelizeKeys(await fetchJson('fetchMatchAnalysis', url, undefined, dateReviver)) as IMatchNew;
}

export async function fetchMatchAnalysisSvg(params: IFetchMatchParams) {
    return `${getHost('aoe2companion-data')}api/matches/${params.matchId}/analysis/svg`;
}

export async function fetchMatches(params: IFetchMatchesParams) {
    //    console.log('fetchMatches', params);
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/matches?${queryString}`;
    return camelizeKeys(await fetchJson('fetchMatches', url, undefined, dateReviver)) as IMatchesResult;
}

export async function fetchLeaderboard(params: IFetchLeaderboardParams) {
    const queryString = makeQueryString(
        decamelizeKeys({
            ...removeReactQueryParams(params),
            page: params.page || params.pageParam || 1,
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards/${params.leaderboardId}?${queryString}`;
    return camelizeKeys(await fetchJson('fetchLeaderboard', url, undefined, dateReviver)) as ILeaderboard;
}

export async function fetchLeaderboards() {
    const queryString = makeQueryString(
        decamelizeKeys({
            language: getInternalLanguage(),
        })
    );
    const url = `${getHost('aoe2companion-data')}api/leaderboards?${queryString}`;
    return camelizeKeys(await fetchJson('fetchLeaderboards', url, undefined, dateReviver)) as ILeaderboardDef[];
}
