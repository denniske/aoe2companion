import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {fetchPlayerMatches} from '../api/player-matches';
import Profile from './components/profile';
import Rating from './components/rating';
import {useApi} from '../hooks/use-api';
import {loadRatingHistories} from '../service/rating';
import {loadProfile} from '../service/profile';
import {Game} from './components/game';
import {IMatch} from "../helper/data";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {Button} from "react-native-paper";
import StatsCiv from "./components/stats-civ";
import StatsMap from "./components/stats-map";
import StatsPlayer from "./components/stats-player";
import {MyText} from "./components/my-text";
import {clearStatsPlayer, setPrefValue, useMutate, useSelector} from "../redux/reducer";
import {formatLeaderboardId, LeaderboardId, leaderboardList} from "../helper/leaderboards";
import Picker from "./components/picker";
import {saveCurrentPrefsToStorage} from "../service/storage";
import {get, set} from "lodash-es";
import {useCachedConservedLazyApi} from "../hooks/use-cached-conserved-lazy-api";
import {getStats} from "../service/stats";
import {usePrevious} from "../hooks/use-previous";
import {useLazyApi} from "../hooks/use-lazy-api";
import RefreshControlThemed from "./components/refresh-control-themed";
import {ITheme, makeVariants, useTheme} from "../theming";
import StatsPosition from "./components/stats-position";
import {time} from "../helper/util";
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import {MainPageInner} from "./main.page";


export function userMenu(props: any) {
    return () => {
        if (props.route?.params?.id) {
            return <UserMenu/>;
        }
        return <View/>;
    }
}

