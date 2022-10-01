// import "reflect-metadata";
// import 'source-map-support/register';
// import {createConnection, getConnectionManager} from "typeorm";
// import {LeaderboardRow} from "./entity/leaderboard-row";
// import {User} from "./entity/user";
// import {Following} from "./entity/following";
// import {Match} from "./entity/match";
// import {Player} from "./entity/player";
// import {SnakeNamingStrategy} from "typeorm-naming-strategies";
// import {Push} from "./entity/push";
// import {Account} from "./entity/account";
import {Event, EventHint} from "@sentry/types";
// Use pg2 to force inclusion in final package
// import * as pg2 from 'pg';
// import {RatingHistory} from "./entity/rating-history";
// import {KeyValue} from "./entity/keyvalue";

const Sentry = require('@sentry/node');

// require('dotenv').config();

Sentry.init({
    dsn: 'https://eae93cfa561849adb3c28acfac66d0df@o431543.ingest.sentry.io/5385911',
    // debug: true,
    onFatalError(error: Error) {
        console.log('fatal', error);
    },
    beforeSend(event: Event, hint?: EventHint): PromiseLike<Event | null> | Event | null {
        // console.log('beforeSend');
        return event;
    }
});

export function getSentry() {
    return Sentry;
}

// console.log(pg2 != null ? 'pg initialized' : '');
// console.log('process.env.LOCAL', process.env.LOCAL);

// export async function createDB() {
//     try {
//         const connection = await createConnection({
//             type: "postgres",
//             url: process.env.DATABASE_URL,
//             entities: [
//                 Account,
//                 Push,
//                 Match,
//                 Player,
//                 Following,
//                 KeyValue,
//                 User,
//                 LeaderboardRow,
//                 RatingHistory,
//             ],
//             // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
//             synchronize: process.env.LOCAL === 'true',
//             logging: false && process.env.LOCAL === 'true',//!!process.env.IS_OFFLINE,
//             namingStrategy: new SnakeNamingStrategy(),
//         });
//         console.log('Using NEW connection. Connected: ', connection.isConnected);
//         return connection;
//     } catch (err) {
//         // If AlreadyHasActiveConnectionError occurs, return already existing connection
//         if (err.name === "AlreadyHasActiveConnectionError") {
//             return getConnectionManager().get("default");
//         } else {
//             throw err;
//         }
//     }
// }
