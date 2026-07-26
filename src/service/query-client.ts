import { QueryClient } from '@tanstack/react-query';
import { getRateLimitRetryDelay, isRateLimitError } from '@app/api/util';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
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
