import { useQuery } from '@tanstack/react-query';
import { fetchAccount, IAccount } from '@app/api/account';

// Kept out of all.ts so modules that all.ts imports can use these without a require cycle.
export const QUERY_KEY_ACCOUNT = () => ['account'];

export const useAccountData = <T>(select?: (data: IAccount) => T) =>
    useQuery({
        queryKey: QUERY_KEY_ACCOUNT(),
        queryFn: async () => await fetchAccount(),
        select,
        staleTime: 10 * 1000, // 10s
    }).data;

export const useLanguage = () => useAccountData((data) => data.language);
