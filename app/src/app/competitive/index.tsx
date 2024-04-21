/* eslint-disable react-hooks/rules-of-hooks */
import { ITwitchChannel } from '@app/api/following';
import { useOngoing } from '@app/api/ongoing';
import { useFeaturedTournaments, useTournamentMatches } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Link } from '@app/components/link';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import PlayerList from '@app/view/components/player-list';
import { Tag } from '@app/view/components/tag';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { TournamentMatch } from '@app/view/tournaments/tournament-match';
import { getHost, getTwitchChannel, getVerifiedPlayer, getVerifiedPlayerIds } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image } from 'expo-image';
import { Stack, router, useFocusEffect } from 'expo-router';
import { orderBy } from 'lodash';
import compact from 'lodash/compact';
import { useCallback, useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';

export default function Competitive() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const proPlayerIds = compact(getVerifiedPlayerIds().map((id) => id?.toString()));
    const { matches } = useOngoing(proPlayerIds);
    const { data: tournamentMatches, isLoading: isLoadingUpcomingMatches } = useTournamentMatches();
    const filteredMatches = tournamentMatches
        ?.filter((match) => match.startTime && match.tournament)
        .map((match) => ({ ...match, header: { name: match.tournament.name } }));

    const activePlayerIds = matches.flatMap((match) => match.players.map((p) => p.profileId.toString())).filter((p) => proPlayerIds.includes(p));

    const { data: liveTwitchAccounts } = useQuery({
        queryKey: ['twitch', 'all'],
        queryFn: async () => {
            const url = getHost('aoe2companion-api') + `twitch/live?game=${appConfig.game === 'aoe2de' ? '13389' : '498482'}`;

            const { data } = await axios.get(url);
            return (Array.isArray(data) ? data : []) as ITwitchChannel[];
        },
        refetchOnWindowFocus: true,
    });
    const activePlayers = orderBy(
        compact(
            activePlayerIds.map((id) => {
                const player = getVerifiedPlayer(Number(id));
                const twitch = player && liveTwitchAccounts?.find((twitch) => twitch.user_login === getTwitchChannel(player));
                return {
                    profileId: Number(id),
                    ...player,
                    isLive: !!twitch,
                    viewerCount: twitch ? twitch.viewer_count : 0,
                };
            })
        ),
        ['isLive', 'viewerCount'],
        ['desc', 'desc']
    );

    const liveTwitch = orderBy(liveTwitchAccounts, 'viewer_count', 'desc')[0];

    useEffect(() => {
        setIsVideoPlaying(false);
    }, [liveTwitch]);

    useFocusEffect(
        useCallback(() => {
            setIsVideoPlaying(false);

            return () => {
                setIsVideoPlaying(false);
            };
        }, [])
    );

    const { data: featuredTournaments, isLoading } = useFeaturedTournaments();

    return (
        <ScrollView className="flex-1" contentContainerStyle="pb-4">
            <Stack.Screen
                options={{
                    title: 'Competitive',
                }}
            />

            <View className="flex-1 pt-4 gap-5">
                {appConfig.game === 'aoe2de' && (
                    <View className="gap-2">
                        <View className="flex-row justify-between items-center px-4">
                            <Text variant="header-lg">Online Verified Players</Text>
                            <Link href="/competitive/games">View Games</Link>
                        </View>

                        <PlayerList
                            hideIcons
                            selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)}
                            list={activePlayers.length > 0 ? activePlayers : ['loading', 'loading', 'loading', 'loading', 'loading']}
                            variant="horizontal"
                            footer={(player) => (player?.isLive ? <View className="top-1 right-1 w-2 h-2 rounded-full bg-red-600 absolute" /> : null)}
                        />
                    </View>
                )}

                {Platform.OS !== 'web' && (
                    <View className="gap-2">
                        <View className="flex-row justify-between items-center px-4">
                            <Text variant="header-lg">Featured Tournaments</Text>
                            <Link href="/competitive/tournaments">View All</Link>
                        </View>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            className="flex-none"
                            horizontal
                            keyboardShouldPersistTaps="always"
                            data={isLoading ? Array(10).fill(null) : featuredTournaments.slice(0, 10)}
                            contentContainerStyle="gap-2.5 px-4"
                            renderItem={({ item }) => <TournamentCard direction="vertical" {...item} />}
                            keyExtractor={(item, index) => item?.path || index}
                        />
                    </View>
                )}

                {Platform.OS !== 'web' && (
                    <View className="gap-2">
                        <Text className="px-4" variant="header-lg">
                            Upcoming Tournament Matches
                        </Text>

                        <FlatList
                            data={isLoadingUpcomingMatches ? Array(10).fill(null) : filteredMatches}
                            renderItem={(match) => (
                                <TournamentMatch
                                    onPress={() => router.navigate(`/competitive/tournaments/${encodeURIComponent(match.item.tournament.path)}`)}
                                    style={{ width: 250 }}
                                    key={match.index}
                                    match={match.item}
                                />
                            )}
                            contentContainerStyle="gap-2.5 px-4"
                            horizontal
                            ListEmptyComponent={<Text>No upcoming matches right now. Check back later!</Text>}
                        />
                    </View>
                )}

                {liveTwitch && (
                    <View className="px-4 gap-3">
                        <View className="flex-row justify-between items-center">
                            <Text variant="header-lg">Twitch Stream - {liveTwitch.user_name}</Text>
                            <Tag leftComponent={<View className="w-2 h-2 rounded-full bg-red-600" />}>{liveTwitch.viewer_count.toString()}</Tag>
                        </View>

                        {isVideoPlaying ? (
                            <WebView
                                allowsFullscreenVideo
                                source={{ uri: `https://player.twitch.tv/?channel=${liveTwitch.user_login}&parent=aoe2companion.com` }}
                                style={{ width: '100%', aspectRatio: 800 / 450 }}
                            />
                        ) : (
                            <TouchableOpacity className="relative" onPress={() => setIsVideoPlaying(true)}>
                                <Image
                                    source={{ uri: liveTwitch.thumbnail_url.replace('{width}', '800').replace('{height}', '450') }}
                                    style={{ width: '100%', aspectRatio: 800 / 450 }}
                                />
                                <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                                    <Icon icon="play-circle" size={40} color="text-blue-800" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
