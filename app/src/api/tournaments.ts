import { sortByStatus, sortByTier, sortedTiers } from '@app/helper/tournaments';
import { appConfig } from '@nex/dataset';
import { UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Application from 'expo-application';
import { GameVersion, Liquipedia, Match, Tournament, TournamentCategory, TournamentDetail, TournamentSection } from 'liquipedia';
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const liquipedia = new Liquipedia({
    USER_AGENT: `${Application.applicationName}/${Application.nativeApplicationVersion} (hello@aoe2companion.com)`,
});

export const useTournaments = (category: TournamentCategory | undefined) =>
    useQuery<TournamentSection[]>({
        queryKey: ['tournaments', category],
        queryFn: async () => await liquipedia.aoe.getTournaments(category ?? sortedTiers[0]),
        enabled: Platform.OS === 'web' ? false : !!category,
    });

export const useUpcomingTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getUpcomingTournaments(appConfig.game === 'aoe2de' ? GameVersion.Age2 : GameVersion.Age4),
        enabled: Platform.OS === 'web' ? false : undefined,
    });

export const useFeaturedTournament = () => {
    return useFeaturedTournaments().data[0];
};

export const useFeaturedTournaments = () => {
    const { data: tournaments, ...query } = useUpcomingTournaments();

    return { data: orderBy(tournaments, [sortByTier, sortByStatus], ['asc', 'asc']), ...query };
};

export const useAllTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getAllTournaments(),
        enabled: Platform.OS === 'web' ? false : undefined,
    });

export const useTournament = (id: string, enabled?: boolean) => {
    const [currentId, setCurrentId] = useState(id);
    const queryClient = useQueryClient();
    const query = useQuery<TournamentDetail>({
        queryKey: ['tournament', id],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getTournament(id),
        enabled: Platform.OS === 'web' ? false : enabled,
    });

    useEffect(() => {
        if (!query.isFetching) {
            setCurrentId(id);
        }
    }, [query.isFetching, id]);
    const cachedData: TournamentDetail | undefined = queryClient.getQueryData(['tournament', currentId]);
    const data: TournamentDetail | undefined = query.data ?? cachedData;

    return { ...query, data };
};

export const useTournamentMatches = (enabled?: boolean) =>
    useQuery<Match[]>({
        queryKey: ['tournament', 'matches'],
        queryFn: async () => await liquipedia.aoe.getMatches(),
        enabled: Platform.OS === 'web' ? false : enabled,
        staleTime: 60000,
        refetchOnWindowFocus: true,
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
