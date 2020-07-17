import {APIGatewayProxyHandler} from "aws-lambda";
import {User} from "../entity/user";
import {createDB} from "./handler";
import {fetchLeaderboard, ILeaderboardPlayerRaw, setValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import { chunk } from 'lodash';

async function fetchLeaderboardDataset(leaderboardId: number, start: number, count: number) {
    const connection = await createDB();

    console.log("Fetch leaderboard dataset", start, count);

    const data = await fetchLeaderboard('aoe2de', leaderboardId, { start, count });
    const entries: ILeaderboardPlayerRaw[] = data.leaderboard;
    console.log(entries.length);

    const rows = entries.map(entry => {
        const leaderboardRow = new LeaderboardRow();
        leaderboardRow.leaderboardId = leaderboardId;
        leaderboardRow.rank = entry.rank;
        leaderboardRow.profileId = entry.profile_id;
        leaderboardRow.steamId = entry.steam_id;
        leaderboardRow.name = entry.name;
        leaderboardRow.country = entry.country;
        leaderboardRow.data = entry;
        return leaderboardRow;
    });

    for (const chunkRows of chunk(rows, 1000)) {
        const query = connection.createQueryBuilder()
            .insert()
            .into(LeaderboardRow)
            .values(chunkRows)
            .orUpdate({ conflict_target: ['"leaderboardId"', 'rank'], overwrite: ['"profileId"', '"steamId"', 'name', 'country', 'data'] });
        await query.execute();
    }


    const userRows = entries.map(entry => {
        const user = new User();
        user.profileId = entry.profile_id;
        user.steamId = entry.steam_id;
        user.name = entry.name;
        user.clan = entry.clan;
        user.country = entry.country;
        user.data = entry;
        return user;
    });

    for (const chunkUserRows of chunk(userRows, 1000)) {
        const query = connection.createQueryBuilder()
            .insert()
            .into(User)
            .values(chunkUserRows)
            .orUpdate({ conflict_target: ['"profileId"'], overwrite: ['"steamId"', 'name', 'clan', 'country', 'data'] });
        await query.execute();
    }

    console.log("Saved entries:", rows.length);

    return rows.length;
}

async function fetchLeaderboardData(leaderboardId: number) {
    const connection = await createDB();

    let rowCount = 0;
    const count = 10000;

    for (let start = 1; start < 70000; start += count) {
        const resultCount = await fetchLeaderboardDataset(leaderboardId, start, count);
        rowCount += resultCount;
        if (resultCount < count) break;
    }

    const query = connection.createQueryBuilder()
        .delete()
        .from(LeaderboardRow)
        .where("rank > :rank AND leaderboardId = :leaderboardId", { rank: rowCount, leaderboardId });

    await query.execute();

    console.log("RowCount:", rowCount);
}

export const ingest: APIGatewayProxyHandler = async (event, _context) => {
    const connection = await createDB();

    await fetchLeaderboardData(1);
    await fetchLeaderboardData(2);
    await fetchLeaderboardData(3);
    await fetchLeaderboardData(4);

    await setValue('leaderboardUpdated', new Date());

    // @ts-ignore
    // const users = await connection.manager.find(LeaderboardRow, {where: { leaderboardId: 4 }, skip: 0, take: 10, order: { 'rank': 'ASC' }});
    // console.log(users);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hu:' + process.env.TWITTER_ACCESS_TOKEN + '. Ho:' + process.env.TWITTER_ACCESS_TOKEN2 + '. Go Serverless Webpack (Typescript) v10.0! Your function executed successfully!',
            updated: new Date(),
            // input: event,
            // users: users,//.map(u => u.data),
        }, null, 2),
    };
}
