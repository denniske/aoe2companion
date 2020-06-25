import {Flag} from "./flags";
import {AoeMap} from "./maps";

export interface IPlayer {
    civ: number;
    clan: string;
    color: number;
    country: string;
    drops: number;
    games: number;
    name: string;
    profile_id: number;
    rating: number;
    rating_change: any;
    slot: number;
    slot_type: number;
    steam_id: string;
    streak: any;
    team: number;
    wins: any;
    won: any;
}

export interface IMatchRaw {
    average_rating: any;
    cheats: boolean;
    ending_age: number;
    expansion: any;
    finished: any;
    full_tech_tree: boolean;
    game_type: any;
    has_custom_content: any;
    has_password: boolean;
    leaderboard_id: number;
    lobby_id: any;
    lock_speed: boolean;
    lock_teams: boolean;
    map_size: number;
    map_type: AoeMap;
    match_id: string;
    match_uuid: string;
    name: string;
    num_players: number;
    num_slots: number;
    opened: any;
    players: IPlayer[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    server: string;
    shared_exploration: boolean;
    speed: number;
    started: any;
    starting_age: number;
    team_positions: boolean;
    team_together: boolean;
    treaty_length: any;
    turbo: boolean;
    version: string;
    victory: any;
    victory_time: any;
    visibility: any;
}

export interface IMatch extends IMatchRaw {
    started: Date;
    opened: Date;
    finished: Date;
}

interface IRatingHistoryEntryRaw {
    drops: number;
    num_losses: number;
    num_wins: number;
    rating: number;
    streak: number;
    timestamp: any;
}

interface IRatingHistoryEntry extends IRatingHistoryEntryRaw {
    timestamp: Date;
}


export interface ILeaderboardPlayerRaw {
    clan: string;
    country: Flag;
    drops: number;
    games: number;
    highest_rating: number;
    highest_streak: number;
    icon: any;
    last_match: any;
    last_match_time: any;
    losses: number;
    lowest_streak: number;
    name: string;
    previous_rating: number;
    profile_id: number;
    rank: number;
    rating: number;
    steam_id: string;
    streak: number;
    wins: number;
}

export interface ILeaderboardRaw {
    count: number;
    leaderboard: ILeaderboardPlayerRaw[];
    length: number;
    leaderboard_id: number;
    start: number;
    total: number;
}


export interface ILeaderboardPlayer extends ILeaderboardPlayerRaw {
    last_match: Date;
    last_match_time: Date;
}

export interface ILeaderboard extends ILeaderboardRaw{
    leaderboard: ILeaderboardPlayer[];
}
