import { useScroll } from '@app/hooks/use-scrollable';
import tw from '@app/tailwind';
import { forwardRef } from 'react';
import { ScrollView as ScrollViewRN, ScrollViewProps as ScrollViewPropsRN, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScrollViewProps extends Omit<ScrollViewPropsRN, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const ScrollView = forwardRef(({ contentContainerStyle, ...props }: ScrollViewProps, ref: React.ForwardedRef<ScrollViewRN>) => {
    const { bottom } = useSafeAreaInsets();
    const style = tw.style(contentContainerStyle);
    const bottomOffset = props.horizontal ? 0 : bottom + 82;
    const paddingBottom = ((style.paddingBottom || 0) as number) + (Platform.OS === 'ios' ? 0 : bottomOffset);
    const { setScrollPosition } = useScroll();

    return (
        <ScrollViewRN
            scrollEventThrottle={16}
            onScroll={({ nativeEvent: { contentInset, contentSize, contentOffset, layoutMeasurement } }) => {
                if (contentSize.height - (layoutMeasurement.height - contentInset.bottom) > 100) {
                    setScrollPosition(contentOffset.y);
                } else {
                    setScrollPosition(0);
                }
            }}
            contentInset={{ bottom: bottomOffset }}
            contentContainerStyle={{ ...style, paddingBottom }}
            {...props}
            ref={ref}
        />
    );
});
