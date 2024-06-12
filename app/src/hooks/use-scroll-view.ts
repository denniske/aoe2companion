import tw from '@app/tailwind';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScroll } from './use-scrollable';

export interface UseScrollViewProps extends Pick<ScrollViewProps, 'horizontal' | 'onScroll' | 'onLayout'> {
    contentContainerStyle?: string;
    ref: React.ForwardedRef<any>;
}
export const useScrollView = ({
    contentContainerStyle,
    horizontal,
    onScroll,
    onLayout,
    ref,
}: UseScrollViewProps): Omit<ScrollViewProps, 'hitSlop'> & { ref: React.RefObject<any> } => {
    const scrollViewRef = useRef<ScrollView>(null);
    const { bottom } = useSafeAreaInsets();
    const style = tw.style(contentContainerStyle);
    const bottomOffset = horizontal ? 0 : bottom + 82;
    const paddingBottom = ((style.paddingBottom || 0) as number) + (Platform.OS === 'ios' ? 0 : bottomOffset);
    const { setScrollPosition, scrollToTop } = useScroll();
    const [localScrollPosition, setLocalScrollPosition] = useState<number>();
    const [scrollReady, setScrollReady] = useState(false);

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
        contentContainerStyle: { ...style, paddingBottom },
        ref: (ref || scrollViewRef) as React.RefObject<any>,
    };
};
