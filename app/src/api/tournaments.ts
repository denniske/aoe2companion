import { sortByStart, sortByStatus, sortByTier, sortedTiers } from '@app/helper/tournaments';
import { appConfig } from '@nex/dataset';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import * as Application from 'expo-application';
import { GameVersion, Liquipedia, MapDetail, Match, Tournament, TournamentCategory, TournamentDetail, TournamentSection } from 'liquipedia';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { fetchJson } from '@app/api/util';
import compact from 'lodash/compact';
import { getHost, parseIntNullable } from '@nex/data';
import { makeQueryString } from '@app/api/helper/util';
import { subDays } from 'date-fns';
import { ConvertedLiquipediaMatch, ILiquipediaPlacement, INewLiquipediaMatch } from '@app/api/tournament.types';

export const tournamentsEnabled = (true && __DEV__) || Platform.OS !== 'web';

const liquipedia = new Liquipedia({
    USER_AGENT: `${Application.applicationName}/${Application.nativeApplicationVersion} (hello@aoe2companion.com)`,
});

export const useTournaments = (category: TournamentCategory | undefined) =>
    useQuery<TournamentSection[]>({
        queryKey: ['tournaments', category],
        queryFn: async () => await liquipedia.aoe.getTournaments(category ?? sortedTiers[0]),
        enabled: tournamentsEnabled && !!category,
    });

export const useUpcomingTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        staleTime: 120000, // 0
        queryFn: async () => await liquipedia.aoe.getUpcomingTournaments(appConfig.game === 'aoe2de' ? GameVersion.Age2 : GameVersion.Age4),
        enabled: tournamentsEnabled,
    });

export const useFeaturedTournament = () => {
    return useFeaturedTournaments().data[0];
};

export const useFeaturedTournaments = () => {
    const { data: tournaments, ...query } = useUpcomingTournaments();
    return { data: orderBy(tournaments, [sortByTier, sortByStatus, sortByStart], ['asc', 'asc', 'asc']), ...query };
};

export const useAllTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getAllTournaments(),
        enabled: tournamentsEnabled,
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
    const cachedData: TournamentDetail | undefined = queryClient.getQueryData(['tournament', currentId]);
    const data: TournamentDetail | undefined = query.data ?? cachedData;

    return { ...query, data };
};

export const useTournamentDetail = (id: string, enabled?: boolean) =>
    useQuery<TournamentDetail>({
        queryKey: ['tournament', id],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getTournament(id),
        enabled: tournamentsEnabled && enabled,
    });

export const useTournamentPlayer = (id?: string) =>
    useQuery({
        queryKey: ['player', id],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getPlayer(id ?? ''),
        enabled: tournamentsEnabled && !!id,
    });

export const useTournamentPlayerOverview = (id?: string) =>
    useQuery({
        queryKey: ['player', 'overview', id],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getPlayerOverview(id ?? ''),
        enabled: tournamentsEnabled && !!id,
    });

