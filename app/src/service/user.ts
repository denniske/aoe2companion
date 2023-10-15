import {Flag, ILeaderboardPlayer} from "@nex/data";
import {fetchProfile} from "../api/profile";

export interface IFetchedUser {
    clan: string;
    country: Flag;
    drops: number;
    games: number;
    icon: any;
    last_match: Date;
    name: string;
    profileId: number;
    steamId: string;
    entries: ILeaderboardPlayer[];
}

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

// export async function loadUser(page: number, search: string) {
//     console.log("loading user", search);
//
//     let profilesList = await Promise.all([
//         ...(onlyDigits(search) && search.length > 12 ? [fetchProfile({start: 1, count: 1, steam_id: search})] : []),
//         ...(onlyDigits(search) && search.length < 10 ? [fetchProfile({start: 1, count: 1, profile_id: parseInt(search)})] : []),
//         fetchProfile({page, search: search}),
//     ]);
//
//     return {
//         profileBySteamId: profilesList[0].profiles[0],
//         profileByProfileId: profilesList[1].profiles[0],
//         profilesBySearch: profilesList[2],
//     };
// }



export async function loadUser(page: number, search: string) {
    return fetchProfile({page, search: search});
}

export async function loadUserByProfileId(search: string) {
    if (onlyDigits(search) && search.length > 12) {
        return (await fetchProfile({steam_id: search})).profiles[0];
    }

    return null;
}

export async function loadUserBySteamId(search: string) {
    if (onlyDigits(search) && search.length < 10) {
        return (await fetchProfile({profile_id: parseInt(search)})).profiles[0];
    }

    return null;
}

// export async function loadUser(page: number, search: string) {
//     console.log("loading user", search);
//
//     let profilesList = await Promise.all([
//         ...(onlyDigits(search) && search.length > 12 ? [fetchProfile({start: 1, count: 1, steam_id: search})] : []),
//         ...(onlyDigits(search) && search.length < 10 ? [fetchProfile({start: 1, count: 1, profile_id: parseInt(search)})] : []),
//         fetchProfile({page, search: search}),
//     ]);
//
//     const profiles = profilesList.flatMap(l => l.profiles);
//
//     // console.log(profiles);
//
//     return profiles;
// }
