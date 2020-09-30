import {Flag} from "./flags";
import {AoeMap} from "./maps";
import {LeaderboardId} from "./leaderboards";


export const slotTypes = {
    1: 'Player',
    3: 'AI',
    4: 'Closed',
    5: 'Open',
} as const;

export type SlotType = keyof typeof slotTypes;

export function getSlotTypeName(slotType: SlotType) {
    return slotTypes[slotType] || slotType;
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

export interface ILobbyPlayerRaw {
    color: number;
    civ: number;
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    countryCode: Flag;
    drops: number;
    games: number;
    name: string;
    profileId: number;
    rating: number;
    slot: number;
    slotType: SlotType;
    steamId: string;
    streak: number;
    unrankedRating: number;
    wins: number;
}

export interface ILobbyMatchRaw {
    active: boolean;
    appId: number;
    averageRating: number;
    cheats: boolean;
    full: boolean;
    fullTechTree: boolean;
    gameType: string;
    gameTypeId: number;
    hasPassword: boolean;
    hidden: boolean;
    id: string;
    location: string;
    lockSpeed: boolean;
    lockTeams: boolean;
    mapSize: string;
    name: string;
    numPlayers: number;
    numSlots: number;
    players: ILobbyPlayerRaw[];
    pop: number;
    ranked: boolean;
    ratingType: number;
    resources: string;
    server: string;
    sharedExploration: boolean;
    speed: string;
    startingAge: string;
    status: string;
    steamLobbyId: string;
    turbo: boolean;
    victory: string;
    visibility: string;
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
}

export interface IMatch extends IMatchRaw {
    started?: Date;
    opened?: Date;
    finished?: Date;
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
    leaderboard_id: LeaderboardId;
    start: number;
    total: number;
    updated?: any;
}


export interface ILeaderboardPlayer extends ILeaderboardPlayerRaw {
    last_match: Date;
    last_match_time: Date;
}

export interface ILeaderboard extends ILeaderboardRaw{
    leaderboard: ILeaderboardPlayer[];
    updated?: Date;
}

export function validMatch(m: IMatch) {
    return m.players.filter(p => p.won !== null).length === m.num_players;
}

function shrinkMatches(matches: IMatch[]) {
    return matches.map(m => ({
        name: m.name,
        map_type: m.map_type,
        players: m.players.map(p => ({
            name: p.name,
        })),
    }));
}

// const size = JSON.stringify(allMatches.data ?? []).length / 1000;
// const size2 = JSON.stringify(shrinkMatches(allMatches.data ?? [])).length / 1000;
// console.log('all matches', size, 'KB');
// console.log('shrinked matches', size2, 'KB');
// const size3 = JSON.stringify(stats.data?.statsCiv ?? []).length / 1000;
// console.log('all stats', size3, 'KB');
