import { fetchJson } from './util';
import { getHost, makeQueryString } from '@nex/data';
import { supabaseClient } from '../../../data/src/helper/supabase';
import throttle from '@jcoreio/async-throttle';
import {
    loadAccountFromStorage,
    loadAuthFromStorage,
    loadConfigFromStorage,
    loadFollowingFromStorage,
    saveAuthToStorage,
    saveConfigToStorage,
    saveFollowingToStorage,
} from '@app/service/storage';
import { DarkMode } from '@app/redux/reducer';
import { loadPrefsFromStorage } from '@app/queries/prefs';

export interface IAccountFollowedPlayer {
    profileId: number;
    name?: string;
    country?: string;
    games?: number;
}

export interface IAccount {
    accountId: string;
    profileId?: number;
    steamId?: string;
    pushToken?: string;
    pushTokenWeb?: string;
    liveActivityToken?: string;
    notificationsEnabled: boolean;
    language: string;
    darkMode: DarkMode;
    mainPage: string;
    patreonId?: string;
    patreonTier?: string;
    preferences?: any;
    followedPlayers: IAccountFollowedPlayer[];

    email: string;
    emailVerified: boolean;
}

export async function fetchAccount(): Promise<IAccount> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {
        // console.log('fetchAccount: no session');

        const [account, auth, following, preferences, config] = await Promise.all([
            loadAccountFromStorage(),
            loadAuthFromStorage(),
            loadFollowingFromStorage(),
            loadPrefsFromStorage(),
            loadConfigFromStorage(),
        ]);

        // console.log('following', following);

        return {
            accountId: account.id,
            profileId: auth?.profileId,
            steamId: undefined,
            pushToken: undefined,
            pushTokenWeb: undefined,
            liveActivityToken: undefined,
            notificationsEnabled: config.pushNotificationsEnabled,
            language: config.language,
            darkMode: config.darkMode,
            mainPage: config.mainPage,
            patreonId: undefined,
            patreonTier: undefined,
            preferences,
            followedPlayers: following,
            email: '',
            emailVerified: false,
        };
    }

    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (result.status === 401) {
        throw new Error('Unauthorized');
    }

    return await result.json();
}

interface IResult {
    result: string;
}

export const saveAccountThrottled = throttle(saveAccount, 1000);

export async function saveAccount(account: Partial<IAccount>): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {
        console.log('saveAccount: no session');

        // Merge
        await saveConfigToStorage({
            pushNotificationsEnabled: account.notificationsEnabled,
            language: account.language,
            darkMode: account.darkMode,
            mainPage: account.mainPage,
        });

        if ('profileId' in account) {
            await saveAuthToStorage({
                profileId: account.profileId,
            });
        }

        return {
            result: 'success',
        };
    }

    const data = {
        ...account,
    };

    // https://stackoverflow.com/questions/31284216/why-does-json-stringify-ignore-keys-whose-values-are-undefined
    const replaceUndefinedWithNull = (key: string, value: any) => {
        return value === undefined ? null : value;
    };

    return await fetchJson('saveAccount', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data, replaceUndefinedWithNull),
    });
}

// if (following.length >= maxFollowing) {
//     alert(`You can follow a maximum of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
//     return;
// }

export async function followV2(profileId: number): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/follow`;

    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {
        console.log('followV2: no session');

        const following = await loadFollowingFromStorage();
        following.push({profileId});
        await saveFollowingToStorage(following);
    }

    const data = {
        profileId,
    };

    return await fetchJson('followV2', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function unfollowV2(profileId: number): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/unfollow`;

    const { data: session } = await supabaseClient.auth.getSession();

    const data = {
        profileId,
    };

    return await fetchJson('unfollowV2', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function accountUnlinkSteam(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/steam`;

    const { data: session } = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkSteam', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function accountUnlinkPatreon(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/patreon`;

    const { data: session } = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkPatreon', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function authLinkSteam(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/steam?${makeQueryString(params)}`;

    const { data: session } = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}


export async function authLinkPatreon(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/patreon?${makeQueryString(params)}`;

    const { data: session } = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function authConfirm(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/confirm?${makeQueryString(params)}`;

    const { data: session } = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}
