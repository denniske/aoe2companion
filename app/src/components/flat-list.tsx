import { styled } from 'nativewind';
import { forwardRef } from 'react';
import { FlatList as FlatListRN, FlatListProps as FlatListPropsRN } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FlatListRef<ItemT = any> = React.RefObject<FlatListRN<ItemT> | null>;
export interface FlatListProps<ItemT> extends Omit<FlatListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const FlatList = forwardRef(FlatListInner) as <ItemT>(
    props: FlatListProps<ItemT> & { ref?: React.ForwardedRef<FlatListRN<ItemT>> }
) => ReturnType<typeof FlatListInner>;

const StyledFlatList = styled(FlatListRN<unknown>, { props: { contentContainerStyle: true } });

function FlatListInner<ItemT>(props: FlatListProps<unknown>, ref: React.ForwardedRef<FlatListRN<ItemT>>) {
    const { bottom } = useSafeAreaInsets();

    return <StyledFlatList contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }} {...props} ref={ref} />;
}
