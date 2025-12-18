import { useScrollView } from '@app/hooks/use-scroll-view';
import { forwardRef } from 'react';
import { SectionList as SectionListRN, SectionListProps as SectionListPropsRN } from 'react-native';
import cn from 'classnames';
import { containerScrollClassName } from '@app/styles';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { SectionListWeb } from './section-list-web';

export type SectionListRef<ItemT = any> = React.RefObject<SectionListRN<ItemT> | null>;
export interface SectionListProps<ItemT> extends Omit<SectionListPropsRN<ItemT>, 'contentContainerStyle'> {
    contentContainerStyle?: string;
}

export const SectionList = forwardRef(SectionListInner) as <ItemT>(
    props: SectionListProps<ItemT> & { ref?: React.ForwardedRef<SectionListRN<ItemT>> } & { horizontalOnWeb?: boolean }
) => ReturnType<typeof SectionListInner>;

function SectionListInner<ItemT>(
    { contentContainerStyle, contentContainerClassName, horizontalOnWeb, ...props }: SectionListProps<ItemT> & { horizontalOnWeb: boolean },
    ref: React.ForwardedRef<SectionListRN<ItemT>>
) {
    const scrollViewProps = useScrollView({ contentContainerStyle, ref, ...props });
    const showTabBar = useShowTabBar();

    if (horizontalOnWeb && !showTabBar) {
        return (
            <SectionListWeb<ItemT>
                {...props}
                {...scrollViewProps}
                contentContainerClassName={cn(containerScrollClassName, contentContainerClassName)}
            />
        );
    }

    return (
        <SectionListRN<ItemT>
            {...props}
            {...scrollViewProps}
            contentContainerClassName={cn(!props.horizontal && containerScrollClassName, contentContainerClassName)}
        />
    );
}
