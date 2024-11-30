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

export async function setAccountLiveActivityToken(account_id: string, live_activity_token: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/live_activity_token`;

    const data = {
        account_id,
        live_activity_token,
    };

    return await fetchJson('setAccountLiveActivityToken', url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function storeLiveActivityStarted(account_id: string, live_activity_id: string, activity_type: string, object_id: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/live_activity_started`;

    const data = {
        account_id,
        live_activity_id,
        activity_type,
        object_id,
    };

    return await fetchJson('storeLiveActivityStarted', url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
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

export async function setAccountLanguage(account_id: string, language: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/language`;

    const data = {
        account_id,
        language
    };

    return await fetchJson('setAccountLanguage', url, {
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

export type IDiscordInfo = {
    type: number
    code: string
    inviter: {
        id: string
        username: string
        avatar: string
        discriminator: string
        public_flags: number
        flags: number
        banner: any
        accent_color: any
        global_name: string
        avatar_decoration_data: any
        banner_color: any
        clan: any
        primary_guild: any
    }
    expires_at: any
    flags: number
    guild: {
        id: string
        name: string
        splash: any
        banner: any
        description: any
        icon: string
        features: Array<string>
        verification_level: number
        vanity_url_code: any
        nsfw_level: number
        nsfw: boolean
        premium_subscription_count: number
    }
    guild_id: string
    channel: {
        id: string
        type: number
        name: string
    }
    approximate_member_count: number
    approximate_presence_count: number
}

export async function discordOnline(invitationId: string): Promise<IDiscordInfo> {
    const url = `https://discord.com/api/invites/${invitationId}?with_counts=true`;
    return await fetchJson('discordOnline', url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
}
