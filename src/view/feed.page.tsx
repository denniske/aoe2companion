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
import {IMatch, IPlayer} from "../helper/data";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {fetchMatchesMulti} from "../service/matches";


export default function FeedPage() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();

    const following = [
        {id: "76561197984749679-196240", steam_id: "76561197984749679", profile_id: 196240, name: "TheViper"},
        {id: "76561198044559189-198035", steam_id: "76561198044559189", profile_id: 198035, name: "_DauT_"},
    ];

    const auth = following[0];

    const matches = useApi(
            [],
            state => state.followedMatches,
            (state, value) => {
                // if (state.user[auth.id] == null) {
                //     state.user[auth.id] = {};
                // }
                state.followedMatches = value;
            },
        fetchMatchesMulti, 'aoe2de', 0, 10, following
    );

    const onRefresh = async () => {
        setRefetching(true);
        await Promise.all([matches.reload()]);
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore) return;
        setFetchingMore(true);
        await matches.refetch('aoe2de', 0, (matches.data?.length ?? 0) + 15, following);
        setFetchingMore(false);
    };

    const list = ['matches-header', ...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    const filterPlayers = (players: IPlayer[]) => {
      return players.filter(p => following.filter(f => p.steam_id === f.steam_id && p.profile_id === f.profile_id).length > 0)
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
                                    case 'matches-header':
                                        return <Text style={styles.sectionHeader}>Match History</Text>;
                                    default:
                                        const match = item as IMatch;
                                        return <View>
                                            <Text style={styles.players}>{filterPlayers(match.players).map(p => p.name).join(' and ')} played</Text>
                                            <Game data={item as IMatch} expanded={false}/>
                                        </View>;
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
    players: {
      marginBottom: 10,
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});
