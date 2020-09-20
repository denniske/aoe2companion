
export interface ILeaderboard {
    leaderboard_id: number;
    rank: number;
    rating: number;
    games: number;
    drops: number;
    profile_id: number;
    steam_id: string;
    name: string;
    country: string;
    clan?: string;
    icon?: string;
    highest_rating: number;
    previous_rating: number;
    wins: number;
    losses: number;
    streak: number;
    lowest_streak: number;
    highest_streak: number;
    last_match: number;
    last_match_time: Date;
}

export interface IStats {
    leaderboard_id: number;
    allies: IStatsEntry[];
    opponents: IStatsEntry[];
    civ: IStatsEntry[];
    map_type: IStatsEntry[];
}

export interface IStatsEntry {
    civ?: number;
    map_type?: number;
    name?: string;
    games: number;
    wins: number;
    country?: string;
}

export interface IRatingHistory {
    leaderboard_id: number;
    history: IRatingHistoryEntry[];
}

export interface IRatingHistoryEntry {
    rating: number;
    num_wins: number;
    num_losses: number;
    streak: number;
    drops: number;
    timestamp: Date;
}

export interface IProfile {
    profile_id: number;
    name: string;
    country: string;
    games: number;
    drops: number;
    last_match_time: Date;
    leaderboards: ILeaderboard[];
    rating_history: IRatingHistory[];
    stats: IStats[];
}

export interface IUser {
    profile_id: number;
    name: string;
    country: string;
    games: number;
}
