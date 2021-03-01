import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {time} from "../util";
import {Connection, getRepository, In, Not} from "typeorm";
import {Account} from "../entity/account";
import {Following} from "../entity/following";
import PushNotifications from '@pusher/push-notifications-server';
import fetch from 'node-fetch';
import {fetchMatch} from '../helper';
import {upsertMatchesWithPlayers} from '../entity/entity-helper';
import {PrismaService} from '../service/prisma.service';
import {getUnixTime} from 'date-fns';


@Controller()
export class ApiController {
    private beamsClient: PushNotifications;

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    async onModuleInit() {
        this.beamsClient = new PushNotifications({
            instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
            secretKey: process.env.PUSHER_SECRET_KEY,
        });
    }

    @Post('/follow')
    async follow(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_ids: number[],
        @Body('enabled') enabled: boolean,
    ) {
        time(1);

        // console.log('/follow');
        // console.log(req.body);

        const query = this.connection.createQueryBuilder().insert().into(Account).values({id: account_id}).orIgnore();
        await query.execute();

        time();
        const followingRepo = getRepository(Following);

        const followingEntries = profile_ids.map(profile_id => {
            const followingEntry = new Following();
            followingEntry.account = { id: account_id };
            followingEntry.profile_id = profile_id;
            followingEntry.enabled = enabled;
            return followingEntry;
        });

        await followingRepo.save(followingEntries);

        time();
        return { success: true };
    }

    @Post('/unfollow')
    async unfollow(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_ids: number[],
    ) {
        time(1);

        // console.log('/follow');
        // console.log(req.body);

        const query = this.connection.createQueryBuilder().insert().into(Account).values({id: account_id}).orIgnore();
        await query.execute();

        time();
        const query2 = this.connection.createQueryBuilder()
            .delete()
            .from(Following)
            .where({ account: { id: account_id }, profile_id: In(profile_ids) });
        await query2.execute();

        time();
        return { success: true };
    }

    @Post('/account/push_token')
    async accountPushToken(
        @Body('account_id') account_id: string,
        @Body('push_token') push_token: string,
    ) {
        time(1);

        const query = this.connection.createQueryBuilder()
            .update(Account)
            .set({ push_token: null })
            .where({ push_token: push_token, id: Not(account_id) });
        await query.execute();

        const accountRepo = getRepository(Account);
        const accountEntry = new Account();
        accountEntry.id = account_id;
        accountEntry.push_token = push_token;

        console.log(accountEntry);

        await accountRepo.save(accountEntry);

        time();
        return { success: true };
    }

    @Post('/account/push_token_web')
    async accountPushTokenWeb(
        @Body('account_id') account_id: string,
        @Body('push_token_web') push_token_web: string,
    ) {
        time(1);

        const query = this.connection.createQueryBuilder()
            .update(Account)
            .set({ push_token_web: null })
            .where({ push_token_web: push_token_web, id: Not(account_id) });
        await query.execute();

        const accountRepo = getRepository(Account);
        const accountEntry = new Account();
        accountEntry.id = account_id;
        accountEntry.push_token_web = push_token_web;

        console.log(accountEntry);

        await accountRepo.save(accountEntry);

        time();
        return { success: true };
    }

    @Post('/account/push_token_electron')
    async accountPushTokenElectron(
        @Body('account_id') account_id: string,
        @Body('push_token_electron') push_token_electron: string,
    ) {
        time(1);

        const query = this.connection.createQueryBuilder()
            .update(Account)
            .set({ push_token_electron: null })
            .where({ push_token_electron: push_token_electron, id: Not(account_id) });
        await query.execute();

        const accountRepo = getRepository(Account);
        const accountEntry = new Account();
        accountEntry.id = account_id;
        accountEntry.push_token_electron = push_token_electron;

        console.log(accountEntry);

        await accountRepo.save(accountEntry);

        time();
        return { success: true };
    }

    @Post('/notification/send_test_web')
    async sendTestPushNotificationWeb(
        @Body('push_token_web') push_token_web: string,
    ) {
        try {
            const webPushResponse = await this.beamsClient.publishToInterests([`device-${push_token_web}`], {
                web: {
                    notification: {
                        title: 'Test Notification',
                        body: 'This is a test!',
                        deep_link: `https://app.aoe2companion.com/feed`,
                    },
                    data: { data: 'goes here' },
                }
            });
            console.log(webPushResponse);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { error: e.toString() };
        }
    }

