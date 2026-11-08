import { fetchJson } from '@app/api/util';
import { useLanguage } from '@app/queries/all';
import { getHost } from '@nex/data';
import { useQuery } from '@tanstack/react-query';

/*
 * The meta statistics (/api/meta/*): civ win rates, matchups, maps, rating groups, countries and
 * activity, computed by our backend from ranked 1v1 matches of the last `days` days.
 *
 * Every civ number comes from decided, non-mirror 1v1 matches. Win rates are plain wins / games;
 * the pages decide how many games a number needs before they show it.
 */

export interface MetaCiv {
    civ: string;
    civName: string;
    civImageUrl: string;
}

export interface MetaMap {
    map: string;
    mapName: string;
    mapImageUrl: string | null;
}

export interface MetaResponse {
    leaderboard: string;
    days: number;
    matches: number | null;
}

export interface MetaCivsResponse extends MetaResponse {
    civs: (MetaCiv & { games: number; wins: number; winRate: number; playRate: number })[];
}

export interface MetaMatchupsResponse extends MetaResponse {
    civs: (MetaCiv & { games: number })[];
    matchups: { civ: string; opponent: string; games: number; wins: number; winRate: number }[];
}

export interface MetaMapsResponse extends MetaResponse {
    maps: (MetaMap & { games: number; playRate: number; avgDurationMinutes: number | null })[];
    civs: MetaCiv[];
    mapCivs: { map: string; civ: string; games: number; wins: number; winRate: number }[];
}

export interface MetaRatingGroup {
    key: string;
    min: number;
    max: number | null;
    games: number;
    players: number;
    avgRating: number | null;
    avgDurationMinutes: number | null;
    civs: (MetaCiv & { games: number; wins: number; winRate: number })[];
}

export interface MetaRatingGroupsResponse extends MetaResponse {
    groups: MetaRatingGroup[];
}

export interface MetaCountriesResponse extends MetaResponse {
    countries: {
        country: string;
        countryIcon: string;
        players: number;
        games: number;
        winRate: number;
        avgRating: number | null;
        avgDurationMinutes: number | null;
    }[];
}

export interface MetaActivityResponse {
    hourly: { hour: string; players: number }[];
    daily: { day: string; matches: number }[];
}

interface MetaEndpoints {
    civs: MetaCivsResponse;
    matchups: MetaMatchupsResponse;
    maps: MetaMapsResponse;
    'rating-groups': MetaRatingGroupsResponse;
    countries: MetaCountriesResponse;
    activity: MetaActivityResponse;
}

export async function fetchMeta<K extends keyof MetaEndpoints>(endpoint: K, language: string, days = 30): Promise<MetaEndpoints[K]> {
    return fetchJson(`${getHost('aoe2companion-data')}api/meta/${endpoint}?language=${language}&days=${days}`);
}

/** One meta endpoint. The backend answers from an hour-long edge cache, so a long staleTime costs nothing. */
export function useMeta<K extends keyof MetaEndpoints>(endpoint: K, days = 30) {
    const language = useLanguage();
    return useQuery({
        queryKey: ['meta', endpoint, language, days],
        queryFn: () => fetchMeta(endpoint, language!, days),
        enabled: !!language,
        staleTime: 15 * 60 * 1000,
    });
}

/** Games a cell needs before its win rate is shown; below it the number is mostly noise. */
export const MIN_CELL_GAMES = 30;
