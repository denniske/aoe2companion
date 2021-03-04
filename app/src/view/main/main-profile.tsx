import {FlatList, StyleSheet, View} from "react-native";
import {useSelector} from "../../redux/reducer";
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {RootTabParamList} from "../../../App";
import {useApi} from "../../hooks/use-api";
import {loadRatingHistories} from "../../service/rating";
import {loadProfile} from "../../service/profile";
import {MyText} from "../components/my-text";
import Profile from "../components/profile";
import Rating from "../components/rating";
import RefreshControlThemed from "../components/refresh-control-themed";
import {Game} from "../components/game";
import {Button} from "react-native-paper";
import {sameUserNull} from "../../helper/user";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {getPathToRoute, getRoutesFromCurrentActiveStack} from '../../service/navigation';
import {useNavigationStateExternal} from '../../hooks/use-navigation-state-external';


export default function MainProfile() {
    // const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    // const user = route.params.id;
    // console.log('MainProfile', route);

    // const user = {
    //     id: '76561198400058723-2858362',
    //     steam_id: '76561198400058723',
    //     profile_id: 2858362,
    // };

    // const route = useRoute<RouteProp<RootTabParamList, 'MainProfile'>>() as any;
    // const user = parseUserId(route.params.user);

    const route = useRoute();
    const navigationState = useNavigationStateExternal();
    let routes = getPathToRoute(navigationState, route.key);
    // console.log('STATE', navigationState);
    // console.log('STATE PATH', routes);
    // console.log('route', route);

    if (routes.length === 0) {
        routes = getRoutesFromCurrentActiveStack(navigationState);
        // console.log('STATE PATH FALLBACK', routes);
    }

    // const navigation = useNavigation();
    // const parent = navigation.dangerouslyGetParent();
    // console.log('parent.state', parent?.dangerouslyGetState());
    // console.log('parent', parent);

    if (routes == null || routes.length === 0 || routes[0].params == null) return <View/>;

    const user = routes[0].params.id;

    if (user == null) {
        try {
            console.log('ROUTES', JSON.stringify(routes));
        } catch (e) { }
        // return <View/>;
    }

    return <MainProfileInternal user={user}/>;
}

function MainProfileInternal({user}: { user: any}) {
    const styles = useStyles();
    const auth = useSelector(state => state.auth);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[user.id]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - AoE II Companion',
        });
    }, [userProfile]);

    const rating = useApi(
        {},
        [],
        state => state.user[user.id]?.rating,
        (state, value) => {
            if (state.user[user.id] == null) {
                state.user[user.id] = {};
            }
            state.user[user.id].rating = value;
        },
        loadRatingHistories, 'aoe2de', user
    );

    const profile = useApi(
        {},
        [],
        state => state.user[user.id]?.profile,
        (state, value) => {
            if (state.user[user.id] == null) {
                state.user[user.id] = {};
            }
            state.user[user.id].profile = value;
        },
        loadProfile, 'aoe2de', user
    );

    // const matches = useApi(
    //     {},
    //     [],
    //     state => state.user[user.id]?.matches5,
    //     (state, value) => {
    //         if (state.user[user.id] == null) {
    //             state.user[user.id] = {};
    //         }
    //         state.user[user.id].matches5 = value;
    //     },
    //     fetchPlayerMatches, 'aoe2de', 0, 5, [user]
    // );

    // const matchesVersus = useCachedLazyApi(
    //     [],
    //     state => state.user[user.id]?.matchesVersus,
    //     (state, value) => {
    //         if (state.user[user.id] == null) {
    //             state.user[user.id] = {};
    //         }
    //         state.user[user.id].matchesVersus = value;
    //     },
    //     fetchPlayerMatches, 'aoe2de', 0, 5, [user, auth!]
    // );

    let list: any = [
        'profile', 'rating-header', 'rating',
    ];

    if (!sameUserNull(user, auth) && auth) {
        // list.push('matches5-header', ...(matches.data || Array(5).fill(null)), 'matches5-footer');
        // list.push('matchesVersus-header', ...(matchesVersus.data || Array(5).fill(null)), 'matchesVersus-footer');
    }

    // useEffect(() => {
    //     if (!sameUserNull(user, auth) && auth) {
    //         matchesVersus.reload();
    //     }
    // });

    const [refreshing, setRefreshing] = useState(false);

    const nav = async (route: keyof RootTabParamList) => {
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FlatList
                    // scrollEnabled={false}
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'rating-header':
                                if (rating.data?.length === 0) return <View/>;
                                return <MyText style={styles.sectionHeader}>{getTranslation('main.profile.ratinghistory.heading')}</MyText>;
                            case 'matches5-header':
                                if (rating.data?.length === 0) return <View/>;
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
                                if (rating.data?.length === 0) return <View/>;
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
                                return <Profile data={profile.data} ready={profile.data != null && rating.data != null}/>;
                            case 'rating':
                                if (rating.data?.length === 0) return <View/>;
                                return <Rating ratingHistories={rating.data} ready={profile.data != null && rating.data != null}/>;
                            default:
                                return <Game data={item as any} expanded={index === -1} highlightedUsers={[user]} user={user}/>;
                        }

                    }}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControlThemed
                            onRefresh={async () => {
                                setRefreshing(true);
                                await Promise.all([rating.reload(), profile.reload()]);
                                setRefreshing(false);
                            }}
                            refreshing={refreshing}
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
