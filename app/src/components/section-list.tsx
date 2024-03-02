import tw from '@app/tailwind';
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

function SectionListInner<ItemT>({ contentContainerStyle, ...props }: SectionListProps<ItemT>, ref: React.ForwardedRef<SectionListRN<ItemT>>) {
    const { bottom } = useSafeAreaInsets();

    return (
        <SectionListRN<ItemT>
            contentInset={{ bottom: props.horizontal ? 0 : bottom + 82 }}
            contentContainerStyle={tw.style(contentContainerStyle)}
            {...props}
            ref={ref}
        />
    );
}
