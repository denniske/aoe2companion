import {APIGatewayProxyHandler} from "aws-lambda";
import {User} from "../entity/user";
import {createDB} from "./handler";
import {getValue, setValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {getUnixTime} from 'date-fns';

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

    if (
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
    const leaderboardUpdated = await getValue('leaderboardUpdated') || new Date(1970);

    let where = {'leaderboardId': leaderboardId};
    if (country) {
        where['country'] = country;
    }

    // @ts-ignore
    const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rank': 'ASC' }});
    const total = await connection.manager.count(LeaderboardRow, {where: where});

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
                return {...u.data, rank: start+i};
            }),
        }, null, 2),
    };
}
