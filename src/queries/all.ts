import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
    fetchBuilds,
    fetchLeaderboards,
    fetchMaps,
    fetchMapsPoll,
    fetchMapsRanked,
    fetchMatch,
    fetchMatchAnalysis,
    fetchMatchAnalysisSvg,
    fetchProfile,
    fetchProfiles,
} from '@app/api/helper/api';
import { fetchAccount, IAccount } from '@app/api/account';
import { compact, uniq } from 'lodash';
import type { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { appConfig } from '@nex/dataset';

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

export const useFollowedAndMeProfileIds = () =>
    useAccountData((data) => {
        return compact(uniq([data.profileId, ...data.followedPlayers.map((f) => f.profileId)]));
    });

export const useProfile = (profileId: number, extend: string = 'avatar_medium_url,avatar_full_url') => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['profile', profileId, extend],
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

export const useProfileFast = (profileId: number | null | undefined, enabled: boolean = true) => {
    const language = useLanguage();
    const extend = 'profiles.avatar_medium_url,profiles.avatar_full_url';
    return useQuery({
        queryKey: ['profile-fast', profileId],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, profileIds: [profileId!], extend })).profiles[0];
        },
        enabled: !!language && !!profileId && enabled,
    });
};

export const useProfilesBySearchInfiniteQuery = (search?: string) => {
    const language = useLanguage();
    const extend = 'profiles.avatar_medium_url,profiles.avatar_full_url';
    return useInfiniteQuery({
        queryKey: ['profiles-by-search', search],
        queryFn: (context) =>
            fetchProfiles({
                ...context,
                search,
                extend,
                language: language!,
            }),
        enabled: !!language && !!search && search.length >= 2,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => (lastPage.profiles.length === lastPage.perPage ? lastPage.page + 1 : null),
        placeholderData: keepPreviousData,
    });
};

export const useProfilesBySteamId = (steamId?: string, enabled: boolean = true) => {
    const language = useLanguage();
    const extend = 'profiles.avatar_medium_url,profiles.avatar_full_url';
    return useQuery({
        queryKey: ['profiles-by-steamid', steamId],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, steamId, extend })).profiles;
        },
        enabled: !!language && !!steamId && steamId.length > 10,
    });
};

export const useProfilesByProfileIds = (profileIds?: number[], enabled: boolean = true) => {
    const language = useLanguage();
    const extend = 'profiles.avatar_medium_url,profiles.avatar_full_url';
    return useQuery({
        queryKey: ['profiles-by-profileids', profileIds],
        queryFn: async () => {
            return (await fetchProfiles({ language: language!, profileIds, extend })).profiles;
        },
        enabled: !!language && !!profileIds && profileIds.length > 0,
    });
};

export const useProfilesByLiquipediaNames = (liquipediaNames?: string[], enabled: boolean = true) => {
    const language = useLanguage();
    const extend = 'profiles.avatar_medium_url,profiles.avatar_full_url';
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
    const extend = 'stats,profiles.avatar_medium_url,profiles.avatar_full_url';
    return useQuery({
        queryKey: ['profile-with-stats', profileId],
        queryFn: () => fetchProfile({ language: language!, profileId, extend }),
        enabled: !!language && isFocused,
    });
};

export function useWithRefetching<TData, TError>(result: UseQueryResult<TData, TError>) {
    const [isRefetching, setIsRefetching] = useState(false);
    const refetch = async () => {
        setIsRefetching(true);
        await result.refetch();
        setIsRefetching(false);
    };
    return {
        ...result,
        refetch,
        isRefetching,
    };
}

export const useMaps = () => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['maps'],
        queryFn: () => fetchMaps({ language: language! }),
        enabled: !!language,
    });
};

export const useMapsRanked = () => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['maps-ranked'],
        queryFn: () => fetchMapsRanked({ language: language! }),
        enabled: !!language && appConfig.game === 'aoe2',
    });
};

export const useMapsPoll = () => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['maps-poll'],
        queryFn: () => fetchMapsPoll({ language: language! }),
        enabled: !!language && appConfig.game === 'aoe2',
    });
};

interface IFetchBuildsParams {
    build_ids?: string[];
    civilization?: string;
    attribute?: string;
    difficulty?: string;
    search?: string;
}

export function removeUndefinedOrNullOrEmptyString<T extends object>(params: T): T {
    return Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ) as T;
}

export const useInfiniteBuilds = (params: IFetchBuildsParams) => {
    return useInfiniteQuery({
        queryKey: ['builds', removeUndefinedOrNullOrEmptyString(params)],
        queryFn: (context) => fetchBuilds({
            ...context,
            ...removeUndefinedOrNullOrEmptyString(params),
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => (lastPage.builds.length === lastPage.perPage ? lastPage.page + 1 : null),
        placeholderData: keepPreviousData,
    });
};

export const useBuild = (buildId: string) => {
    const language = useLanguage();
    return useQuery({
        queryKey: ['build', buildId],
        queryFn: async () => (await fetchBuilds({ build_ids: [buildId] })).builds[0],
        enabled: !!language && !!buildId,
    });
};

const civDataFileMapping = {
    AbbasidDynasty: 'abbasid',
    Chinese: 'chinese',
    DelhiSultanate: 'delhi',
    English: 'english',
    French: 'french',
    HolyRomanEmpire: 'hre',
    Mongols: 'mongols',
    Rus: 'rus',
    Malians: 'malians',
    Ottomans: 'ottomans',
    Byzantines: 'byzantines',
    Japanese: 'japanese',
    JeanneDArc: 'jeannedarc',
    Ayyubids: 'ayyubids',
    ZhuXiSLegacy: 'zhuxi',
    OrderOfTheDragon: 'orderofthedragon',
    HouseOfLancaster: 'lancaster',
    KnightsTemplar: 'templar',
    SengokuDaimyo: 'sengoku',
    TughlaqDynasty: 'tughlaq',
    GoldenHorde: 'goldenhorde',
    MacedonianDynasty: 'macedonian',
} as const;

export const useAoe4CivData = () =>
    useQuery({
        queryKey: ['aoe4-civ-data'],
        queryFn: async () => {
            const entries = Object.entries(civDataFileMapping);

            const results = await Promise.all(
                entries.map(async ([key, slug]) => {
                    const res = await fetch(
                        `https://raw.githubusercontent.com/aoe4world/data/main/civilizations/${slug}.json`
                    );
                    if (!res.ok) throw new Error(`Failed to fetch ${slug}`);
                    const data = await res.json();
                    return [key, data] as const;
                })
            );

            return Object.fromEntries(results) as Record<
                string,
                { classes: string }
            >;
        },
        staleTime: 3600 * 1000, // 1 hour
        enabled: appConfig.game === 'aoe4',
    }).data;
