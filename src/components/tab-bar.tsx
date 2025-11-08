import { IconName } from '@fortawesome/fontawesome-svg-core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import { usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { useMutateScroll, useScrollPosition } from '@app/redux/reducer';
import { useTranslation } from '@app/helper/translate';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from '@app/components/button';
import { v4 as uuidv4 } from 'uuid';
import { useResolveClassNames, useUniwind } from 'uniwind';

function useCurrentTabName() {
    // useRootNavigationState does not trigger a re-render when the route changes, but usePathname does
    const pathname = usePathname();

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
    const shadowLg = useResolveClassNames(`shadow-lg shadow-blue-50 dark:shadow-black`);
    const shadowXl = useResolveClassNames(`shadow-xl shadow-blue-50 dark:shadow-black`);
    const { theme } = useUniwind();

    const colorBlue950_0 = useResolveClassNames('text-blue-950/0').color;
    const colorGold50_0 = useResolveClassNames('text-gold-50/0').color;
    const colorBlue950_90 = useResolveClassNames('text-blue-950/90').color;
    const colorGold50_90 = useResolveClassNames('text-gold-50/90').color;

    const gradient =
        theme === 'dark'
            ? ([colorBlue950_0 ?? 'black', colorBlue950_90 ?? 'black'] as const)
            : ([colorGold50_0 ?? 'white', colorGold50_90 ?? 'white'] as const);

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
            <Animated.View
                className="absolute px-4 pb-2 w-full"
                style={animatedArrowStyle}
            >
                <View style={{ height: 74, pointerEvents: 'box-none' }} className="items-center justify-center">
                    <View className={`${!showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                        <Button
                            className="h-10 w-10 items-center justify-center rounded-full"
                            icon="arrow-up"
                            style={shadowLg}
                            hitSlop={10}
                            onPress={() => {
                                setScrollPosition(0);
                                setScrollToTop(uuidv4());
                            }}
                        />
                    </View>
                </View>
            </Animated.View>

            <Animated.View className={`absolute px-4 pb-2 w-full ${showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`} style={animatedStyle}>
                <LinearGradient className="absolute left-0 right-0" style={{ bottom: -bottom, top: -16 }} locations={[0, 0.25]} colors={gradient} />
                <View className="flex-row p-2 rounded-lg bg-white dark:bg-blue-900" style={shadowXl}>
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
                            <Pressable onPress={() => onPress()} key={route.label}
                                       className={`justify-center items-center py-2 flex-1 ${isFocused && 'bg-blue-800 dark:bg-gold-700'} rounded-lg`}
                            >
                                {route.icon && <Icon color={isFocused ? 'white' : 'brand'} size={22} icon={route.icon as IconName} />}
                                <Text
                                    allowFontScaling={false}
                                    variant="nav"
                                    color={isFocused ? 'white' : 'brand'}
                                    className={`uppercase mt-2`}
                                >
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
