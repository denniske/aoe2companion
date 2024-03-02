import { MaterialTopTabBar, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Constants from 'expo-constants';
import React from 'react';
import { View } from 'react-native';

import { TabBarLabel } from './components/tab-bar-label';
import MainMatches from './main/main-matches';
import MainProfile from './main/main-profile';
import MainStats from './main/main-stats';
import { getTranslation } from '../helper/translate';
import { useColorScheme } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

interface MainPageInnerProps {
    profileId: number;
}

export function MainPageInner({ profileId }: MainPageInnerProps) {
    const appName = Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name;
    const { colorScheme } = useColorScheme();

    return (
        <Tab.Navigator
            tabBar={(props) => (
                <View className="bg-white dark:bg-blue-900 ">
                    <MaterialTopTabBar {...props} />
                </View>
            )}
            screenOptions={{
                lazy: false,
                swipeEnabled: true,
                tabBarStyle: { backgroundColor: 'transparent' },
                tabBarInactiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
                tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
            }}
            sceneContainerStyle={{ backgroundColor: 'transparent' }}
        >
            <Tab.Screen
                name="MainProfile"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.profile')} /> }}
            >
                {() => <MainProfile profileId={profileId} />}
            </Tab.Screen>
            <Tab.Screen
                name="MainStats"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.stats')} /> }}
            >
                {() => <MainStats profileId={profileId} />}
            </Tab.Screen>
            <Tab.Screen
                name="MainMatches"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.matches')} /> }}
            >
                {() => <MainMatches profileId={profileId} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
