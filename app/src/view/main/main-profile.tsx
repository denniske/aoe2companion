import {FlatList, StyleSheet, View} from "react-native";
import {useMutate, useSelector} from "../../redux/reducer";
import React, {useState} from "react";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
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
import {parseUserId, sameUserNull} from "../../helper/user";
import {createStylesheet} from '../../theming-new';


export default function MainProfile() {
    const styles = useStyles();
    const mutate = useMutate();

    const auth = useSelector(state => state.auth);

    const route = useRoute<RouteProp<RootTabParamList, 'MainProfile'>>();
    const user = parseUserId(route.params.user);

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

    const navigation = useNavigation();

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
                                return <MyText style={styles.sectionHeader}>Rating History</MyText>;
                            case 'matches5-header':
                                if (rating.data?.length === 0) return <View/>;
                                return <MyText style={styles.sectionHeader}>Recent matches</MyText>;
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
                                if (profile.data === null) return <View/>;
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
        // textAlign: 'center',
        marginBottom: 10,
        marginLeft: 5,
    },

    col: {
        // width: 54,
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
