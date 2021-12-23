import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {fetchOngoingMatches} from "../helper";
import {Connection} from "typeorm";
import {PrismaService} from '../service/prisma.service';
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {Match} from "../entity/match";


@Injectable()
export class ImportOngoingTask implements OnModuleInit {
    private readonly logger = new Logger(ImportOngoingTask.name);

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {
    }

    async onModuleInit() {
        await this.importOngoingMatches();
    }

    async importOngoingMatches() {
        try {
            const count = await this.fetchOngoing();
            if (count < 100) {
                console.log('Waiting 30s');
                setTimeout(() => this.importOngoingMatches(), 30 * 1000);
            } else {
                console.log('Waiting 0s');
                setTimeout(() => this.importOngoingMatches(), 0 * 1000);
            }
        } catch (e) {
            console.error(e);
            setTimeout(() => this.importOngoingMatches(), 60 * 1000);
        }
    }

    async fetchOngoing() {
        let query = this.connection.createQueryBuilder().select("MAX(match.started)", "max").from(Match, 'match');
        let matchesFetchedLastStartedEntity = await query.getRawOne();
        let matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? 0;
        console.log('matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);

        const ongoingMatches = await fetchOngoingMatches();
        console.log('recordsTotal', ongoingMatches.recordsTotal);
        console.log('data.length', ongoingMatches.data.length);
        // console.log('data[0]', ongoingMatches.data[0]);

        const newMatches =  ongoingMatches.data.filter(d => d.started >= matchesFetchedLastStarted);

        const entriesToSave = newMatches.map(({ id, players, ...match }) => ({
                ...match,
                players: (players as any).map(({ profileId, slotType, ...player}) => ({
                    ...player,
                    profile_id: profileId,
                    slot_type: slotType,
                })),
                match_id: id,
                maybe_finished: -1
            })
        );
        await upsertMatchesWithPlayers(this.connection, entriesToSave, true);

        console.log('Saved entries:', newMatches.length);

        return newMatches.length;
    }
}
