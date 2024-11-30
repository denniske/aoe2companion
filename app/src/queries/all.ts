import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchProfiles } from '@app/api/helper/api';
import { authLinkSteam, fetchAccount, IAccount } from '@app/api/account';


export const QUERY_KEY_ACCOUNT = () => ['account'];
// export const QUERY_KEY_TODO = (todoId?: number) => ['todo', todoId];

export const useAccount = () =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
    });

export const useAccountData = (select?: (data: IAccount) => any) =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
        select,
    }).data;

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

export const useProfileFast = (profileId: number) =>
    useQuery({
        queryKey: ['profile', profileId],
        queryFn: async () => { return (await fetchProfiles({ profileId })).profiles[0]; },
    });

export const useProfileWithStats = (profileId: number) =>
    useQuery({
        queryKey: ['profile-with-stats', profileId],
        queryFn: () => fetchProfile({ profileId, extend: 'stats' }),
        enabled: false, // Remove this
    });

