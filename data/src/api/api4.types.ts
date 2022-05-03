
export interface IAoe4WorldPlayerMatches {
    total_count: number;
    page: number;
    per_page: number;
    count: number;
    offset: number;
    filters: Aoe4WorldFilters;
    games: Aoe4WorldGame[];
}

export interface Aoe4WorldFilters {
    leaderboard: string[];
    since: Date;
    opponent_profile_id?: any;
}

export interface Aoe4WorldGame {
    game_id: number;
    started_at: string;
    duration: number;
    map: string;
    kind: string;
    server: string;
    patch: number;
    average_rating: number;
    teams: Aoe4WorldPlayerEntry[][];
}

export interface Aoe4WorldPlayer {
    profile_id: number;
    name: string;
    result: string;
    civilization: string;
    rating_diff: number;
    rating: number;
}

export interface Aoe4WorldPlayerEntry {
    player: Aoe4WorldPlayer;
}



export interface Aoe4WorldFoundPlayerLeaderboard {
    rating: number;
    rank?: number;
    rank_level?: any;
    streak?: number;
    games_count: number;
    wins_count: number;
    losses_count: number;
    last_game_at: Date;
    win_rate: number;
}

export interface Aoe4WorldFoundPlayer {
    name: string;
    profile_id: number;
    steam_id: any;
    avatars: Avatars;
    social: Social;
    last_game_at: Date;
    leaderboards: { [key: string]: Aoe4WorldFoundPlayerLeaderboard };
}

export interface Aoe4WorldFoundPlayers {
    total_count: number;
    page: number;
    per_page: number;
    count: number;
    offset: number;
    query: string;
    players: Aoe4WorldFoundPlayer[];
}

export interface Avatars {
    small: string;
    medium: string;
    full: string;
}

export interface Social {
    twitch: string;
    twitter: string;
    youtube: string;
    instagram: string;
    liquipedia: string;
}

export interface Aoe4WorldLeaderboardPlayer {
    name: string;
    profile_id: number;
    steam_id: any;
    site_url: string;
    avatars: Avatars;
    social: Social;
    twitch_url: string;
    twitch_is_live: boolean;
    rating: number;
    rank: number;
    rank_level?: any;
    streak: number;
    games_count: number;
    wins_count: number;
    losses_count: number;
    last_game_at: Date;
    win_rate: number;
    last_rating_change: number;
}

export interface Aoe4WorldLeaderboard {
    query?: any;
    key: string;
    short_name: string;
    name: string;
    site_url: string;
    players: Aoe4WorldLeaderboardPlayer[];
    total_count: number;
    page: number;
    per_page: number;
    count: number;
    offset: number;
}






export interface Aoe4WorldRatingHistoryEntry {
    rating: number;
    streak: number;
    wins_count: number;
    drops_count: number;
    games_count: number;
}

export interface Aoe4WorldMode {
    rating: number;
    rank: number;
    streak: number;
    games_count: number;
    wins_count: number;
    losses_count: number;
    drops_count: number;
    last_game_at: Date;
    win_rate: number;
    rank_level: string;
    rating_history: { [key: string]: Aoe4WorldRatingHistoryEntry };
    civilizations: any;
}

// export interface Aoe4WorldModes {
//     qm_1v1: Qm1v1;
//     qm_2v2: Qm2v2;
//     qm_3v3: Qm3v3;
//     qm_4v4: Qm4v4;
//     rm_1v1: Rm1v1;
// }

export interface Aoe4WorldProfile {
    name: string;
    profile_id: number;
    steam_id: string;
    site_url: string;
    avatars: Avatars;
    social: Social;
    modes: { [key: string]: Aoe4WorldMode };
}
