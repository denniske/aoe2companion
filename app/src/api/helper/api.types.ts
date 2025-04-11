






export const GAME_VARIANT_AOE2DE = 2;
export const GAME_VARIANT_AOE2ROR = 1;



export interface ILobbiesMatch {
    totalSlotCount: number;
    blockedSlotCount: number;
    gameModeName: string;
    averageRating: number;

    matchId: number
    started: Date
    finished?: Date
    leaderboardId?: number
    leaderboardName?: string
    name: string
    server?: string
    internalLeaderboardId?: number
    difficulty: number
    startingAge: number
    fullTechTree: boolean
    allowCheats: boolean
    empireWarsMode: boolean
    endingAge: number
    gameMode: number
    lockSpeed: boolean
    lockTeams: boolean
    mapSize: number
    map: number
    mapName: string
    mapImageUrl: string
    population: number
    recordGame: boolean
    regicideMode: boolean
    resources: number
    sharedExploration: boolean
    speed: number
    suddenDeathMode: boolean
    teamPositions: boolean
    teamTogether: boolean
    treatyLength: number
    turboMode: boolean
    victory: number
    revealMap: number
    privacy: number
    players: IMatchesMatchPlayer2[];
}


export type IMatchesMatch = Pick<ITeamNew, 'players'> & Omit<IMatchNew, 'teams'>;

export interface ILobbiesMatch2 {
    totalSlotCount: number;
    blockedSlotCount: number;
    gameModeName: string;
    averageRating: number;

    matchId: number
    started: Date
    finished?: Date
    leaderboardId?: number
    leaderboardName?: string
    name: string
    server?: string
    internalLeaderboardId?: number
    difficulty: number
    startingAge: number
    fullTechTree: boolean
    allowCheats: boolean
    empireWarsMode: boolean
    endingAge: number
    gameMode: number
    lockSpeed: boolean
    lockTeams: boolean
    mapSize: number
    map: number
    mapName: string
    mapImageUrl: string
    population: number
    recordGame: boolean
    regicideMode: boolean
    resources: number
    sharedExploration: boolean
    speed: number
    suddenDeathMode: boolean
    teamPositions: boolean
    teamTogether: boolean
    treatyLength: number
    turboMode: boolean
    victory: number
    revealMap: number
    privacy: number
    players: number[];
}

export interface IMatchesMatchPlayer2 {
    matchId: number
    profileId: number
    name?: string
    rating?: number
    ratingDiff?: number
    games?: number
    wins?: number
    losses?: number
    drops?: number
    civ: number
    civName: string
    civImageUrl: string
    color: number
    colorHex: string
    slot: number
    team?: number
    won?: boolean
}



export interface IProfileLeaderboardResult {
    maxRating: number; // TODO
    games: number;

    rankLevel: string
    rankLevelName: string
    rankLevelImageUrl: string
    rankLevelColor: string
    rankLevelBackgroundColor: string
    season: number


    leaderboardId: any
    leaderboardName: string
    abbreviation: string
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
}

export type IAssetsResult = IAsset[]

export interface IAsset {
    type: string
    gameVariant: string
    name: string
    imageUrl: string
}

export interface IProfileResult {
    clan: string; // Todo
    drops: number; // Todo

    profileId: number;
    steamId: string;
    name: string;
    games: number;
    country: string;
    countryIcon: string;
    verified: boolean;
    shared: boolean;
    leaderboards: IProfileLeaderboardResult[];
    ratings: IProfileRatingsLeaderboard[];
    stats: IStatNew[];
    linkedProfiles: ILinkedProfile[];
}

interface ILinkedProfile {
    profileId: number
    steamId: any
    name: string
    country: any
    games: number
    drops: number
    clan: any
    avatarhash: any
    hidden: any
    verified: boolean
    shared: boolean
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
    civ: string
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

export interface IProfilesResultProfile {
    // profileId: number;
    // name: string;
    // games: number;
    // country: string;

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

export interface IProfilesResult {
    page: number
    perPage: number
    count: number
    offset: number
    hasMore: boolean
    profiles: IProfilesResultProfile[];
}


export interface IMatchesResult {
    perPage: number;
    page: number;
    matches: IMatchNew[];
}

export interface IMatchNew {
    gameVariant: number; // TODO
    speedName: string; // TODO

