import { Button } from '@app/components/button';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Match } from '@app/components/match';
import { Text } from '@app/components/text';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { MyText } from '@app/view/components/my-text';
import { ProfileLive } from '@app/view/components/profile';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { flatten, orderBy, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { fetchMatches } from '../../api/helper/api';
import { IMatchNew, IPlayerNew } from '../../api/helper/api.types';
import { openLink } from '../../helper/url';
import { useWebRefresh } from '../../hooks/use-web-refresh';
import { Link } from '@app/components/link';
import { useAccountData, useFollowedAndMeProfileIds } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';

export default function MatchesPage() {
    const getTranslation = useTranslation();
    const [refetching, setRefetching] = useState(false);

    const isActiveRoute = true;

    const { match_id: matchId } = useLocalSearchParams<{ match_id: string }>();

    const authProfileId = useAccountData((data) => data.profileId);
    const followedPlayers = useAccountData((data) => data.followedPlayers);
    const profileIds = useFollowedAndMeProfileIds();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, error } = useInfiniteQuery({
        queryKey: ['feed-matches', profileIds],
        queryFn: (context) =>
            fetchMatches({
                ...context,
                profileIds,
            }),
        enabled: !!profileIds,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => (lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null),
        placeholderData: keepPreviousData,
    });

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    useEffect(() => {
        if (matchId && !refetching) {
            onRefresh();
        }
    }, [matchId]);

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const list = data?.pages?.flatMap((p) => p.matches) || Array(15).fill(null);

    const _renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return <FlatListLoadingIndicator />;
    };

    const filterAndSortPlayers = (players: IPlayerNew[]) => {
        let filteredPlayers = players.filter(
            (p) => followedPlayers.filter((f) => f.profileId === p.profileId).length > 0 || p.profileId == authProfileId
        );
        filteredPlayers = orderBy(filteredPlayers, (p) => p.profileId == authProfileId);
        return filteredPlayers;
    };

    const gotoPlayer = (profileId: number) => {
        router.push(`/matches/users/${profileId}`);
    };

    const formatPlayer = (player: any, i: number) => {
        return player?.profileId === authProfileId
            ? i == 0
                ? getTranslation('feed.following.you')
                : getTranslation('feed.following.you').toLowerCase()
            : player.name;
    };

    const spectate = async (match_id: number) => {
        const url = `aoe2de://1/${match_id}`;
        await openLink(url);
    };

    return (
        <View className="flex-1">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: 'Matches',
                    headerRight: () => (
                        <Button href="/matches/users/search" icon="search">
                            Find Player
                        </Button>
                    ),
                }}
            />
            <View className="pb-5 pt-4">
                <FollowedPlayers />
            </View>

            <View className="flex-row justify-between items-center px-4">
                <Text variant="header-lg">Live and Recent Matches</Text>
                <Link href="/matches/live">View Lobbies</Link>
            </View>

            {error ? (
                <View className="flex-1">
                    <View className="flex-1">
                        <View className="h-full items-center justify-center">
                            <Text className="my-5" variant="label" align="center">
                                {getTranslation('leaderboard.error')}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : profileIds?.length === 0 || list.length === 0 ? (
                <View className="flex-1 p-4 gap-1">
                    <Text variant="label">{getTranslation('feed.following.info.1')}</Text>
                    <Link href="/matches/users/follow">
                        <Text variant="body-sm">{getTranslation('feed.following.info.2')}</Text>
                    </Link>
                </View>
            ) : (
                <View className="flex-1">
                    {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
                    {Platform.OS === 'web' && refetching && <FlatListLoadingIndicator />}
                    <FlatList
                        contentContainerStyle="gap-2 px-4 pt-2"
                        data={list}
                        renderItem={({ item, index }) => {
                            const match = item as IMatchNew;

                            if (match == null) {
                                return <Match match={item} />;
                            }

                            const players = flatten(match.teams.map((t) => t.players));
                            const filteredPlayers = filterAndSortPlayers(players);
                            const len = filteredPlayers.length;

                            if (len === 0) {
                                return <Match match={item} />;
                            }

                            let samePlayers = false;
                            if (index > 0) {
                                const previousMatch = list[index - 1] as IMatchNew;
                                const previousPlayers = flatten(previousMatch.teams.map((t) => t.players));
                                const previousFilteredPlayers = filterAndSortPlayers(previousPlayers);

                                // console.log('match', index, match.match_id);
                                // console.log('previousMatchFilteredPlayers.length', previousFilteredPlayers.length);
                                // console.log('filteredPlayers.length', filteredPlayers.length);
                                // console.log('uniq', uniq([...filteredPlayers, ...previousFilteredPlayers].map(p => p.profileId)));

                                const overlapPlayers = uniq([...filteredPlayers, ...previousFilteredPlayers].map((p) => p.profileId));

                                if (
                                    !!match.finished == !!previousMatch.finished &&
                                    previousFilteredPlayers.length == filteredPlayers.length &&
                                    overlapPlayers.length == filteredPlayers.length
                                ) {
                                    samePlayers = true;
                                }
                            }

                            const allFilteredPlayersSameResult =
                                filteredPlayers.every((p) => p.won === true) || filteredPlayers.every((p) => p.won === false);
                            const highlightedUsers = filteredPlayers?.map((p) => p.profileId);

                            let relevantUser = undefined;

                            if (authProfileId && highlightedUsers.includes(authProfileId)) {
                                relevantUser = { profileId: authProfileId };
                            } else if (allFilteredPlayersSameResult || !match.finished) {
                                relevantUser = filteredPlayers[0];
                            }

                            return (
                                <View>
                                    {!samePlayers && (
                                        <Text className="flex-row flex-wrap items-center mb-3">
                                            {filteredPlayers.map((p, i) => (
                                                <MyText key={i} className="flex-row flex-wrap items-center">
                                                    <Text variant="header-xs" onPress={() => gotoPlayer(p.profileId)}>
                                                        {formatPlayer(p, i)}
                                                    </Text>

                                                    {!match.finished && (
                                                        // match.match_id == '72116505' &&
                                                        <ProfileLive data={p} />
                                                    )}

                                                    {i < len - 2 && <MyText>, </MyText>}
                                                    {i == len - 2 && <MyText> {getTranslation('feed.following.and')} </MyText>}
                                                </MyText>
                                            ))}
                                            {filteredPlayers[0].profileId === authProfileId && (
                                                <MyText>
                                                    {' '}
                                                    {match.finished
                                                        ? getTranslation('feed.following.yplayed')
                                                        : getTranslation('feed.following.yplayingnow')}
                                                </MyText>
                                            )}
                                            {filteredPlayers[0].profileId !== authProfileId && filteredPlayers.length == 1 && (
                                                <MyText>
                                                    {' '}
                                                    {match.finished
                                                        ? getTranslation('feed.following.played')
                                                        : getTranslation('feed.following.playingnow')}
                                                </MyText>
                                            )}
                                            {filteredPlayers[0].profileId !== authProfileId && filteredPlayers.length > 1 && (
                                                <MyText>
                                                    {' '}
                                                    {match.finished
                                                        ? getTranslation('feed.following.2played')
                                                        : getTranslation('feed.following.2playingnow')}
                                                </MyText>
                                            )}
                                            {Platform.OS === 'web' && !match.finished && (
                                                <MyText onPress={() => spectate(match.matchId)}> (Spectate)</MyText>
                                            )}
                                        </Text>
                                    )}
                                    <Match
                                        expanded={Number(item.matchId) === Number(matchId)}
                                        match={item as IMatchNew}
                                        highlightedUsers={highlightedUsers}
                                        user={relevantUser?.profileId ?? filteredPlayers[0]?.profileId}
                                        showLiveActivity={!match.finished}
                                    />
                                </View>
                            );
                        }}
                        ListFooterComponent={_renderFooter}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                    />
                </View>
            )}
        </View>
    );
}
