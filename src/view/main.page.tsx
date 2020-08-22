import React, {useEffect} from 'react';
import {Alert, AsyncStorage, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Search from './components/search';
import {composeUserId, UserId, UserInfo} from '../helper/user';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {setAuth, useMutate, useSelector} from '../redux/reducer';
import {fetchPlayerMatches} from '../api/player-matches';
import {useNavigationState} from "@react-navigation/native";
// import {useCavy} from "cavy";
import {TabBarLabel} from "./components/tab-bar-label";
import {saveSettingsToStorage} from "../service/storage";
import {LeaderboardId} from "../helper/leaderboards";
import {useCachedConservedLazyApi} from "../hooks/use-cached-conserved-lazy-api";
import {get, set} from "lodash-es";
import {getStats} from "../service/stats";
import {ITheme, makeVariants, useTheme} from "../theming";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import MainProfile from "./main/main-profile";
import MainStats from "./main/main-stats";
import MainMatches from "./main/main-matches";


export function mainMenu() {
    return () => {
        return <MainMenu/>;
    }
}

export function MainMenu() {
    const styles = useTheme(variants);
    const mutate = useMutate();
    const auth = useSelector(state => state.auth!);

    const deleteUser = () => {
        if (Platform.OS === 'web') {
            if (confirm("Do you want to reset me page?")){
                doDeleteUser();
            }
        } else {
            Alert.alert("Delete Me?", "Do you want to reset me page?",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Reset", onPress: doDeleteUser,}
                ],
                {cancelable: false}
            );
        }
    };

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        mutate(setAuth(null))
    };

    if (auth == null) {
        return <View/>;
    }

    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuButton} onPress={deleteUser}>
                <IconFA5 style={styles.menuIcon} name="user-times" size={16} />
            </TouchableOpacity>
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

interface MainPageInnerProps {
    user: UserId;
}

export default function MainPage() {
    const mutate = useMutate();
    const auth = useSelector(state => state.auth);

    const onSelect = async (user: UserInfo) => {
        await saveSettingsToStorage({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        });
        mutate(setAuth(user));
    };

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return <MainPageInner user={auth}/>
}

export function MainPageInner({ user }: MainPageInnerProps) {
    const styles = useTheme(variants);
    const mutate = useMutate();

    console.log('USER PAGE', user);

    // const generateTestHook = useCavy();
    // const navigation = useNavigation();
    // generateTestHook('Navigation')(navigation);

    const loadingMatchesOrStatsTrigger = useSelector(state => state.loadingMatchesOrStats);
    const leaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;

    const currentTabIndex = useNavigationState(state => state.routes[state.index].state?.index ?? 0);

    let allMatches = useCachedConservedLazyApi(
        [currentTabIndex, loadingMatchesOrStatsTrigger],
        () => currentTabIndex > 0,
        state => get(state, ['user', user.id, 'matches']),
        (state, value) => set(state, ['user', user.id, 'matches'], value),
        fetchPlayerMatches, 'aoe2de', 0, 1000, [user]
    );

    const stats = useCachedConservedLazyApi(
        [allMatches.data, leaderboardId],
        () => allMatches.data != null,
        state => get(state, ['statsPlayer', user.id, leaderboardId]),
        (state, value) => set(state, ['statsPlayer', user.id, leaderboardId], value),
        getStats, {matches: allMatches.data, user: user, leaderboardId}
    );

    const initialParams = { user: composeUserId(user) };
    return (
            <Tab.Navigator lazy={true} swipeEnabled={true}>
                <Tab.Screen name="MainProfile" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Profile"/>}} component={MainProfile} initialParams={initialParams}/>
                <Tab.Screen name="MainStats" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Stats"/>}} component={MainStats} initialParams={initialParams}/>
                <Tab.Screen name="MainMatches" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Matches"/>}} component={MainMatches} initialParams={initialParams}/>
            </Tab.Navigator>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);
