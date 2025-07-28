import { fetchJson } from './util';
import { getHost, makeQueryString, sleep } from '@nex/data';
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
import { IPrefs, loadPrefsFromStorage } from '@app/queries/prefs';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    preferences?: IPrefs;
    followedPlayers: IAccountFollowedPlayer[];
    authRelicId?: number;
    twitchChannel?: string;
    youtubeChannel?: string;
    youtubeChannelName?: string;
    discordName?: string;
    discordInvitation?: string;
    sharedHistory?: boolean;

    email: string;
    emailVerified: boolean;
}

// async function setFakeStorage() {
//     await AsyncStorage.setItem('account', '{"id":"f0ca3509-5337-43d2-9b9f-b99efec3e3de"}');
//     await AsyncStorage.setItem('config', '{"language":"de","darkMode":"system","preventScreenLockOnGuidePage":true,"pushNotificationsEnabled":false,"hotkeyShowHideEnabled":true,"hotkeySearchEnabled":true,"overlay":{"opacity":80,"offset":7,"duration":60}}');
//     await AsyncStorage.setItem('settings', '{"profileId":223576}');
//     await AsyncStorage.setItem('following', '[{"profileId":196240,"profile_id":196240,"name":"GL.TheViper","games":6248,"country":"de"},{"profileId":199325,"profile_id":199325,"name":"aM.Hera","games":8529,"country":"ca"},{"steam_id":"76561199043161086","profileId":2202814,"profile_id":2202814,"name":"Ems","games":780,"country":"ie"}]');
//     await AsyncStorage.setItem('prefs', '{"country":"de","ratingHistoryHiddenLeaderboardIds":[],"clan":"AE2C","ratingHistoryDuration":"3m"}');
// }

// setFakeStorage();

// async function logCurrentStorage() {
//     console.log(`await AsyncStorage.setItem('account', '${JSON.stringify(await AsyncStorage.getItem('account'))}');`);
//     console.log(`await AsyncStorage.setItem('config', '${JSON.stringify(await AsyncStorage.getItem('config'))}');`);
//     console.log(`await AsyncStorage.setItem('settings', '${JSON.stringify(await AsyncStorage.getItem('settings'))}');`);
//     console.log(`await AsyncStorage.setItem('following', '${JSON.stringify(await AsyncStorage.getItem('following'))}');`);
//     console.log(`await AsyncStorage.setItem('prefs', '${JSON.stringify(await AsyncStorage.getItem('prefs'))}');`);
// }
//
// logCurrentStorage();

export async function fetchAccount(): Promise<IAccount> {
    // console.trace('fetchAccount START');
    const url = getHost('aoe2companion-api') + `v2/account`;

    // await supabaseClient.auth.signOut();

    let { data: session } = await supabaseClient.auth.getSession();

    // console.log('session', session);

    if (!session.session) {
        console.log('fetchAccount: no session');

        const { error, data } = await supabaseClient.auth.signInAnonymously({
            options: {
                data: {

                }
            }
        })

        session = data;

        // console.log('data.session', data.session);
        // console.log('error', error);

        if (error) {
            console.log('fetchAccount: session creation failed', error);
            throw error;
        }

        const [account, auth, following, preferences, config] = await Promise.all([
            loadAccountFromStorage(),
            loadAuthFromStorage(),
            loadFollowingFromStorage(),
            loadPrefsFromStorage(),
            loadConfigFromStorage(),
        ]);

        const accountData = {
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
            email: '',
            emailVerified: false,
        };

        // console.log('accountData', accountData);
        // console.log('fetchAccount SAVING ACCOUNT');

        await saveAccount(accountData);
        await followV2(following.map(f => f.profileId));
    }

    return await fetchJson(url, {
        method: 'GET',
    });
}

interface IResult {
    result: string;
}

interface IRelicVerifyResult {
    token: string;
    verified: boolean;
}

export const saveAccountThrottled = throttle(saveAccount, 1000);

export type PartialAccountWithPartialPrefs = Omit<Partial<IAccount>, 'preferences'> & {
    preferences?: Partial<IAccount['preferences']>;
};

export async function saveAccount(account: PartialAccountWithPartialPrefs): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {
        console.log('saveAccount: no session');
        throw new Error('saveAccount: no session');
    }

    const data = {
        ...account,
    };

    // https://stackoverflow.com/questions/31284216/why-does-json-stringify-ignore-keys-whose-values-are-undefined
    const replaceUndefinedWithNull = (key: string, value: any) => {
        return value === undefined ? null : value;
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data, replaceUndefinedWithNull),
    });
}

// if (following.length >= maxFollowing) {
//     alert(`You can follow a maximum of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
//     return;
// }

export async function followV2(profileIds: number[]): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/follow`;

    const data = {
        profileIds,
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function unfollowV2(profileIds: number[]): Promise<IResult> {
    const url = getHost('aoe2companion-api') + `v2/unfollow`;

    const data = {
        profileIds,
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function accountRelicVerify(): Promise<IRelicVerifyResult> {
    const url = getHost('aoe2companion-api') + `v2/account/relic/verify`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountUnlinkSteam(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/steam`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountUnlinkPatreon(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/patreon`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountUnlinkYoutube(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/youtube`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountUnlinkDiscord(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/discord`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountUnlinkTwitch(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/twitch`;

    return await fetchJson(url, {
        method: 'POST',
    });
}

export async function accountDiscordInvitation(invitation: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/discord/invitation`;

    const data = {
        invitation,
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function authLinkSteam(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/steam?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}


export async function authLinkPatreon(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/patreon?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}


export async function authLinkYoutube(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/youtube?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}


export async function authLinkDiscord(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/discord?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}


export async function authLinkTwitch(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/twitch?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}

export async function authConfirm(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/confirm?${makeQueryString(params)}`;

    return await fetchJson(url, {
        method: 'GET',
    });
}

export async function setAccountLiveActivityToken(liveActivityToken: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/live_activity_token`;

    const data = {
        liveActivityToken,
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function storeLiveActivityStarted(liveActivityId: string, activityType: string, objectId: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/live_activity_started`;

    const data = {
        liveActivityId,
        activityType,
        objectId,
    };

    return await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
