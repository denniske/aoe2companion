import {createDB} from "./helper/db";
import {fetchMatch, fetchMatches} from "../../serverless/src/helper";
import {PrismaClient} from "@prisma/client"
import {fromUnixTime} from "date-fns";
import {upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";
import {createExpress} from "./helper/express";
import {formatDayAndTime, sleep} from './helper/util';
import * as cron from "node-cron";

const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn'],
});

async function refetchAgain() {
    console.log(new Date(), 'Mark all unfinished matches for refetch');
    const result = await prisma.match.updateMany({
        where: {
            AND: [
                { maybe_finished: { not: -5 } },
                { finished: null },
            ],
        },
        data: {
            maybe_finished: null,
        },
    });
    console.log(new Date(), 'GOT', result.count);
}

async function main() {
    await createDB();

    const app = createExpress();
    app.listen(process.env.PORT || 3003, () => console.log(`Server listening on port ${process.env.PORT || 3003}!`));

    // Every 30 minutes
    cron.schedule("0/30 * * * *", refetchAgain);
}

main();