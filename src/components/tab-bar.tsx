import { IconName } from '@fortawesome/fontawesome-svg-core';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import { usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useMutateScroll, useScrollPosition } from '@app/redux/reducer';
import { useTranslation } from '@app/helper/translate';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from '@app/components/button';
import { v4 as uuidv4 } from 'uuid';

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
        return rootNavigationState?.routes[rootNavigationState.index || 0].state?.routes[childIndex || 0].name;
    }

    return name;
}

export const TabBar: React.FC = () => {
    const getTranslation = useTranslation();
    const insets = useSafeAreaInsets();
    const { bottom } = insets;
    const router = useRouter();
    const routeName = useCurrentTabName();

    const scrollPosition = useScrollPosition();
    const { setScrollPosition, setScrollToTop } = useMutateScroll();

    const showTabBar = scrollPosition === 0;
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        bottom: bottom,
    }));

    const animatedArrowStyle = useAnimatedStyle(() => ({
        pointerEvents: 'box-none',
        bottom,
        opacity: interpolate(opacity.value, [0, 1], [1, 0]),
    }));

    useEffect(() => {
        const toValue = showTabBar ? 1 : 0;
        opacity.value = withTiming(toValue, { duration: 500 });
    }, [showTabBar]);

    const routes = [
        {
            key: 'index',
            label: getTranslation('nav.home'),
            icon: 'home',
            path: '/',
        },
        {
            key: 'matches',
            label: getTranslation('nav.matches'),
            icon: 'chess',
            path: '/matches',
        },
        {
            key: 'explore',
            label: getTranslation('nav.explore'),
            icon: 'landmark',
            path: '/explore',
        },
        {
            key: 'statistics',
            label: getTranslation('nav.stats'),
            icon: 'chart-simple',
            path: '/statistics',
        },
        {
            key: 'competitive',
            label: getTranslation('nav.pros'),
            icon: 'ranking-star',
            path: '/competitive',
        },
        {
            key: 'more',
            label: getTranslation('nav.more'),
            icon: 'bars',
            path: '/more',
        },
    ] as const;
    return (
        <>
            <Animated.View className="absolute px-4 pb-2 w-full" style={animatedArrowStyle}>
                <View style={{ height: 74, pointerEvents: 'box-none' }} className="items-center justify-center">
                    <View className={`${!showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                        <Button
                            className="h-10 w-10 items-center justify-center rounded-full shadow-lg shadow-blue-50 dark:shadow-black"
                            icon="arrow-up"
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
                style={animatedStyle}
            >
                <View
                    style={{ position: 'absolute', left: 0, right: 0, bottom: -bottom, top: -16 }}
                    className="bg-gradient-to-b from-[0%] to-[25%] from-gold-50/0 to-gold-50/90 dark:from-blue-950/0 dark:to-blue-950/90"
                />
                <View className="flex-row p-2 rounded-lg bg-white dark:bg-blue-900 shadow-xl shadow-blue-50 dark:shadow-black max-w-2xl w-full mx-auto">
                    {routes.map((route) => {
                        // console.log('ROUTE', route.key, route.path);

                        const label = route.label;
                        const isFocused = routeName?.startsWith(route.key);

                        const onPress = () => {
                            if (router.canDismiss()) {
                                router.dismissAll();
                            }
                            router.replace(route.path);
                        };

                        return (
                            <Pressable
                                onPress={() => onPress()}
                                key={route.label}
                                className={`justify-center items-center py-2 flex-1 ${isFocused && 'bg-blue-800 dark:bg-gold-700'} rounded-lg`}
                            >
                                {route.icon && <Icon color={isFocused ? 'white' : 'brand'} size={22} icon={route.icon as IconName} />}
                                <Text allowFontScaling={false} variant="nav" color={isFocused ? 'white' : 'brand'} className={`uppercase mt-2`}>
                                    {label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Animated.View>
        </>
    );
};
