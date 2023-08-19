import {FlatList, Platform, StyleSheet, View} from "react-native";
import {useSelector} from "../../redux/reducer";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootTabParamList} from "../../../App2";
import {useApi} from "../../hooks/use-api";
import {loadProfile} from "../../service/profile";
import {MyText} from "../components/my-text";
import Profile from "../components/profile";
import Rating from "../components/rating";
import RefreshControlThemed from "../components/refresh-control-themed";
import {Game} from "../components/game";
import {Button} from "react-native-paper";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {useTheme} from '../../theming';
import {appVariants} from '../../styles';
import {openLink} from "../../helper/url";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import Constants from 'expo-constants';

interface Props {
    profileId: number;
}

export default function MainProfile({ profileId }: Props) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);

    if (profileId == null) {
        // This happens sometimes when clicking notification
        // Routes will contain "Feed" with match_id
        // console.log('ROUTES', JSON.stringify(routes));
        return (
            <View style={styles.list}>
                <MyText>
                    If you see this screen instead of a user profile, report a bug in the <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>discord</MyText>.
                </MyText>
            </View>
        );
    }

    return <MainProfileInternal profileId={profileId}/>;
}

function MainProfileInternal({profileId}: {profileId: number}) {
    const styles = useStyles();
    const auth = useSelector(state => state.auth);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[profileId]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - ' + (Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name),
        });
    }, [userProfile]);

    const profile = useApi(
        {},
        [],
        state => state.user[profileId]?.profile,
        (state, value) => {
            if (state.user[profileId] == null) {
                state.user[profileId] = {};
            }
            // state.user[profileId].profile = value;
            state.user[profileId].profile = {
                ...state.user[profileId].profile,
                ...value,
            };
        },
        loadProfile, profileId
    );

    const rating = profile.data?.ratings;

    const route = useRoute();
    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index] as RouteProp<RootStackParamList, 'Main'>;
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        console.log('REFRESHING MAIN PROFILE', userProfile?.name);
        setRefetching(true);
        await Promise.all([profile.reload()]);
        setRefetching(false);
    };

    // const matches = useApi(
    //     {},
    //     [],
    //     state => state.user[profileId]?.matches5,
    //     (state, value) => {
    //         if (state.user[profileId] == null) {
    //             state.user[profileId] = {};
    //         }
    //         state.user[profileId].matches5 = value;
    //     },
    //     fetchPlayerMatches, 'aoe2de', 0, 5, [user]
    // );

    // const matchesVersus = useCachedLazyApi(
    //     [],
    //     state => state.user[profileId]?.matchesVersus,
    //     (state, value) => {
    //         if (state.user[profileId] == null) {
    //             state.user[profileId] = {};
    //         }
    //         state.user[profileId].matchesVersus = value;
    //     },
    //     fetchPlayerMatches, 'aoe2de', 0, 5, [user, auth!]
    // );

    let list: any = [
        'profile', 'rating-header', 'rating',
    ];

    // if (profileId !== auth?.profileId && auth) {
    //     // list.push('matches5-header', ...(matches.data || Array(5).fill(null)), 'matches5-footer');
    //     // list.push('matchesVersus-header', ...(matchesVersus.data || Array(5).fill(null)), 'matchesVersus-footer');
    // }

    // useEffect(() => {
    //     if (!sameUserNull(user, auth) && auth) {
    //         matchesVersus.reload();
    //     }
    // });

    const [refetching, setRefetching] = useState(false);

    const nav = async (route: keyof RootTabParamList) => {
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {
                    Platform.OS === 'web' && refetching &&
                    <FlatListLoadingIndicator/>
                }
                <FlatList
                    // scrollEnabled={false}
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'rating-header':
                                if (rating?.length === 0) return <View/>;
                                return <MyText style={styles.sectionHeader}>{getTranslation('main.profile.ratinghistory.heading')}</MyText>;
                            case 'matches5-header':
                                if (rating?.length === 0) return <View/>;
                                return <MyText style={styles.sectionHeader}>{getTranslation('main.profile.recentmatches.heading')}</MyText>;
                            case 'matches5-footer':
                                return <Button
                                    onPress={() => nav('MainMatches')}
                                    mode="contained"
                                    compact
                                    uppercase={false}
                                    dark={true}
                                >
                                    View All
                                </Button>;
                            case 'matchesVersus-header':
                                if (rating?.length === 0) return <View/>;
                                return <MyText style={styles.sectionHeader}>Recent matches with you</MyText>;
                            case 'matchesVersus-footer':
                                return <Button
                                    onPress={() => nav('MainMatches')}
                                    mode="contained"
                                    compact
                                    uppercase={false}
                                    dark={true}
                                >
                                    View All
                                </Button>;
                            case 'profile':
                                if (profile.data === null) return <View style={styles.container}><MyText>No leaderboard data yet.</MyText></View>;;
                                return <Profile data={profile.data} ready={profile.data != null && rating != null}/>;
                            case 'rating':
                                if (rating?.length === 0) return <View/>;
                                return <Rating ratingHistories={rating} ready={profile.data != null && rating != null}/>;
                            default:
                                return <Game match={item as any} expanded={index === -1} highlightedUsers={[profileId]} user={profileId}/>;
                        }

                    }}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControlThemed
                            onRefresh={onRefresh}
                            refreshing={refetching}
                        />
                    }
                />
            </View>
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    info: {
        marginBottom: 10,
        marginLeft: 5,
    },

    col: {
        paddingHorizontal: 7,
        alignItems: 'center',
    },
    h1: {

    },
    h2: {
        fontSize: 11,
    },

    pickerRow: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 20,
        // marginTop: 20,
    },
    sectionHeader: {
        marginVertical: 25,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
    list: {
        padding: 20,
    },
    container: {
        flex: 1,
        // backgroundColor: '#B89579',
    },
    content: {
        flex: 1,
    },
}));
