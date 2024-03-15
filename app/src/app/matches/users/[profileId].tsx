import React, { useEffect } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RootStackParamList, RootStackProp } from '../../../../App2';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainPageInner } from '@app/view/main.page';
import { createStylesheet } from '../../../theming-new';
import { setAuth, setPrefValue, useMutate, useSelector } from '../../../redux/reducer';
import { useCavy } from '@app/view/testing/tester';
import { clearSettingsInStorage, saveCurrentPrefsToStorage, saveSettingsToStorage } from '../../../service/storage';
import Search from '@app/view/components/search';
import { getTranslation } from '../../../helper/translate';
import { FontAwesome5 } from '@expo/vector-icons';
import { getRootNavigation } from '../../../service/navigation';
import { setAccountProfile } from '../../../api/following';
import { openLink } from '../../../helper/url';
import { fetchProfiles } from '../../../api/helper/api';
import { router } from 'expo-router';

export function UserMenu() {
    const styles = useStyles();
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const profileId = route.params.profileId;
    const auth = useSelector((state) => state.auth!);
    const account = useSelector((state) => state.account);
    const profile = useSelector((state) => state.user[profileId]?.profile);
    const steamProfileUrl = 'https://steamcommunity.com/profiles/' + profile?.steamId;
    const xboxProfileUrl = 'https://www.ageofempires.com/stats/?game=age2&profileId=' + profile?.profileId;

    const mutate = useMutate();

    const deleteUser = () => {
        if (Platform.OS === 'web') {
            if (confirm('Do you want to reset me page?')) {
                doDeleteUser();
            }
        } else {
            Alert.alert(
                getTranslation('main.profile.reset.title'),
                getTranslation('main.profile.reset.note'),
                [
                    { text: getTranslation('main.profile.reset.action.cancel'), style: 'cancel' },
                    { text: getTranslation('main.profile.reset.action.reset'), onPress: doDeleteUser },
                ],
                { cancelable: false }
            );
        }
    };

    const doDeleteUser = async () => {
        await clearSettingsInStorage();
        mutate(setAuth(null));
        router.replace('/matches/users/select');
        setAccountProfile(account.id, { profile_id: null, steam_id: null });
    };

    return (
        <View style={styles.menu}>
            {!!profile?.profileId && (
                <TouchableOpacity style={styles.menuButton} onPress={() => openLink(xboxProfileUrl)}>
                    <FontAwesome5 style={styles.menuIcon} name="xbox" size={20} />
                </TouchableOpacity>
            )}
            {!!profile?.steamId && (
                <TouchableOpacity style={styles.menuButton} onPress={() => openLink(steamProfileUrl)}>
                    <FontAwesome5 style={styles.menuIcon} name="steam" size={20} />
                </TouchableOpacity>
            )}
            {!!profile?.profileId && Number(profileId) === Number(auth?.profileId) && (
                <TouchableOpacity style={styles.menuButton} onPress={deleteUser}>
                    <FontAwesome5 style={styles.menuIcon} name="user-times" size={16} />
                </TouchableOpacity>
            )}
        </View>
    );
}

export default function UserPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const profileId = route.params?.profileId;
    const styles = useStyles();

    console.log('==> UserPage', profileId);

    const mutate = useMutate();
    const auth = useSelector((state) => state.auth);
    const account = useSelector((state) => state.account);
    const profile = useSelector((state) => state.user[profileId]?.profile);

    // console.log('==> UserPage');
    // console.log(route.params);
    // console.log(auth);
    // console.log(profileId);

    const navigation = useNavigation<RootStackProp>();

    const onSelect = async (user: any) => {
        await saveSettingsToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profile_id: user.profileId!, steam_id: user.steamId });
    };

    // Reset country for use in leaderboard country dropdown
    useEffect(() => {
        if (auth == null) {
            mutate(setPrefValue('country', undefined));
            mutate(setPrefValue('clan', undefined));
            saveCurrentPrefsToStorage();
        }
    }, [auth]);

    // useEffect(() => {
    //     navigation.setOptions({ title: profile?.name || ' ' });
    //     console.log('PROFILE UPDATED', profile?.name);
    // }, [profile]);

    // When user is not set but we have auth

    const navigateToAuthUser = async () => {
        console.log('==> NAVIGATE');
        // @ts-ignore
        router.navigate(`/matches/users/${auth?.profileId}`);
        console.log('==> NAVIGATED');
    };

    useEffect(() => {
        if (auth != null && profileId == null) {
            navigateToAuthUser();
        }
    }, [auth]);

    // When name is not set yet

    // useEffect(() => {
    //     if (profile != null) {
    //         // @ts-ignore
    //         navigation.setParams({
    //             profileId: profile.profileId,
    //         });
    //     }
    // }, [profile]);

    // When visiting user page with only profileId / steamId

    const completeUserIdInfo = async () => {
        // console.log('completeUserIdInfo');

        const loadedProfile = await fetchProfiles({ profileId: profileId });
        if (loadedProfile) {
            const name = loadedProfile?.profiles?.[0]?.name;
            navigation.setOptions({ title: name || ' ', headerRight: () => <UserMenu /> });
            // console.log('PROFILE UPDATED', name);
            // mutate(state => {
            //     set(state.cache, ['profile', profileId, 'name'], loadedProfile.profiles[0].name);
            // });
        }
        // console.log(loadedProfile);

        // if (!loadedProfile?.steamId) {
        //     setHasSteamId(false);
        // }

        // if (loadedProfile) {
        //     // @ts-ignore
        //     navigation.setParams({
        //         profileId: loadedProfile.profileId,
        //         name: loadedProfile?.name,
        //     });
        // }
    };

    useEffect(() => {
        // const hasInCache = false;
        // if (!hasInCache) {
        completeUserIdInfo();
        // }
    }, [profileId]);

    // if (profileId) {
    //     if (profileId == null) {
    //         return <View style={styles.container}><MyText>Loading profile by Steam ID...</MyText></View>;
    //     }
    //     if (user.steamId == null && hasSteamId) {
    //         return <View style={styles.container}><MyText>Loading profile by profile ID...</MyText></View>;
    //     }
    // }

    if (profileId) {
        return <MainPageInner profileId={profileId} />;
    }

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return <MainPageInner profileId={profileId} />;
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            padding: 20,
        },
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            // flex: 1,
            // marginRight: 10,
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
    })
);
