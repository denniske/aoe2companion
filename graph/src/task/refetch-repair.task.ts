import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {fromUnixTime} from "date-fns";
import {formatDayAndTime} from "../util";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatches, getValue, setValue} from "../helper";
import {Connection} from "typeorm";
import {last} from 'lodash';


const FETCH_COUNT = 1200;

@Injectable()
export class RefetchRepairTask implements OnModuleInit {
    private readonly logger = new Logger(RefetchRepairTask.name);

    constructor(
        private connection: Connection,
    ) {}

    async onModuleInit() {
        await this.refetchMatches();
    }

    async refetchMatches() {
        try {
            const matchesProcessed = await this.refetchMatchesSinceLastTime();
            if (matchesProcessed) {
                console.log('Waiting 0s');
                setTimeout(() => this.refetchMatches(), 0 * 1000);
            } else {
                console.log('Waiting 10s');
                setTimeout(() => this.refetchMatches(), 10 * 1000);
            }
        } catch (e) {
            console.error(e);
            setTimeout(() => this.refetchMatches(), 60 * 1000);
        }
    }

    async refetchMatchesSinceLastTime() {
        console.log(new Date(), "Refetch repair matches");

        const refetchRepairLastStarted = await getValue(this.connection, 'refetchRepairLastStarted') || 1599955200;

        console.log(new Date(), "Fetch matches dataset", refetchRepairLastStarted-1, formatDayAndTime(fromUnixTime(refetchRepairLastStarted-1)));
        let updatedMatches = await fetchMatches('aoe2de', 0, FETCH_COUNT, refetchRepairLastStarted-1);
        console.log(new Date(), 'GOT', updatedMatches.length);

        await upsertMatchesWithPlayers(this.connection, updatedMatches, true);
        console.log(new Date(), 'SAVED ALL');

        await setValue(this.connection, 'refetchRepairLastStarted', last(updatedMatches).started);

        return true;
    }
}
