import {Body, Controller, Post} from '@nestjs/common';
import {time} from "../util";
import {Connection, getRepository, In, Not} from "typeorm";
import {Account} from "../entity/account";
import {Following} from "../entity/following";
import PushNotifications from '@pusher/push-notifications-server';
import fetch from 'node-fetch';


@Controller()
export class ApiController {
    private beamsClient: PushNotifications;

    constructor(
        private connection: Connection,
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
}
