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

    constructor(
        private connection: Connection,
        @InjectRepository(Push)
        private pushRepository: Repository<Push>,
    ) {}

    async onModuleInit() {
        // const followings = await this.connection.manager.find(Following);
        // console.log('followings.length', followings.length);
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

        // match.notified = true;
        // const matchRepo = getRepository(Match); // you can also get it via getConnection().getRepository() or getManager().getRepository()
        // await matchRepo.save(match);

        await this.connection.createQueryBuilder()
            .update(Match)
            .set({ notified: true })
            .where("id = :id", { id: match.id })
            .execute();
    }

    async sendPushNotification(expoPushToken: string, title: string, body: string, data: any) {
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
}
