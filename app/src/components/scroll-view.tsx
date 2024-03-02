import { styled } from 'nativewind';
import { forwardRef } from 'react';
import { ScrollView as ScrollViewRN, ScrollViewProps as ScrollViewPropsRN } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScrollViewProps extends Omit<ScrollViewPropsRN, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

const StyledScrollView = styled(ScrollViewRN, { props: { contentContainerStyle: true } });

export const ScrollView = forwardRef((props: ScrollViewProps, ref: React.ForwardedRef<ScrollViewRN>) => {
    const { bottom } = useSafeAreaInsets();

    return <StyledScrollView contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }} {...props} ref={ref} />;
});
