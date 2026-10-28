import { fetchLeaderboard } from '@app/api/helper/api';
import useDebounce from '@app/hooks/use-debounce';
import { useLanguage } from '@app/queries/all';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'lodash';

// The player list behind a search box, shared by the web table and the native
// search results. `params` is the country/clan/following selection both screens
// already build for their own queries.
export function useLeaderboardSearch({
    leaderboardId,
    params,
    search,
    enabled = true,
}: {
    leaderboardId: string | null;
    params: Record<string, any>;
    search: string;
    enabled?: boolean;
}) {
    const debouncedSearch = useDebounce(search, 600);
    const language = useLanguage();

    const query = useInfiniteQuery({
        queryKey: ['leaderboard-players', debouncedSearch, leaderboardId, params],
        queryFn: (context) => {
            return fetchLeaderboard({
                ...context,
                ...params,
                pageParam: `${context.pageParam}`,
                search: context.queryKey[1] as string,
                leaderboardId: context.queryKey[2] as string,
                extend: ['players.avatar_medium_url'],
                language: language!,
            });
        },
        enabled: !!language && !!leaderboardId && enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage.players.length === lastPage.perPage ? lastPage.page + 1 : null),
    });

    const players = flatten(query.data?.pages?.map((p) => p.players) || []);
    const isLoading = (query.isFetching && !query.isFetchingNextPage) || debouncedSearch !== search;

    return { ...query, players, isLoading };
}
