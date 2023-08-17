import React, {useEffect, useState} from 'react';
import {Alert, Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainPageInner} from "./main.page";
import {createStylesheet} from '../theming-new';
import {setAuth, setPrefValue, useMutate, useSelector} from '../redux/reducer';
import {useCavy} from './testing/tester';
import {clearSettingsInStorage, saveCurrentPrefsToStorage, saveSettingsToStorage} from '../service/storage';
import Search from './components/search';
import {loadProfile} from '../service/profile';
import {MyText} from './components/my-text';
import {getTranslation} from '../helper/translate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome5} from "@expo/vector-icons";
import {useApi} from '../hooks/use-api';
import {getRootNavigation} from '../service/navigation';
import {setAccountProfile} from "../api/following";
import {openLink} from "../helper/url";
import {RootStackProp} from '../../App2';

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
    const steamProfileUrl = 'https://steamcommunity.com/profiles/' + user.steamId;
    const xboxProfileUrl = 'https://www.ageofempires.com/stats/?game=age2&profileId=' + user.profileId;
    const account = useSelector(state => state.account);

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
        await clearSettingsInStorage();
        mutate(setAuth(null));
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: 'User'}],
        });
        setAccountProfile(account.id, { profileId: null, steamId: null });
    };

    return (
        <View style={styles.menu}>
            {
                !!user.profileId &&
                <TouchableOpacity style={styles.menuButton} onPress={() => openLink(xboxProfileUrl)}>
                    <FontAwesome5 style={styles.menuIcon} name="xbox" size={20} />
                </TouchableOpacity>
            }
            {
                !!user.steamId &&
                <TouchableOpacity style={styles.menuButton}  onPress={() => openLink(steamProfileUrl)}>
                    <FontAwesome5 style={styles.menuIcon} name="steam" size={20} />
                </TouchableOpacity>
            }
            {
                user.profile_id === auth.profileId &&
                <TouchableOpacity style={styles.menuButton} onPress={deleteUser}>
                    <FontAwesome5 style={styles.menuIcon} name="user-times" size={16} />
                </TouchableOpacity>
            }
        </View>
    );
}

function isValidUserInfo(userInfo: any) {
    return userInfo && (userInfo.steamId || userInfo.profileId);
}

export default function UserPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const profileId = route.params?.profileId;
    const styles = useStyles();

    const mutate = useMutate();
    const auth = useSelector(state => state.auth);
    const account = useSelector(state => state.account);
    const profile = useSelector(state => state.user[profileId]?.profile);
    const [hasSteamId, setHasSteamId] = useState(true);

    console.log('==> UserPage');
    console.log(route.params);
    console.log(auth);
    console.log(profileId);

    const generateTestHook = useCavy();
    const navigation = useNavigation<RootStackProp>();
    generateTestHook('Navigation')(navigation);

    const onSelect = async (user: any) => {
        await saveSettingsToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profileId: user.profileId!, steamId: user.steamId });
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
        // @ts-ignore
        navigation.navigate('User', {
            profileId: auth?.profileId,
            // name: profile?.name,
        });
        console.log('==> NAVIGATED');
    };

    useEffect(() => {
        if (auth != null && profileId == null) {
            navigateToAuthUser();
        }
    }, [auth]);

    // When name is not set yet

    useEffect(() => {
        if (profile != null) {
            // @ts-ignore
            navigation.setParams({
                profileId: profile.profileId,
                name: profile.name
            });
        }
    }, [profile]);

    // When visiting user page with only profileId / steamId

    const completeUserIdInfo = async () => {
        // console.log('completeUserIdInfo');
        const loadedProfile = profile ?? await loadProfile(profileId);
        if (loadedProfile) {
            mutate(state => {
                if (state.user[loadedProfile.profileId] == null) {
                    state.user[loadedProfile.profileId] = {};
                }
                state.user[loadedProfile.profileId].profile = loadedProfile;
            });
        }

        // if (!loadedProfile?.steamId) {
        //     setHasSteamId(false);
        // }

        if (loadedProfile) {
            // @ts-ignore
            navigation.setParams({
                profileId: loadedProfile.profileId,
                name: loadedProfile?.name,
            });
        }
    }

    useEffect(() => {
        if (profileId == null) {
            completeUserIdInfo();
        }
    }, [profileId, hasSteamId]);

    // if (profileId) {
    //     if (profileId == null) {
    //         return <View style={styles.container}><MyText>Loading profile by Steam ID...</MyText></View>;
    //     }
    //     if (user.steamId == null && hasSteamId) {
    //         return <View style={styles.container}><MyText>Loading profile by profile ID...</MyText></View>;
    //     }
    // }

    if (profileId) {
        return <MainPageInner profileId={profileId}/>;
    }

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return <MainPageInner profileId={profileId}/>;
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
