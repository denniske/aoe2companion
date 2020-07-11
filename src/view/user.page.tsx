import React, {useState} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './components/profile';
import Rating from './components/rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import {IMatch} from "../helper/data";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {Button} from "react-native-paper";
import StatsCiv from "./components/stats-civ";
import StatsMap from "./components/stats-map";
import StatsPlayer from "./components/stats-player";
import {useLazyApi} from "../hooks/use-lazy-api";
import {MyText} from "./components/my-text";
import {setPrefValue, useMutate, useSelector} from "../redux/reducer";
import {formatLeaderboardId, LeaderboardId, leaderboardList} from "../helper/leaderboards";
import Picker from "./components/picker";
import {saveCurrentPrefsToStorage} from "../service/storage";


export default function UserPage() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const mutate = useMutate();
    const leaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;

    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();
    const auth = route.params.id;

    const rating = useApi(
            [],
            state => state.user[auth.id]?.rating,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].rating = value;
            },
            loadRatingHistories, 'aoe2de', auth
    );

    const profile = useApi(
            [],
            state => state.user[auth.id]?.profile,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].profile = value;
            },
            loadProfile, 'aoe2de', auth
    );
    const matches = useApi(
            [],
            state => state.user[auth.id]?.matches,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].matches = value;
            },
            fetchMatches, 'aoe2de', 0, 10, auth
    );

    const onRefresh = async () => {
        setRefetching(true);
        await Promise.all([rating.reload(), profile.reload(), matches.reload()]);
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore) return;
        setFetchingMore(true);
        await matches.refetch('aoe2de', 0, (matches.data?.length ?? 0) + 15, auth);
        setFetchingMore(false);
    };

    const list = ['profile', 'rating-header', 'rating', 'stats-header', 'stats-player', 'stats-civ', 'stats-map', 'matches-header', ...(matches.data || Array(15).fill(null))];

    const matches2 = useLazyApi(
        fetchMatches, 'aoe2de', 0, 1000, auth
    );

    const filterMatchesByLeaderboardId = (matchList: IMatch[]) => {
        if (matchList == null) {
            return undefined;
        }
        return matchList.filter(m => m.leaderboard_id === leaderboardId);
    };

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
    };

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={onRefresh}
                            refreshing={refetching}
                            style={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating-header':
                                        return <MyText style={styles.sectionHeader}>Rating History</MyText>;
                                    case 'stats-header':
                                        return <View>
                                            <MyText style={styles.sectionHeader}>Stats</MyText>
                                            <Picker style={styles.statsPicker} value={leaderboardId} values={leaderboardList} formatter={formatLeaderboardId} onSelect={onLeaderboardSelected}/>
                                            {
                                                !matches2.touched && !matches2.loading &&
                                                <Button
                                                    onPress={() => matches2.reload()}
                                                    mode="contained"
                                                    compact
                                                    uppercase={false}
                                                    dark={true}
                                                >
                                                    Load Stats
                                                </Button>
                                            }
                                        </View>;
                                    case 'stats-civ':
                                        if (!matches2.touched && !matches2.loading) return <View/>;
                                        return <StatsCiv matches={filterMatchesByLeaderboardId(matches2.data)} user={auth}/>;
                                    case 'stats-map':
                                        if (!matches2.touched && !matches2.loading) return <View/>;
                                        return <StatsMap matches={filterMatchesByLeaderboardId(matches2.data)} user={auth}/>;
                                    case 'stats-player':
                                        if (!matches2.touched && !matches2.loading) return <View/>;
                                        return <StatsPlayer matches={filterMatchesByLeaderboardId(matches2.data)} user={auth} leaderboardId={leaderboardId}/>;
                                    case 'profile':
                                        return <Profile data={profile.data}/>;
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'matches-header':
                                        return <MyText style={styles.sectionHeader}>Match History</MyText>;
                                    default:
                                        return <Game data={item as IMatch} expanded={false}/>;
                                }

                            }}
                            ListFooterComponent={_renderFooter}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.1}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    statsPicker: {
        alignSelf: 'center',
        marginBottom: 10
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 20,
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
