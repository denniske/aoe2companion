import {fromUnixTime} from "date-fns";
import {makeQueryString, removeReactQueryParams} from "./util";
import {camelizeKeys, decamelizeKeys} from "humps";
import {
    IFetchLeaderboardParams,
    IFetchMatchesParams,
    IFetchProfileParams, IFetchProfileRatingParams,
    ILeaderboard,
    ILeaderboardDef,
    IMatchesResult, IProfileRatingsResult, IProfileResult, IProfilesResult
} from "./api.types";
import {dateReviver, getHost} from "@nex/data";
import {fetchJson2} from "../util";

export async function fetchProfileRatings(params: IFetchProfileRatingParams) {
    console.log('fetchProfileRatings', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${getHost('aoe2companion-data')}api/profile/${params.profileId}/ratings?${queryString}`;
    return camelizeKeys(await fetchJson2('fetchProfileRatings', url, undefined, dateReviver)) as IProfileRatingsResult;
}

// export async function fetchProfileLeaderboard(params: IFetchProfileRatingParams) {
//     console.log('fetchProfileLeaderboard', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.pageParam || 1,
//     }));
//     const url = `${getHost('aoe2companion-data')}api/profile/ratings?${queryString}`;
//     return camelizeKeys(await fetchJson2('fetchProfileLeaderboard', url, undefined, dateReviver)) as IProfileRatingsResult;
// }

export async function fetchProfile(params: IFetchProfileParams) {
    console.log('fetchProfile', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${getHost('aoe2companion-data')}api/profiles/${params.profileId}?${queryString}`;
    return camelizeKeys(await fetchJson2('fetchProfile', url, undefined, dateReviver)) as IProfileResult;
}

export async function fetchProfiles(params: IFetchProfileParams) {
    console.log('fetchProfiles', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${getHost('aoe2companion-data')}api/profiles?${queryString}`;
    return camelizeKeys(await fetchJson2('fetchProfile', url, undefined, dateReviver)) as IProfilesResult;
}

// export async function fetchProfile(params: IFetchProfileParams) {
//     console.log('fetchProfile', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.pageParam || 1,
//     }));
//     const url = `${getHost('aoe2companion-data')}api/profile?${queryString}`;
//     return camelizeKeys(await fetchJson2('fetchProfile', url, undefined, dateReviver)) as IProfilesResult;
// }

export async function fetchMatches(params: IFetchMatchesParams) {
//    console.log('fetchMatches', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${getHost('aoe2companion-data')}api/matches?${queryString}`;
    return camelizeKeys(await fetchJson2('fetchMatches', url, undefined, dateReviver)) as IMatchesResult;
}

export async function fetchLeaderboard(params: IFetchLeaderboardParams) {
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${getHost('aoe2companion-data')}api/leaderboards/${params.leaderboardId}?${queryString}`;
    return camelizeKeys(await fetchJson2('fetchLeaderboard', url, undefined, dateReviver)) as ILeaderboard;
}

export async function fetchLeaderboards() {
    const url = `${getHost('aoe2companion-data')}api/leaderboards`;
    return camelizeKeys(await fetchJson2('fetchLeaderboards', url, undefined, dateReviver)) as ILeaderboardDef[];
}

