import { useScrollView } from '@app/hooks/use-scroll-view';
import { forwardRef } from 'react';
import { ScrollView as ScrollViewRN, ScrollViewProps as ScrollViewPropsRN } from 'react-native';

export interface ScrollViewProps extends Omit<ScrollViewPropsRN, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const ScrollView = forwardRef(({ contentContainerStyle, ...props }: ScrollViewProps, ref: React.ForwardedRef<ScrollViewRN>) => {
    const scrollViewProps = useScrollView({ contentContainerStyle, ref, ...props });

    return <ScrollViewRN {...props} {...scrollViewProps} />;
});
