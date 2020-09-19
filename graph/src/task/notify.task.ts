import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {getUnixTime} from "date-fns";
import {createDB, getSentry} from "../db";
import fetch from "node-fetch";
import {getRepository, In, MoreThan} from "typeorm";
import {groupBy} from "lodash";
import {Match} from "../entity/match";
import {Push} from "../entity/push";
import {Following} from "../entity/following";


interface IExpoPushResponse {
    data: {
        status: string;
        message: string;
        details?: { error?: 'DeviceNotRegistered' };
    };
}

async function sendPushNotification(expoPushToken: string, title: string, body: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { data: 'goes here' },
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

    const pushRepo = getRepository(Push);
    await pushRepo.save({ title: message.title, body: message.body, push_token: expoPushToken, status });
}

function formatNames(names: string[]) {
    return names.reduce((a, b, i) => a + (i === names.length-1 ? ' and ' : ', ') + b);
}

async function notify(match: Match) {
    const connection = await createDB();

    console.log('NOTIFY', match.name, '-> ', match.id);
    const players = match.players.filter(p => p.profile_id);

    if (players.length === 0) return;

    const followings = await connection.manager.find(Following, {where: { profile_id: In(players.map(p => p.profile_id)), enabled: true }, relations: ["account"]});
    const tokens = Object.entries(groupBy(followings, p => p.account.push_token));
    if (tokens.length > 0) {
        console.log('tokens', tokens.length);
        for (const [token, followings] of tokens) {
            const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
            const verb = followings.length > 1 ? 'are' : 'is';

            await sendPushNotification(token, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.');
        }
    }

    // match.notified = true;
    // const matchRepo = getRepository(Match); // you can also get it via getConnection().getRepository() or getManager().getRepository()
    // await matchRepo.save(match);

    await connection.createQueryBuilder()
        .update(Match)
        .set({ notified: true })
        .where("id = :id", { id: match.id })
        .execute();
}

async function notifyAll() {
    try {
        const connection = await createDB();

        const oneMinuteAgo = getUnixTime(new Date()) - 60*5;

        // const matches = await connection.manager.find(Match, {where: { id: '33322038'}, relations: ["players"]});
        const matches = await connection.manager.find(Match, {where: { notified: false, started: MoreThan(oneMinuteAgo) }, relations: ["players"]});
        console.log(matches.length);

        for (const match of matches) {
            await notify(match);
        }
        setTimeout(notifyAll, 5000);
    } catch (e) {
        console.error(e);
        getSentry().captureException(e);
        // sendAlert('notify', e)
        setTimeout(notifyAll, 60 * 1000);
    }
}

@Injectable()
export class NotifyTask implements OnModuleInit {
    private readonly logger = new Logger(NotifyTask.name);

    async onModuleInit() {
        await createDB();
        await notifyAll();
    }
}
