import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "@prisma/client";
import {getUnixTime} from "date-fns";
import {createDB} from "../db";
import {min} from "lodash";
import {fetchRatingHistoryUniqueByTimestamp} from "../helper";
import {IRatingHistoryEntryRaw, upsertRatingHistory} from "../entity/entity-helper";


const prisma = new PrismaClient()

interface ILeaderboardPlayer {
    leaderboard_id: number;
    profile_id: number;
    last_match_time: number;
    history_fetched?: number;
}

async function fetchMatchesSinceLastTime() {
    console.log(new Date(), "Fetch recent matches all leaderboards");

    const connection = await createDB();

    const outdatedRatingHistories = await prisma.$queryRaw`
        SELECT leaderboard_id, profile_id, last_match_time, history_fetched
        FROM leaderboard_row
        WHERE last_match_time > history_fetched OR history_fetched is null
        ORDER BY last_match_time DESC
        LIMIT 1;
    ` as ILeaderboardPlayer[];

    console.log('outdatedRatingHistories', outdatedRatingHistories);

    if (outdatedRatingHistories.length === 0) {
        console.log('ALL RATING HISTORIES UP-TO-DATE.');
        return 0;
    }

    const first = outdatedRatingHistories[0];

    const fetched = new Date();

    let history: IRatingHistoryEntryRaw[] = [];

    // Fetch only 10 history entries when possible, to avoid db load on aoe2.net
    if (first.history_fetched != null) {
        console.log('Fetching 10 recent history entries');
        history = await fetchRatingHistoryUniqueByTimestamp('aoe2de', first.leaderboard_id, 1, 10, {profile_id : first.profile_id});
        const minTimestamp = min(history.map(h => h.timestamp));

        // console.log({
        //     leaderboard_id: first.leaderboard_id,
        //     profile_id: first.profile_id,
        //     timestamp: minTimestamp,
        // });

        const historyEntryInDb = await prisma.rating_history.findOne({
            where: {
                leaderboard_id_profile_id_timestamp: {
                    leaderboard_id: first.leaderboard_id,
                    profile_id: first.profile_id,
                    timestamp: minTimestamp,
                },
            }
        });
        if (historyEntryInDb) {
            // history entry found. we can continue with the 10 entries.
        } else {
            console.log('Fetching all history entries');
            history = await fetchRatingHistoryUniqueByTimestamp('aoe2de', first.leaderboard_id, 1, 10000, {profile_id : first.profile_id});
        }
    } else {
        console.log('Fetching all history entries');
        history = await fetchRatingHistoryUniqueByTimestamp('aoe2de', first.leaderboard_id, 1, 10000, {profile_id : first.profile_id});
    }

    await upsertRatingHistory(connection, first.leaderboard_id, first.profile_id, history);
    console.log('Saved history entries');

    // Also set matches from this player to finished
    const res = await prisma.match.updateMany({
        where: {
            AND: [
                { maybe_finished: { not: -5 } },
                { started: { lt: first.last_match_time } },
                { finished: null },
                { players: { some: { profile_id: first.profile_id } } },
            ],
        },
        data: { maybe_finished: null },
    });
    console.log(`Also marked ${res.count} matches for refetching.`);

    await prisma.leaderboard_row.update({
        where: {
            leaderboard_id_profile_id: {
                leaderboard_id: first.leaderboard_id,
                profile_id: first.profile_id,
            },
        },
        data: {
            history_fetched: getUnixTime(fetched),
        },
    });
}

async function importRatingHistory() {
    try {
        const done = await fetchMatchesSinceLastTime();
        if (done === 0) {
            console.log('Waiting 10s');
            setTimeout(importRatingHistory, 10 * 1000);
        } else {
            setTimeout(importRatingHistory, 0 * 1000);
        }
    } catch (e) {
        console.error(e);
        setTimeout(importRatingHistory, 60 * 1000);
    }
}

@Injectable()
export class RatingHistoryTask implements OnModuleInit {
    private readonly logger = new Logger(RatingHistoryTask.name);

    async onModuleInit() {
        await createDB();
        await importRatingHistory();
    }
}
