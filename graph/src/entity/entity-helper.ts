import {Match} from "./match";
import {IMatchFromApi, IPlayer, IPlayerBase} from "./entity.type";
import {Player} from "./player";
import {chunk, uniqBy} from "lodash";
import {Column, Connection, PrimaryColumn} from "typeorm";
import {LeaderboardRow} from "./leaderboard-row";
import {RatingHistory} from "./rating-history";
import {IMatchRaw} from "../util";

export interface IRatingHistoryEntryRaw {
    drops: number;
    num_losses: number;
    num_wins: number;
    rating: number;
    streak: number;
    timestamp?: any;
}

export function createMatchEntity(matchEntry: IMatchRaw) {
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
    match.maybe_finished = matchEntry.maybe_finished;
    return match;
}

export function createPlayerEntity(matchEntry: IMatchRaw, playerEntry: IPlayerBase) {
    const player = new Player();
    player.match_id = matchEntry.match_id;
    player.profile_id = playerEntry.profile_id;
    player.steam_id = playerEntry.steam_id;
    player.civ = playerEntry.civ;
    player.clan = playerEntry.clan;
    player.color = playerEntry.color;
    // player.country = playerEntry.country;
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

export function createLeaderboardRowEntity(leaderboardRowEntry: LeaderboardRow) {
    const leaderboardRow = new LeaderboardRow();
    leaderboardRow.leaderboard_id = leaderboardRowEntry.leaderboard_id;
    // leaderboardRow.rank = leaderboardRowEntry.rank;
    leaderboardRow.profile_id = leaderboardRowEntry.profile_id;
    leaderboardRow.steam_id = leaderboardRowEntry.steam_id;
    leaderboardRow.name = leaderboardRowEntry.name;
    leaderboardRow.country = leaderboardRowEntry.country;
    leaderboardRow.clan = leaderboardRowEntry.clan;
    leaderboardRow.icon = leaderboardRowEntry.icon;
    leaderboardRow.wins = leaderboardRowEntry.wins;
    leaderboardRow.drops = leaderboardRowEntry.drops;
    leaderboardRow.games = leaderboardRowEntry.games;
    leaderboardRow.losses = leaderboardRowEntry.losses;
    leaderboardRow.rating = leaderboardRowEntry.rating;
    leaderboardRow.streak = leaderboardRowEntry.streak;
    leaderboardRow.last_match = leaderboardRowEntry.last_match;
    leaderboardRow.lowest_streak = leaderboardRowEntry.lowest_streak;
    leaderboardRow.highest_rating = leaderboardRowEntry.highest_rating;
    leaderboardRow.highest_streak = leaderboardRowEntry.highest_streak;
    leaderboardRow.last_match_time = leaderboardRowEntry.last_match_time;
    leaderboardRow.previous_rating = leaderboardRowEntry.previous_rating;
    return leaderboardRow;
}


export function createRatingHistoryEntity(leaderboard_id: number, profile_id: number, ratingHistoryEntry: IRatingHistoryEntryRaw) {
    const ratingHistory = new RatingHistory();
    ratingHistory.leaderboard_id = leaderboard_id;
    ratingHistory.profile_id = profile_id;
    ratingHistory.rating = ratingHistoryEntry.rating;
    ratingHistory.timestamp = ratingHistoryEntry.timestamp;
    return ratingHistory;
}

export async function upsertMatchesWithPlayers(connection: Connection, matchEntries: IMatchRaw[]) {
    for (const chunkRows of chunk(matchEntries, 100)) {
        const playerRows: Player[] = [];
        const matchRows: Match[] = [];

        chunkRows.forEach(matchEntry => {
            const match = createMatchEntity(matchEntry);

            const players = matchEntry.players.map(playerEntry => {
                return createPlayerEntity(matchEntry, {...playerEntry, profile_id: playerEntry.profile_id || 0});
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

export async function upsertAIPlayers(connection: Connection, matchEntries: IMatchRaw[]) {
    for (const chunkRows of chunk(matchEntries, 100)) {
        const playerRows: Player[] = [];

        chunkRows.forEach(matchEntry => {
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

export async function upsertLeaderboardRows(connection: Connection, leaderboardRowEntries: LeaderboardRow[]) {
    for (const chunkRows of chunk(leaderboardRowEntries, 100)) {
        const leaderboardRows: LeaderboardRow[] = [];

        chunkRows.forEach(leaderboardEntry => {
            const leaderboard = createLeaderboardRowEntity(leaderboardEntry);
            leaderboardRows.push(leaderboard);
        });

        await connection.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(leaderboardRows);
        });
    }
}

export async function upsertRatingHistory(connection: Connection, leaderboard_id: number, profile_id: number, ratingHistoryEntries: IRatingHistoryEntryRaw[]) {
    for (const chunkRows of chunk(ratingHistoryEntries, 100)) {
        const ratingHistoryRows: RatingHistory[] = [];

        chunkRows.forEach(ratingHistoryEntry => {
            const ratingHistory = createRatingHistoryEntity(leaderboard_id, profile_id, ratingHistoryEntry);
            ratingHistoryRows.push(ratingHistory);
        });

        await connection.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(ratingHistoryRows);
        });
    }
}
