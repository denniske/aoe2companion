import { queryClient } from '@app/service/query-client';
import { QUERY_KEY_ACCOUNT } from '@app/queries/all';

export function getInternalLanguage() {
    const account = queryClient.getQueryData<Record<string, string>>(QUERY_KEY_ACCOUNT());
    // console.log('getlanguage', account?.language || 'en');
    return account?.language || 'en';
}

