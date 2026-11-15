// Types from the old aoestats.io integration. Only the Red Bull Wololo overlay still
// builds WinrateCiv objects itself; the win rates screens read our own /api/meta.
export interface WinrateMatchup {
    wins: number;
    ci_lower: number;
    ci_upper: number;
    win_rate: number;
    num_games: number;
    play_rate: number;
}

export interface WinrateCiv extends WinrateMatchup {
    rank: number;
    by_map: Record<string, WinrateMatchup>;
    civ_name: string;
    by_matchup: Record<string, WinrateMatchup>;
    by_opening: Record<string, WinrateMatchup>;
    prior_rank: number;
    by_game_time: Record<string, WinrateMatchup>;
    avg_castle_time: number;
    avg_feudal_time: number;
    avg_game_length: number;
    avg_imperial_time: number;
}
