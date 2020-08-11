import "reflect-metadata";

import 'source-map-support/register';
import {createConnection, getConnectionManager} from "typeorm";

require('dotenv').config();

const Sentry = require('@sentry/node');

Sentry.init({
    dsn: 'https://eae93cfa561849adb3c28acfac66d0df@o431543.ingest.sentry.io/5385911',
    // debug: true,
    onFatalError(error: Error) {
        console.log('fatal', error);
    },
    beforeSend(event: Event, hint?: EventHint): PromiseLike<Event | null> | Event | null {
        console.log('beforeSend');
        return event;
    }
});

export function getSentry() {
    return Sentry;
}

// const mail = require('@sendgrid/mail');
// mail.setApiKey(process.env.SENDGRID_API_KEY);
//
// const PrettyError = require('pretty-error');
// const pe = new PrettyError().withoutColors();
//
// export function sendAlert(service: string, error: Error) {
//     console.log('SENDING ALERT', service, error.message);
//     const subject = 'Error in ' + service + ': ' + error.message;
//     const content = pe.render(error);
//     const msg = {
//         to: process.env.ALERT_MAIL_TO,
//         from: 'alert@aoe2companion.com',
//         subject,
//         text: content,
//         // html: content,
//     };
//     mail.send(msg);
// }

// Sentry.flush(2000).then((done) => {
//     if (done) {
//         // flushed successfully
//     } else {
//         // timeout reached
//     }
// });

// Use pg2 to force inclusion in final package
import * as pg2 from 'pg';
import {KeyValue} from "../../serverless/entity/keyvalue";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {User} from "../../serverless/entity/user";
import {Following} from "../../serverless/entity/following";
import {Match} from "../../serverless/entity/match";
import {Player} from "../../serverless/entity/player";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {Push} from "../../serverless/entity/push";
import {Account} from "../../serverless/entity/account";
import {Event, EventHint} from "@sentry/types";

console.log(pg2 != null ? 'pg initialized' : '');
console.log('process.env.LOCAL', process.env.LOCAL);

export async function createDB() {
    try {
        const connection = await createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            entities: [
                Account,
                Push,
                Match,
                Player,
                Following,
                KeyValue,
                User,
                LeaderboardRow,
            ],
            // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            synchronize: process.env.LOCAL === 'true',
            logging: false && process.env.LOCAL === 'true',//!!process.env.IS_OFFLINE,
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
