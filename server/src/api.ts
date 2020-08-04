import express from 'express';
import {createDB} from "./db";
import {setValue} from "../../serverless/src/helper";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {Following} from "../../serverless/entity/following";
import {Match} from "../../serverless/entity/match";
import {Player} from "../../serverless/entity/player";
import {getRepository, In} from "typeorm";
import {asyncHandler, getParam, time} from "./util";
import {User} from "../../serverless/entity/user";
import {Account} from "../../serverless/entity/account";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();

// let sentPushNotifications = 0;

setInterval(async () => {
    if (!process.env.K8S_POD_NAME) return;
    // await setValue(process.env.K8S_POD_NAME + '_sentPushNotifications', sentPushNotifications);
}, 5000);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/status', (req, res) => {
    res.send({
        // sentPushNotifications: sentPushNotifications,
    });
});

interface IAccountPushTokenRequest {
    account_id: string;
    push_token: string;
}

interface IFollowRequest {
    account_id: string;
    profile_ids: number[];
    enabled: boolean;
}

interface IUnfollowRequest {
    account_id: string;
    profile_ids: number[];
}

interface INotificationConfigRequest {
    account_id: string;
    push_enabled: boolean;
}

app.post('/follow', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

    const { account_id, profile_ids, enabled } = req.body as IFollowRequest;

    // console.log('/follow');
    // console.log(req.body);

    const query = connection.createQueryBuilder().insert().into(Account).values({id: account_id}).orIgnore();
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

    res.send({ success: true });
    time();
}));



app.post('/unfollow', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

    const { account_id, profile_ids } = req.body as IUnfollowRequest;

    // console.log('/follow');
    // console.log(req.body);

    const query = connection.createQueryBuilder().insert().into(Account).values({id: account_id}).orIgnore();
    await query.execute();

    time();
    const query2 = connection.createQueryBuilder()
        .delete()
        .from(Following)
        .where({ account: { id: account_id }, profile_id: In(profile_ids) });
    await query2.execute();

    res.send({ success: true });
    time();
}));



app.post('/account/push_token', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

    const { account_id, push_token } = req.body as IAccountPushTokenRequest;

    // console.log('/follow');
    // console.log(req.body);

    const accountRepo = getRepository(Account);

    const accountEntry = new Account();
    accountEntry.id = account_id;
    accountEntry.push_token = push_token;

    console.log(accountEntry);

    await accountRepo.save(accountEntry);

    res.send({ success: true });
    time();
}));




app.post('/notification/config', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

    const { account_id, push_enabled } = req.body as INotificationConfigRequest;

    // console.log('/follow');
    // console.log(req.body);

    const query = connection.createQueryBuilder()
        .update(Following)
        .set({
            enabled: push_enabled,
        })
        .where({ account: { id: account_id } });
    await query.execute();

    res.send({ success: true });
    time();
}));


















// interface IFollowingEntry {
//     id?: string;
//     steam_id?: string;
//     profile_id?: number;
// }
//
// interface IFollowingRequest {
//     token: string;
//     token_profile_id?: number;
//     following: IFollowingEntry[];
//     enabled: boolean;
// }
//
// app.post('/following', asyncHandler(async (req, res) => {
//     time(1);
//     const connection = await createDB();
//
//     const { token, following, token_profile_id, enabled } = req.body as IFollowingRequest;
//
//     // console.log('/following');
//     // console.log(req.body);
//
//     throw 'Deliberate error';
//
//     const query = connection.createQueryBuilder()
//         .delete()
//         .from(Following)
//         .where({ push_token: token });
//     await query.execute();
//
//     time();
//     const followingRepo = getRepository(Following);
//     time();
//
//     const rows = Object.values(following).map(follow => {
//         const followingEntry = new Following();
//         followingEntry.push_token = token;
//         followingEntry.profile_id = follow.profile_id;
//         followingEntry.enabled = enabled;
//         followingEntry.token_profile_id = token_profile_id;
//
//         return followingEntry;
//     });
//
//     await followingRepo.save(rows);
//
//     res.send({ success: true });
//     time();
// }));

app.listen(process.env.PORT || 3000, () => console.log(`Server listening on port ${process.env.PORT || 3000}!`));