export function UserMenu() {
    const styles = useTheme(variants);
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
    // const styles = useTheme(variants);
    // const [refetching, setRefetching] = useState(false);
    // const [fetchingMore, setFetchingMore] = useState(false);
    // const [fetchedAll, setFetchedAll] = useState(false);
    // const mutate = useMutate();
    // const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;
    // const [leaderboardId, setLeaderboardId] = useState(prefLeaderboardId);

    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const user = route.params.id;

    return <MainPageInner user={user}/>;

    // const rating = useApi(
    //     {},
    //     [],
    //     state => state.user[auth.id]?.rating,
    //     (state, value) => {
    //         if (state.user[auth.id] == null) {
    //             state.user[auth.id] = {};
    //         }
    //         state.user[auth.id].rating = value;
    //     },
    //     loadRatingHistories, 'aoe2de', auth
    // );
    //
    // const profile = useApi(
    //     {},
    //     [],
    //     state => state.user[auth.id]?.profile,
    //     (state, value) => {
    //         if (state.user[auth.id] == null) {
    //             state.user[auth.id] = {};
    //         }
    //         state.user[auth.id].profile = value;
    //     },
    //     loadProfile, 'aoe2de', auth
    // );
    // const matches = useApi(
    //     {},
    //     [],
    //     state => state.user[auth.id]?.matches,
    //     (state, value) => {
    //         if (state.user[auth.id] == null) {
    //             state.user[auth.id] = {};
    //         }
    //         state.user[auth.id].matches = value;
    //     },
    //     fetchPlayerMatches, 'aoe2de', 0, 10, [auth]
    // );
    //
    // const allMatches = useLazyApi(
    //     {},
    //     fetchPlayerMatches, 'aoe2de', 0, 1000, [auth]
    // );
    //
    // const cachedData = useSelector(state => get(state.statsPlayer, [auth.id, leaderboardId]));
    //
    // const stats = useCachedConservedLazyApi(
    //     [allMatches.data, leaderboardId],
    //     () => allMatches.data != null,
    //     state => get(state, ['statsPlayer', auth.id, leaderboardId]),
    //     (state, value) => set(state, ['statsPlayer', auth.id, leaderboardId], value),
    //     getStats, {matches: allMatches.data, user: auth, leaderboardId}
    // );
    //
    // let statsPlayer = stats.data?.statsPlayer;
    // let statsCiv = stats.data?.statsCiv;
    // let statsMap = stats.data?.statsMap;
    // let statsPosition = stats.data?.statsPosition;
    //
    // const hasMatches = allMatches.loading || (allMatches.data != null);
    // const hasStats = cachedData != null;
    // const hasMatchesOrStats = hasMatches || hasStats;
    // const loadingMatchesOrStats = (allMatches.loading || stats.loading);
    //
    // const prevLeaderboardId = usePrevious(leaderboardId);
    //
    // const loadStats = () => {
    //     time('loadStats');
    //     const res = allMatches.reload();
    //     time();
    //     return res;
    // };
    //
    // useEffect(() => {
    //     // console.log("FETCHING MATCHES TRY", hasMatchesOrStats, prevLeaderboardId);
    //     if (!hasMatchesOrStats && prevLeaderboardId != null) {
    //         // console.log("FETCHING MATCHES");
    //         allMatches.reload();
    //     }
    // }, [leaderboardId]);
    //
    // const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
    //     mutate(setPrefValue('leaderboardId', leaderboardId));
    //     await saveCurrentPrefsToStorage();
    //     setLeaderboardId(leaderboardId);
    // };
    //
    // const list = ['profile', 'rating-header', 'rating', 'stats-header', 'stats-position', 'stats-player', 'stats-civ', 'stats-map', 'matches-header', ...(matches.data || Array(15).fill(null))];
    //
    // const _renderFooter = () => {
    //     if (!fetchingMore) return null;
    //     return <FlatListLoadingIndicator />;
    // };
    //
    // const onRefresh = async () => {
    //     setRefetching(true);
    //     await mutate(clearStatsPlayer(auth));
    //     await Promise.all([rating.reload(), profile.reload(), matches.reload(), allMatches.reload()]);
    //     setRefetching(false);
    // };
    //
    // const onEndReached = async () => {
    //     if (fetchingMore) return;
    //     setFetchingMore(true);
    //     const matchesLength = matches.data?.length ?? 0;
    //     const newMatchesData = await matches.refetch('aoe2de', 0, matchesLength + 15, [auth]);
    //     if (matchesLength === newMatchesData?.length) {
    //         setFetchedAll(true);
    //     }
    //     setFetchingMore(false);
    // };
    //
    // return (
    //         <View style={styles.container}>
    //             <View style={styles.content}>
    //                 <FlatList
    //                         // scrollEnabled={false}
    //                         contentContainerStyle={styles.list}
    //                         data={list}
    //                         renderItem={({item, index}) => {
    //                             switch (item) {
    //                                 case 'rating-header':
    //                                     if (rating.data?.length === 0) return <View/>;
    //                                     return <MyText style={styles.sectionHeader}>Rating History</MyText>;
    //                                 case 'stats-header':
    //                                     return <View>
    //                                         <MyText style={styles.sectionHeader}>Statistics</MyText>
    //
    //                                         <View style={styles.pickerRow}>
    //                                             <ActivityIndicator animating={loadingMatchesOrStats} size="small"/>
    //                                             <Picker style={styles.picker} disabled={loadingMatchesOrStats} value={leaderboardId} values={leaderboardList} formatter={formatLeaderboardId} onSelect={onLeaderboardSelected}/>
    //                                         </View>
    //
    //                                         {
    //                                             !hasMatchesOrStats &&
    //                                             <Button
    //                                                 onPress={loadStats}
    //                                                 mode="contained"
    //                                                 compact
    //                                                 uppercase={false}
    //                                                 dark={true}
    //                                             >
    //                                                 Load Stats
    //                                             </Button>
    //                                         }
    //                                         {
    //                                             hasStats && statsPlayer?.matches?.length != 0 &&
    //                                             <MyText style={styles.info}>the last {statsPlayer?.matches?.length} matches:</MyText>
    //                                         }
    //                                     </View>;
    //                                 case 'stats-position':
    //                                     if (!hasMatchesOrStats) return <View/>;
    //                                     return <StatsPosition data={statsPosition} user={auth} leaderboardId={leaderboardId}/>;
    //                                 case 'stats-civ':
    //                                     if (!hasMatchesOrStats) return <View/>;
    //                                     return <StatsCiv data={statsCiv} user={auth}/>;
    //                                 case 'stats-map':
    //                                     if (!hasMatchesOrStats) return <View/>;
    //                                     return <StatsMap data={statsMap} user={auth}/>;
    //                                 case 'stats-player':
    //                                     if (!hasMatchesOrStats) return <View/>;
    //                                     return <StatsPlayer data={statsPlayer} user={auth} leaderboardId={leaderboardId}/>;
    //                                 case 'profile':
    //                                     if (profile.data === null) return <View/>;
    //                                     return <Profile data={profile.data}/>;
    //                                 case 'rating':
    //                                     if (rating.data?.length === 0) return <View/>;
    //                                     return <Rating ratingHistories={rating.data}/>;
    //                                 case 'matches-header':
    //                                     return <MyText style={styles.sectionHeader}>Match History</MyText>;
    //                                 default:
    //                                     return <Game data={item as IMatch} expanded={false}/>;
    //                             }
    //                         }}
    //                         ListFooterComponent={_renderFooter}
    //                         onEndReached={fetchedAll ? null : onEndReached}
    //                         onEndReachedThreshold={0.1}
    //                         keyExtractor={(item, index) => index.toString()}
    //                         refreshControl={
    //                             <RefreshControlThemed
    //                                 onRefresh={onRefresh}
    //                                 refreshing={refetching}
    //                             />
    //                         }
    //                 />
    //             </View>
    //         </View>
    // );
}


