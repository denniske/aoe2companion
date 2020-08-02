import {APIGatewayProxyHandler} from "aws-lambda";
import {createDB} from "./handler";
import {getValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {getUnixTime} from 'date-fns';
import {Like} from "typeorm";

function getParam(params: { [name: string]: string } | null, key: string): string {
    if (params == null) {
        return null;
    }
    return params[key];
}

export const leaderboard: APIGatewayProxyHandler = async (event, _context) => {
    const connection = await createDB();

    const start = parseInt(getParam(event.queryStringParameters, 'start') ?? '1');
    const count = parseInt(getParam(event.queryStringParameters, 'count') ?? '10');
    const leaderboardId = parseInt(getParam(event.queryStringParameters, 'leaderboard_id'));
    const country = getParam(event.queryStringParameters, 'country') || null;
    const steamId = getParam(event.queryStringParameters, 'steam_id') || null;
    const profileId = getParam(event.queryStringParameters, 'profile_id') || null;
    const search = getParam(event.queryStringParameters, 'search') || null;

    console.log('params:', event.queryStringParameters);

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

    if (country != null && (steamId != null || profileId != null)) {
        const users = await connection
            .createQueryBuilder()
            .select('*')
            .addSelect(subQuery => {
                return subQuery
                    .select('count(user.name)', 'rank')
                    .from(LeaderboardRow, "user")
                    .where('user.leaderboard_id = :leaderboardId AND user.country = :country AND user.rank <= outer.rank', {leaderboardId, country});
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


    // @ts-ignore
    const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rank': 'ASC' }});

    return {
        statusCode: 200,
        body: JSON.stringify({
            updated: getUnixTime(leaderboardUpdated),
            total: total,
            leaderboard_id: leaderboardId,
            start: start,
            count: count,
            country: country,
            leaderboard: users.map((u, i) => {
                if (country) {
                    return {...u, rank: start+i};
                }
                return u;
            }),
        }, null, 2),
    };
}
