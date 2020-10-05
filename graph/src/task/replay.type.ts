
export interface Dataset {
    id: number;
    name: string;
    version?: any;
}

export interface Diplomacy {
    '1v1': boolean;
    FFA: boolean;
    TG: boolean;
    team_size: string;
    type: string;
}

export interface Modes {
    direct_placement: boolean;
    effect_quantity: boolean;
    fixed_positions: boolean;
    guard_state: boolean;
}

export interface Map {
    custom: boolean;
    dimension: number;
    id: number;
    modes: Modes;
    name: string;
    seed: number;
    size: string;
    water: number;
    zr: boolean;
}

export interface Ratings {
}

export interface Platform {
    ladder?: any;
    lobby_name: string;
    platform_id: string;
    platform_match_id: string;
    rated?: any;
    ratings: Ratings;
}

// export interface Economy {
//     food_collected?: any;
//     gold_collected?: any;
//     relic_gold?: any;
//     score?: any;
//     stone_collected?: any;
//     trade_gold?: any;
//     tribute_received?: any;
//     tribute_sent?: any;
//     wood_collected?: any;
// }
//
// export interface Military {
//     buildings_lost?: any;
//     buildings_razed?: any;
//     hit_points_killed?: any;
//     hit_points_razed?: any;
//     score?: any;
//     units_converted?: any;
//     units_killed?: any;
//     units_lost?: any;
// }
//
// export interface Society {
//     score?: any;
//     total_castles?: any;
//     total_relics?: any;
//     total_wonders?: any;
//     villager_high?: any;
// }
//
// export interface Technology {
//     castle_time?: any;
//     explored_percent?: any;
//     feudal_time?: any;
//     imperial_time?: any;
//     research_count?: any;
//     research_percent?: any;
//     score?: any;
// }
//
// export interface Achievements {
//     economy: Economy;
//     military: Military;
//     society: Society;
//     technology: Technology;
// }

export interface IReplayPlayer {
    achievements?: any;
    cheater: boolean;
    civilization: number;
    color_id: number;
    human: boolean;
    mvp?: any;
    name: string;
    number: number;
    position: number[];
    rate_snapshot?: any;
    score?: any;
    user_id: number;
    winner: boolean;
}

export interface IReplay {
    duration: number;
    players: IReplayPlayer[];
    chat: any[];
    completed: boolean;
    dataset: Dataset;
    diplomacy: Diplomacy;
    encoding: string;
    file_hash: string;
    language: string;
    map: Map;
    mirror: boolean;
    owner: number;
    platform: Platform;
    postgame?: any;
    profile_ids: any;
    ratings: any;
    restored: any[];
    start_time: number;
    teams: number[][];
}

export interface IReplayResult {
    status: number;
    replay: IReplay;
}
