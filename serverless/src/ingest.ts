import {APIGatewayProxyHandler} from "aws-lambda";
import {User} from "../entity/user";
import {createDB} from "./handler";
import {fetchLeaderboard, ILeaderboardPlayerRaw, setValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import { chunk } from 'lodash';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function fetchLeaderboardDataset(leaderboardId: number, start: number, count: number) {
    const connection = await createDB();

    console.log("Fetch leaderboard dataset", leaderboardId, ': ', start, '+', count);

    const data = await fetchLeaderboard('aoe2de', leaderboardId, { start, count });
    const entries: ILeaderboardPlayerRaw[] = data.leaderboard;
    console.log(entries.length);

    const rows = entries.map(entry => {
        const leaderboardRow = new LeaderboardRow();
        leaderboardRow.leaderboard_id = leaderboardId;
        leaderboardRow.rank = entry.rank;
        leaderboardRow.profile_id = entry.profile_id;
        leaderboardRow.steam_id = entry.steam_id;
        leaderboardRow.name = entry.name;
        leaderboardRow.country = entry.country;
        leaderboardRow.clan = entry.clan;
        leaderboardRow.icon = entry.icon;
        leaderboardRow.wins = entry.wins;
        leaderboardRow.drops = entry.drops;
        leaderboardRow.games = entry.games;
        leaderboardRow.losses = entry.losses;
        leaderboardRow.rating = entry.rating;
        leaderboardRow.streak = entry.streak;
        leaderboardRow.last_match = entry.last_match;
        leaderboardRow.lowest_streak = entry.lowest_streak;
        leaderboardRow.highest_rating = entry.highest_rating;
        leaderboardRow.highest_streak = entry.highest_streak;
        leaderboardRow.last_match_time = entry.last_match_time;
        leaderboardRow.previous_rating = entry.previous_rating;
        return leaderboardRow;
    });

    for (const chunkRows of chunk(rows, 1000)) {
        const query = connection.createQueryBuilder()
            .insert()
            .into(LeaderboardRow)
            .values(chunkRows)
            .orUpdate({
                conflict_target: ['leaderboard_id', 'rank'], overwrite: [
                    'profile_id',
                    'steam_id',
                    'name',
                    'country',
                    'clan',
                    'icon',
                    'wins',
                    'drops',
                    'games',
                    'losses',
                    'rating',
                    'streak',
                    'last_match',
                    'lowest_streak',
                    'highest_rating',
                    'highest_streak',
                    'last_match_time',
                    'previous_rating',
                ]
            });
        await query.execute();
    }

    const userRows = entries.map(entry => {
        const user = new User();
        user.profile_id = entry.profile_id;
        user.steam_id = entry.steam_id;
        user.name = entry.name;
        user.clan = entry.clan;
        user.country = entry.country;
        user.icon = entry.icon;
        user.wins = entry.wins;
        user.drops = entry.drops;
        user.games = entry.games;
        user.losses = entry.losses;
        user.rating = entry.rating;
        user.streak = entry.streak;
        user.last_match = entry.last_match;
        user.lowest_streak = entry.lowest_streak;
        user.highest_rating = entry.highest_rating;
        user.highest_streak = entry.highest_streak;
        user.last_match_time = entry.last_match_time;
        user.previous_rating = entry.previous_rating;
        return user;
    });

    for (const chunkUserRows of chunk(userRows, 1000)) {
        const query = connection.createQueryBuilder()
            .insert()
            .into(User)
            .values(chunkUserRows)
            .orUpdate({
                conflict_target: ['profile_id'], overwrite: [
                    'steam_id',
                    'name',
                    'clan',
                    'country',
                    'icon',
                    'wins',
                    'drops',
                    'games',
                    'losses',
                    'rating',
                    'streak',
                    'last_match',
                    'lowest_streak',
                    'highest_rating',
                    'highest_streak',
                    'last_match_time',
                    'previous_rating',]
            });
        await query.execute();
        await sleep(100);
    }

    console.log("Saved entries:", rows.length);

    return rows.length;
}

async function fetchLeaderboardData(leaderboardId: number) {
    const connection = await createDB();

    let rowCount = 0;
    const count = 10000;

    for (let start = 1; start < 200000; start += count) {
        const resultCount = await fetchLeaderboardDataset(leaderboardId, start, count);
        rowCount += resultCount;
        if (resultCount < count) break;
    }

    const query = connection.createQueryBuilder()
        .delete()
        .from(LeaderboardRow)
        .where("rank > :rank AND leaderboard_id = :leaderboardId", { rank: rowCount, leaderboardId });

    await query.execute();

    console.log("RowCount:", rowCount);
}

export const ingest: APIGatewayProxyHandler = async (event, _context) => {
    await fetchLeaderboardData(0);
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
        }, null, 2),
    };
}
