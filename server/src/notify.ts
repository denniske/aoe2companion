import express from 'express';
import WebSocket from 'ws';
import {ILastMatchRaw, ILobbyMatchRaw, IMatchRaw, makeQueryString, minifyUserId} from "./util";
import fetch from "node-fetch";
import {createDB} from "./db";
import {User} from "../../serverless/entity/user";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {Following} from "../../serverless/entity/following";
import {setValue} from "../../serverless/src/helper";
import {Match} from "../../serverless/entity/match";
import {Player} from "../../serverless/entity/player";
import {groupBy} from "lodash";
import {In, MoreThan, getRepository} from "typeorm";
import {getUnixTime} from 'date-fns';
import {Push} from "../../serverless/entity/push";
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();

let sentPushNotifications = 0;

setInterval(async () => {
    if (!process.env.K8S_POD_NAME) return;
    await setValue(process.env.K8S_POD_NAME + '_sentPushNotifications', sentPushNotifications);
}, 5000);

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function sendPushNotification(expoPushToken: string, title: string, body: string) {
    sentPushNotifications++;

    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { data: 'goes here' },
    };

    console.log('PUSH');
    console.log(message);

    const pushRepo = getRepository(Push);
    await pushRepo.save({ title: message.title, body: message.body });

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}


async function notify(match: Match) {
    const connection = await createDB();

    console.log('NOTIFY', match.name, '-> ', match.id);
    const players = match.players.filter(p => p.profile_id);

    const followings = await connection.manager.find(Following, {where: { profile_id: In(players.map(p => p.profile_id)) }, relations: ["account"]});
    const tokens = Object.entries(groupBy(followings, p => p.account.push_token));
    if (tokens.length > 0) {
        console.log('tokens', tokens.length);
        for (const [token, followings] of tokens) {
            const names = followings.map(following => players.find(p => p.profile_id == following.profile_id).name).join(', ');
            await sendPushNotification(token, match.name + ' - ' + match.id, names + ' are playing.');
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
    const connection = await createDB();

    const oneMinuteAgo = getUnixTime(new Date()) - 60*5;

    const matches = await connection.manager.find(Match, {where: { notified: false, started: MoreThan(oneMinuteAgo) }, relations: ["players"]});
    console.log(matches);

    for (const match of matches) {
        await notify(match);
    }

    setTimeout(notifyAll, 5000);
}

notifyAll();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/status', (req, res) => {
    res.send({
        sentPushNotifications: sentPushNotifications,
    });
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
