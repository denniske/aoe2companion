import {fetchProfiles} from "../api/helper/api";

// export interface IFetchedUser {
//     clan: string;
//     country: Flag;
//     drops: number;
//     games: number;
//     icon: any;
//     last_match: Date;
//     name: string;
//     profileId: number;
//     steamId: string;
//     entries: ILeaderboardPlayer[];
// }

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

export async function loadUser(page: number, search: string) {
    return fetchProfiles({page, search: search});
}

export async function loadUserBySteamId(search: string) {
    if (onlyDigits(search) && search.length > 12) {
        return (await fetchProfiles({steamId: search})).profiles[0];
    }
    return null;
}

export async function loadUserByProfileId(search: string) {
    if (onlyDigits(search) && search.length < 10) {
        return (await fetchProfiles({profileId: parseInt(search)})).profiles[0];
    }
    return null;
}
