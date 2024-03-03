import { useScroll } from '@app/hooks/use-scrollable';
import tw from '@app/tailwind';
import { forwardRef } from 'react';
import { SectionList as SectionListRN, SectionListProps as SectionListPropsRN, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SectionListRef<ItemT = any> = React.RefObject<SectionListRN<ItemT> | null>;
export interface SectionListProps<ItemT> extends Omit<SectionListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const SectionList = forwardRef(SectionListInner) as <ItemT>(
    props: SectionListProps<ItemT> & { ref?: React.ForwardedRef<SectionListRN<ItemT>> }
) => ReturnType<typeof SectionListInner>;

function SectionListInner<ItemT>({ contentContainerStyle, ...props }: SectionListProps<ItemT>, ref: React.ForwardedRef<SectionListRN<ItemT>>) {
    const { bottom } = useSafeAreaInsets();
    const style = tw.style(contentContainerStyle);
    const bottomOffset = props.horizontal ? 0 : bottom + 82;
    const paddingBottom = ((style.paddingBottom || 0) as number) + (Platform.OS === 'ios' ? 0 : bottomOffset);
    const { setScrollPosition } = useScroll();

    return (
        <SectionListRN<ItemT>
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
}
