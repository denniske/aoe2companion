import {createDB} from "./helper/db";
import {Match} from "../../serverless/entity/match";
import {fetchMatches, setValue} from "../../serverless/src/helper";
import {max} from "lodash";
import {upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";
import {fromUnixTime} from "date-fns";
import {createExpress} from "./helper/express";
import {formatDayAndTime} from './helper/util';

const app = createExpress();

async function fetchMatchesSinceLastTime() {
    const connection = await createDB();

    let query = connection.createQueryBuilder().select("MAX(match.started)", "max").from(Match, 'match');
    let matchesFetchedLastStartedEntity = await query.getRawOne();
    let matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? 0;
    console.log('matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);

    if (matchesFetchedLastStartedEntity?.max) {
        query = connection.createQueryBuilder()
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

    await upsertMatchesWithPlayers(connection, entriesToSave);

    await setValue('matchesFetchedLastStarted', max(entries.map(e => e.started)));

    if (entriesGreater.length === 0) {
        console.log('DONE', entriesGreater.length);
    }

    return entriesGreater.length;
}

async function importMatches() {
    try {
        const count = await fetchMatchesSinceLastTime();
        if (count < 100) {
            console.log('Waiting 30s');
            setTimeout(importMatches, 30 * 1000);
        } else {
            console.log('Waiting 0s');
            setTimeout(importMatches, 0 * 1000);
        }
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3001, () => console.log(`Server listening on port ${process.env.PORT || 3001}!`));
    await importMatches();
}

main();
