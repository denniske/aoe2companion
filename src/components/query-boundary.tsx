import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Component, ReactNode, Suspense } from 'react';
import { View } from 'react-native';

import { Text } from './text';

interface ErrorBoundaryProps {
    onReset: () => void;
    fallback: (props: { error: Error; reset: () => void }) => ReactNode;
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    reset = () => {
        this.props.onReset();
        this.setState({ error: null });
    };

    render() {
        if (this.state.error) {
            return this.props.fallback({ error: this.state.error, reset: this.reset });
        }
        return this.props.children;
    }
}

interface QueryBoundaryProps {
    children: ReactNode;
    /** Shown while suspense queries below are loading. */
    loadingFallback?: ReactNode;
    /**
     * Shown when a suspense query below throws. `retry` resets the react-query
     * error state and re-mounts the children, triggering a refetch.
     */
    errorFallback?: (props: { error: Error; retry: () => void }) => ReactNode;
}

/**
 * Wraps children in an error boundary + Suspense boundary so `useSuspenseQuery`
 * / `useSuspenseQueries` can be used safely. Keep it colocated around the
 * smallest section that owns the data, not around a whole screen — that way the
 * loading and error fallbacks stay next to the component they belong to.
 */
export function QueryBoundary({ children, loadingFallback = null, errorFallback }: QueryBoundaryProps) {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    onReset={reset}
                    fallback={({ error, reset: retry }) =>
                        errorFallback ? (
                            errorFallback({ error, retry })
                        ) : (
                            <View className="p-4">
                                <Text variant="body">Something went wrong.</Text>
                            </View>
                        )
                    }
                >
                    <Suspense fallback={loadingFallback}>{children}</Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
}
