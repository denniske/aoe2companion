import tw from '@app/tailwind';
import { textColors } from '@app/utils/text.util';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { Button } from './button';
import { Icon } from './icon';
import { Text } from './text';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setMainPageShown, useMutate, useMutateScroll, useScrollPosition, useSelector } from '@app/redux/reducer';
import { useAccountData } from '@app/queries/all';

export const TabBar: React.FC = ({}) => {
    const insets = useSafeAreaInsets();
    const { bottom } = insets;
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const shadow = tw.style('shadow-blue-50 dark:shadow-black', Platform.OS === 'web' && 'shadow-2xl');
    const { colorScheme } = useColorScheme();
    const gradient =
        colorScheme === 'dark'
            ? [tw.color('blue-950/0') ?? 'black', tw.color('blue-950/90') ?? 'black']
            : [tw.color('gold-50/0') ?? 'white', tw.color('gold-50/90') ?? 'white'];

    const scrollPosition = useScrollPosition();
    const { setScrollPosition, setScrollToTop } = useMutateScroll();

    // console.log('USE TAB BAR', scrollPosition);

    const showTabBar = scrollPosition === 0;
    const opacity = useRef(new Animated.Value(1)).current;

    const configMainPage = useAccountData(data => data.mainPage);
    const mainPageShown = useSelector((state) => state.mainPageShown);
    const isNavigationReady = rootNavigationState?.key != null;
    const mutate = useMutate();

    useEffect(() => {
        if (Platform.OS !== 'web' && isNavigationReady && configMainPage && mainPageShown !== true) {
            router.navigate(configMainPage);
            mutate(setMainPageShown(true));
        }
    }, [isNavigationReady]);

    useEffect(() => {
        const toValue = showTabBar ? 1 : 0;
        Animated.timing(opacity, {
            toValue,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [showTabBar]);

    // console.log('');
    // console.log('');
    // console.log('ROUTES');
    // console.log('-------------------------------------------------------');

    // console.log(navigation);
    // console.log(rootNavigationState);

    const routes = [
        {
            key: 'index',
            label: 'Home',
            tabBarIcon: () => 'home',
            path: '/',
        },
        {
            key: 'matches',
            label: 'Matches',
            tabBarIcon: () => 'chess',
            path: '/matches',
        },
        {
            key: 'explore',
            label: 'Explore',
            tabBarIcon: () => 'landmark',
            path: '/explore',
        },
        {
            key: 'statistics',
            label: 'Stats',
            tabBarIcon: () => 'chart-simple',
            path: '/statistics',
        },
        {
            key: 'competitive',
            label: 'Pros',
            tabBarIcon: () => 'ranking-star',
            path: '/competitive',
        },
        {
            key: 'more',
            label: 'More',
            tabBarIcon: () => 'bars',
            path: '/more',
        },
    ];
    return (
        <>
            <Animated.View
                className="absolute px-4 pb-2 w-full"
                style={{ bottom, opacity: opacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}
                pointerEvents="box-none"
            >
                <View style={{ height: 74 }} className="items-center justify-center" pointerEvents="box-none">
                    <View pointerEvents={!showTabBar ? 'auto' : 'none'}>
                        <Button
                            className="h-10 w-10 items-center justify-center rounded-full shadow-lg"
                            icon="arrow-up"
                            style={shadow}
                            hitSlop={10}
                            onPress={() => {
                                setScrollPosition(0);
                                setScrollToTop(uuidv4());
                            }}
                        />
                    </View>
                </View>
            </Animated.View>
            <Animated.View className="absolute px-4 pb-2 w-full" style={{ bottom, opacity }} pointerEvents={showTabBar ? 'auto' : 'none'}>
                <LinearGradient className="absolute left-0 right-0" style={{ bottom: -bottom, top: -16 }} locations={[0, 0.25]} colors={gradient} />
                <View className="flex-row p-2 rounded-lg shadow-xl bg-white dark:bg-blue-900" style={shadow}>
                    {routes.map((route) => {
                        // console.log('ROUTE', route);

                        const label = route.label;
                        const isFocused = rootNavigationState?.routes[rootNavigationState.index || 0].name.startsWith(route.key);

                        const onPress = () => {
                            if (router.canDismiss()) {
                                router.dismissAll();
                            }
                            router.replace(route.path);
                        };

                        const iconName = route.tabBarIcon?.({ focused: true, color: '', size: 0 }) as IconName;

                        return (
                            <React.Fragment key={route.label}>
                                <Pressable onPress={() => onPress()} style={{ flex: 1 }}>
                                    <View
                                        className="justify-center items-center py-2 rounded-lg flex-1"
                                        style={tw.style(isFocused && 'bg-blue-800 dark:bg-gold-700')}
                                    >
                                        {iconName && <Icon color={isFocused ? 'text-white' : 'brand'} size={22} icon={iconName} />}
                                        <Text
                                            allowFontScaling={false}
                                            style={tw.style(isFocused ? 'text-white' : textColors['brand'])}
                                            variant="header-sm"
                                            className="!text-[9px] !leading-[12px] uppercase mt-2"
                                        >
                                            {label}
                                        </Text>
                                    </View>
                                </Pressable>
                            </React.Fragment>
                        );
                    })}
                </View>
            </Animated.View>
        </>
    );
};
