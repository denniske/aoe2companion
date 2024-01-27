import { BottomTabBarProps, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import React from 'react';
import { Icon } from './icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Text } from './text';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation, insets }) => {
    const { bottom } = insets;

    return (
        <View className="absolute px-4 pb-2 w-full" style={{ bottom }}>
            <View className="flex-row p-2 justify-between bg-white dark:bg-blue-900 rounded-lg shadow-lg shadow-blue-50 dark:shadow-blue-950">
                {state.routes.map((route, index) => {
                    const {
                        options: {
                            tabBarButton = (props: BottomTabBarButtonProps) => {
                                return <Pressable {...props}></Pressable>;
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
                                children: (
                                    <View
                                        className={`justify-center items-center py-2 px-3 rounded-lg ${
                                            isFocused ? 'bg-blue-800 dark:bg-gold-700' : ''
                                        }`}
                                    >
                                        {iconName && <Icon color={isFocused ? 'text-white' : 'brand'} size={22} icon={iconName} />}
                                        <Text
                                            color={isFocused ? 'text-white' : 'brand'}
                                            variant="header-sm"
                                            className={`text-[10px] leading-[12px] uppercase mt-2`}
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
        </View>
    );
};
