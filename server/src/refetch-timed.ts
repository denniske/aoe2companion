import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {fetchMatches} from "../../serverless/src/helper";
import {chunk, uniqBy} from "lodash";
import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";
import {Player} from "../../serverless/entity/player";
import {createMatchEntity, upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";

// Initialize DB with correct entities
createDB();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

function formatDayAndTime(date: Date) {
    console.log(date);
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// cron.schedule("* * * * *", function() {
//     console.log("running a task every minute");
// });

// async function refetchMatchesSinceLastTime() {
//     const connection = await createDB();
//
//     console.log(new Date(), "Refetch leaderboard recent matches");
//
//     await prisma.match.updateMany({
//         where: {
//             match_id: { in: updatedButNotFinishedMatches.map(m => m.match_id) },
//         },
//         data: {
//             maybe_finished: -1,
//         },
//     });
//
//     // await sleep(60 * 1000);
//     return true;
// }
