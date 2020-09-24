import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import {PrismaService} from "../service/prisma.service";


@Injectable()
export class RankTask implements OnModuleInit {
    private readonly logger = new Logger(RankTask.name);

    constructor(
        private prisma: PrismaService
    ) {}

    async onModuleInit() {}

    // Every 5 minutes
    @Cron('*/5 * * * *')
    async runSetRanks() {
        console.log(new Date(), 'Calculate leaderboard rank and rank_country');
        const hh = await this.prisma.$queryRaw`
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
}
