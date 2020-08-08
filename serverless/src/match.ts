import {APIGatewayProxyHandler} from "aws-lambda";
import {User} from "../entity/user";
import {createDB} from "./handler";
import {fetchLeaderboard, fetchMatches, getValue, ILeaderboardPlayerRaw, setValue} from "./helper";
import {LeaderboardRow} from "../entity/leaderboard-row";
import { chunk } from 'lodash';
import {getUnixTime, parseISO} from "date-fns";
import {Match} from "../entity/match";
import {Player} from "../entity/player";
import {getRepository} from "typeorm";
import {uniqBy} from "lodash";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function fetchMatchesSinceLastTime() {
    const lastFetchDateStr = await getValue('matchesFetched');
    const lastFetchDate = lastFetchDateStr ? parseISO(lastFetchDateStr) : new Date();
    const currentFetchDate = new Date();

    console.log("Fetch matches dataset", 0, 1000, lastFetchDate);

    const entries = uniqBy(await fetchMatches('aoe2de', 0, 1000, getUnixTime(lastFetchDate)), e => e.match_id);
    console.log(entries.length);

    if (entries.length > 0) {
        console.log(entries[0].match_id, '-', entries[entries.length-1].match_id);
    }

    const matchRepo = getRepository(Match);

    const matchRows = entries.map(matchEntry => {
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
            user.match = { id: matchEntry.match_id } as Match;
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

    await matchRepo.save(matchRows);

    await setValue('matchesFetched', currentFetchDate);

    console.log("Saved entries:", entries.length);

    return entries.length;
}

export const match: APIGatewayProxyHandler = async (event, _context) => {
    await fetchMatchesSinceLastTime();

    // @ts-ignore
    // const users = await connection.manager.find(LeaderboardRow, {where: { leaderboardId: 4 }, skip: 0, take: 10, order: { 'rank': 'ASC' }});
    // console.log(users);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hu:' + process.env.TWITTER_ACCESS_TOKEN + '. Ho:' + process.env.TWITTER_ACCESS_TOKEN2 + '. Go Serverless Webpack (Typescript) v10.0! Your function executed successfully!',
            updated: new Date(),
            // input: event,
        }, null, 2),
    };
}