    @Post('/notification/send_test_electron')
    async sendTestPushNotificationElectron(
        @Body('push_token_electron') push_token_electron: string,
    ) {
        try {
            const message = {
                appKey: 'IpANYN0DRa84xPpmvQ9Z',
                appSecret: process.env.ELECTROLYTIC_APP_SECRET,
                target: [push_token_electron],
                payload: {
                    title: 'Test Notification',
                    body: 'This is a test!',
                    data: { data: 'goes here' },
                },
            };

            console.log('PUSH ELECTRON');
            console.log(message);

            const result = await fetch('https://api.electrolytic.app/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const electronPushResponse = await result.json();
            console.log(electronPushResponse);

            return { success: electronPushResponse.status == 'accepted' };
        } catch (e) {
            console.error(e);
            return { error: e.toString() };
        }
    }

    @Post('/account/profile')
    async accountProfile(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_id: number,
        @Body('steam_id') steam_id: string,
    ) {
        time(1);

        // console.log('/follow');
        // console.log(req.body);

        const accountRepo = getRepository(Account);

        const accountEntry = new Account();
        accountEntry.id = account_id;
        accountEntry.profile_id = profile_id;
        accountEntry.steam_id = steam_id;

        console.log(accountEntry);

        await accountRepo.save(accountEntry);

        time();
        return { success: true };
    }

    @Post('/notification/config')
    async notificationConfig(
        @Body('account_id') account_id: string,
        @Body('push_enabled') push_enabled: boolean,
    ) {
        time(1);

        // console.log('/follow');
        // console.log(req.body);

        const query = this.connection.createQueryBuilder()
            .update(Following)
            .set({
                enabled: push_enabled,
            })
            .where({ account: { id: account_id } });
        await query.execute();

        time();
        return { success: true };
    }

    @Post('/match/refetch')
    async triggerMatchRefetch(
        @Body('match_uuid') match_uuid: string,
        @Body('match_id') match_id: string,
    ) {
        time(1);

        let updatedMatch = await fetchMatch('aoe2de', {
            uuid: match_uuid,
            match_id: match_id
        });

        if (updatedMatch.finished) {
            await upsertMatchesWithPlayers(this.connection, [updatedMatch], false);
        }

        time();
        return { success: true };
    }

    @Post('/match/checked')
    async setMatchChecked(
        @Body('match_uuid') match_uuid: string,
        @Body('match_id') match_id: string,
    ) {
        time(1);

        await this.prisma.match.update({
            data: {
                checked: getUnixTime(new Date()),
            },
            where: {
                match_id,
            },
        });

        time();
        return { success: true };
    }

    twitchAppToken: string;
    twitchAppTokenExpiresAt: number;

    @Get('/twitch/live')
    async twitchLive(
        @Query('channel') channel: string,
    ) {
        time(1);

        if (!/\w+/.test(channel)) {
            return { error: 'Invalid channel' };
        }

        // console.log('twitchAppToken', this.twitchAppToken);

        // Check token for validity
        // if (this.twitchAppToken) {
        //     const tokenUrl = `https://id.twitch.tv/oauth2/validate`;
        //     const tokenResponse = await fetch(tokenUrl, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${this.twitchAppToken}`,
        //         },
        //     });
        //     const tokenJson = await tokenResponse.json();
        //     console.log(tokenJson);
        //
        //     if (tokenJson.expires_in == null || tokenJson.expires_in < 100) {
        //         this.twitchAppToken = null;
        //     }
        // }

        // Get token if we have no token or token expires in less than 100s
        if (!this.twitchAppToken || this.twitchAppTokenExpiresAt < (new Date().getTime() + 100 * 1000)) {
            const tokenUrl = `https://id.twitch.tv/oauth2/token`;
            const tokenResponse = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'client_id': process.env.TWITCH_CLIENT_ID,
                    'client_secret': process.env.TWITCH_CLIENT_SECRET,
                    'grant_type': 'client_credentials',
                }),
            });
            const tokenJson = await tokenResponse.json();
            console.log(tokenJson);

            this.twitchAppToken = tokenJson.access_token;
            this.twitchAppTokenExpiresAt = new Date().getTime() + tokenJson.expires_in * 1000;
        }

        // const url = `https://api.twitch.tv/helix/search/channels?query=${channel}`;
        // const response = await fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'client-id': process.env.TWITCH_CLIENT_ID,
        //         'Authorization': `Bearer ${this.twitchAppToken}`,
        //     },
        // });
        // const json = await response.json();
        // console.log(json);
        // return json.data.find(c => c.broadcaster_login === channel);

        const url = `https://api.twitch.tv/helix/streams?user_login=${channel}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'client-id': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${this.twitchAppToken}`,
            },
        });
        const json = await response.json();
        console.log(json);

        time();
        return json.data.find(c => c.user_login.toLowerCase() === channel.toLowerCase() || c.user_name.toLowerCase() === channel.toLowerCase()) ?? {};
    }
}
