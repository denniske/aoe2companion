import React, {useEffect, useState} from 'react';
import {Alert, Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import {MainPageInner} from "./main.page";
import {createStylesheet} from '../theming-new';
import {setAuth, setPrefValue, useMutate, useSelector} from '../redux/reducer';
import {useCavy} from './testing/tester';
import {composeUserId, sameUserNull, UserId, userIdFromBase, UserInfo} from '../helper/user';
import {saveCurrentPrefsToStorage, saveSettingsToStorage} from '../service/storage';
import Search from './components/search';
import {loadProfile} from '../service/profile';
import {MyText} from './components/my-text';
import {getTranslation} from '../helper/translate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import {useApi} from '../hooks/use-api';
import {getRootNavigation} from '../service/navigation';


export function userMenu(props: any) {
    return () => {
        if (props.route?.params?.id) {
            return <UserMenu/>;
        }
        return <View/>;
    }
}

export function UserMenu() {
    const styles = useStyles();
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const user = route.params.id;
    const auth = useSelector(state => state.auth!);
    const steamProfileUrl = 'https://steamcommunity.com/profiles/' + user.steam_id;
    const xboxProfileUrl = 'https://www.ageofempires.com/stats/?game=age2&profileId=' + user.profile_id;

    const mutate = useMutate();

    const deleteUser = () => {
        if (Platform.OS === 'web') {
            if (confirm("Do you want to reset me page?")){
                doDeleteUser();
            }
        } else {
            Alert.alert(getTranslation('main.profile.reset.title'), getTranslation('main.profile.reset.note'),
                [
                    {text: getTranslation('main.profile.reset.action.cancel'), style: "cancel"},
                    {text: getTranslation('main.profile.reset.action.reset'), onPress: doDeleteUser,}
                ],
                {cancelable: false}
            );
        }
    };

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        mutate(setAuth(null));
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: 'User'}],
        });
    };

    return (
        <View style={styles.menu}>
            {
                user.profile_id &&
                <TouchableOpacity style={styles.menuButton} onPress={() => Linking.openURL(xboxProfileUrl)}>
                    <FontAwesomeIcon5 style={styles.menuIcon} name="xbox" size={20} />
                </TouchableOpacity>
            }
            {
                user.steam_id &&
                <TouchableOpacity style={styles.menuButton}  onPress={() => Linking.openURL(steamProfileUrl)}>
                    <FontAwesomeIcon5 style={styles.menuIcon} name="steam" size={20} />
                </TouchableOpacity>
            }
            {
                sameUserNull(user, auth) &&
                <TouchableOpacity style={styles.menuButton} onPress={deleteUser}>
                    <IconFA5 style={styles.menuIcon} name="user-times" size={16} />
                </TouchableOpacity>
            }
        </View>
    );
}

function isValidUserInfo(userInfo: any) {
    return userInfo && (userInfo.steam_id || userInfo.profile_id);
}

export default function UserPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const user: UserId = isValidUserInfo(route.params?.id) ? route.params?.id : undefined as unknown as UserId;
    const styles = useStyles();

    const mutate = useMutate();
    const auth = useSelector(state => state.auth);
    const profile = useSelector(state => state.user[user?.id]?.profile);
    const [hasSteamId, setHasSteamId] = useState(true);

    console.log('UserPage', route.params, auth);

    const generateTestHook = useCavy();
    const navigation = useNavigation();
    generateTestHook('Navigation')(navigation);

    const onSelect = async (user: UserInfo) => {
        await saveSettingsToStorage({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        });
        mutate(setAuth(user));
    };

    // Reset country for use in leaderboard country dropdown
    useEffect(() => {
        if (auth == null) {
            mutate(setPrefValue('country', undefined));
            saveCurrentPrefsToStorage();
        }
    }, [auth]);

    // When user is not set but we have auth

    const navigateToAuthUser = async () => {
        console.log('==> NAVIGATE');
        navigation.navigate('User', {
            id: userIdFromBase(auth!),
            // name: profile?.name,
        });
        console.log('==> NAVIGATED');
    };

    useEffect(() => {
        if (auth != null && user == null) {
            navigateToAuthUser();
        }
    }, [auth]);

    // When name is not set yet

    useEffect(() => {
        if (profile != null) {
            navigation.setParams({
                id: userIdFromBase(profile),
                name: profile.name
            });
        }
    }, [profile]);

    // When visiting user page with only profile_id / steam_id

    const completeUserIdInfo = async () => {
        console.log('completeUserIdInfo');
        const loadedProfile = profile ?? await loadProfile('aoe2de', user!);
        if (loadedProfile) {
            const loadedProfileId = composeUserId(loadedProfile);

            mutate(state => {
                if (state.user[loadedProfileId] == null) {
                    state.user[loadedProfileId] = {};
                }
                state.user[loadedProfileId].profile = loadedProfile;
            });
        }

        if (!loadedProfile?.steam_id) {
            setHasSteamId(false);
        }

        if (loadedProfile) {
            navigation.setParams({
                id: userIdFromBase(loadedProfile!),
                name: loadedProfile?.name,
            });
        }
    }

    useEffect(() => {
        if (user != null && user.profile_id == null) {
            completeUserIdInfo();
        }
        if (user != null && user.steam_id == null && hasSteamId) {
            completeUserIdInfo();
        }
    }, [user, hasSteamId]);

    if (user) {
        if (user.profile_id == null) {
            return <View style={styles.container}><MyText>Loading profile by Steam ID...</MyText></View>;
        }
        if (user.steam_id == null && hasSteamId) {
            return <View style={styles.container}><MyText>Loading profile by profile ID...</MyText></View>;
        }
    }

    if (user) {
        return <MainPageInner user={user}/>;
    }

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return <MainPageInner user={auth}/>;
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        padding: 20,
    },
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
        color: theme.textNoteColor,
    },
}));
