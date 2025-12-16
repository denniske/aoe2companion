import { useScrollView } from '@app/hooks/use-scroll-view';
import { containerScrollClassName } from '@app/styles';
import { forwardRef } from 'react';
import { ScrollView as ScrollViewRN, ScrollViewProps as ScrollViewPropsRN } from 'react-native';
import cn from 'classnames';

export interface ScrollViewProps extends Omit<ScrollViewPropsRN, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const ScrollView = forwardRef(
    ({ contentContainerStyle, contentContainerClassName, ...props }: ScrollViewProps, ref: React.ForwardedRef<ScrollViewRN>) => {
        const scrollViewProps = useScrollView({ contentContainerStyle, ref, ...props });

        return (
            <ScrollViewRN
                {...props}
                {...scrollViewProps}
                contentContainerClassName={cn(!props.horizontal && containerScrollClassName, contentContainerClassName)}
            />
        );
    }
);
