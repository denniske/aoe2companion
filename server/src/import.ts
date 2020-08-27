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


async function fetchMatchesSinceLastTime() {
    const connection = await createDB();

    const matchesFetchedLastStarted = parseInt(await getValue('matchesFetchedLastStarted') || '0');

    console.log(new Date(), "Fetch matches dataset", matchesFetchedLastStarted);

    const entries = await fetchMatches('aoe2de', 0, 1000, matchesFetchedLastStarted);
    console.log(new Date(), 'GOT', entries.length);

    fs.writeFileSync(`matches-${matchesFetchedLastStarted}-1000.json`, JSON.stringify(entries));

    if (entries.length > 0) {
        console.log(entries[0].match_id, '-', entries[entries.length-1].match_id);
    }

    const total1 = await connection.manager.count(Match);

    const matchRepo = getRepository(Match);

    const len = 0;
    for (const chunkRows of chunk(entries, 100)) {

        const matchRows = chunkRows.map(matchEntry => {
            const match = new Match();
            // console.log(matchEntry.match_id);
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

            match.players = matchEntry.players.filter(p => p.profile_id).map(playerEntry => {
                const user = new Player();
                // user.match = { id: matchEntry.match_id } as Match;
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

            return match;
        });

        const result = await matchRepo.save(matchRows);
        // console.log(result);
    }

    await setValue('matchesFetchedLastStarted', max(entries.map(e => e.started)));

    const total2 = await connection.manager.count(Match);

    console.log(new Date(), "Saved entries:", total2-total1);

    return entries.length;
}

async function importMatches() {
    try {
        await fetchMatchesSinceLastTime();
        setTimeout(importMatches, 0);
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

importMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
