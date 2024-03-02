import { styled } from 'nativewind';
import { forwardRef } from 'react';
import { SectionList as SectionListRN, SectionListProps as SectionListPropsRN } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SectionListRef<ItemT = any> = React.RefObject<SectionListRN<ItemT> | null>;
export interface SectionListProps<ItemT> extends Omit<SectionListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const SectionList = forwardRef(SectionListInner) as <ItemT>(
    props: SectionListProps<ItemT> & { ref?: React.ForwardedRef<SectionListRN<ItemT>> }
) => ReturnType<typeof SectionListInner>;

const StyledSectionList = styled(SectionListRN<unknown>, { props: { contentContainerStyle: true } });

function SectionListInner<ItemT>(props: SectionListProps<unknown>, ref: React.ForwardedRef<SectionListRN<ItemT>>) {
    const { bottom } = useSafeAreaInsets();

    return <StyledSectionList contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }} {...props} ref={ref} />;
}
