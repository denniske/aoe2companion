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

@Injectable()
export class RefetchAgainTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchAgainTask.name);

    async onModuleInit() {
        await createDB();
    }

    // Every 30 minutes
    @Cron('0/30 * * * *')
    async runRefetchAgain() {
        await refetchAgain();
    }
}
