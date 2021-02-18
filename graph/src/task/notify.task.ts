import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {getUnixTime} from "date-fns";
import {getSentry} from "../db";
import fetch from "node-fetch";
import {Connection, In, MoreThan, Repository} from "typeorm";
import {groupBy} from "lodash";
import {Match} from "../entity/match";
import {Push} from "../entity/push";
import {Following} from "../entity/following";
import {InjectRepository} from "@nestjs/typeorm";
import PushNotifications from '@pusher/push-notifications-server';


interface IExpoPushResponse {
    data: {
        status: string;
        message: string;
        details?: { error?: 'DeviceNotRegistered' };
    };
}

function formatNames(names: string[]) {
    return names.reduce((a, b, i) => a + (i === names.length-1 ? ' and ' : ', ') + b);
}

@Injectable()
export class NotifyTask implements OnModuleInit {
    private readonly logger = new Logger(NotifyTask.name);
    private beamsClient: PushNotifications;

    constructor(
        private connection: Connection,
        @InjectRepository(Push)
        private pushRepository: Repository<Push>,
    ) {}

    async onModuleInit() {
        // const followings = await this.connection.manager.find(Following);
        // console.log('followings.length', followings.length);

        this.beamsClient = new PushNotifications({
            instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        await this.notifyAll();
    }

    async notifyAll() {
        try {
            const oneMinuteAgo = getUnixTime(new Date()) - 60*5;

            // const matches = await connection.manager.find(Match, {where: { id: '33322038'}, relations: ["players"]});
            const matches = await this.connection.manager.find(Match, {where: { notified: false, started: MoreThan(oneMinuteAgo) }, relations: ["players"]});
            console.log(matches.length);

            for (const match of matches) {
                await this.notify(match);
            }
            setTimeout(() => this.notifyAll(), 5000);
        } catch (e) {
            console.error(e);
            getSentry().captureException(e);
            // sendAlert('notify', e)
            setTimeout(() => this.notifyAll(), 60 * 1000);
        }
    }

    async notify(match: Match) {
        console.log('NOTIFY', match.name, '-> ', match.id);
        const players = match.players.filter(p => p.profile_id);

        if (players.length === 0) return;

        const followings = await this.connection.manager.find(Following, {where: { profile_id: In(players.map(p => p.profile_id)), enabled: true }, relations: ["account"]});

        const tokens = Object.entries(groupBy(followings, p => p.account.push_token));
        if (tokens.length > 0) {
            console.log('tokens', tokens.length);
            for (const [token, followings] of tokens) {
                const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
                const verb = followings.length > 1 ? 'are' : 'is';

                await this.sendPushNotification(token, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.', { match_id: match.id });
            }
        }

        const tokensWeb = Object.entries(groupBy(followings, p => p.account.push_token_web));
        if (tokensWeb.length > 0) {
            console.log('tokensWeb', tokensWeb.length);
            for (const [tokenWeb, followings] of tokensWeb) {
                const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
                const verb = followings.length > 1 ? 'are' : 'is';

                await this.sendPushNotificationWeb(tokenWeb, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.', { match_id: match.id });
            }
        }

        await this.connection.createQueryBuilder()
            .update(Match)
            .set({ notified: true })
            .where("id = :id", { id: match.id })
            .execute();
    }

    async sendPushNotification(expoPushToken: string, title: string, body: string, data: any) {
        if (expoPushToken == null || expoPushToken == 'null') return;

        const message = {
            to: expoPushToken,
            sound: 'default',
            title,
            body,
            data,
        };

        console.log('PUSH');
        console.log(message);

        const result = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const expoPushResponse = await result.json() as IExpoPushResponse;
        console.log(expoPushResponse);

        const status = expoPushResponse.data.status == 'ok' ? 'ok' : expoPushResponse.data.details?.error;

        await this.pushRepository.save({ title: message.title, body: message.body, push_token: expoPushToken, status });
    }

    async sendPushNotificationWeb(pushTokenWeb: string, title: string, body: string, data: any) {
        if (pushTokenWeb == null || pushTokenWeb == 'null') return;

        const message = {
            to: pushTokenWeb,
            sound: 'default',
            title,
            body,
            data,
        };

        console.log('PUSH WEB');
        console.log(message);

        let status = '?';
        try {
            const webPushResponse = await this.beamsClient.publishToInterests([`device-${pushTokenWeb}`], {
                web: {
                    notification: {
                        title,
                        body,
                        deep_link: `https://app.aoe2companion.com/feed?match_id=${data.match_id}`,
                    },
                    data,
                }
            });
            console.log(webPushResponse);
            status = 'ok';
        } catch (e) {
            console.error(e);
            status = e.toString();
        }

        await this.pushRepository.save({ title: message.title, body: message.body, push_token_web: pushTokenWeb, status });
    }
}