// function MainMatches() {
//     const styles = useTheme(variants);
//     const [refetching, setRefetching] = useState(false);
//     const [fetchingMore, setFetchingMore] = useState(false);
//     const [fetchedAll, setFetchedAll] = useState(false);
//
//     const auth = useSelector(state => state.auth!);
//
//     const matches = useApi(
//         {
//             append: (data, newData) => {
//                 // console.log('APPEND', data, newData);
//                 return [...(data || []), ...newData];
//             },
//         },
//         [],
//         state => state.user[auth.id]?.matches,
//         (state, value) => {
//             if (state.user[auth.id] == null) {
//                 state.user[auth.id] = {};
//             }
//             state.user[auth.id].matches = value;
//         },
//         fetchPlayerMatches, 'aoe2de', 0, 15, [auth]
//     );
//
//     const onRefresh = async () => {
//         setRefetching(true);
//         await matches.reload();
//         setRefetching(false);
//     };
//
//     const onEndReached = async () => {
//         if (fetchingMore) return;
//         setFetchingMore(true);
//         const matchesLength = matches.data?.length ?? 0;
//         const newMatchesData = await matches.refetch('aoe2de', 0, matchesLength + 15, [auth]);
//         if (matchesLength === newMatchesData?.length) {
//             setFetchedAll(true);
//         }
//         setFetchingMore(false);
//     };
//
//     const list = [...(matches.data || Array(15).fill(null))];
//
//     const _renderFooter = () => {
//         if (!fetchingMore) return null;
//         return <FlatListLoadingIndicator />;
//     };
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.content}>
//                 <FlatList
//                     contentContainerStyle={styles.list}
//                     data={list}
//                     renderItem={({item, index}) => {
//                         switch (item) {
//                             default:
//                                 return <Game data={item as any} expanded={index === -1}/>;
//                         }
//                     }}
//                     ListFooterComponent={_renderFooter}
//                     onEndReached={fetchedAll ? null : onEndReached}
//                     onEndReachedThreshold={0.1}
//                     keyExtractor={(item, index) => index.toString()}
//                     refreshControl={
//                         <RefreshControlThemed
//                             onRefresh={onRefresh}
//                             refreshing={refetching}
//                         />
//                     }
//                 />
//             </View>
//         </View>
//     );
// }

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
            // opacity: 0.5,
            // color: theme.textColor,
            color: theme.textNoteColor,
        },
        info: {
            textAlign: 'center',
            marginBottom: 10,
            color: theme.textNoteColor,
            fontSize: 12,
        },
        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            marginBottom: 10
        },
        picker: {
            width: 100,
            marginLeft: 10,
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
            textAlign: 'center',
        },
        list: {
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
        },
        container: {
            flex: 1,
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },

    });
};

const variants = makeVariants(getStyles);
