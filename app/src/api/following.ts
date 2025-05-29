import {fetchJson} from "./util";
import { getHost } from '@nex/data';

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
