import {createDB} from "./db";
import {fetchLeaderboard, ILeaderboardPlayerRaw, setValue} from "../../serverless/src/helper";
import {upsertLeaderboardRows} from "../../serverless/entity/entity-helper";
import * as cron from "node-cron";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {getUnixTime, subDays} from "date-fns";

// Initialize DB with correct entities
createDB();

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function fetchLeaderboardDataset(leaderboardId: number, start: number, count: number) {
    const connection = await createDB();

    console.log("Fetch leaderboard dataset", leaderboardId, ': ', start, '+', count);

    const data = await fetchLeaderboard('aoe2de', leaderboardId, { start, count });
    const entries: ILeaderboardPlayerRaw[] = data.leaderboard;
    console.log(entries.length);

    const rows = entries.map(entry => ({
        ...entry,
        leaderboard_id: leaderboardId,
    }));

    await upsertLeaderboardRows(connection, rows);

    console.log("Saved entries:", rows.length);

    return rows.length;
}

async function fetchLeaderboardData(leaderboardId: number) {
    const connection = await createDB();

    let rowCount = 0;
    const count = 10000;

    for (let start = 1; start < 200000; start += count) {
        const resultCount = await fetchLeaderboardDataset(leaderboardId, start, count);
        rowCount += resultCount;
        if (resultCount < count) break;
    }
    console.log("RowCount:", rowCount);

    const total = await connection.manager.count(LeaderboardRow, {where: { leaderboard_id: leaderboardId }});
    console.log("Total:", total);

    // Remove all users update earlier than 28 days ago
    const last_match_time = getUnixTime(subDays(new Date(), 28));

    const query = connection.createQueryBuilder()
        .delete()
        .from(LeaderboardRow)
        .where("last_match_time < :last_match_time AND leaderboard_id = :leaderboardId", { last_match_time, leaderboardId });

    await query.execute();

    const total2 = await connection.manager.count(LeaderboardRow, {where: { leaderboard_id: leaderboardId }});
    console.log("After removing earlier 28 days:", total2);
}

async function ingest() {
  console.log("Running ingest...");

    await fetchLeaderboardData(0);
    await fetchLeaderboardData(1);
    await fetchLeaderboardData(2);
    await fetchLeaderboardData(3);
    await fetchLeaderboardData(4);

    await setValue('leaderboardUpdated', new Date());
}

cron.schedule("0 * * * *", ingest);
