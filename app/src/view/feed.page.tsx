import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList, RootStackProp} from '../../App';
import {RouteProp, useNavigation, useNavigationState, useRoute} from '@react-navigation/native';
import {Game} from './components/game';
import {IMatch, IPlayer} from "../helper/data";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import Search from "./components/search";
import {sameUser, sameUserNull, UserIdBaseWithName, userIdFromBase} from "../helper/user";
import {setFollowing, useMutate, useSelector} from "../redux/reducer";
import {useCachedLazyApi} from "../hooks/use-cached-lazy-api";
import {Button} from "react-native-paper";
import {IFetchedUser} from "../service/user";
import PlayerList, {IPlayerListPlayer} from "./components/player-list";
// import {useCavy} from "cavy";
import {MyText} from "./components/my-text";
import {isEqual, orderBy, uniq} from "lodash-es";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import RefreshControlThemed from "./components/refresh-control-themed";
import {toggleFollowing} from "../service/following";
import {fetchPlayerMatches} from "../api/player-matches";
import {IFollowingEntry} from "../service/storage";
import {createStylesheet} from '../theming-new';


export function feedTitle(props: any) {
    switch (props.route?.params?.action) {
        case 'add':
            return 'Follow Player';
        case 'config':
            return 'Manage Follows';
        default:
            return 'Following';
    }
}

export function feedMenu(props: any) {
    return () => {
        if (props.route?.params?.action) {
            return <View/>;
        }
        return <FeedMenu/>;
    }
}

export function FeedMenu() {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.push('Feed', { action: 'add' })}>
                <FontAwesomeIcon style={styles.menuIcon} name="plus" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}  onPress={() => navigation.push('Feed', { action: 'config' })}>
                <FontAwesomeIcon style={styles.menuIcon} name="cog" size={20} />
            </TouchableOpacity>
        </View>
    );
}

export function FeedList() {
    const styles = useStyles();
    // const generateTestHook = useCavy();
    const navigation = useNavigation<RootStackProp>();
    // generateTestHook('Navigation')(navigation);

    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = activeRoute.name === 'Feed' && activeRoute.params == null;

    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);
    const [prevFollowing, setPrevFollowing] = useState<IFollowingEntry[] | null>(null);

    const matches = useCachedLazyApi(
        [],
        state => state.followedMatches,
        (state, value) => {
            state.followedMatches = value;
        },
        fetchPlayerMatches, 'aoe2de', 0, 15, following
    );

    const refresh = () => {
        if (!isActiveRoute) return;

        if (isEqual(prevFollowing, following)) {
            return;
        }

        if (prevFollowing == null) {
            matches.init('aoe2de', 0, 15, following);
        } else {
            matches.refetch('aoe2de', 0, 15, following);
        }

        setPrevFollowing(following);
    };

    useEffect(() => {
        refresh();
    }, [following, isActiveRoute]);

    const onRefresh = async () => {
        setRefetching(true);
        await Promise.all([matches.reload()]);
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore || !matches.data) return;
        setFetchingMore(true);
        // console.log("FEEDLIST", 'onEndReached');
        await matches.refetch('aoe2de', 0, (matches.data?.length ?? 0) + 15, following);
        setFetchingMore(false);
    };

    const list = [...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    const filterAndSortPlayers = (players: IPlayer[]) => {
        let filteredPlayers = players.filter(p => following.filter(f => sameUserNull(p, f)).length > 0 || sameUserNull(p, auth));
        filteredPlayers = orderBy(filteredPlayers, p => sameUserNull(p, auth));
        return filteredPlayers;
    };

    const gotoPlayer = (player: UserIdBaseWithName) => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const formatPlayer = (player: UserIdBaseWithName, i: number) => {
        return sameUserNull(player, auth) ? (i == 0 ? 'You' : 'you') : player.name;
    };

    if (following?.length === 0 || list.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.centered}>
                        <MyText style={styles.sectionHeader}>Follow players to see their match history.</MyText>
                        <MyText style={styles.sectionHeader}>Click the + button to follow a player.</MyText>
                    </View>
                </View>
            </View>
        );
    }

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    default:
                                        const match = item as IMatch;

                                        if (match == null) {
                                            return <Game data={item as IMatch}/>;
                                        }

                                        const filteredPlayers = filterAndSortPlayers(match.players);
                                        const len = filteredPlayers.length;

                                        let relevantUser = undefined;
                                        if (uniq(filteredPlayers.map(p => p.team)).length === 1) {
                                            relevantUser = filteredPlayers[0];
                                        }

                                        return <View>
                                            {
                                                <MyText style={styles.players}>
                                                    {filteredPlayers.map((p, i) =>
                                                        <MyText key={i}>
                                                            <MyText onPress={() => gotoPlayer(p)}>{formatPlayer(p, i)}</MyText>
                                                            { i < len-2 && <MyText>, </MyText> }
                                                            { i == len-2 && <MyText> and </MyText> }
                                                        </MyText>
                                                    )}
                                                    <MyText> {match.finished ? 'played' : 'playing now'}</MyText>
                                                </MyText>
                                            }
                                            <View style={styles.game}>
                                                <Game data={item as IMatch} highlightedUsers={filteredPlayers} user={relevantUser}/>
                                            </View>
                                        </View>;
                                }
                            }}
                            ListFooterComponent={_renderFooter}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.1}
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

function FeedAction({user}: {user: IPlayerListPlayer}) {
    const mutate = useMutate();
    const following = useSelector(state => state.following);
    const followingThisUser = following.find(f => sameUser(f, user));
    const [loading, setLoading] = useState(false);

    const onSelect = async () => {
        setLoading(true);
        try {
            const following = await toggleFollowing(user);
            if (following) {
                mutate(setFollowing(following));
            }
        } catch(e) {
            alert('Follow/Unfollow failed.\n\n' + e);
        }
        setLoading(false);
    };

    return (
        <Button
            labelStyle={{fontSize: 13, marginVertical: 0}}
            contentStyle={{height: 22}}
            onPress={onSelect}
            disabled={loading}
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

const useStyles = createStylesheet(theme => StyleSheet.create({
    game: {
        marginLeft: 7,
        marginTop: 2,
    },
    menu: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
    },
    menuButton: {
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    menuIcon: {
        color: theme.textColor,
    },

    players: {
        marginBottom: 10,
    },
    centered: {
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
    },
    content: {
        flex: 1,
    },
}));
