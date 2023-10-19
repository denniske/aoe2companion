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
