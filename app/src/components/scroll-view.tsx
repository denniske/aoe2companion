import tw from '@app/tailwind';
import { forwardRef } from 'react';
import { ScrollView as ScrollViewRN, ScrollViewProps as ScrollViewPropsRN } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScrollViewProps extends Omit<ScrollViewPropsRN, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const ScrollView = forwardRef(({ contentContainerStyle, ...props }: ScrollViewProps, ref: React.ForwardedRef<ScrollViewRN>) => {
    const { bottom } = useSafeAreaInsets();
    console.log(tw.style(contentContainerStyle));

    return (
        <ScrollViewRN
            contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }}
            contentContainerStyle={tw.style(contentContainerStyle)}
            {...props}
            ref={ref}
        />
    );
});
