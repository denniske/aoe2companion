import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {fromUnixTime} from "date-fns";
import {formatDayAndTime} from "../util";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {myTodoList} from "@nex/data";
import {max} from "lodash";
import {Match} from "../entity/match";
import {fetchMatches, setValue} from "../helper";
import {Connection} from "typeorm";
import {PrismaService} from '../service/prisma.service';
import {flatMap} from 'lodash';
import {join} from '@prisma/client/runtime';


@Injectable()
export class ImportTask implements OnModuleInit {
    private readonly logger = new Logger(ImportTask.name);

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    async onModuleInit() {
        console.log('IMPORT LEN:', myTodoList.length);
        await this.importMatches();
    }

    async importMatches() {
        try {
            const count = await this.fetchMatchesSinceLastTime();
            if (count < 100) {
                console.log('Waiting 30s');
                setTimeout(() => this.importMatches(), 30 * 1000);
            } else {
                console.log('Waiting 0s');
                setTimeout(() => this.importMatches(), 0 * 1000);
            }
        } catch (e) {
            console.error(e);
            setTimeout(() => this.importMatches(), 60 * 1000);
        }
    }

    async fetchMatchesSinceLastTime() {
        let query = this.connection.createQueryBuilder().select("MAX(match.started)", "max").from(Match, 'match');
        let matchesFetchedLastStartedEntity = await query.getRawOne();
        let matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? 0;
        console.log('matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);

        if (matchesFetchedLastStartedEntity?.max) {
            query = this.connection.createQueryBuilder()
                .select("MAX(match.started)", "max")
                .from(Match, 'match')
                .where("started < :lastmax", { lastmax: matchesFetchedLastStartedEntity?.max });
            matchesFetchedLastStartedEntity = await query.getRawOne();
            matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? 0;
            console.log('matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);
        }

        console.log(new Date(), "Fetch matches dataset", matchesFetchedLastStarted, formatDayAndTime(fromUnixTime(matchesFetchedLastStarted)));

        let entries = await fetchMatches('aoe2de', 0, 1000, matchesFetchedLastStarted);
        console.log(new Date(), 'GOT', entries.length);

        // fs.writeFileSync(`/Volumes/External/json/matches-${matchesFetchedLastStarted}.json`, JSON.stringify(entries));

        if (entries.length > 0) {
            console.log(entries[0].match_id, '-', entries[entries.length-1].match_id);
        }

        const entriesGreater = entries.filter(e => e.started > matchesFetchedLastStarted);

        const entriesToSave = entries.map(e => ({...e, maybe_finished: -1}));

        await upsertMatchesWithPlayers(this.connection, entriesToSave, true);

        await setValue(this.connection, 'matchesFetchedLastStarted', max(entries.map(e => e.started)));

        if (entriesGreater.length === 0) {
            console.log('DONE', entriesGreater.length);
        }

        // Also mark matches from these player for refetching
        const profile_ids = flatMap(entriesToSave.map(e => e.players)).map(p => p.profile_id);
        const rowCount = await this.prisma.$executeRaw`
            UPDATE match m
            SET maybe_finished = null
            WHERE
                maybe_finished != -5 AND
                maybe_finished is not null AND
                m.finished is null AND
                EXISTS(
                    SELECT * FROM player p
                    WHERE p.profile_id IN (${join(profile_ids)}) AND p.match_id=m.match_id
                );
          `;
        console.log(`Also marked ${rowCount}/${entries.length} matches for refetching.`);


        // const res = await this.prisma.match.updateMany({
        //     where: {
        //         AND: [
        //             { maybe_finished: { not: -5 } },
        //             { finished: null },
        //             { players: { some: { profile_id: { in: flatMap(entriesToSave.map(e => e.players)).map(p => p.profile_id) } } } },
        //         ],
        //     },
        //     data: { maybe_finished: null },
        // });
        // console.log(`Also marked ${res.count} matches for refetching.`);

        return entriesGreater.length;
    }
}
