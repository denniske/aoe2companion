import express from 'express';
import {createDB} from "./db";
import {getValue} from "../../serverless/src/helper";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {Like} from "typeorm";
import {asyncHandler, getParam, time} from "./util";
import {getUnixTime} from "date-fns";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/leaderboard', asyncHandler(async (req, res) => {
    time(1);
    const connection = await createDB();

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
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid or missing params',
            }, null, 2),
        };
    }

    // @ts-ignore
    const leaderboardUpdated = new Date(await getValue('leaderboardUpdated')) || new Date(1970);

    let where: any = {'leaderboard_id': leaderboardId};
    if (country) where['country'] = country;

    // Execute total before single-result restrictions are appended to where clause
    const total = await connection.manager.count(LeaderboardRow, {where: where});

    if (steamId) where['steam_id'] = steamId;
    if (profileId) where['profile_id'] = profileId;
    if (search) where['name'] = Like(`%${search}%`);

    // Only for "My Rank" (will return one row)
    if (country != null && (steamId != null || profileId != null)) {
        const users = await connection
            .createQueryBuilder()
            .select('*')
            .addSelect(subQuery => {
                return subQuery
                    .select('count(user.name)', 'rank')
                    .from(LeaderboardRow, "user")
                    .where('user.leaderboard_id = :leaderboardId AND user.country = :country AND user.rating <= outer.rating', {leaderboardId, country});
            })
            .from(LeaderboardRow, "outer")
            .where(where)
            .getRawMany();

        return {
            statusCode: 200,
            body: JSON.stringify({
                updated: getUnixTime(leaderboardUpdated),
                total: total,
                leaderboard_id: leaderboardId,
                start: start,
                count: count,
                country: country,
                leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
            }, null, 2),
        };
    }

    // Only for "My Rank" (will return one row)
    if (steamId != null || profileId != null) {
        console.log('TTTT2');
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

        return {
            statusCode: 200,
            headers: { ...cors },
            body: JSON.stringify({
                updated: getUnixTime(leaderboardUpdated),
                total: total,
                leaderboard_id: leaderboardId,
                start: start,
                count: count,
                country: country,
                leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
            }, null, 2),
        };
    }

    console.log('TTTT3');

    // @ts-ignore
    const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rating': 'ASC' }});

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
    // res.send({ success: true });
    time();
}));


app.listen(process.env.PORT || 3004, () => console.log(`Server listening on port ${process.env.PORT || 3004}!`));