    matchId: number
    started: Date
    finished?: Date
    leaderboardId?: number
    leaderboardName?: string
    name: string
    server?: string
    internalLeaderboardId?: number
    difficulty: number
    startingAge: number
    fullTechTree: boolean
    allowCheats: boolean
    empireWarsMode: boolean
    endingAge: number
    gameMode: number
    lockSpeed: boolean
    lockTeams: boolean
    mapSize: number
    map: number
    mapName: string
    mapImageUrl: string
    population: number
    recordGame: boolean
    regicideMode: boolean
    resources: number
    sharedExploration: boolean
    speed: number
    suddenDeathMode: boolean
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
    civ: string
    civName: string
    civImageUrl: string
    color: number
    colorHex: string
    status: string
    slot: number
    team?: number
    won?: boolean
    replay?: boolean
    verified: boolean
    shared?: boolean
}







export interface IFetchMatchesParams {
    leaderboardIds?: number[];
    platform?: string;
    page?: number;
    search?: string;
    steamId?: string;
    profileIds?: number[];
    withProfileIds?: number[];
    country?: string;

    pageParam?: string;
}



export interface IFetchProfileParams {
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number | string;
    country?: string;
    extend?: string;

    pageParam?: string;
}

export interface IFetchProfileRatingParams {
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number;
    country?: string;

    pageParam?: string;
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
  slot_type: any;
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
  game_type: any;
  has_custom_content: any;
  has_password: boolean;
  leaderboard_id: number;
  lobby_id: any;
  lock_speed: boolean;
  lock_teams: boolean;
  map_size: number;
  map_type: number;
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
  checked?: Date;
}








export type IProfileRatingsResult = IProfileRatingsLeaderboard[]

export interface IProfileRatingsLeaderboard {
    leaderboardId: string
    leaderboardName: string
    abbreviation: string
    ratings: IProfileRatingsRating[]
}

export interface IProfileRatingsRating {
    leaderboardId: number
    profileId: number
    games: number
    rating: number
    ratingDiff?: number
    date: Date
}


export interface ILeaderboardDef {
    leaderboardId: string
    leaderboardName: string
    abbreviation: string
    abbreviationTitle: string
    abbreviationSubtitle: string
    active: boolean
}

export interface ILeaderboard {
    leaderboardId: number;
    total: number;
    start: number;
    count: number;
    page: number;
    country: string;
    players: ILeaderboardPlayer[];
}

export interface ILeaderboardPlayer {
    clan: string;
    leaderboardId: number;
    profileId: number;
    name: string;
    rank: number;
    rankCountry: number;
    rating: number;
    lastMatchTime: Date;
    streak: number;
    wins: number;
    losses: number;
    drops: number;
    updatedAt: string;
    games: number;
    country: string;
}

export interface IFetchLeaderboardParams {
    leaderboardId: number;
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number;
    country?: string;

    pageParam?: string;
}


// export type ILeaderboardsResponse = {
//     leaderboardId: string
//     leaderboardName: string
//     abbreviation: string
//     abbreviationTitle: string
//     abbreviationSubtitle: string
//     active: boolean
// }[];
//
//
// export interface ILeaderboardResponse {
//     leaderboardId: string
//     total: number
//     start: number
//     count: number
//     country: any
//     page: number
//     players: ILeaderboardPlayerNew[]
// }
//
// export interface ILeaderboardPlayerNew {
//     leaderboardId: string
//     profileId: number
//     name: string
//     rank: number
//     rating: number
//     lastMatchTime: string
//     drops: number
//     losses: number
//     streak: number
//     wins: number
//     updatedAt: string
//     rankCountry: number
//     games: number
//     country: string
// }
