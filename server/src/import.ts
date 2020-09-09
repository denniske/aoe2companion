import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {fetchMatches, setValue} from "../../serverless/src/helper";
import {max} from "lodash";
import {upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

function formatDayAndTime(date: Date) {
    console.log(date);
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

// Initialize DB with correct entities
createDB();

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

    return entriesGreater.length === 0;
}

async function importMatches() {
    // await createDB();
    try {
        const done = await fetchMatchesSinceLastTime();
        if (!done) {
            console.log('Waiting 30s');
            setTimeout(importMatches, 0 * 1000);
        } else {
            console.log('DONE');
        }
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

// importMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/health', (req, res) => {
    res.send({ status: 'OK' });
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
