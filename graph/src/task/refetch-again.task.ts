import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import {PrismaService} from "../service/prisma.service";


@Injectable()
export class RefetchAgainTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchAgainTask.name);

    constructor(
        private prisma: PrismaService,
    ) {}

    async onModuleInit() { this.runRefetchAgain(); }

    // Every 30 minutes
    @Cron('0/30 * * * *')
    async runRefetchAgain() {
        console.log(new Date(), 'Mark all unfinished matches for refetch');
        const result = await this.prisma.match.updateMany({
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
}
