import {APIGatewayProxyHandler} from "aws-lambda";
import {User} from "../entity/user";
import {createDB} from "./handler";
import {getValue, setValue} from "./helper";


export const leaderboard: APIGatewayProxyHandler = async (event, _context) => {
    const connection = await createDB();

    const {country = 'DE', start = 0, count = 10} = event.queryStringParameters ?? {};

    // @ts-ignore
    const leaderboardUpdated = await getValue('leaderboardUpdated') || new Date(1970);

    // @ts-ignore
    const users = await connection.manager.find(User, {where: {country: country}, skip: start, take: count});

    return {
        statusCode: 200,
        body: JSON.stringify({
            updated: leaderboardUpdated,
            users: users.map(u => u.data),
        }, null, 2),
    };
}
