import { useScrollView } from '@app/hooks/use-scroll-view';
import { FlashList as FlashListShopify, FlashListProps as FlashListPropsShopify, FlashListRef } from '@shopify/flash-list';
import { forwardRef } from 'react';

// FlashList counterpart of ./flat-list.tsx. Same job: run the list's props through
// useScrollView so it gets the bottom padding for the tab bar, the insets, and the
// onScroll wiring that drives tab-bar hide/show and scroll-to-top.
//
// flat-list.tsx also forwards `contentContainerClassName` with
// containerScrollClassName; that is `web:`-only and FlashList is a native-only path
// here (web renders WebLeaderboard), so it is deliberately not carried over.
export type FlashListWrapperProps<ItemT> = FlashListPropsShopify<ItemT>;

function FlashListInner<ItemT>(props: FlashListPropsShopify<ItemT>, ref: React.ForwardedRef<FlashListRef<ItemT>>) {
    const scrollViewProps = useScrollView({
        horizontal: props.horizontal ?? undefined,
        onScroll: props.onScroll,
        onLayout: props.onLayout,
        scrollEnabled: props.scrollEnabled,
        scrollEventThrottle: props.scrollEventThrottle,
        ref: ref as React.ForwardedRef<any>,
    });

    // Forwarded explicitly rather than spread: useScrollView returns the full
    // ScrollView prop surface and FlashList accepts only part of it.
    const {
        contentContainerStyle,
        ref: scrollRef,
        onScroll,
        onLayout,
        scrollEventThrottle,
        scrollEnabled,
        contentInset,
        scrollIndicatorInsets,
        automaticallyAdjustContentInsets,
        automaticallyAdjustsScrollIndicatorInsets,
    } = scrollViewProps;

    return (
        <FlashListShopify<ItemT>
            {...props}
            ref={scrollRef}
            onScroll={onScroll}
            onLayout={onLayout}
            scrollEventThrottle={scrollEventThrottle}
            scrollEnabled={scrollEnabled}
            contentInset={contentInset}
            scrollIndicatorInsets={scrollIndicatorInsets}
            automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
            automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets}
            contentContainerStyle={(contentContainerStyle || undefined) as FlashListPropsShopify<ItemT>['contentContainerStyle']}
        />
    );
}

export const FlashList = forwardRef(FlashListInner) as <ItemT>(
    props: FlashListPropsShopify<ItemT> & { ref?: React.ForwardedRef<FlashListRef<ItemT>> }
) => ReturnType<typeof FlashListInner>;
