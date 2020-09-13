import {APIGatewayProxyHandler} from "aws-lambda";
import {createDB} from "./handler";
import {corsHeader, getValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {getUnixTime} from 'date-fns';
import {Like} from "typeorm";

function getParam(params: { [name: string]: string } | null, key: string): string {
    if (params == null) {
        return null;
    }
    return params[key];
}

export const leaderboardTable: APIGatewayProxyHandler = async (event, _context) => {
    const connection = await createDB();

    console.log('params:', event.body);

    const body = JSON.parse(event.body);

    const { leaderboardId, startRow, endRow } = body;

    if (startRow == null || endRow == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid or missing params',
            }, null, 2),
        };
    }

    const start = startRow+1;
    const count = endRow - startRow;

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

    const leaderboardUpdated = new Date(await getValue('leaderboardUpdated')) || new Date(1970);

    let where: any = {'leaderboard_id': leaderboardId};

    // Execute total before single-result restrictions are appended to where clause
    const total = await connection.manager.count(LeaderboardRow, {where: where});

    // @ts-ignore
    const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rank': 'ASC' }});

    return {
        statusCode: 200,
        headers: { ...corsHeader },
        body: JSON.stringify({
            updated: getUnixTime(leaderboardUpdated),
            total: total,
            leaderboard_id: leaderboardId,
            start: start,
            count: count,
            // country: country,
            leaderboard: users.map((u, i) => {
                // if (country) {
                //     return {...u, rank: startRow+i};
                // }
                return u;
            }),
        }, null, 2),
    };

    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({
    //         message: 'Hu:',
    //         updated: new Date(),
    //         input: event,
    //         // users: users,//.map(u => u.data),
    //     }, null, 2),
    // };
}
