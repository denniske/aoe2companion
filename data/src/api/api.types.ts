import {AoeMap} from '../helper/maps';
import {Flag} from '../lib/flag';
import {getUiTranslation} from '../lib/aoe-data';

export const slotTypes = {
    1: 'player',
    3: 'ai',
    4: 'closed',
    5: 'open',
} as const;

export type SlotType = keyof typeof slotTypes;

export function getSlotTypeName(slotType: SlotType) {
    return slotTypes[slotType] ? getUiTranslation(`enum.slottype.${slotTypes[slotType]}`) : slotType;
    // return slotTypes[slotType] || slotType;
}

export interface IPlayerRaw {
    civ: number;
    clan: string;
    color: number;
    country: Flag;
    drops: number;
    games: number;
    name: string;
    profile_id: number;
    rating: number;
    rating_change: any;
    slot: number;
    slot_type: SlotType;
    steam_id: string;
    streak: any;
    team: number;
    wins: any;
    won: any;
}

export interface IPlayer {
    civ: number;
    clan: string;
    color: number;
    country: Flag;
    drops: number;
    games: number;
    name: string;
    profile_id: number;
    rating: number;
    rating_change: any;
    slot: number;
    slot_type: SlotType;
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
    finished?: any;
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
    opened?: any;
    players: IPlayerRaw[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    server: string;
    shared_exploration: boolean;
    speed: number;
    started?: any;
    starting_age: number;
    team_positions: boolean;
    team_together: boolean;
    treaty_length: any;
    turbo: boolean;
    version: string;
    victory: any;
    victory_time: any;
    visibility: any;
    maybe_finished?: number;
}

export interface IMatch extends Omit<IMatchRaw, 'finished' | 'opened' | 'started'> {
    started?: Date;
    opened?: Date;
    finished?: Date;
    source?: 'aoe2net' | 'aoe2companion';
}

export enum LeaderboardId {
    Unranked = 0,
    DM1v1 = 1,
    DMTeam = 2,
    RM1v1 = 3,
    RMTeam = 4,
}

export interface IRatingHistoryEntryRaw {
    drops: number;
    num_losses: number;
    num_wins: number;
    rating: number;
    streak: number;
    timestamp?: any;
}

export interface IRatingHistoryEntry extends IRatingHistoryEntryRaw {
    timestamp?: Date;
}

export function validMatch(m: IMatch) {
    return m.players.filter(p => p.won !== null).length === m.num_players;
}


export interface ILeaderboardInfoRaw {
    leaderboard_id: LeaderboardId;
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
