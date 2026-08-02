import { QueryClient } from '@tanstack/react-query';

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
                if (failureCount < 2) return true;
                return false;
            }
        },
    },
});
