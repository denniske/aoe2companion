import {fetchJson} from "./util";
import {getHost} from "@nex/data";


export async function follow(account_id: string, profile_ids: number[], enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `follow`;

    const data = {
        account_id,
        profile_ids,
        enabled,
    };

    return await fetchJson('follow', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function unfollow(account_id: string, profile_ids: number[]): Promise<any> {
    const url = getHost('aoe2companion-api') + `unfollow`;

    const data = {
        account_id,
        profile_ids,
    };

    return await fetchJson('unfollow', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushToken(account_id: string, push_token: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token`;

    const data = {
        account_id,
        push_token,
    };

    return await fetchJson('setAccountPushToken', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushTokenWeb(account_id: string, push_token_web: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token_web`;

    const data = {
        account_id,
        push_token_web,
    };

    return await fetchJson('setAccountPushTokenWeb', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushTokenElectron(account_id: string, push_token_electron: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token_electron`;

    const data = {
        account_id,
        push_token_electron,
    };

    return await fetchJson('setAccountPushTokenElectron', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function sendTestPushNotificationWeb(push_token_web: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/send_test_web`;

    const data = {
        push_token_web,
    };

    return await fetchJson('sendTestPushNotificationWeb', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function sendTestPushNotificationElectron(push_token_electron: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/send_test_electron`;

    const data = {
        push_token_electron: push_token_electron,
    };

    return await fetchJson('sendTestPushNotificationElectron', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export interface IAccountProfile {
    profile_id?: number | null;
    steam_id?: string | null;
    overlay?: boolean;
}

export async function setAccountProfile(account_id: string, profile: IAccountProfile): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/profile`;

    const data = {
        account_id,
        ...profile
    };

    return await fetchJson('setAccountProfile', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setNotificationConfig(account_id: string, push_enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/config`;

    const data = {
        account_id,
        push_enabled,
    };

    return await fetchJson('setNotificationConfig', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}


export interface ITwitchChannel {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: Date;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
}

export async function twitchLive(channel?: string): Promise<ITwitchChannel> {
    if (channel == null || channel.length === 0) return {} as any;
    // return new Promise((resolve) => resolve({
    //   type: 'live',
    //   viewer_count: 320,
    // } as any));

    const url = getHost('aoe2companion-api') + `twitch/live?channel=${channel}`;
    // console.log(url);
    return await fetchJson('twitchLive', url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
}


interface Channel {
    id: string;
    name: string;
    position: number;
}

interface Game {
    name: string;
}

interface Member {
    id: string;
    username: string;
    discriminator: string;
    avatar?: any;
    status: string;
    avatar_url: string;
    game: Game;
}

export interface IDiscordInfo {
    id: string;
    name: string;
    instant_invite?: any;
    channels: Channel[];
    members: Member[];
    presence_count: number;
}

export async function discordOnline(serverId: string): Promise<IDiscordInfo> {
    const url = `https://discord.com/api/v6/guilds/${serverId}/widget.json`;
    // console.log(url);
    return await fetchJson('discordOnline', url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
}
