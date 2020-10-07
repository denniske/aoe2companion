import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import {PrismaService} from "../service/prisma.service";
import {getUnixTime, subHours} from "date-fns";


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

        const twoHoursAgo = subHours(new Date(), 2);

        const result = await this.prisma.match.updateMany({
            where: {
                AND: [
                    { maybe_finished: -1 },
                    { finished: null },
                    { started: {lt: getUnixTime(twoHoursAgo)} },
                ],
            },
            data: {
                maybe_finished: 1,
            },
        });
        console.log(new Date(), 'GOT', result.count);
    }
}
