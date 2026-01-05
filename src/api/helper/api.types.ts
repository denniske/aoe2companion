import { IBuildOrder } from '@/data/src/helper/builds';


export const GAME_VARIANT_AOE2DE = 2;
export const GAME_VARIANT_AOE2ROR = 1;



export interface ILobbiesMatch {
    totalSlotCount: number;
    blockedSlotCount: number;
    gameModeName: string;
    averageRating: number;

    matchId: number;
    started?: Date;
    finished?: Date;
    leaderboardId?: string;
    leaderboardName?: string;
    name: string;
    server?: string;
    internalLeaderboardId?: number;
    difficulty: number;
    startingAge: number;
    fullTechTree: boolean;
    allowCheats: boolean;
    empireWarsMode: boolean;
    endingAge: number;
    gameMode?: string;
    lockSpeed: boolean;
    lockTeams: boolean;
    mapSize: number;
    map?: string;
    mapName: string;
    mapImageUrl: string;
    population: number;
    recordGame: boolean;
    regicideMode: boolean;
    resources: number;
    sharedExploration: boolean;
    speed: number;
    suddenDeathMode: boolean;
    teamPositions: boolean;
    teamTogether: boolean;
    treatyLength: number;
    turboMode: boolean;
    victory: number;
    revealMap: number;
    privacy: number;
    players: IMatchesMatchPlayer2[];
    mod: boolean;
    difficultyName?: string;
    startingAgeName?: string;
    endingAgeName?: string;
    mapSizeName?: string;
    resourcesName?: string;
    civilizationSetName?: string;
    victoryName?: string;
    revealMapName?: string;
    antiquityMode?: boolean;
    password?: boolean;
    hideCivs?: boolean;
    civilizationSet?: number;
    scenario?: string;
    modDataset?: string;
    speedName?: string;
    speedFactor: number;
    gameVariant?: number;
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
    civ?: string
    civName?: string
    civImageUrl?: string
    color?: number
    colorHex: string
    slot: number
    team?: number
    won?: boolean
    rank?: number
    status?: string
    country?: string
    verified?: boolean
    teamName?: string
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
    total: number
    last10MatchesWon: {
        won: boolean
    }[]
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
    sharedHistory?: boolean;
    leaderboards: IProfileLeaderboardResult[];
    ratings: IProfileRatingsLeaderboard[];
    stats: IStatNew[];
    linkedProfiles: ILinkedProfile[];

    socialLiquipedia?: string;
    socialTwitchChannel?: string;
    socialTwitchChannelUrl?: string;
    socialYoutubeChannelUrl?: string;
    socialDouyuChannelUrl?: string;
    socialDiscordInvitationUrl?: string;
    socialDiscordInvitation?: string;
}

interface ILinkedProfile {
    profileId: number
    steamId: any
    name: string
    avatarMediumUrl: string
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
    platform: 'steam' | 'xbox' | 'psn'
    platformName: string
    name: string
    country: string
    games: number
    drops: number
    clan: string
    avatarhash: string
    avatarFullUrl?: string
    verified: boolean

    socialLiquipedia?: string;
    socialTwitchChannel?: string;
    socialTwitchChannelUrl?: string;
    socialYoutubeChannelUrl?: string;
    socialDouyuChannelUrl?: string;
    socialDiscordInvitationUrl?: string;
    socialDiscordInvitation?: string;
}

export interface IProfilesResult {
    page: number
    perPage: number
    count: number
    offset: number
    hasMore: boolean
    profiles: IProfilesResultProfile[];
}

export type INewsResult = INews[];

export type INews = {
    featuredMediaUrl: string;
    title: string;
    link: string;
};

export type IVideosResult = IVideo[];

export interface IVideo {
    source: 'youtube';
    title: string;
    author: string;
    thumbnailUrl: string;
    videoId: string;
    publishDate: Date;
    civ?: string;
}

export type IMapsResult = IMap[];

export type IMap = {
    mapId: string;
    mapName: string;
    description: string;
    imageUrl: string;
};

