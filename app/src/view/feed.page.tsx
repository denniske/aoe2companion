import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList, RootStackProp} from '../../App2';
import {RouteProp, useNavigation, useNavigationState, useRoute} from '@react-navigation/native';
import {Game} from './components/game';
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import Search from "./components/search";
import {setFollowing, useMutate, useSelector} from "../redux/reducer";
import {Button} from "react-native-paper";
import PlayerList, {IPlayerListPlayer} from "./components/player-list";
import {MyText} from "./components/my-text";
import {flatten, orderBy, uniq} from 'lodash';
import {FontAwesome} from "@expo/vector-icons";
import RefreshControlThemed from "./components/refresh-control-themed";
import {toggleFollowing} from "../service/following";
import {createStylesheet} from '../theming-new';
import {getTranslation} from '../helper/translate';
import {ProfileLive} from './components/profile';
import {useWebRefresh} from "../hooks/use-web-refresh";
import {isElectron, useLastNotificationReceivedElectron} from "../helper/electron";
import {openLink} from "../helper/url";
import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchMatches} from "../api/helper/api";
import {IMatchNew, IPlayerNew, IProfilesResultProfile} from "../api/helper/api.types";


export function feedTitle(props: any) {
    switch (props.route?.params?.action) {
        case 'add':
            return getTranslation('feed.follow.title');
        case 'config':
            return getTranslation('feed.manage.title');
        default:
            return getTranslation('feed.following.title');
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
                <FontAwesome style={styles.menuIcon} name="plus" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}  onPress={() => navigation.push('Feed', { action: 'config' })}>
                <FontAwesome style={styles.menuIcon} name="cog" size={20} />
            </TouchableOpacity>
        </View>
    );
}

