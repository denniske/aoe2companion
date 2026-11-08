import { sortByStart, sortByStatus, sortByTier } from '@app/helper/tournaments';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '@app/api/util';
import compact from 'lodash/compact';
import { getHost } from '@nex/data';
import { makeQueryString } from '@app/api/helper/util';
import { ILiquipediaPlayer, ILiquipediaTournament, ILiquipediaTournamentResponse, INewLiquipediaMatch } from '@app/api/tournament.types';
import { convertMatches, convertPlayer, convertTournament, convertTournamentDetail } from '@app/api/liquipedia.convert';
import { Tournament, TournamentCategory, TournamentDetail } from '@app/api/liquipedia.types';

// Tournaments come from our tournament service, which keeps a copy of Liquipedia's v3 data. Every client used to
// scrape the wiki itself, which Liquipedia's CORS policy ruled out on web.
export const tournamentsEnabled = true;

function tournamentApi<T>(path: string, params: Record<string, any> = {}): Promise<T> {
    return fetchJson(`${getHost('aoe2companion-tournament')}api/${path}?${makeQueryString(params)}`);
}

async function fetchTournaments(params: { upcoming?: boolean; category?: TournamentCategory; series?: string; limit?: number }) {
    const rows = await tournamentApi<ILiquipediaTournament[]>('tournaments', params);
    return rows.map(convertTournament);
}

/** A tier's tournaments, or with `series` a series' tournaments. Newest first. */
export const useTournaments = ({ category, series }: { category?: TournamentCategory; series?: string }) =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments', category, series],
        staleTime: 120000,
        queryFn: () => fetchTournaments(series ? { series } : { category, limit: 200 }),
        enabled: tournamentsEnabled && !!(category || series),
    });

export const useUpcomingTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments', 'upcoming'],
        staleTime: 120000,
        queryFn: () => fetchTournaments({ upcoming: true }),
        enabled: tournamentsEnabled,
    });

export const useFeaturedTournament = () => {
    return useFeaturedTournaments().data[0];
};

export const useFeaturedTournaments = () => {
    const { data: tournaments, ...query } = useUpcomingTournaments();
    return { data: orderBy(tournaments, [sortByTier, sortByStatus, sortByStart], ['asc', 'asc', 'asc']), ...query };
};

// One request per tournament: the detail, its matches and its placements are all read from the same cached rows.
// Ids arrive URL-encoded from routes and decoded from rows. MediaWiki titles cannot contain a percent-encoding, so
// decoding is safe either way.
const tournamentQuery = (id: string, enabled?: boolean) => ({
    queryKey: ['tournament', id],
    queryFn: () => tournamentApi<ILiquipediaTournamentResponse>('tournament', { pagename: decodeURIComponent(id).replace(/ /g, '_') }),
    enabled: tournamentsEnabled && enabled !== false && !!id,
    staleTime: 60000,
});

export const useTournament = (id: string, enabled?: boolean) => {
    const [currentId, setCurrentId] = useState(id);
    const queryClient = useQueryClient();
    const query = useTournamentDetail(id, enabled);

    useEffect(() => {
        if (!query.isFetching) {
            setCurrentId(id);
        }
    }, [query.isFetching, id]);
    // While a new id loads, keep showing the previous tournament.
    const cachedRows: ILiquipediaTournamentResponse | undefined = queryClient.getQueryData(['tournament', currentId]);
    const cachedData = useMemo(() => cachedRows && convertTournamentDetail(cachedRows), [cachedRows]);
    const data: TournamentDetail | undefined = query.data ?? cachedData;

    return { ...query, data };
};

export const useTournamentDetail = (id: string, enabled?: boolean) =>
    useQuery({
        ...tournamentQuery(id, enabled),
        select: convertTournamentDetail,
    });

export const useTournamentMatches = ({ tournamentId, enabled = true }: { tournamentId: string; enabled?: boolean }) => {
    const { data: tournament } = useTournament(tournamentId);
    const {
        data: matches,
        isLoading,
        ...query
    } = useQuery({
        ...tournamentQuery(tournamentId, enabled),
        select: (rows) => rows.matches,
        refetchOnWindowFocus: true,
    });

    const liquipediaMatches = useMemo(() => convertMatches(matches, compact([tournament])), [matches, tournament]);

    return {
        data: liquipediaMatches,
        isLoading,
        ...query,
    };
};

export const useTournamentPlacements = ({ tournamentId, enabled = true }: { tournamentId: string; enabled?: boolean }) =>
    useQuery({
        ...tournamentQuery(tournamentId, enabled),
        select: (rows) => rows.placements,
    });

/** A player's page, by Liquipedia page name (a profile's socialLiquipedia). */
export const useTournamentPlayer = (pagename?: string) =>
    useQuery({
        queryKey: ['player', pagename],
        staleTime: 120000,
        queryFn: async () => convertPlayer(await tournamentApi<ILiquipediaPlayer>('tournaments/player', { pagename })),
        enabled: tournamentsEnabled && !!pagename,
    });

export const useUpcomingTournamentMatches = (enabled: boolean = true) => {
    const { data: upcomingTournaments, isLoading: isLoadingTournaments } = useUpcomingTournaments();

    const {
        data: matches,
        isLoading,
        ...query
    } = useQuery<INewLiquipediaMatch[]>({
        queryKey: ['tournament', 'matches'],
        queryFn: () => tournamentApi<INewLiquipediaMatch[]>('tournaments/matches'),
        enabled: tournamentsEnabled && enabled,
        staleTime: 60000,
        refetchOnWindowFocus: true,
    });

    const liquipediaMatches = useMemo(() => convertMatches(matches, upcomingTournaments), [matches, upcomingTournaments]);

    return {
        data: liquipediaMatches,
        isLoading: isLoadingTournaments || isLoading,
        ...query,
    };
};

export function useRefreshControl({ isFetching, refetch }: Pick<UseQueryResult, 'isFetching' | 'refetch'>) {
    const [refreshing, setFetching] = useState(!!isFetching);
    const onRefresh = () => {
        setFetching(true);
        refetch();
    };

    useEffect(() => {
        setFetching(!!isFetching);
    }, [isFetching]);

    return { refreshing, onRefresh };
}
