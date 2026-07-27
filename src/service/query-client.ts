import { QueryClient } from '@tanstack/react-query';
import { getRateLimitRetryDelay, isRateLimitError } from '@app/api/util';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // Must stay >= the Cloudflare edge TTL on the data host (15s). Below it, a screen can
            // remount after an explicit refresh, refetch the un-busted URL, and be handed the edge's
            // older copy -- so the user watches data they just refreshed roll backwards.
            // Every non-data-host query already declares its own staleTime, so this default lands on
            // the data.aoe2companion.com queries and leaves the rest untouched.
            staleTime: 60 * 1000,
            // retry: 0,
            retry: (failureCount, error) => {
                console.log('retry', failureCount, error);
                if ((error as any).status === 404) return false;
                if (error.message == 'Unauthorized') return false;
                if ((error as any).code == 'PARSER_LIBRARY_ERROR') return false;
                // Every retry is counted by the rate limiter too, so retrying a rejected request is
                // what keeps the window full. Allow a single one, delayed past the window below.
                if (isRateLimitError(error)) return failureCount < 1;
                if (failureCount < 2) return true;
                return false;
            },
            retryDelay: (failureCount, error) => {
                if (isRateLimitError(error)) return getRateLimitRetryDelay(error);
                return Math.min(1000 * 2 ** failureCount, 30_000);
            },
        },
    },
});
