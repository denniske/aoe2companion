import tw from '@app/tailwind';
import { forwardRef } from 'react';
import { FlatList as FlatListRN, FlatListProps as FlatListPropsRN, Platform } from 'react-native';
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
    const style = tw.style(contentContainerStyle);
    const bottomOffset = props.horizontal ? 0 : bottom + 82;
    const paddingBottom = ((style.paddingBottom || 0) as number) + (Platform.OS === 'ios' ? 0 : bottomOffset);

    return <FlatListRN<ItemT> contentInset={{ bottom: bottomOffset }} contentContainerStyle={{ ...style, paddingBottom }} {...props} ref={ref} />;
}
