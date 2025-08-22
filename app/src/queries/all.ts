import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboards, fetchMatch, fetchMatchAnalysis, fetchMatchAnalysisSvg, fetchProfile, fetchProfiles } from '@app/api/helper/api';
import { fetchAccount, IAccount } from '@app/api/account';
import { compact, uniq } from 'lodash';
import type { UseQueryResult } from '@tanstack/react-query/src/types';
import { useState } from 'react';


export const QUERY_KEY_ACCOUNT = () => ['account'];

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

export const useProfile = (profileId: number, extend: string = 'avatar_medium_url,avatar_full_url') => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profile', profileId],
        queryFn: () => fetchProfile({ language: language!, profileId, extend }),
        enabled: !!language && !!profileId,
    });
};

export const useMatch = (matchId: number) => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['match', matchId],
        queryFn: () => fetchMatch({ language: language!, matchId }),
        enabled: !!language && !!matchId,
    });
};

export const useLeaderboards = () => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['leaderboards'],
        queryFn: () => fetchLeaderboards({ language: language! }),
        enabled: !!language,
    });
};

export const useMatchAnalysis = (matchId: number, enabled: boolean) => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['match', matchId, 'analysis'],
        queryFn: () => fetchMatchAnalysis({ language: language!, matchId }),
        enabled: !!language && !!matchId && enabled,
    });
};

export const useMatchAnalysisSvg = (matchId: number, enabled: boolean) => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['match', matchId, 'analysis', 'svg'],
        queryFn: () => fetchMatchAnalysisSvg({ language: language!, matchId }),
        enabled: !!language && !!matchId && enabled,
    });
};

export const useProfileFast = (profileId?: number, extend: string = 'profiles.avatar_medium_url,profiles.avatar_full_url') => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profile-fast', profileId],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, profileIds: [profileId!], extend })).profiles[0];
        },
        enabled: !!language && !!profileId,
    });
};

export const useProfiles = (profileIds?: number[], extend: string = 'profiles.avatar_medium_url,profiles.avatar_full_url') => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profiles', profileIds],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, profileIds, extend })).profiles;
        },
        enabled: !!language && !!profileIds && profileIds.length > 0,
    });
};

export const useProfilesByLiquipediaNames = (liquipediaNames?: string[], extend: string = 'profiles.avatar_medium_url,profiles.avatar_full_url') => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profiles', liquipediaNames],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, liquipediaNames, extend })).profiles;
        },
        enabled: !!language && !!liquipediaNames,
    });
};

export const useProfileWithStats = (profileId: number, isFocused: boolean) => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profile-with-stats', profileId],
        queryFn: () => fetchProfile({ language: language!, profileId, extend: 'stats,profiles.avatar_medium_url,profiles.avatar_full_url' }),
        enabled: !!language && isFocused,
    });
};


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
