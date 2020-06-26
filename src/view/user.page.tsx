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


export default function UserPage() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

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

    const list = ['profile', 'rating-header', 'rating', 'matches-header', ...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
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
                                    case 'profile':
                                        return <Profile data={profile.data}/>;
                                    case 'rating-header':
                                        return <Text style={styles.sectionHeader}>Rating History</Text>;
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'matches-header':
                                        return <Text style={styles.sectionHeader}>Match History</Text>;
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});
