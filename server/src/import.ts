import express from 'express';
import {createDB} from "./db";
import {Match} from "../../serverless/entity/match";
import {getRepository} from "typeorm";
import {getUnixTime} from 'date-fns';
import {Player} from "../../serverless/entity/player";
import {fetchMatches, getValue, setValue} from "../../serverless/src/helper";
import {chunk, uniqBy} from "lodash";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import * as fs from "fs";
import {max} from "lodash";

const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

// Initialize DB with correct entities
createDB();



export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function fetchMatchesSinceLastTime(year: number, month: number) {
    const connection = await createDB();

    const identifier = year + ' ' + month.toString().padStart(2, ' ') + ' ';

    const startDate = getUnixTime(new Date(year, month));
    console.log(identifier, 'startDate', startDate);
    const endDate = getUnixTime(new Date(year, month+1));
    console.log(identifier, 'endDate', endDate);

    // const matchesFetchedLastStarted = parseInt(await getValue('matchesFetchedLastStarted') || '0');
    let query = connection.createQueryBuilder();
    query.select("MAX(match.started)", "max")
        .from(Match, 'match')
        .where("started >= :start AND started < :end", { start: startDate, end: endDate });
    let matchesFetchedLastStartedEntity = await query.getRawOne();
    let matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? startDate;
    console.log(identifier, 'matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);

    if (matchesFetchedLastStartedEntity?.max) {
        query = connection.createQueryBuilder();
        query.select("MAX(match.started)", "max")
            .from(Match, 'match')
            .where("started < :lastmax", { lastmax: matchesFetchedLastStartedEntity?.max });
        matchesFetchedLastStartedEntity = await query.getRawOne();
        matchesFetchedLastStarted = matchesFetchedLastStartedEntity?.max ?? startDate;
        console.log(identifier, 'matchesFetchedLastStartedEntity', matchesFetchedLastStartedEntity);
    }

    console.log(identifier, new Date(), "Fetch matches dataset", matchesFetchedLastStarted);

    let entries = await fetchMatches('aoe2de', 0, 10, matchesFetchedLastStarted);
    console.log(identifier, new Date(), 'GOT', entries.length);

    // fs.writeFileSync(`json/matches-${matchesFetchedLastStarted}.json`, JSON.stringify(entries));

    if (entries.length > 0) {
        console.log(identifier, entries[0].match_id, '-', entries[entries.length-1].match_id);
    }

    const entriesGreater = entries.filter(e => e.started >= endDate);
    entries = entries.filter(e => e.started < endDate);

    const total1 = await connection.manager.count(Match);

    const matchRepo = getRepository(Match);
    const playerRepo = getRepository(Player);

    const len = 0;
    for (const chunkRows of chunk(entries, 100)) {

        const playerRows: Player[] = [];
        const matchRows: Match[] = [];

        chunkRows.forEach(matchEntry => {
            const match = new Match();
            console.log(identifier, matchEntry.match_id);
            match.id = matchEntry.match_id;
            match.match_uuid = matchEntry.match_uuid;
            match.lobby_id = matchEntry.lobby_id;
            match.name = matchEntry.name;
            match.opened = matchEntry.opened;
            match.started = matchEntry.started;
            match.finished = matchEntry.finished;
            match.leaderboard_id = matchEntry.leaderboard_id;
            match.num_slots = matchEntry.num_slots;
            match.has_password = matchEntry.has_password;
            match.server = matchEntry.server;
            match.map_type = matchEntry.map_type;
            match.average_rating = matchEntry.average_rating;
            match.cheats = matchEntry.cheats;
            match.ending_age = matchEntry.ending_age;
            match.expansion = matchEntry.expansion;
            match.full_tech_tree = matchEntry.full_tech_tree;
            match.game_type = matchEntry.game_type;
            match.has_custom_content = matchEntry.has_custom_content;
            match.lock_speed = matchEntry.lock_speed;
            match.lock_teams = matchEntry.lock_teams;
            match.map_size = matchEntry.map_size;
            match.num_players = matchEntry.num_players;
            match.pop = matchEntry.pop;
            match.ranked = matchEntry.ranked;
            match.rating_type = matchEntry.rating_type;
            match.resources = matchEntry.resources;
            match.rms = matchEntry.rms;
            match.scenario = matchEntry.scenario;
            match.shared_exploration = matchEntry.shared_exploration;
            match.speed = matchEntry.speed;
            match.starting_age = matchEntry.starting_age;
            match.team_positions = matchEntry.team_positions;
            match.team_together = matchEntry.team_together;
            match.treaty_length = matchEntry.treaty_length;
            match.turbo = matchEntry.turbo;
            match.version = matchEntry.version;
            match.victory = matchEntry.victory;
            match.victory_time = matchEntry.victory_time;
            match.visibility = matchEntry.visibility;

            const players = matchEntry.players.filter(p => p.profile_id).map(playerEntry => {
                const user = new Player();
                // user.match = { id: matchEntry.match_id } as Match;
                // user.match = match;
                user.match_id = matchEntry.match_id;
                user.profile_id = playerEntry.profile_id;
                user.steam_id = playerEntry.steam_id;
                user.civ = playerEntry.civ;
                user.clan = playerEntry.clan;
                user.color = playerEntry.color;
                user.country = playerEntry.country;
                user.drops = playerEntry.drops;
                user.games = playerEntry.games;
                user.name = playerEntry.name;
                user.rating = playerEntry.rating;
                user.rating_change = playerEntry.rating_change;
                user.slot = playerEntry.slot;
                user.slot_type = playerEntry.slot_type;
                user.streak = playerEntry.streak;
                user.team = playerEntry.team;
                user.wins = playerEntry.wins;
                user.won = playerEntry.won;
                return user;
            });

            matchRows.push(match);
            playerRows.push(...players);
        });

        // const result = await matchRepo.save(matchRows);
        // const result2 = await playerRepo.save(playerRows);

        await connection.transaction(async transactionalEntityManager => {
            const result = await transactionalEntityManager.save(matchRows);
            const result2 = await transactionalEntityManager.save(playerRows);
        });

        // console.log(identifier, result);
    }

    await setValue('matchesFetchedLastStarted', max(entries.map(e => e.started)));

    const total2 = await connection.manager.count(Match);

    console.log(identifier, new Date(), "Saved entries:", total2-total1);

    if (entriesGreater.length > 0) {
        console.log(identifier, 'DONE', entriesGreater.length);
    }

    return entriesGreater.length > 0;
}

async function importMatchesBatch(year: number, month: number) {
    try {
        const done = await fetchMatchesSinceLastTime(year, month);
        if (!done) {
            setTimeout(() => importMatchesBatch(year, month), 0);
        }
    } catch (e) {
        console.error(e);
        setTimeout(() => importMatchesBatch(year, month), 60 * 1000);
    }
}

async function importMatches() {
    // await createDB();
    setTimeout(() => importMatchesBatch(2019, 11), 0);
    setTimeout(() => importMatchesBatch(2020, 0), 2 * 1000);
    setTimeout(() => importMatchesBatch(2020, 1), 4 * 1000);
    setTimeout(() => importMatchesBatch(2020, 2), 6 * 1000);
    setTimeout(() => importMatchesBatch(2020, 3), 8 * 1000);
    setTimeout(() => importMatchesBatch(2020, 4), 10 * 1000);
    setTimeout(() => importMatchesBatch(2020, 5), 12 * 1000);
    setTimeout(() => importMatchesBatch(2020, 6), 14 * 1000);
    setTimeout(() => importMatchesBatch(2020, 7), 16 * 1000);
}

importMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
