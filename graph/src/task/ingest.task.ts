import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {getUnixTime, subDays} from "date-fns";
import {Cron} from "@nestjs/schedule";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {upsertLeaderboardRows} from "../entity/entity-helper";
import {fetchLeaderboard, ILeaderboardPlayerRaw, setValue} from "../helper";
import {Connection} from "typeorm";


const appConfigGame = process.env.SERVICE_NAME.includes('aoe2de') ? 'aoe2de' : 'aoe4';

@Injectable()
export class IngestTask implements OnModuleInit {
    private readonly logger = new Logger(IngestTask.name);

    constructor(
        private connection: Connection,
    ) {}

    async onModuleInit() {}

    // Every hour
    @Cron('0 * * * *')
    async runIngest() {
        console.log("Running ingest...");

        if (appConfigGame === 'aoe2de') {
            await this.fetchLeaderboardData(0);
            await this.fetchLeaderboardData(13);
            await this.fetchLeaderboardData(14);
            await this.fetchLeaderboardData(3);
            await this.fetchLeaderboardData(4);
        }
        if (appConfigGame === 'aoe4') {
            await this.fetchLeaderboardData(0);
            await this.fetchLeaderboardData(17);
            await this.fetchLeaderboardData(18);
            await this.fetchLeaderboardData(19);
            await this.fetchLeaderboardData(20);
        }

        await setValue(this.connection, 'leaderboardUpdated', new Date());
    }

    async fetchLeaderboardData(leaderboardId: number) {
        let rowCount = 0;
        const count = 10000;

        for (let start = 1; start < 200000; start += count) {
            const resultCount = await this.fetchLeaderboardDataset(leaderboardId, start, count);
            rowCount += resultCount;
            if (resultCount < count) break;
        }
        console.log("RowCount:", rowCount);

        const total = await this.connection.manager.count(LeaderboardRow, {where: { leaderboard_id: leaderboardId }});
        console.log("Total:", total);

        // Remove all users update earlier than 28 days ago
        const last_match_time = getUnixTime(subDays(new Date(), 28));

        const query = this.connection.createQueryBuilder()
            .delete()
            .from(LeaderboardRow)
            .where("last_match_time < :last_match_time AND leaderboard_id = :leaderboardId", { last_match_time, leaderboardId });

        await query.execute();

        const total2 = await this.connection.manager.count(LeaderboardRow, {where: { leaderboard_id: leaderboardId }});
        console.log("After removing earlier 28 days:", total2);
    }

    async fetchLeaderboardDataset(leaderboardId: number, start: number, count: number) {
        console.log("Fetch leaderboard dataset", leaderboardId, ': ', start, '+', count);

        const data = await fetchLeaderboard('aoe2de', leaderboardId, { start, count });
        const entries: ILeaderboardPlayerRaw[] = data.leaderboard;
        console.log(entries.length);

        const rows = entries.map(entry => ({
            ...entry,
            leaderboard_id: leaderboardId,
        }));

        await upsertLeaderboardRows(this.connection, rows);

        console.log("Saved entries:", rows.length);

        return rows.length;
    }
}
