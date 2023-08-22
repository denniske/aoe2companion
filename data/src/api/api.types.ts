import {AoeMap} from '../helper/maps';
import {Flag} from '../lib/flag';
import {getUiTranslation} from '../lib/aoe-data';
import {LeaderboardId} from '../helper/leaderboards';

export const slotTypes = {
    1: 'player',
    3: 'ai',
    4: 'closed',
    5: 'open',
} as const;

export type SlotType = keyof typeof slotTypes;

export function getSlotTypeName(slotType: any) {
    return slotTypes[slotType] ? getUiTranslation(`enum.slottype.${slotTypes[slotType]}`) : slotType;
}

export interface IPlayerRaw {
    civ: number;
    civ_alpha: number;
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

export interface IPlayerRawGraphQl extends IPlayerRaw {
    profile: IProfileRawGraphQl;
}

export interface IProfileRawGraphQl {
    name: string;
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
    rating_diff: any;
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
    checked?: any;
    full_tech_tree: boolean;
    game_mode: number;
    game_type: any;
    game_variant: any;
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
    rating_type_id: any;
    resources: any;
    rms: string;
    scenario: string;
    ugc: boolean;
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


export interface IMatchRawGraphQl extends IMatchRaw {
    players: IPlayerRawGraphQl[];
}


export interface IMatch extends Omit<IMatchRaw, 'finished' | 'opened' | 'started' | 'checked'> {
    replayed?: number;
    started?: Date;
    opened?: Date;
    finished?: Date;
    checked?: Date;
    source?: 'aoe2net' | 'aoe2companion';
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
















export interface IProfileResponse {
    clan: string; // Todo
    drops: number; // Todo

    profileId: number
    steamId: number
    name: string
    country: string
    games: number
    verified: boolean
    countryIcon: string
    leaderboards: ILeaderboardNew[]
    ratings: IRatingNew[]
    stats: IStatNew[]
}

export interface ILeaderboardNew {
    leaderboardId: string
    profileId: number
    name: string
    rank: number
    rankLevel: string
    rankLevelName: string
    rankLevelImageUrl: string
    rankLevelColor: string
    rankLevelBackgroundColor: string
    rating: number
    lastMatchTime: string
    drops: number
    losses: number
    games: number
    streak: number
    wins: number
    updatedAt: string
    rankCountry: number
    leaderboardName: string
    abbreviation: string
    maxRating: number
    season: number
    internalLeaderboardId: number
}

export interface IRatingNew {
    leaderboardId: string
    leaderboardName: string
    abbreviation: string
    ratings: IRatingList[]
}

export interface IRatingList {
    profileId: number
    games: number
    rating: number
    date: Date
    leaderboardId: number
    ratingDiff?: number
}

export interface IStatNew {
    leaderboardId: string
    leaderboardName: string
    abbreviation: string
    civ: IStatCiv[]
    map: IStatMap[]
    allies: IStatAlly[]
    opponents: IStatOpponent[]
}

export interface IStatCiv {
    civ: number
    civName: string
    civImageUrl: string
    games: number
    wins: number
}

export interface IStatMap {
    map: string
    mapName: string
    mapImageUrl: string
    location?: number
    games: number
    wins: number
    losses: number
}

export interface IStatAlly {
    verified: boolean
    countryIcon?: string
    profileId: number
    name: string
    country?: string
    games: number
    wins: number
    losses: number
}

export interface IStatOpponent {
    verified: boolean
    countryIcon: string
    profileId: number
    name: string
    country: string
    games: number
    wins: number
    losses: number
}


















export interface IMatchesResponse {
    page: number
    perPage: number
    matches: IMatchNew[]
}

export interface IMatchNew {
    matchId: number
    started: Date
    finished?: Date
    leaderboardId: string
    leaderboardName: string
    name: string
    server?: string
    internalLeaderboardId: number
    difficulty: number
    startingAge: number
    fullTechTree: boolean
    allowCheats: boolean
    empireWarsMode?: boolean
    endingAge?: number
    gameMode: number
    lockSpeed: boolean
    lockTeams: boolean
    mapSize: number
    map: string
    mapName: string
    mapImageUrl: string
    population: number
    recordGame: boolean
    regicideMode?: boolean
    gameVariant?: number
    resources?: number
    sharedExploration: boolean
    speed?: number
    suddenDeathMode?: boolean
    teamPositions: boolean
    teamTogether: boolean
    treatyLength: number
    turboMode: boolean
    victory: number
    revealMap: number
    privacy: number
    teams: ITeamNew[]
}

export interface ITeamNew {
    teamId?: number
    players: IPlayerNew[]
}

export interface IPlayerNew {
    profileId: number
    name: string
    rating?: number
    ratingDiff: number
    civFix: number
    civ: number
    civName: string
    civImageUrl: string
    color: number
    colorHex: string
    status: number
    slot: number
    team?: number
    won?: boolean
    replay?: boolean
    verified: boolean
}












export type ILeaderboardsResponse = {
    leaderboardId: string
    leaderboardName: string
    abbreviation: string
    abbreviationTitle: string
    abbreviationSubtitle: string
    active: boolean
}[];


export interface ILeaderboardResponse {
    leaderboardId: string
    total: number
    start: number
    count: number
    country: any
    page: number
    players: ILeaderboardPlayerNew[]
}

export interface ILeaderboardPlayerNew {
    leaderboardId: string
    profileId: number
    name: string
    rank: number
    rating: number
    lastMatchTime: string
    drops: number
    losses: number
    streak: number
    wins: number
    updatedAt: string
    rankCountry: number
    games: number
    country: string
}



export interface IProfilesResponse {
    page: number
    perPage: number
    count: number
    offset: number
    hasMore: boolean
    profiles: IProfileItemNew[]
}

export interface IProfileItemNew {
    profileId: number
    steamId: string
    name: string
    country: string
    games: number
    drops: number
    clan: string
    avatarhash: string
    verified: boolean
}
