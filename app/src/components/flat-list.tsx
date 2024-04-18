import { useScrollView } from '@app/hooks/use-scroll-view';
import { forwardRef } from 'react';
import { FlatListProps as FlatListPropsRN } from 'react-native';
import { FlatList as FlatListRN } from 'react-native-gesture-handler';

export type FlatListRef<ItemT = any> = React.RefObject<FlatListRN<ItemT> | null>;
export interface FlatListProps<ItemT> extends Omit<FlatListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const FlatList = forwardRef(FlatListInner) as <ItemT>(
    props: FlatListProps<ItemT> & { ref?: React.ForwardedRef<FlatListRN<ItemT>> }
) => ReturnType<typeof FlatListInner>;

function FlatListInner<ItemT>({ contentContainerStyle, ...props }: FlatListProps<ItemT>, ref: React.ForwardedRef<FlatListRN<ItemT>>) {
    const scrollViewProps = useScrollView({ contentContainerStyle, ref, ...props });

    return <FlatListRN<ItemT> {...props} {...scrollViewProps} />;
}
