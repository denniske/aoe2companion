import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {RouteProp, useNavigationState, useRoute} from '@react-navigation/native';
import {Game} from './components/game';
import {IMatch, IPlayer} from "../helper/data";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {fetchMatchesMulti} from "../service/matches";
import Search from "./components/search";
import {sameUser} from "../helper/user";
import {setFollowing, useMutate, useSelector} from "../redux/reducer";
import {toggleFollowingInStorage} from "../service/storage";
import {useCachedLazyApi} from "../hooks/use-cached-lazy-api";
import {usePrevious} from "../hooks/use-previous";
import {Button} from "react-native-paper";
import {IFetchedUser} from "../service/user";
import PlayerList, {IPlayerListPlayer} from "./components/player-list";


export function FeedList() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = activeRoute.name === 'Feed' && activeRoute.params == null;

    const following = useSelector(state => state.following);
    const prevFollowing = usePrevious({following});

    console.log("following", following);

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
        if (!isActiveRoute) return;
        // AsyncStorage.removeItem('following');
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
    }, [following, isActiveRoute]);

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
                    {
                        list.length === 0 &&
                            <View style={styles.centered}>
                                <Text style={styles.sectionHeader}>Follow players to see their match history.</Text>
                                <Text style={styles.sectionHeader}>Click the + button to follow a player.</Text>
                            </View>
                    }
                    <FlatList
                            onRefresh={onRefresh}
                            refreshing={refetching}
                            style={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    default:
                                        const match = item as IMatch;
                                        return <View>
                                            {
                                                match &&
                                                <Text style={styles.players}>{filterPlayers(match.players).map(p => p.name).join(' and ')} {match.finished ? 'played' : 'playing now'}</Text>
                                                // <Text style={styles.players}>{filterPlayers(match.players).map(p => `${p.name} (${p.rating_change})`).join(' and ')} {match.finished ? 'played' : 'playing now'}</Text>
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

function FeedAction({user}: {user: IPlayerListPlayer}) {
    const mutate = useMutate();
    const following = useSelector(state => state.following);
    const followingThisUser = following.find(f => sameUser(f, user));

    const onSelect = async () => {
        const following = await toggleFollowingInStorage(user);
        if (following) {
            mutate(setFollowing(following));
        }
    };

    return (
        <Button
            labelStyle={{fontSize: 13, marginVertical: 0}}
            contentStyle={{height: 22}}
            onPress={onSelect}
            mode="contained"
            compact
            uppercase={false}
            dark={true}
        >
            {followingThisUser ? 'Unfollow' : 'Follow'}
        </Button>
    );
}

export function FeedAdd() {
    return <Search
        title="Enter AoE username you want to follow:"
        action={
            (user: IFetchedUser) => <FeedAction user={user}/>
        }
    />;
}

export function FeedConfig() {
    const following = useSelector(state => state.following);
    return <PlayerList
        list={following}
        action={
            (user: IPlayerListPlayer) => <FeedAction user={user}/>
        }
    />;
}

export default function FeedPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Feed'>>();

    if (route.params?.action === 'add') {
        return <FeedAdd/>;
    }
    if (route.params?.action === 'config') {
        return <FeedConfig/>;
    }

    return <FeedList/>;
}

const styles = StyleSheet.create({
    players: {
      marginBottom: 10,
    },
    centered: {
        // backgroundColor: 'yellow',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
