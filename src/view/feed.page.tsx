import React, {useEffect, useRef, useState} from 'react';
import {AsyncStorage, FlatList, StyleSheet, Text, View} from 'react-native';
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
import Search from "./components/search";
import {composeUserId, UserInfo} from "../helper/user";
import {setAuth, setFollowing, useMutate, useSelector} from "../redux/reducer";
import {loadFollowingFromStorage, loadSettingsFromStorage, saveFollowingToStorage} from "../service/storage";
import {useCavy} from "cavy";
import {useCachedLazyApi} from "../hooks/use-cached-lazy-api";
import {usePrevious} from "../hooks/use-previous";


export function FeedList() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

    const following = useSelector(state => state.following);
    const prevFollowing = usePrevious({following});

    // console.log("following", following);
    // console.log("prevFollowing", prevFollowing);

    // const following = [
    //     {id: "76561197984749679-196240", steam_id: "76561197984749679", profile_id: 196240, name: "TheViper"},
    //     {id: "76561198044559189-198035", steam_id: "76561198044559189", profile_id: 198035, name: "_DauT_"},
    // ];

    const matches = useCachedLazyApi(
        [],
        state => state.followedMatches,
        (state, value) => {
            state.followedMatches = value;
        },
        fetchMatchesMulti, 'aoe2de', 0, 15, following
    );

    const refresh = () => {
        // console.log("refresh <-->");
        // console.log("following2", following);
        // console.log("prevFollowing2", prevFollowing);
        if (prevFollowing == null) {
            matches.init('aoe2de', 0, 15, following);
        } else {
            matches.refetch('aoe2de', 0, 15, following);
        }
    };

    useEffect(() => {
        refresh();
    }, [following]);

    // useEffect(() => {
    //     console.log("REACTIVATE");
    // }, []);

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

    const list = [...(matches.data || Array(15).fill(null))];

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
                                    // case 'matches-header':
                                    //     return <Text style={styles.sectionHeader}>Match History</Text>;
                                    default:
                                        const match = item as IMatch;
                                        return <View>
                                            {
                                                match &&
                                                <Text style={styles.players}>{filterPlayers(match.players).map(p => p.name).join(' and ')} {match.finished ? 'played' : 'playing now'}</Text>
                                            }
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

export default function FeedPage() {


    const route = useRoute<RouteProp<RootStackParamList, 'Feed'>>();
    const mutate = useMutate();

    const onSelect = async (user: UserInfo) => {
        const following = await loadFollowingFromStorage();
        following.push({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        });
        await saveFollowingToStorage(following);
        mutate(setFollowing(following));
    };

    if (route.params?.action) {
        return <Search title="Enter AoE username you want to follow:" selectedUser={onSelect} actionText="Follow" />;
    }

    return <FeedList/>;
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
