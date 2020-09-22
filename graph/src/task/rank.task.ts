import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "@prisma/client";
import {differenceInHours, fromUnixTime} from "date-fns";
import {createDB} from "../db";
import {formatDayAndTime} from "../util";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatch} from "../helper";
import {myTodoList} from "@nex/data";
import {Cron} from "@nestjs/schedule";

const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn'],
});

async function setRanks() {
    console.log(new Date(), 'Calculate leaderboard rank and rank_country');
    const hh = await prisma.$queryRaw`
        UPDATE leaderboard_row x
        SET rank = x2.rank,
            rank_country = x2.rank_country
        FROM (
            SELECT
                ROW_NUMBER() OVER (PARTITION BY leaderboard_id ORDER BY rating desc) as rank,
                ROW_NUMBER() OVER (PARTITION BY leaderboard_id, country ORDER BY rating desc) as rank_country,
                profile_id, leaderboard_id
            FROM leaderboard_row x3
        ) as x2
        where x.profile_id = x2.profile_id AND x.leaderboard_id = x2.leaderboard_id;
    `;

    console.log(new Date(), 'GOT', hh);
}

@Injectable()
export class RankTask implements OnModuleInit {
    private readonly logger = new Logger(RankTask.name);

    async onModuleInit() {
        await createDB();
    }

    // Every 5 minutes
    @Cron('*/5 * * * *')
    async runSetRanks() {
        await setRanks();
    }
}
