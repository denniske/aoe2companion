import {APIGatewayProxyHandler} from "aws-lambda";
import {createDB} from "./handler";
import {cors, getValue} from "./helper";
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

    console.log('params:', event.queryStringParameters);
    console.log('params:', event.body);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hu:',
            updated: new Date(),
            input: event,
            // users: users,//.map(u => u.data),
        }, null, 2),
    };

    // @ts-ignore
    // const leaderboardUpdated = new Date(await getValue('leaderboardUpdated')) || new Date(1970);
    //
    // let where: any = {'leaderboard_id': leaderboardId};
    //
    // // @ts-ignore
    // const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rank': 'ASC' }});
    //
    // return {
    //     statusCode: 200,
    //     headers: { ...cors },
    //     body: JSON.stringify({
    //         updated: getUnixTime(leaderboardUpdated),
    //         total: total,
    //         leaderboard_id: leaderboardId,
    //         start: start,
    //         count: count,
    //         country: country,
    //         leaderboard: users.map((u, i) => {
    //             if (country) {
    //                 return {...u, rank: start+i};
    //             }
    //             return u;
    //         }),
    //     }, null, 2),
    // };
}
