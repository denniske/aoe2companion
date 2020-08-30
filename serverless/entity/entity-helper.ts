import {Match} from "./match";
import {IMatchFromApi, IPlayer, IPlayerBase} from "./entity.type";
import {Player} from "./player";
import {chunk, uniqBy} from "lodash";
import {Connection} from "typeorm";

export function createMatchEntity(matchEntry: IMatchFromApi) {
    const match = new Match();
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
    return match;
}

export function createPlayerEntity(matchEntry: IMatchFromApi, playerEntry: IPlayerBase) {
    const player = new Player();
    player.match_id = matchEntry.match_id;
    player.profile_id = playerEntry.profile_id;
    player.steam_id = playerEntry.steam_id;
    player.civ = playerEntry.civ;
    player.clan = playerEntry.clan;
    player.color = playerEntry.color;
    player.country = playerEntry.country;
    player.drops = playerEntry.drops;
    player.games = playerEntry.games;
    player.name = playerEntry.name;
    player.rating = playerEntry.rating;
    player.rating_change = playerEntry.rating_change;
    player.slot = playerEntry.slot;
    player.slot_type = playerEntry.slot_type;
    player.streak = playerEntry.streak;
    player.team = playerEntry.team;
    player.wins = playerEntry.wins;
    player.won = playerEntry.won;
    return player;
}

export async function upsertMatchesWithPlayers(connection: Connection, matchEntries: IMatchFromApi[]) {
    for (const chunkRows of chunk(matchEntries, 100)) {
        const playerRows: Player[] = [];
        const matchRows: Match[] = [];

        chunkRows.forEach(matchEntry => {
            const match = createMatchEntity(matchEntry);

            const players = uniqBy(matchEntry.players.filter(p => p.profile_id), p => p.profile_id).map(playerEntry => {
                return createPlayerEntity(matchEntry, playerEntry);
            });

            matchRows.push(match);
            playerRows.push(...players);
        });

        await connection.transaction(async transactionalEntityManager => {
            const result = await transactionalEntityManager.save(matchRows);
            const result2 = await transactionalEntityManager.save(playerRows);
        });
    }
}

export async function upsertAIPlayers(connection: Connection, matchEntries: IMatchFromApi[]) {
    for (const chunkRows of chunk(matchEntries, 100)) {
        const playerRows: Player[] = [];

        chunkRows.forEach(matchEntry => {
            const match = createMatchEntity(matchEntry);

            const otherPlayers = matchEntry.players.filter(p => p.profile_id == null);

            const players = otherPlayers.map(playerEntry => {
                return createPlayerEntity(matchEntry, {...playerEntry, profile_id: 0});
            });

            playerRows.push(...players);
        });

        await connection.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(playerRows);
        });
    }
}