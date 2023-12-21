import { UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { Liquipedia, Match, Tournament, TournamentCategory, TournamentDetail, TournamentSection } from 'liquipedia';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';
import { compact, pickBy } from 'lodash';

const liquipedia = new Liquipedia({
    USER_AGENT: `${Application.applicationName}/${Application.nativeApplicationVersion} (hello@aoe2companion.com)`,
});

export const useTournaments = (category: TournamentCategory | undefined) =>
    useQuery<TournamentSection[]>({
        queryKey: ['tournaments', category],
        queryFn: async () => await liquipedia.aoe.getTournaments(category),
        enabled: !!category,
    });

export const useAllTournaments = () =>
    useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        staleTime: 120000,
        queryFn: async () => await liquipedia.aoe.getAllTournaments(),
    });

export const useTournament = (id: string, enabled?: boolean) => {
    const [currentId, setCurrentId] = useState(id);
    const queryClient = useQueryClient();
    const query = useQuery<TournamentDetail>({ queryKey: ['tournament', id], queryFn: async () => await liquipedia.aoe.getTournament(id), enabled });

    useEffect(() => {
        if (!query.isFetching) {
            setCurrentId(id);
        }
    }, [query.isFetching]);
    const cachedData: TournamentDetail | undefined = queryClient.getQueryData(['tournament', currentId]);
    const data: TournamentDetail | undefined = query.data ?? cachedData;

    return { ...query, data };
};

export const useTournamentMatches = (enabled?: boolean) =>
    useQuery<Match[]>({ queryKey: ['tournament', 'matches'], queryFn: async () => await liquipedia.aoe.getMatches(), enabled, staleTime: 60000 });

export function useRefreshControl({ isFetching, refetch }: Pick<UseQueryResult, 'isFetching' | 'refetch'>) {
    const [refreshing, setFetching] = useState(isFetching ? true : false);
    const onRefresh = () => {
        setFetching(true);
        refetch();
    };

    useEffect(() => {
        setFetching(isFetching ? true : false);
    }, [isFetching]);

    return { refreshing, onRefresh };
}
