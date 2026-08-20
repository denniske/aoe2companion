import { useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, ScrollViewProps, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useMutateScroll, useScrollToTop } from '@app/redux/reducer';
import { useShowTabBar } from './use-show-tab-bar';

export interface UseScrollViewProps extends Pick<ScrollViewProps, 'horizontal' | 'onScroll' | 'onLayout' | 'scrollEnabled' | 'scrollEventThrottle'> {
    contentContainerStyle?: string;
    ref: React.ForwardedRef<any>;
}
export const useScrollView = ({
    contentContainerStyle,
    horizontal,
    onScroll,
    onLayout,
    ref,
    scrollEnabled,
    scrollEventThrottle,
}: UseScrollViewProps): Omit<ScrollViewProps, 'hitSlop'> & { ref: React.RefObject<any> } & { initialNumToRender?: number } => {
    const showTabBar = useShowTabBar();
    const shouldDisableScroll = !showTabBar && !horizontal;
    const scrollViewRef = useRef<ScrollView>(null);
    const { bottom } = useSafeAreaInsets();

    // const tw = useTw();
    // const style = tw.style(contentContainerStyle);
    // const paddingBottom = ((style.paddingBottom || 0) as number) + (Platform.OS === 'ios' ? 0 : bottomOffset);

    const bottomOffset = horizontal || shouldDisableScroll ? 0 : bottom + 82;
    const paddingBottom = 20 + (Platform.OS === 'ios' ? bottomOffset - 20 : bottomOffset);
    const scrollToTop = useScrollToTop();
    const { setScrollPosition } = useMutateScroll();
    const [localScrollPosition, setLocalScrollPosition] = useState<number>();
    const [scrollReady, setScrollReady] = useState(false);

    // console.log('USE SCROLL VIEW', scrollToTop, 'localScrollPosition', localScrollPosition, 'scrollReady', scrollReady);

    useEffect(() => {
        if (scrollToTop && !horizontal) {
            const scrollView = ((ref || scrollViewRef) as React.RefObject<ScrollView>).current?.getScrollResponder() as ScrollView;
            scrollView?.scrollTo({
                y: 0,
                animated: true,
            });
        }
    }, [scrollToTop, horizontal, ref]);

    useFocusEffect(() => {
        if (!horizontal) {
            if (localScrollPosition === undefined) {
                if (scrollReady) {
                    setTimeout(() => {
                        setLocalScrollPosition((localScrollPosition) => (localScrollPosition === undefined ? 0 : localScrollPosition));
                    }, 100);
                }
            } else {
                setScrollPosition(localScrollPosition);
            }
        }
    });

    return {
        onLayout: (e) => {
            onLayout?.(e);
            setScrollReady(true);
        },
        // flat-list.tsx spreads these *after* the caller's props, so a hardcoded
        // value here silently overrode any scrollEventThrottle a screen set for
        // itself. The leaderboard asks for 500 precisely because every scroll
        // event re-renders a list of tens of thousands of rows; it was getting 16
        // and re-rendering ~60x/second while flinging.
        scrollEventThrottle: scrollEventThrottle ?? 16,
        onScroll: (event) => {
            onScroll?.(event);
            if (!horizontal) {
                const { contentInset, contentSize, contentOffset, layoutMeasurement } = event.nativeEvent;

                if (contentSize.height - (layoutMeasurement.height - (contentInset?.bottom ?? 0)) > 100) {
                    setLocalScrollPosition(contentOffset.y < 100 ? 0 : 1);
                } else {
                    setLocalScrollPosition(0);
                }
            }
        },

        // only iOS
        automaticallyAdjustContentInsets: false,
        automaticallyAdjustsScrollIndicatorInsets: false,
        contentInset: { bottom: 0 }, // content inset gets reset after hot reload so we use padding bottom instead like on android
        scrollIndicatorInsets: { bottom: bottomOffset },

        contentContainerStyle: !shouldDisableScroll && !horizontal && { paddingBottom },
        ref: (ref || scrollViewRef) as React.RefObject<any>,
        style: [shouldDisableScroll && { overflow: 'visible', overflowX: 'clip' }],
        scrollEnabled: !shouldDisableScroll && scrollEnabled,
        initialNumToRender: shouldDisableScroll ? 1000 : undefined,
    };
};
