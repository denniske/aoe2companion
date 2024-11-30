import {fetchJson} from "./util";
import { getHost, makeQueryString } from '@nex/data';
import { supabaseClient } from '../../../data/src/helper/supabase';
import throttle from '@jcoreio/async-throttle';

export interface IAccountFollowedPlayer {
    profileId: number;
    name?: string;
    country?: string;
    games?: number;
}

export interface IAccount {
    accountId: string;
    profileId: string;
    steamId: string;
    pushToken?: string;
    pushTokenWeb?: string;
    liveActivityToken: string;
    notificationsEnabled: boolean;
    language: string;
    darkMode: string;
    mainPage: string;
    patreonId: string;
    patreonTier: string;
    followedPlayers: IAccountFollowedPlayer[];

    email: string;
    emailVerified: boolean;
}

export async function fetchAccount(): Promise<IAccount> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });

    if (result.status === 401) {
        // throw new Error('Unauthorized');
        return null;
    }

    return await result.json();

    // return await fetchJson('account', url, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `bearer ${session?.data?.session?.access_token}`,
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     // body: JSON.stringify(data),
    // });
}

interface IResult {
    result: string;
}

export const saveAccountThrottled = throttle(saveAccount, 1000);

export async function saveAccount(account: IAccount): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const session = await supabaseClient.auth.getSession();

    const data = {
        ...account,
    };

    return await fetchJson('saveAccount', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

// if (following.length >= maxFollowing) {
//     alert(`You can follow a maximum of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
//     return;
// }

export async function followV2(profileId: number): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/follow`;

    const session = await supabaseClient.auth.getSession();

    const data = {
        profileId,
    };

    return await fetchJson('followV2', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function unfollowV2(profileId: number): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/unfollow`;

    const session = await supabaseClient.auth.getSession();

    const data = {
        profileId,
    };

    return await fetchJson('unfollowV2', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function accountUnlinkSteam(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/steam`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkSteam', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function accountUnlinkPatreon(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/patreon`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkPatreon', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function authLinkSteam(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/steam?${makeQueryString(params)}`;

    const session = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}


export async function authLinkPatreon(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/patreon?${makeQueryString(params)}`;

    const session = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function authConfirm(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/confirm?${makeQueryString(params)}`;

    const session = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}
