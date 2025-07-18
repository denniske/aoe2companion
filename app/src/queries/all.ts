import { useQuery } from '@tanstack/react-query';
import {
    fetchMatch,
    fetchMatchAnalysis,
    fetchMatchAnalysisSvg,
    fetchProfile,
    fetchProfiles,
} from '@app/api/helper/api';
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
        staleTime: 10 * 1000, // 10s
    });

export const useAccountData = <T>(select?: (data: IAccount) => T) =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
        select,
        staleTime: 10 * 1000, // 10s
    }).data;

export const useAuthProfileId = () => useAccountData((data) => data.profileId);
export const useLanguage = () => useAccountData((data) => data.language);

export const useFollowedAndMeProfileIds = () => useAccountData((data) => {
    return compact(uniq([data.profileId, ...data.followedPlayers.map((f) => f.profileId)]))
});

export const useAuthLinkSteam = (params: any) =>
    useQuery({
        queryKey: ['authLinkSteam'],
        queryFn: async () => await authLinkSteam(params),
    });

export const useProfile = (profileId: number, extend: string = 'avatar_medium_url,avatar_full_url') =>
    useQuery({
        queryKey: ['profile', profileId],
        queryFn: () => fetchProfile({ profileId, extend }),
        enabled: !!profileId,
    });

export const useMatch = (matchId: number) =>
    useQuery({
        queryKey: ['match', matchId],
        queryFn: () => fetchMatch({ matchId }),
        enabled: !!matchId,
    });

export const useMatchAnalysis = (matchId: number, enabled: boolean) =>
    useQuery({
        queryKey: ['match', matchId, 'analysis'],
        queryFn: () => fetchMatchAnalysis({ matchId }),
        enabled: !!matchId && enabled,
    });

export const useMatchAnalysisSvg = (matchId: number, enabled: boolean) =>
    useQuery({
        queryKey: ['match', matchId, 'analysis', 'svg'],
        queryFn: () => fetchMatchAnalysisSvg({ matchId }),
        enabled: !!matchId && enabled,
    });

export const useProfileFast = (profileId?: number, extend: string = 'profiles.avatar_medium_url,profiles.avatar_full_url') =>
    useQuery({
        queryKey: ['profile-fast', profileId],
        queryFn: async () => { return (await fetchProfiles({ profileId, extend })).profiles[0]; },
        enabled: !!profileId,
    });

export const useProfiles = (profileIds?: number[], extend: string = 'profiles.avatar_medium_url,profiles.avatar_full_url') =>
    useQuery({
        queryKey: ['profiles', profileIds?.join(',')],
        queryFn: async () => { return (await fetchProfiles({ profileId: profileIds?.join(','), extend })).profiles; },
        // enabled: !!profileId,
    });

export const useProfileWithStats = (profileId: number, isFocused: boolean) =>
    useQuery({
        queryKey: ['profile-with-stats', profileId],
        queryFn: () => fetchProfile({ profileId, extend: 'stats,profiles.avatar_medium_url,profiles.avatar_full_url' }),
        enabled: isFocused,
    });


export function useWithRefetching<TData, TError>(result: UseQueryResult<TData, TError>) {
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
