import React, {useEffect} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import {MainPageInner} from "./main.page";
import {createStylesheet} from '../theming-new';
import {setAuth, setPrefValue, useMutate, useSelector} from '../redux/reducer';
import {useCavy} from './testing/tester';
import {composeUserId, userIdFromBase, UserInfo} from '../helper/user';
import {saveCurrentPrefsToStorage, saveSettingsToStorage} from '../service/storage';
import Search from './components/search';
import {loadProfile} from '../service/profile';


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
    const auth = route.params.id;
    const steamProfileUrl = 'https://steamcommunity.com/profiles/' + auth.steam_id;
    const xboxProfileUrl = 'https://www.ageofempires.com/stats/?game=age2&profileId=' + auth.profile_id;
    return (
        <View style={styles.menu}>
            {
                auth.profile_id &&
                <TouchableOpacity style={styles.menuButton} onPress={() => Linking.openURL(xboxProfileUrl)}>
                    <FontAwesomeIcon5 style={styles.menuIcon} name="xbox" size={20} />
                </TouchableOpacity>
            }
            {
                auth.steam_id &&
                <TouchableOpacity style={styles.menuButton}  onPress={() => Linking.openURL(steamProfileUrl)}>
                    <FontAwesomeIcon5 style={styles.menuIcon} name="steam" size={20} />
                </TouchableOpacity>
            }
        </View>
    );
}

export default function UserPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const user = route.params?.id;

    console.log('UserPage', route.params);

    const mutate = useMutate();
    const auth = useSelector(state => state.auth);

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

    const navigateToUser = async () => {
        const profile = await loadProfile('aoe2de', auth!);
        navigation.navigate('User', {
            id: userIdFromBase(auth!),
            name: profile?.name,
        });
    }

    useEffect(() => {
        if (auth != null && user == null) {
            navigateToUser();
        }
    }, [auth]);

    if (user) {
        return <MainPageInner user={user}/>;
    }

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return <MainPageInner user={auth}/>;
}

const useStyles = createStylesheet(theme => StyleSheet.create({
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
