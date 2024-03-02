import tw from '@app/tailwind';
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

function FlatListInner<ItemT>({ contentContainerStyle, ...props }: FlatListProps<ItemT>, ref: React.ForwardedRef<FlatListRN<ItemT>>) {
    const { bottom } = useSafeAreaInsets();

    return (
        <FlatListRN<ItemT>
            contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }}
            contentContainerStyle={tw.style(contentContainerStyle)}
            {...props}
            ref={ref}
        />
    );
}
