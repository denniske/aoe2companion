

export interface ILeaderboardDef {
    leaderboardId: number;
    name: string;
    abbreviation: string;
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
    players: IMatchesMatchPlayer[];
}







export interface IFetchProfilesProfile {
    profileId: number;
    name: string;
    games: number;
    country: string;
}


export interface IProfilesResult {
    page: number;
    profiles: IFetchProfilesProfile[];
}


export interface IMatchesResult {
    perPage: number;
    page: number;
    matches: IMatchesMatch[];
}

export interface IMatchesMatch {
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
    teams: IMatchesMatchTeam[]
}

export type IMatchesMatchTeam = IMatchesMatchPlayer[];

export interface IMatchesMatchPlayer {
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






export interface IFetchMatchesParams {
    leaderboardIds: number[];
    page?: number;
    search?: string;
    steamId?: string;
    profileIds?: number[];
    country?: string;

    pageParam?: string;
}



export interface IFetchProfileParams {
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
