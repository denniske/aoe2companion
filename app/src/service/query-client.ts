import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            // retry: (failureCount, error) => {
            //     if (error.message == 'Unauthorized') return false;
            //     if (failureCount < 2) return true;
            //     return false;
            // }
        },
    },
});
