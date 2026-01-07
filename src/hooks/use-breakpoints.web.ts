import { breakpoints } from '@app/helper/breakpoints';
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from 'react-spring';

/** Hook options. */
type UseMediaQueryOptions = {
    /**
     * The default value to return if the hook is being run on the server.
     * @default false
     */
    defaultValue?: boolean;
    /**
     * If `true` (default), the hook will initialize reading the media query. In SSR, you should set it to `false`, returning `options.defaultValue` or `false` initially.
     * @default true
     */
    initializeWithValue?: boolean;
};

export function useMediaQuery(query: string, { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}): boolean {
    const getMatches = (query: string): boolean => {
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState<boolean>(() => {
        if (initializeWithValue) {
            return getMatches(query);
        }
        return defaultValue;
    });

    // Handles the change event of the media query.
    function handleChange() {
        setMatches(getMatches(query));
    }

    useIsomorphicLayoutEffect(() => {
        const matchMedia = window.matchMedia(query);

        // Triggered at the first client-side load and if query changes
        handleChange();

        // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
        if (matchMedia.addListener) {
            matchMedia.addListener(handleChange);
        } else {
            matchMedia.addEventListener('change', handleChange);
        }

        return () => {
            if (matchMedia.removeListener) {
                matchMedia.removeListener(handleChange);
            } else {
                matchMedia.removeEventListener('change', handleChange);
            }
        };
    }, [query]);

    return matches;
}

const getRemValue = (key: keyof typeof breakpoints) => `${breakpoints[key] / 16}rem`

export const useBreakpoints = () => ({
    isSmall: useMediaQuery(`(width >= ${getRemValue('sm')})`),
    isMedium: useMediaQuery(`(width >= ${getRemValue('md')})`),
    isLarge: useMediaQuery(`(width >= ${getRemValue('lg')})`),
    isExtraLarge: useMediaQuery(`(width >= ${getRemValue('xl')})`),
});