export function FeedList() {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Feed'>>();
    const matchId = route.params?.match_id;

    const [refetching, setRefetching] = useState(false);

    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index] as RouteProp<RootStackParamList, 'Feed'>;
    const isActiveRoute = activeRoute.name === 'Feed' && activeRoute.params?.action == null;

    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery(
        ['feed-matches', following?.map(f => f.profileId)],
        (context) => {
            return fetchMatches({
                ...context,
                profileIds: context.queryKey[1] as number[],
            });
        }, {
            getNextPageParam: (lastPage, pages) => lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null,
            keepPreviousData: true,
        });

    if (isElectron()) {
        const lastNotificationReceivedElectron = useLastNotificationReceivedElectron();

        useEffect(() => {
            console.log('lastNotificationReceivedElectron', lastNotificationReceivedElectron);
            console.log('isActiveRoute', isActiveRoute);
            if (!isActiveRoute) return;
            if (!lastNotificationReceivedElectron?.data?.match_id) return;
            onRefresh();
        }, [lastNotificationReceivedElectron]);
    }

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const list = flatten(data?.pages?.map(p => p.matches) || Array(15).fill(null));

    const _renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return <FlatListLoadingIndicator />;
    };

    const filterAndSortPlayers = (players: IPlayerNew[]) => {
        let filteredPlayers = players.filter(p => following.filter(f => f.profileId === p.profileId).length > 0 || p.profileId == auth?.profileId);
        filteredPlayers = orderBy(filteredPlayers, p => p.profileId == auth?.profileId);
        return filteredPlayers;
    };

    const gotoPlayer = (profileId: number) => {
        navigation.push('User', {
            profileId,
        });
    };

    const formatPlayer = (player: any, i: number) => {
        return player?.profileId === auth?.profileId ? (i == 0 ? getTranslation('feed.following.you') : getTranslation('feed.following.you').toLowerCase()) : player.name;
    };

    if (following?.length === 0 || list.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.centered}>
                        <MyText style={styles.sectionHeader}>{getTranslation('feed.following.info.1')}</MyText>
                        <MyText style={styles.sectionHeader}>{getTranslation('feed.following.info.2')}</MyText>
                    </View>
                </View>
            </View>
        );
    }

    const spectate = async (match_id: number) => {
        const url = `aoe2de://1/${match_id}`;
        await openLink(url);
    };

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
                    {
                        Platform.OS === 'web' && refetching &&
                        <FlatListLoadingIndicator/>
                    }
                    <FlatList
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    default:
                                        const match = item as IMatchNew;

                                        if (match == null) {
                                            return <Game match={item}/>;
                                        }

                                        const players = flatten(match.teams.map(t => t.players));
                                        const filteredPlayers = filterAndSortPlayers(players);
                                        const len = filteredPlayers.length;

                                        if (len == 0) {
                                            return <Game match={item}/>;
                                        }

                                        let samePlayers = false;
                                        if (index > 0) {
                                            const previousMatch = list[index-1] as IMatchNew;
                                            const previousPlayers = flatten(previousMatch.teams.map(t => t.players));
                                            const previousFilteredPlayers = filterAndSortPlayers(previousPlayers);

                                            // console.log('match', index, match.match_id);
                                            // console.log('previousMatchFilteredPlayers.length', previousFilteredPlayers.length);
                                            // console.log('filteredPlayers.length', filteredPlayers.length);
                                            // console.log('uniq', uniq([...filteredPlayers, ...previousFilteredPlayers].map(p => p.profileId)));

                                            const overlapPlayers = uniq([...filteredPlayers, ...previousFilteredPlayers].map(p => p.profileId));

                                            if (!!match.finished == !!previousMatch.finished &&
                                                previousFilteredPlayers.length == filteredPlayers.length &&
                                                overlapPlayers.length == filteredPlayers.length
                                            ) {
                                                samePlayers = true;
                                            }
                                        }

                                        const allFilteredPlayersSameResult = filteredPlayers.every(p => p.won === true)
                                                                          || filteredPlayers.every(p => p.won === false);

                                        let relevantUser = undefined;
                                        if (allFilteredPlayersSameResult) {
                                            relevantUser = filteredPlayers[0];
                                        }

                                        return <View>
                                            {
                                                !samePlayers &&
                                                <MyText style={styles.players}>
                                                    {filteredPlayers.map((p, i) =>
                                                        <MyText key={i} style={styles.players2}>
                                                            <MyText style={styles.player} onPress={() => gotoPlayer(p.profileId)}>{formatPlayer(p, i)}</MyText>

                                                            {
                                                                !match.finished &&
                                                                // match.match_id == '72116505' &&
                                                                <ProfileLive data={p}/>
                                                            }

                                                            { i < len-2 && <MyText>, </MyText> }
                                                            { i == len-2 && <MyText> {getTranslation('feed.following.and')} </MyText> }
                                                        </MyText>
                                                    )}
                                                    {
                                                        filteredPlayers[0].profileId === auth?.profileId &&
                                                        <MyText> {match.finished ? getTranslation('feed.following.yplayed') : getTranslation('feed.following.yplayingnow')}</MyText>
                                                    }
                                                    {
                                                        filteredPlayers[0].profileId !== auth?.profileId && filteredPlayers.length == 1 &&
                                                        <MyText> {match.finished ? getTranslation('feed.following.played') : getTranslation('feed.following.playingnow')}</MyText>
                                                    }
                                                    {
                                                        !filteredPlayers[0].profileId !== auth?.profileId && filteredPlayers.length > 1 &&
                                                        <MyText> {match.finished ? getTranslation('feed.following.2played') : getTranslation('feed.following.2playingnow')}</MyText>
                                                    }
                                                    {
                                                        Platform.OS === 'web' && !match.finished &&
                                                        <MyText style={styles.player} onPress={() => spectate(match.matchId)}> (Spectate)</MyText>
                                                    }
                                                </MyText>
                                            }
                                            <View style={styles.game}>
                                                <Game expanded={item.matchId === matchId} match={item as IMatchNew} highlightedUsers={filteredPlayers?.map(p => p.profileId)} user={relevantUser?.profileId} showLiveActivity={!match.finished}/>
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
    const followingThisUser = following.find(f => f.profileId === user.profileId);
    const [loading, setLoading] = useState(false);

    const onSelect = async () => {
        setLoading(true);
        try {
            const following = await toggleFollowing(user);
            if (following) {
                mutate(setFollowing(following));
            }
        } catch(e) {
            alert(getTranslation('feed.follow.error') + '\n\n' + e);
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
            {followingThisUser ? getTranslation('feed.follow.unfollow') : getTranslation('feed.follow.follow')}
        </Button>
    );
}

export function FeedAdd() {
    return <Search
        action={
            (user: IProfilesResultProfile) => <FeedAction user={user}/>
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
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 12,
        lineHeight: 24,
    },
    players2: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    player: {
        fontWeight: 'bold',
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
