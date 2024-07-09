import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface WinratePatch {
    number: number;
    label: string;
    release_date: string;
    published: boolean;
    url: string;
    description: string;
    total_games: number;
}

export const useWinratesPatches = () => {
    const { data: patches, ...rest } = useQuery({
        queryFn: async () => {
            const patches = await axios.get<WinratePatch[]>('https://aoestats.io/api/patches/');
            return patches.data;
        },
        queryKey: ['winrates', 'patches'],
        staleTime: Infinity,
    });
    return { patches, recentPatch: patches?.[0]?.number, ...rest };
};

export enum WinrateEloRange {
    All = 'all',
    Low = 'low',
    MediumLow = 'med_low',
    Medium = 'medium',
    MediumHigh = 'med_high',
    High = 'high',
}

export enum WinrateGrouping {
    '1v1Random' = 'random_map',
    'TeamRandom' = 'team_random_map',
    'CO1v1Random' = 'co_random_map',
    'COTeamRandom' = 'co_team_random_map',
}

export interface WinrateParams {
    patch?: number;
    grouping?: WinrateGrouping;
    eloRange?: WinrateEloRange;
}

export interface WinrateResponse {
    patch: number;
    grouping: WinrateGrouping;
    elo_grouping: WinrateEloRange;
    total_games: number;
    civ_stats: Record<string, WinrateCiv>;
    map_stats: Record<string, WinrateMap>;
    opening_stats: Record<string, WinrateOpening>;
}

interface WinrateMatchup {
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

export interface WinrateMap {
    by_civ: Record<string, WinrateCiv>;
    map_name: string;
    num_games: number;
    play_rate: number;
    by_opening: Record<string, WinrateMatchup>;
}

export interface WinrateOpening extends WinrateMatchup {
    by_matchup: Record<string, WinrateMatchup>;
    opening_name: string;
    avg_game_length: 2410;
}

export const useWinrates = (params?: WinrateParams) => {
    const { patch, eloRange = WinrateEloRange.All, grouping = WinrateGrouping['1v1Random'] } = params ?? {};
    const { recentPatch } = useWinratesPatches();
    const selectedPatch = patch ?? recentPatch;
    const { data, ...rest } = useQuery({
        queryFn: async () => {
            const patches = await axios.get<WinrateResponse[]>(
                'https://aoestats.io/api/stats/?patch=111772&grouping=random_map&elo_range=all&format=json',
                { params: { patch: selectedPatch, grouping, elo_range: eloRange } }
            );
            return patches.data;
        },
        queryKey: ['winrates', 'stats', selectedPatch, grouping, eloRange],
        staleTime: Infinity,
        enabled: !!selectedPatch,
    });
    const winrates = data?.[0];
    const { civ_stats: civStats, map_stats: mapStats, opening_stats: openingStats } = winrates ?? {};

    return {
        winrates:
            winrates && civStats && mapStats && openingStats
                ? { civs: Object.values(civStats), maps: Object.values(mapStats), openings: Object.values(openingStats) }
                : undefined,
        ...rest,
    };
};

export interface PriorCivStat {
    win_rate: number;
    play_rate: number;
    rank: number;
}

export interface PriorStat {
    civ_stats: Record<string, PriorCivStat>;
    by_map: Record<string, Record<string, PriorCivStat>>;
}

export interface WinrateBreakdownResponse {
    prior_stats: ({ patch: number } & PriorStat)[];
    by_rating: Record<WinrateEloRange, { elo_range: WinrateEloRange } & PriorStat>;
}

export interface WinrateBreakdown {
    priorStats: WinrateBreakdownResponse['prior_stats'];
    byRating: WinrateBreakdownResponse['by_rating'];
}

export const useWinratesBreakdown = (params?: WinrateParams) => {
    const { patch, eloRange = WinrateEloRange.All, grouping = WinrateGrouping['1v1Random'] } = params ?? {};
    const { recentPatch } = useWinratesPatches();
    const selectedPatch = patch ?? recentPatch;
    const { data, ...rest } = useQuery({
        queryFn: async () => {
            const patches = await axios.get<WinrateBreakdownResponse[]>(
                'https://aoestats.io/api/stats/breakdown/?patch=111772&grouping=random_map&elo_range=all&format=json',
                { params: { patch: selectedPatch, grouping, elo_range: eloRange } }
            );
            return patches.data;
        },
        queryKey: ['winrates', 'breakdown', selectedPatch, grouping, eloRange],
        staleTime: Infinity,
        enabled: !!selectedPatch,
    });

    const breakdown = data?.[0];

    return {
        breakdown: breakdown ? ({ priorStats: breakdown.prior_stats, byRating: breakdown.by_rating } as WinrateBreakdown) : undefined,
        ...rest,
    };
};

export interface WinrateGroupingResponse {
    name: WinrateGrouping;
    label: string;
    elo_groupings: { label: 'string'; name: WinrateEloRange }[];
}

export const useWinrateGroupings = () => {
    const { data: groupings, ...rest } = useQuery({
        queryFn: async () => {
            const patches = await axios.get<WinrateGroupingResponse[]>('https://aoestats.io/api/groupings/');
            return patches.data;
        },
        queryKey: ['winrates', 'groupings'],
        staleTime: Infinity,
    });

    return {
        groupings,
        ...rest,
    };
};
