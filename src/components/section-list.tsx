import { useScrollView } from '@app/hooks/use-scroll-view';
import { forwardRef } from 'react';
import { SectionList as SectionListRN, SectionListProps as SectionListPropsRN } from 'react-native';
import cn from 'classnames';
import { containerScrollClassName } from '@app/styles';

export type SectionListRef<ItemT = any> = React.RefObject<SectionListRN<ItemT> | null>;
export interface SectionListProps<ItemT> extends Omit<SectionListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const SectionList = forwardRef(SectionListInner) as <ItemT>(
    props: SectionListProps<ItemT> & { ref?: React.ForwardedRef<SectionListRN<ItemT>> }
) => ReturnType<typeof SectionListInner>;

function SectionListInner<ItemT>({ contentContainerStyle, contentContainerClassName, ...props }: SectionListProps<ItemT>, ref: React.ForwardedRef<SectionListRN<ItemT>>) {
    const scrollViewProps = useScrollView({ contentContainerStyle, ref, ...props });

    return (
        <SectionListRN<ItemT>
            {...props}
            {...scrollViewProps}
            contentContainerClassName={cn(!props.horizontal && containerScrollClassName, contentContainerClassName)}
        />
    );
}