export type IMapsRankedResult = {
    patch: number
    patchVersion: number
    leaderboards: Array<{
        leaderboardId: string
        leaderboardName: string
        abbreviation: string
        maps: Array<{
            mapId: string
            mapName: string
            description: string
            imageUrl: string
            count: number
            percentage: number
        }>
    }>
}

export type IMapsPollResult = {
    pollId: string
    started: Date
    finished: Date
    expired: Date
    metadata: string
    questions: Array<{
        leaderboardId: string
        leaderboardName: string
        abbreviation: string
        questionId: number
        totalVotes: number
        options: Array<{
            optionId: number
            mapId: string
            mapName: string
            description: string
            imageUrl: string
            voteCount: number
            percentage: number
        }>
        devOptions: Array<{
            optionId: number
            mapId: string
            mapName: string
            description: string
            imageUrl: string
            voteCount: number
            percentage: number
        }>
    }>
}



export interface IBuildsResult {
    perPage: number;
    page: number;
    builds: IBuildOrder[];
}

export interface IMatchesResult {
    perPage: number;
    page: number;
    matches: IMatchNew[];
}

export interface IMatchNew {
    gameModeName: string;

    gameVariant: string;
    speedName: string;

    matchId: number
    started: Date
    finished?: Date
    leaderboardId?: string
    leaderboardName?: string
    name: string
    server?: string
    internalLeaderboardId?: number
    difficulty: number
    startingAge: string
    fullTechTree: boolean
    allowCheats: boolean
    empireWarsMode: boolean
    endingAge: string
    gameMode: string
    lockSpeed: boolean
    lockTeams: boolean
    mapSize: number
    map: string
    mapName: string
    mapImageUrl: string
    population: number
    recordGame: boolean
    regicideMode: boolean
    resources: number
    sharedExploration: boolean
    speed: number
    speedFactor: number
    suddenDeathMode: boolean
    teamPositions: boolean
    teamTogether: boolean
    treatyLength: number
    turboMode: boolean
    victory: number
    revealMap: number
    privacy: number
    teams: ITeamNew[]

    difficultyName?: string;
    startingAgeName?: string;
    endingAgeName?: string;
    mapSizeName?: string;
    resourcesName?: string;
    civilizationSetName?: string;
    victoryName?: string;
    revealMapName?: string;
    antiquityMode?: boolean;

    biomeName?: string;
    startingResourcesName?: string;
    mapStateName?: string;
    winConditionsName?: string;
    cheats?: boolean;
    mod?: boolean;
    password?: boolean;
    hideCivs?: boolean;
    civilizationSet?: number;
    scenario?: string;
    modDataset?: string;
    totalSlotCount?: number;
    blockedSlotCount?: number;
    averageRating?: number;
}

export interface ITeamNew {
    teamId?: number
    players: IPlayerNew[]
}

export interface IPlayerNew {
    profileId: number
    name: string
    rating?: number
    ratingDiff?: number
    civFix?: number
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
    socialLiquipedia?: string;
    socialTwitchChannel?: string;
    socialTwitchChannelUrl?: string;
    socialYoutubeChannelUrl?: string;
    socialDouyuChannelUrl?: string;
    socialDiscordInvitationUrl?: string;
    socialDiscordInvitation?: string;
    rank?: number
    country?: string
    teamName?: string
    games?: number
    wins?: number
    losses?: number
    drops?: number
}







export interface IFetchMatchesParams {
    leaderboardIds?: string[];
    platform?: string;
    search?: string;
    steamId?: string;
    profileIds?: number[];
    withProfileIds?: number[];
    country?: string;

    page?: number;
    pageParam?: number;
    language: string;
}



export interface IFetchMatchParams {
    matchId?: number;
    extend?: string;

    language: string;
}

export interface IFetchProfileParams {
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number | string;
    country?: string;
    extend?: string;

    pageParam?: number;
    language: string;
}

export interface IFetchProfilesParams {
    page?: number;
    search?: string;
    steamId?: string;
    profileIds?: number[];
    liquipediaNames?: string[];
    country?: string;
    extend?: string;
    clan?: string;
    perPage?: number;
    pageParam?: number;
    language: string;
}

