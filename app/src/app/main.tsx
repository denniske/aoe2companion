import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBarLabel } from '@app/view/components/tab-bar-label';
import MainProfile from '@app/view/main/main-profile';
import MainStats from '@app/view/main/main-stats';
import MainMatches from '@app/view/main/main-matches';
import { createStylesheet } from '../theming-new';
import { getTranslation } from '../helper/translate';
import Constants from 'expo-constants';

const Tab = createMaterialTopTabNavigator();

interface MainPageInnerProps {
    profileId: number;
}

export function MainPageInner({ profileId }: MainPageInnerProps) {
    const appName = Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name;

    return (
        <Tab.Navigator screenOptions={{ lazy: false, swipeEnabled: true }}>
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

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            flex: 1,
            marginRight: 10,
        },
        menuButton: {
            // backgroundColor: 'blue',
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginHorizontal: 2,
        },
        menuIcon: {
            opacity: 0.5,
            color: theme.textColor,
        },
    })
);
