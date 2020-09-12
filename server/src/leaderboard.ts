import express from 'express';
import {createDB} from "./db";
import {getValue} from "../../serverless/src/helper";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {Like} from "typeorm";
import {asyncHandler, getParam, time} from "./util";
import {differenceInMinutes, getUnixTime} from "date-fns";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

const cache: Record<string, number> = {};
let cacheUpdated: Date = null;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

interface IRow {
    key: string;
    count: string;
}

async function updateCache() {
    if (cacheUpdated && differenceInMinutes(new Date(), cacheUpdated) < 1) return;
    cacheUpdated = new Date();

    const connection = await createDB();
    console.log('Update cache...');
    const rows: IRow[] = await connection.manager.query('SELECT DISTINCT(leaderboard_id) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id', []);
    rows.forEach(row => cache[`(${row.key},null)`] = parseInt(row.count));
    const rows2: IRow[] = await connection.manager.query('SELECT DISTINCT(leaderboard_id, country) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id, country', []);
    rows2.forEach(row => cache[row.key] = parseInt(row.count));
    // console.log('cache', cache);
    console.log('done');
}

app.get('/api/leaderboard', asyncHandler(async (req, res) => {
    const connection = await createDB();
    time(1);
    console.log('params:', req.query);

    const start = parseInt(getParam(req.query, 'start') ?? '1');
    const count = parseInt(getParam(req.query, 'count') ?? '10');
    const leaderboardId = parseInt(getParam(req.query, 'leaderboard_id'));
    const country = getParam(req.query, 'country') || null;
    const steamId = getParam(req.query, 'steam_id') || null;
    const profileId = getParam(req.query, 'profile_id') || null;
    const search = getParam(req.query, 'search') || null;

    // console.log('params:', event.queryStringParameters);

    if (
        start < 1 ||
        count > 200 ||
        ![0, 1, 2, 3, 4].includes(leaderboardId)
    ) {
        res.send({
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid or missing params',
            }, null, 2),
        });
        updateCache();
        return;
    }

    // @ts-ignore
    const leaderboardUpdated = new Date(await getValue('leaderboardUpdated')) || new Date(1970);

    let where: any = {'leaderboard_id': leaderboardId};
    if (country) where['country'] = country;

    time();
    // console.log('TOTAL', where);
    // Execute total before single-result restrictions are appended to where clause
    // const total = await connection.manager.count(LeaderboardRow, {where: where});
    const total = cache[`(${leaderboardId},${country})`];
    console.log(`cache(${leaderboardId},${country})`, total, cacheUpdated);

    if (steamId) where['steam_id'] = steamId;
    if (profileId) where['profile_id'] = profileId;
    if (search) where['name'] = Like(`%${search}%`);

    // Only for "My Rank" (will return one row)
    if (country != null && (steamId != null || profileId != null)) {
        console.log('HAS country + id');
        const users = await connection
            .createQueryBuilder()
            .select('*')
            .addSelect(subQuery => {
                return subQuery
                    .select('count(user.name)', 'rank')
                    .from(LeaderboardRow, "user")
                    .where('user.leaderboard_id = :leaderboardId AND user.country = :country AND user.rating >= outer.rating', {leaderboardId, country});
            })
            .from(LeaderboardRow, "outer")
            .where(where)
            .getRawMany();

        res.send({
            updated: getUnixTime(leaderboardUpdated),
            total: total,
            leaderboard_id: leaderboardId,
            start: start,
            count: count,
            country: country,
            leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
        });
        time();
        updateCache();
        return;
    }

    // Only for "My Rank" (will return one row)
    if (steamId != null || profileId != null) {
        console.log('HAS id');
        const users = await connection
            .createQueryBuilder()
            .select('*')
            .addSelect(subQuery => {
                return subQuery
                    .select('count(user.name)', 'rank')
                    .from(LeaderboardRow, "user")
                    .where('user.leaderboard_id = :leaderboardId AND user.rating >= outer.rating', {leaderboardId});
            })
            .from(LeaderboardRow, "outer")
            .where(where)
            .getRawMany();

        res.send({
            updated: getUnixTime(leaderboardUpdated),
            total: total,
            leaderboard_id: leaderboardId,
            start: start,
            count: count,
            country: country,
            leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
        });
        time();
        return;
    }

    console.log('HAS default', where);

    // @ts-ignore
    const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rating': 'DESC' }});
    time();

    res.send({
        updated: getUnixTime(leaderboardUpdated),
        total: total,
        leaderboard_id: leaderboardId,
        start: start,
        count: count,
        country: country,
        leaderboard: users.map((u, i) => {
            // if (country) {
            return {...u, rank: start+i};
            // }
            // return u;
        }),
    });
    time();
    updateCache();
}));

async function main() {
    // Initialize DB with correct entities
    await createDB();
    await updateCache();
    app.listen(process.env.PORT || 3004, () => console.log(`Server listening on port ${process.env.PORT || 3004}!`));
}

main();
