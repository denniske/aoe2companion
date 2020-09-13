import {createDB} from "./helper/db";
import {Following} from "../../serverless/entity/following";
import {getRepository, In, Not} from "typeorm";
import {asyncHandler, time} from "./helper/util";
import {Account} from "../../serverless/entity/account";
import {createExpress} from "./helper/express";

const app = createExpress();

interface IAccountPushTokenRequest {
    account_id: string;
    push_token: string;
}

interface IAccountProfileRequest {
    account_id: string;
    profile_id: number;
    steam_id?: string;
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

    const query = connection.createQueryBuilder()
        .update(Account)
        .set({
            push_token: null,
        })
        .where({ push_token: push_token, id: Not(account_id) });
    await query.execute();

    const accountRepo = getRepository(Account);

    const accountEntry = new Account();
    accountEntry.id = account_id;
    accountEntry.push_token = push_token;

    console.log(accountEntry);

    await accountRepo.save(accountEntry);

    res.send({ success: true });
    time();
}));


app.post('/account/profile', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

    const { account_id, profile_id, steam_id } = req.body as IAccountProfileRequest;

    // console.log('/follow');
    // console.log(req.body);

    const accountRepo = getRepository(Account);

    const accountEntry = new Account();
    accountEntry.id = account_id;
    accountEntry.profile_id = profile_id;
    accountEntry.steam_id = steam_id;

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

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3003, () => console.log(`Server listening on port ${process.env.PORT || 3003}!`));
}

main();
