import "reflect-metadata";

import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {createConnection, getConnectionManager} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

import {User} from "../entity/user";

require('dotenv').config();

// Use pg2 to force inclusion in final package
import * as pg2 from 'pg';
import {KeyValue} from "../entity/keyvalue";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {Push} from "../entity/push";
import {Match} from "../entity/match";
import {Player} from "../entity/player";
import {Following} from "../entity/following";
import {Account} from "../entity/account";

console.log(pg2 != null ? 'pg initialized' : '');

export async function createDB() {
    try {
        const connection = await createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            // ssl: {
            //     rejectUnauthorized: false,
            // },
            entities: [
                Account,
                Push,
                Player,
                Match,
                Following,
                KeyValue,
                User,
                LeaderboardRow,
            ],
            // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            synchronize: !!process.env.IS_OFFLINE,
            logging: true,//!!process.env.IS_OFFLINE,
            namingStrategy: new SnakeNamingStrategy(),
        });
        console.log('Using NEW connection. Connected: ', connection.isConnected);
        return connection;
    } catch (err) {
        // If AlreadyHasActiveConnectionError occurs, return already existing connection
        if (err.name === "AlreadyHasActiveConnectionError") {
            const existingConnection = getConnectionManager().get("default");
            // console.log('Using existing connection. Connected: ', existingConnection.isConnected);
            // console.log('Using existing connection. Connected: ', existingConnection.entityMetadatas);
            return existingConnection;
        } else {
            throw err;
        }
    }
}