export interface IFetchProfileRatingParams {
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number;
    country?: string;

    pageParam?: number;
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
    countryIcon?: string;
    last10MatchesWon?: Array<boolean | null>;
    rank: number;
    rankCountry: number;
    rating: number;
    maxRating: number;
    lastMatchTime: Date;
    streak: number;
    wins: number;
    losses: number;
    drops: number;
    updatedAt: string;
    games: number;
    country: string;
    avatarSmallUrl?: string;
    avatarMediumUrl?: string;
}

export interface IFetchLeaderboardParams {
    leaderboardId: string;
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number;
    country?: string;
    perPage?: number;
    pageParam?: string;
    language: string;
    extend?: string[];
    clan?: string;
}

export interface IFetchLeaderboardsParams {
    language: string;
}

export interface IFetchMapsParams {
    language: string;
}

export interface IFetchMapsRankedParams {
    language: string;
}

export interface IFetchMapsPollParams {
    language: string;
}

export interface IFetchBuildsParams {
    build_ids?: string[];
    civilization?: string;
    attribute?: string;
    difficulty?: string;
    search?: string;
    perPage?: number,
    page?: number;
    pageParam?: number;
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


export type IAnalysis = {
    error?: string

    guid: string
    version: string
    duration: string
    gaia?: Array<{
        classId: number
        index: number
        instanceId: number
        name: string
        objectId: number
        position: {
            x: number
            y: number
        }
    }>
    players: Array<{
        eapmPerMinute: Record<string, number>
        civilization?: string
        civilizationId?: number
        color?: string
        colorHex?: string
        colorId?: number
        eapm?: number
        name?: string
        number?: number
        objects?: Array<{
            classId: number
            index: number
            instanceId: number
            name: string
            objectId: number
            position: {
                x: number
                y: number
            }
        }>
        position?: object
        preferRandom?: boolean
        profileId?: number
        rateSnapshot?: number
        team?: [
            number,
            {
                civilization: string
                civilizationId: number
                color: string
                colorId: number
                eapm: number
                name: string
                number: number
                objects: Array<{
                    classId: number
                    index: number
                    instanceId: number
                    name: string
                    objectId: number
                    position: {
                        x: number
                        y: number
                    }
                }>
                position: object
                preferRandom: boolean
                profileId: number
                rateSnapshot: number
                team: Array<number>
                teamId: Array<number>
                winner: boolean
            }
        ]
        teamId?: Array<number>
        winner?: boolean
        unknown: Array<{
            payload: {
                sequence: number
                targets: Array<number>
            }
            player: number
            position: {
                x: number
                y: number
            }
            timestamp: string
            type: string
        }>
        queuedUnits: Array<{
            timestamp: string
            unit: string
        }>
        queuedTechs: Array<{
            timestamp: string
            unit: string
        }>
        resignation?: {
            timestamp: string
        }
        queuedBuildings: Array<{
            timestamp: string
            position: {
                x: number
                y: number
            }
            unit: string
            unitId: number
        }>
        queuedWalls: Array<{
            timestamp: string
            position: {
                x: number
                y: number
            }
            positionEnd: {
                x: number
                y: number
            }
            unit: string
        }>
        market: Array<{
            timestamp: string
            unit: string
            amount: number
            type: string
        }>
        chat: Array<{
            timestamp: string
            audience: string
            message: string
            origination: string
        }>
        uptimes: Array<{
            timestamp: string
            age: string
        }>
        timeseries: Array<{
            timestamp: string
            totalObjects: number
            totalResources: number
        }>
        viewLocks: Array<any>
    }>
    map: {
        custom: boolean
        dimension: number
        id: number
        modes: {
            directPlacement: boolean
            effectQuantity: boolean
            fixedPositions: boolean
            guardState: boolean
        }
        tiles: Array<{
            elevation: number
            position: {
                x: number
                y: number
            }
            terrain: number
        }>
        name: string
        size: string
        zr: boolean
    }
}
