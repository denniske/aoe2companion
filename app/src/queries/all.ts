import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchProfiles } from '@app/api/helper/api';
import { authLinkSteam, fetchAccount, IAccount } from '@app/api/account';
import { compact, uniq } from 'lodash';
import type { UseQueryResult } from '@tanstack/react-query/src/types';
import { useState } from 'react';


export const QUERY_KEY_ACCOUNT = () => ['account'];
// export const QUERY_KEY_TODO = (todoId?: number) => ['todo', todoId];

export const useAccount = () =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
    });

export const useAccountData = <T>(select?: (data: IAccount) => T) =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
        select,
    }).data;

export const useAuthProfileId = () => useAccountData((data) => data.profileId);

export const useFollowedAndMeProfileIds = () => useAccountData((data) => {
    return compact(uniq([data.profileId, ...data.followedPlayers.map((f) => f.profileId)]))
});

export const useAuthLinkSteam = (params: any) =>
    useQuery({
        queryKey: ['authLinkSteam'],
        queryFn: async () => await authLinkSteam(params),
    });

export const useProfile = (profileId: number) =>
    useQuery({
        queryKey: ['profile', profileId],
        queryFn: () => fetchProfile({ profileId }),
    });

export const useProfileFast = (profileId?: number) =>
    useQuery({
        queryKey: ['profile', profileId],
        queryFn: async () => { return (await fetchProfiles({ profileId })).profiles[0]; },
        enabled: !!profileId,
    });

export const useProfileWithStats = (profileId: number, isFocused: boolean) =>
    useQuery({
        queryKey: ['profile-with-stats', profileId],
        queryFn: () => fetchProfile({ profileId, extend: 'stats' }),
        enabled: isFocused,
    });


export function withRefetching<TData, TError>(result: UseQueryResult<TData, TError>) {
    const [isRefetching, setIsRefetching] = useState(false);
    const refetch = async () => {
        setIsRefetching(true);
        await result.refetch();
        setIsRefetching(false);
    }
    return {
        ...result,
        refetch,
        isRefetching,
    };
}