async function getLiquipediaMatches(options: { tournamentId?: string; upcoming?: boolean }) {
    // console.log('getLiquipediaMatches', options);

    const yesterday = subDays(new Date(), 1);
    const yesterdayString = yesterday.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const game = 'Age of Empires II';
    const conditions = [`[[game::${game}]]`];
    if (options.tournamentId) {
        conditions.push(`[[pagename::${options.tournamentId}]]`);
    }
    if (options.upcoming) {
        conditions.push(`[[finished::0]] AND [[date::>${yesterdayString}]]`);
    }

    const queryString = makeQueryString({
        limit: 100,
        wiki: 'ageofempires',
        offset: 0,
        order: 'date asc',
        conditions: conditions.join(' AND '),
    });
    return (
        await fetchJson(`${getHost('aoe2companion-tournament')}api/external/match?${queryString}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    )?.result;
}

async function getLiquipediaPlacements(options: { tournamentId?: string; upcoming?: boolean }) {
    // console.log('getLiquipediaPlacements', options);

    const game = 'Age of Empires II';
    const conditions = [`[[game::${game}]]`];
    if (options.tournamentId) {
        conditions.push(`[[pagename::${options.tournamentId}]]`);
    }

    const queryString = makeQueryString({
        limit: 100,
        wiki: 'ageofempires',
        offset: 0,
        conditions: conditions.join(' AND '),
    });
    return (
        await fetchJson(`${getHost('aoe2companion-tournament')}api/external/placement?${queryString}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    )?.result;
}

function convertNewLiquipediaMatches(newLiquipediaMatches: INewLiquipediaMatch[] | undefined, tournaments?: (Tournament | TournamentDetail)[]) {
    const list = compact(
        newLiquipediaMatches?.map((match) => {
            const tournament = tournaments?.find((tournament) => tournament.path === match.parent);

            const links = [];

            // If the streamurls parameter is set to true and rawstreams is set to true, the API will return links to the streaming providers page
            // https://api.liquipedia.net/documentation/api/v3/match
            if (match.stream.twitch) {
                links.push({
                    text: 'Twitch',
                    url: `https://www.twitch.tv/${match.stream.twitch}`,
                });
            }
            if (match.vod) {
                links.push({
                    text: 'Watch VOD',
                    url: match.vod,
                });
            }
            if (match.links.mapdraft) {
                links.push({
                    text: 'Map Draft',
                    url: match.links.mapdraft,
                });
            }
            if (match.links.civdraft) {
                links.push({
                    text: 'Civ Draft',
                    url: match.links.civdraft,
                });
            }

            const games = match.match2games.map((game) => ({
                map: game.map,
                winner: parseIntNullable(game.winner),
                players: game.opponents.map((opponent) =>
                    opponent.players.map((player) => ({
                        name: player.pageName,
                        civ: player.civ,
                    }))
                ),
            }));

            return {
                format: match.mode,
                finished: match.finished === 1,
                startTime: match.date ? new Date(match.date) : undefined,
                participants: match.match2opponents.map((participant) => ({
                    name: participant.name,
                })) as [Match['participants'][0], Match['participants'][1]],
                games,
                links,
                tournament: {
                    ...tournament!,
                    image: tournament?.league?.image,
                },
            } as ConvertedLiquipediaMatch;
        })
    );
    return list;
}

export const useUpcomingTournamentMatches = (enabled: boolean = true) => {
    const { data: upcomingTournaments, isLoading: isLoadingTournaments } = useUpcomingTournaments();
    // const upcomingTournamentIds = upcomingTournaments?.map((tournament) => encodeURIComponent(tournament.path));

    const {
        data: matches,
        isLoading,
        ...query
    } = useQuery<INewLiquipediaMatch[]>({
        queryKey: ['tournament', 'matches'],
        queryFn: async () => await getLiquipediaMatches({ upcoming: true }),
        enabled: tournamentsEnabled && enabled,
        staleTime: 60000, // 0
        refetchOnWindowFocus: true,
    });

    const liquipediaMatches = useMemo(() => convertNewLiquipediaMatches(matches, upcomingTournaments), [matches, upcomingTournaments]);

    return {
        data: liquipediaMatches,
        isLoading: isLoadingTournaments || isLoading,
        ...query,
    };
};

export const useTournamentMatches = ({ tournamentId, upcoming, enabled = true }: { tournamentId: string; upcoming?: boolean; enabled?: boolean }) => {
    const { data: tournament, isLoading: isLoadingTournaments } = useTournament(tournamentId);

    const {
        data: matches,
        isLoading,
        ...query
    } = useQuery<INewLiquipediaMatch[]>({
        queryKey: ['tournament', 'matches', tournamentId],
        queryFn: async () => await getLiquipediaMatches({ tournamentId, upcoming }),
        enabled: tournamentsEnabled && enabled && tournamentId != null,
        staleTime: 60000, // 0
        refetchOnWindowFocus: true,
    });

    const liquipediaMatches = useMemo(() => convertNewLiquipediaMatches(matches, compact([tournament])), [matches, tournament]);

    return {
        data: liquipediaMatches,
        isLoading: isLoadingTournaments || isLoading,
        ...query,
    };
};

export const useTournamentPlacements = ({ tournamentId, enabled = true }: { tournamentId: string; enabled?: boolean }) => {
    const {
        data: placements,
        isLoading,
        ...query
    } = useQuery<ILiquipediaPlacement[]>({
        queryKey: ['tournament', 'placements', tournamentId],
        queryFn: async () => await getLiquipediaPlacements({ tournamentId }),
        enabled: tournamentsEnabled && enabled && tournamentId != null,
        staleTime: 60000, // 0
        refetchOnWindowFocus: true,
    });

    // const liquipediaMatches = useMemo(() => convertNewLiquipediaMatches(matches, compact([tournament])), [matches, tournament]);

    return {
        data: placements,
        ...query,
    };
};

export const useMap = (path: string, enabled?: boolean) =>
    useQuery<MapDetail>({
        queryKey: ['tournament', 'maps', path],
        queryFn: async () => await liquipedia.aoe.getMap(path),
        enabled: tournamentsEnabled && enabled,
    });

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
