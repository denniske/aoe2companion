import {useTw} from '@app/tailwind';
import {IconName} from '@fortawesome/fontawesome-svg-core';
import {LinearGradient} from 'expo-linear-gradient';
import {useColorScheme} from 'nativewind';
import React, {useEffect, useState} from 'react';
import {Text as RNText, Platform, Pressable, View} from 'react-native';
import {Icon} from './icon';
import {Text} from './text';
import {usePathname, useRootNavigationState, useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutateScroll, useScrollPosition} from '@app/redux/reducer';
import {useTranslation} from '@app/helper/translate';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Button} from "@app/components/button";
import {v4 as uuidv4} from 'uuid';

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
    const tw = useTw();
    const getTranslation = useTranslation();
    const insets = useSafeAreaInsets();
    const { bottom } = insets;
    const router = useRouter();
    const routeName = useCurrentTabName();
    const shadow = tw.style('shadow-blue-50 dark:shadow-black', Platform.OS === 'web' && 'shadow-2xl');
    const { colorScheme } = useColorScheme();
    const gradient =
        colorScheme === 'dark'
            ? ([tw.color('blue-950/0') ?? 'black', tw.color('blue-950/90') ?? 'black'] as const)
            : ([tw.color('gold-50/0') ?? 'white', tw.color('gold-50/90') ?? 'white'] as const);

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

            {/*<TestScreen />*/}

            <Animated.View className={`absolute px-4 pb-2 w-full ${showTabBar ? 'pointer-events-auto' : 'pointer-events-none'}`} style={animatedStyle}>
                <LinearGradient className="absolute left-0 right-0" style={{ bottom: -bottom, top: -16 }} locations={[0, 0.25]} colors={gradient} />
                <View className="flex-row p-2 rounded-lg shadow-xl bg-white dark:bg-blue-900" style={shadow}>
                    {routes.map((route) => {
                        // console.log('ROUTE', route);
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
                            <React.Fragment key={route.label}>
                                <Pressable onPress={() => onPress()} style={{ flex: 1 }}>
                                    <View
                                        className="justify-center items-center py-2 rounded-lg flex-1"
                                        style={tw.style(isFocused && 'bg-blue-800 dark:bg-gold-700')}
                                    >
                                        {route.icon && <Icon color={isFocused ? 'white' : 'brand'} size={22} icon={route.icon as IconName} />}
                                        {/*<Text*/}
                                        {/*    allowFontScaling={false}*/}
                                        {/*    variant="header-sm"*/}
                                        {/*    color={isFocused ? 'white' : 'brand'}*/}
                                        {/*    className={`!text-[9px] !leading-[12px] uppercase mt-2`}*/}
                                        {/*>*/}
                                        {/*    {label}*/}
                                        {/*</Text> */}
                                        {/*<Text*/}
                                        {/*    color={isFocused ? 'white' : 'brand'}>*/}
                                        {/*    {label}*/}
                                        {/*</Text>*/}
                                        <Text
                                            allowFontScaling={false}
                                            variant="header-sm"
                                            color={isFocused ? 'white' : 'brand'}
                                            className={`!text-[9px] !leading-[12px] uppercase mt-2`}
                                        >
                                            {label}
                                        </Text>
                                        {/*<RNText*/}
                                        {/*    className={`${isFocused ? 'text-red-500' : 'text-yellow-500'}`}*/}
                                        {/*    style={[{ textAlign: 'center' }]}*/}
                                        {/*>*/}
                                        {/*    {label}*/}
                                        {/*</RNText>*/}
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

// export function TestScreen() {
//     const tabs = ['Home', 'Search', 'Notifications', 'Messages', 'Profile', 'Settings', 'Help', 'About', 'Contact', 'Feedback'];
//     const [ activeTab, setActiveTab] = useState(0);
//     return (
//         <View
//             style={{flex: 1, flexDirection: 'column', paddingTop:60}}
//         >
//             {
//                 tabs.map((tab, index) => (
//                     <Pressable key={index} onPress={() => setActiveTab(index)} >
//                         <RNText
//                             className={`${activeTab === index ? 'text-red-500' : 'text-yellow-500'}`}
//                             style={[{textAlign: 'center', marginBottom: 20}]}
//                         >
//                             {tab}
//                         </RNText>
//                     </Pressable>
//                 ))
//             }
//             <RNText>{activeTab}</RNText>
//         </View>
//     );
// }