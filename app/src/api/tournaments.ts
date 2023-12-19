import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Liquipedia, Match, TournamentCategory, TournamentDetail, TournamentSection } from 'liquipedia';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';

const liquipedia = new Liquipedia({
    USER_AGENT: `${Application.applicationName}/${Application.nativeApplicationVersion} (hello@aoe2companion.com)`,
});

export const useTournaments = (category: TournamentCategory | undefined) =>
    useQuery<TournamentSection[]>({
        queryKey: ['tournaments', category],
        staleTime: 120000,
        queryFn: async () => ((await category) ? liquipedia.aoe.getTournaments(category) : liquipedia.aoe.getAllTournaments()),
    });

export const useTournament = (id: string, enabled?: boolean) =>
    useQuery<TournamentDetail>({ queryKey: ['tournament', id], queryFn: async () => await liquipedia.aoe.getTournament(id), enabled });

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
