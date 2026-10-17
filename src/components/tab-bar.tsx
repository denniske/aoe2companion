import React, { useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from './uniwind/glass-effect';
import { Icon } from './icon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faBars, faChartSimple, faChess, faHome, faLandmark, faRankingStar } from '@fortawesome/sharp-solid-svg-icons';
import { Text } from './text';
import { Href, usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useMutateScroll, useScrollPosition } from '@app/redux/reducer';
import { useTranslation } from '@app/helper/translate';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from '@app/components/button';
import { v4 as uuidv4 } from 'uuid';
import { useTabBarPlacement } from '@app/hooks/use-side-tab-bar';

export function useCurrentTabName() {
    // useRootNavigationState does not trigger a re-render when the route changes, but usePathname does
    usePathname();

    const rootNavigationState = useRootNavigationState();
    if (!rootNavigationState || !rootNavigationState.routes || rootNavigationState.routes.length === 0) {
        return null;
    }

    // console.log('ROUTE', rootNavigationState.index);
    // console.log('ROUTE', rootNavigationState);
    // console.log('ROUTE', rootNavigationState?.routes[rootNavigationState.index || 0]);
    // console.log('ROUTE', rootNavigationState?.routes[rootNavigationState.index || 0].name);

    const name = rootNavigationState?.routes[rootNavigationState.index || 0].name;

    if (name === '__root') {
        const childIndex = rootNavigationState?.routes[rootNavigationState.index || 0].state?.index;
        const child = rootNavigationState?.routes[rootNavigationState.index || 0].state?.routes[childIndex || 0];
        const childName = child?.name;

        if (childName === '(main)' && child) {
            return child.state?.routes[child.state.index || 0].name;
        }

        return child?.name;
    }

    return name;
}

// Liquid glass needs iOS 26+; everywhere else keep the solid bar.
const glassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();
const Bar = glassAvailable ? GlassView : View;

export const TabBar: React.FC = () => {
    const getTranslation = useTranslation();
    const insets = useSafeAreaInsets();
    const { bottom } = insets;
    const placement = useTabBarPlacement();
    const sideTabBar = placement.position === 'side';
    const compact = placement.position === 'side' && placement.compact;
    const router = useRouter();
    const routeName = useCurrentTabName();

    const scrollPosition = useScrollPosition();
    const { setScrollPosition, setScrollToTop } = useMutateScroll();

    const showTabBar = scrollPosition === 0;
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.get(),
        bottom: bottom,
    }));

    const animatedArrowStyle = useAnimatedStyle(() => ({
        pointerEvents: 'box-none',
        bottom,
        opacity: interpolate(opacity.get(), [0, 1], [1, 0]),
    }));

    useEffect(() => {
        const toValue = showTabBar ? 1 : 0;
        opacity.set(withTiming(toValue, { duration: 500 }));
    }, [showTabBar, opacity]);

    const routes: { key: string; additionalRoutes: string[]; label: string; icon: IconDefinition; path: Href }[] = [
        {
            key: 'index',
            additionalRoutes: [],
            label: getTranslation('nav.home'),
            icon: faHome,
            path: '/',
        },
        {
            key: 'matches',
            additionalRoutes: ['players'],
            label: getTranslation('nav.matches'),
            icon: faChess,
            path: '/matches',
        },
        {
            key: 'explore',
            additionalRoutes: [],
            label: getTranslation('nav.explore'),
            icon: faLandmark,
            path: '/explore',
        },
        {
            key: 'statistics',
            additionalRoutes: [],
            label: getTranslation('nav.stats'),
            icon: faChartSimple,
            path: '/statistics',
        },
        {
            key: 'competitive',
            additionalRoutes: [],
            label: getTranslation('nav.pros'),
            icon: faRankingStar,
            path: '/competitive',
        },
        {
            key: 'more',
            additionalRoutes: ['auth'],
            label: getTranslation('nav.more'),
            icon: faBars,
            path: '/more',
        },
    ];
    const renderItem = (route: (typeof routes)[number]) => {
        const label = route.label;
        const isFocused = routeName?.startsWith(route.key) || route.additionalRoutes.some((r) => routeName?.startsWith(r));

        const onPress = () => {
            if (router.canDismiss()) {
                router.dismissAll();
            }
            router.replace(route.path);
        };

        // Symbols only in the iPhone Duo strip, as Apple asks for vertical bars.
        if (compact) {
            return (
                <Pressable
                    onPress={() => onPress()}
                    key={route.label}
                    accessibilityRole="tab"
                    accessibilityLabel={label}
                    accessibilityState={{ selected: !!isFocused }}
                    className={`w-12 h-12 justify-center items-center rounded-full ${isFocused && 'bg-blue-800 dark:bg-gold-700'}`}
                >
                    <Icon color={isFocused ? 'white' : 'brand'} size={20} icon={route.icon} />
                </Pressable>
            );
        }

        return (
            <Pressable
                onPress={() => onPress()}
                key={route.label}
                className={`justify-center items-center py-2 ${sideTabBar ? 'w-20 py-3' : 'flex-1'} ${isFocused && 'bg-blue-800 dark:bg-gold-700'} rounded-lg`}
            >
                {!!(route.icon) && <Icon color={isFocused ? 'white' : 'brand'} size={22} icon={route.icon} />}
                {/* Six slots share the width, so a long label used to wrap and
                    push the row taller. Clip instead -- the translations below
                    are kept short enough that this rarely bites. */}
                <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    variant="nav"
                    color={isFocused ? 'white' : 'brand'}
                    className={`uppercase mt-2`}
                >
                    {label}
                </Text>
            </Pressable>
        );
    };

    // iPhone Duo: a capsule at the bottom of the strip the system reserves for bars, under the
    // status bar, filling exactly that inset.
    if (placement.position === 'side' && placement.compact) {
        const stripWidth = placement.side === 'right' ? insets.right : insets.left;
        return (
            <View className="justify-end items-center" style={{ width: stripWidth, paddingBottom: insets.bottom + 8 }}>
                <Bar
                    className={`gap-1 p-1 rounded-full ${glassAvailable ? '' : 'bg-white dark:bg-blue-900 shadow-xl shadow-blue-50 dark:shadow-black'}`}
                >
                    {routes.map((route) => renderItem(route))}
                </Bar>
            </View>
        );
    }

    // Android navigation rail beside the content: it covers nothing, so it stays visible while
    // scrolling and needs no scroll-to-top arrow.
    if (sideTabBar) {
        return (
            <View
                className="justify-center"
                style={{ paddingLeft: insets.left + 8, paddingRight: 8, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}
            >
                <Bar
                    className={`gap-1 p-2 ${glassAvailable ? 'rounded-2xl' : 'rounded-lg bg-white dark:bg-blue-900 shadow-xl shadow-blue-50 dark:shadow-black'}`}
                >
                    {routes.map((route) => renderItem(route))}
                </Bar>
            </View>
        );
    }

    return (
        <>
            <Animated.View className="absolute px-4 pb-2 w-full" style={animatedArrowStyle}>
                <View style={{ height: 74, pointerEvents: 'box-none' }} className="items-center justify-center">
                    <View className={`${!showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                        <Button
                            className="h-10 w-10 items-center justify-center rounded-full shadow-lg shadow-blue-50 dark:shadow-black"
                            icon={faArrowUp}
                            hitSlop={10}
                            onPress={() => {
                                setScrollPosition(0);
                                setScrollToTop(uuidv4());
                            }}
                        />
                    </View>
                </View>
            </Animated.View>

            <Animated.View
                className={`absolute px-4 pb-2 w-full ${showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`}
                style={[animatedStyle, { paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right }]}
            >
                {/* With glass, keep only a light fade (like iOS's scroll edge effect) so content stays visible through the bar. */}
                <View
                    style={{ position: 'absolute', left: 0, right: 0, bottom: -bottom, top: -16 }}
                    className={
                        glassAvailable
                            ? 'bg-gradient-to-b from-[0%] to-[60%] from-gold-50/0 to-gold-50/35 dark:from-blue-950/0 dark:to-blue-950/35'
                            : 'bg-gradient-to-b from-[0%] to-[25%] from-gold-50/0 to-gold-50/90 dark:from-blue-950/0 dark:to-blue-950/90'
                    }
                />
                <Bar
                    className={`flex-row p-2 max-w-2xl w-full mx-auto ${glassAvailable ? 'rounded-2xl' : 'rounded-lg bg-white dark:bg-blue-900 shadow-xl shadow-blue-50 dark:shadow-black'}`}
                >
                    {routes.map((route) => renderItem(route))}
                </Bar>
            </Animated.View>
        </>
    );
};
