import { useScroll, useScrollable } from '@app/hooks/use-scrollable';
import tw from '@app/tailwind';
import { textColors } from '@app/utils/text.util';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { BottomTabBarProps, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { Button } from './button';
import { Icon } from './icon';
import { Text } from './text';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation, insets }) => {
    const { bottom } = insets;
    const shadow = tw.style('shadow-blue-50 dark:shadow-black', Platform.OS === 'web' && 'shadow-2xl');
    const { colorScheme } = useColorScheme();
    const gradient =
        colorScheme === 'dark'
            ? [tw.color('blue-950/0') ?? 'black', tw.color('blue-950/90') ?? 'black']
            : [tw.color('gold-50/0') ?? 'white', tw.color('gold-50/90') ?? 'white'];

    const { scrollPosition, setScrollToTop } = useScrollable();
    const { setScrollPosition } = useScroll();
    const showTabBar = scrollPosition === 0;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const toValue = showTabBar ? 1 : 0;
        Animated.timing(opacity, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [showTabBar]);

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
                    {state.routes.map((route, index) => {
                        const {
                            options: {
                                tabBarButton = (props: BottomTabBarButtonProps) => {
                                    return <Pressable {...props} />;
                                },
                                ...options
                            },
                        } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? (options.tabBarLabel as string)
                                : options.title !== undefined
                                  ? options.title
                                  : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const iconName = options.tabBarIcon?.({ focused: true, color: '', size: 0 }) as IconName;

                        return (
                            <React.Fragment key={route.key}>
                                {tabBarButton({
                                    onPress,
                                    style: { flex: 1 },
                                    children: (
                                        <View
                                            className="justify-center items-center py-2 rounded-lg flex-1"
                                            style={tw.style(isFocused && 'bg-blue-800 dark:bg-gold-700')}
                                        >
                                            {iconName && <Icon color={isFocused ? 'text-white' : 'brand'} size={22} icon={iconName} />}
                                            <Text
                                                style={tw.style(isFocused ? 'text-white' : textColors['brand'])}
                                                variant="header-sm"
                                                className="!text-[9px] !leading-[12px] uppercase mt-2"
                                            >
                                                {label}
                                            </Text>
                                        </View>
                                    ),
                                })}
                            </React.Fragment>
                        );
                    })}
                </View>
            </Animated.View>
        </>
    );
};
