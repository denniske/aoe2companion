import {Body, Controller, Post} from '@nestjs/common';
import {time} from "../util";
import {getRepository, In, Not} from "typeorm";
import {createDB} from "../db";
import {Account} from "../entity/account";
import {Following} from "../entity/following";


@Controller()
export class ApiController {

    @Post('/follow')
    async follow(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_ids: number[],
        @Body('enabled') enabled: boolean,
    ) {
        time(1);
        const connection = await createDB();

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

        time();
        return { success: true };
    }

    @Post('/unfollow')
    async unfollow(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_ids: number[],
    ) {
        time(1);
        const connection = await createDB();

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

        time();
        return { success: true };
    }

    @Post('/account/push_token')
    async accountPushToken(
        @Body('account_id') account_id: string,
        @Body('push_token') push_token: string,
    ) {
        time(1);
        const connection = await createDB();

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

        time();
        return { success: true };
    }

    @Post('/account/profile')
    async accountProfile(
        @Body('account_id') account_id: string,
        @Body('profile_ids') profile_id: number,
        @Body('steam_id') steam_id: string,
    ) {
        time(1);
        const connection = await createDB();

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
        const connection = await createDB();

        // console.log('/follow');
        // console.log(req.body);

        const query = connection.createQueryBuilder()
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
