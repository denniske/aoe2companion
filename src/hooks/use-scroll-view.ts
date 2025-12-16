import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, ScrollViewProps, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useMutateScroll, useScrollToTop } from '@app/redux/reducer';
import { useShowTabBar } from './use-show-tab-bar';

export interface UseScrollViewProps extends Pick<ScrollViewProps, 'horizontal' | 'onScroll' | 'onLayout' | 'scrollEnabled'> {
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
}: UseScrollViewProps): Omit<ScrollViewProps, 'hitSlop'> & { ref: React.RefObject<any> } & { initialNumToRender?: number } => {
    const showTabBar = useShowTabBar();
    const shouldDisableScroll = !showTabBar && !horizontal;
    const scrollViewRef = useRef<ScrollView>(null);
    const { bottom } = useSafeAreaInsets();
    // const tw = useTw();
    // const style = tw.style(contentContainerStyle);
    const bottomOffset = horizontal || shouldDisableScroll ? 0 : bottom + 82;
    const paddingBottom = (horizontal ? 10 : 20) + (Platform.OS === 'ios' ? 0 : bottomOffset);
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
    }, [scrollToTop, horizontal]);

    useFocusEffect(
        useCallback(() => {
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
        }, [localScrollPosition, scrollReady, horizontal])
    );

    return {
        onLayout: (e) => {
            onLayout?.(e);
            setScrollReady(true);
        },
        scrollEventThrottle: 16,
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
        contentInset: { bottom: bottomOffset },
        contentContainerStyle: !shouldDisableScroll && { paddingBottom },
        ref: (ref || scrollViewRef) as React.RefObject<any>,
        style: [shouldDisableScroll && { overflow: 'visible', overflowX: 'clip' }, horizontal && { marginBottom: -10 }],
        scrollEnabled: !shouldDisableScroll && scrollEnabled,
        initialNumToRender: shouldDisableScroll ? 1000 : undefined,
    };
};
