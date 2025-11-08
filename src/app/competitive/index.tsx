import { IMatchesMatch } from '@app/api/helper/api.types';
import { useLiveTwitchAccounts } from '@app/api/twitch';
import { useOngoing } from '@app/api/socket/ongoing';
import { tournamentsEnabled, useFeaturedTournaments, useUpcomingTournamentMatches } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Link } from '@app/components/link';
import { ScrollView } from '@app/components/scroll-view';
import { SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import PlayerList from '@app/view/components/player-list';
import { Tag } from '@app/view/components/tag';
import { PlayoffPopup } from '@app/view/tournaments/playoffs/popup';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { TournamentMatch } from '@app/view/tournaments/tournament-match';
import { matchAttributes } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PlayoffMatch } from 'liquipedia';
import { groupBy, orderBy } from 'lodash';
import compact from 'lodash/compact';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import { useTranslation } from '@app/helper/translate';
import { openLinkWithCheck } from '@app/helper/url';
import { showAlert } from '@app/helper/alert';
import { Button } from '@app/components/button';

export default function Competitive() {
    const getTranslation = useTranslation();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const { matches } = useOngoing({ verified: true });

    // console.log('Ongoing matches', matches);

    const { data: tournamentMatches, isLoading: isLoadingUpcomingMatches } = useUpcomingTournamentMatches();
    const filteredMatches = tournamentMatches
        ?.filter((match) => match.startTime && match.tournament)
        .map((match) => ({ ...match, header: { name: match.tournament.name } }));

    const activePlayerIds = matches.flatMap((match) => match.players.map((p) => ({ player: p, match }))).filter(({ player }) => player.verified);

    const [selectedMatch, setSelectedMatch] = useState<{ match: IMatchesMatch; profileId: number }>();
    const [showMatchPopup, setShowMatchPopup] = useState(false);

    const [selectedSet, setSelectedSet] = useState<{ match: PlayoffMatch; tournamentPath: string }>();
    const [showSetPopup, setShowSetPopup] = useState(false);

    const { liveTwitchAccounts } = useLiveTwitchAccounts();

    const activePlayers = orderBy(
        compact(
            activePlayerIds.map(({ player, match }) => {
                const twitch = player.socialTwitchChannel && liveTwitchAccounts?.find((twitch) => twitch.user_login === player.socialTwitchChannel);
                return {
                    ...player,
                    match,
                    isLive: !!twitch,
                    viewerCount: twitch ? twitch.viewer_count : 0,
                };
            })
        ),
        ['isLive', 'viewerCount'],
        ['desc', 'desc']
    );

    const liveTwitch = orderBy(liveTwitchAccounts, 'viewer_count', 'desc')[0];
    const liveTwitchAppUrl = liveTwitch ? `twitch://stream/${liveTwitch.user_login}` : null;
    const liveTwitchUrl = liveTwitch ? `https://player.twitch.tv/?channel=${liveTwitch.user_login}&parent=aoe2companion.com` : null;

    useEffect(() => {
        setIsVideoPlaying(false);
    }, [liveTwitch]);

    useEffect(() => {
        setShowMatchPopup(true);
    }, [selectedMatch]);

    useEffect(() => {
        setShowSetPopup(true);
    }, [selectedSet]);

    useFocusEffect(
        useCallback(() => {
            setIsVideoPlaying(false);

            return () => {
                setIsVideoPlaying(false);
            };
        }, [])
    );

    const { data: featuredTournaments, isLoading } = useFeaturedTournaments();

    const router = useRouter();

    const openMatch = (matchId: number) => {
        router.push(`/matches/single/${matchId}`);
    };

    const playTwitchStream = async () => {
        if (Platform.OS === 'ios') {
            try {
                if (await Linking.canOpenURL(liveTwitchAppUrl!)) {
                    await Linking.openURL(liveTwitchAppUrl!);
                } else {
                    await openLinkWithCheck(liveTwitchUrl!);
                }
            } catch (e: any) {
                showAlert(e.message);
            }
        } else {
            setIsVideoPlaying(true);
        }
    };

    return (
        <ScrollView className="flex-1" contentContainerClassName="pb-4">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('competitive.title'),
                }}
            />
            {/*{selectedMatch && (*/}
            {/*    <MatchPopup*/}
            {/*        isActive={showMatchPopup}*/}
            {/*        onClose={() => setShowMatchPopup(false)}*/}
            {/*        user={selectedMatch.profileId}*/}
            {/*        highlightedUsers={[selectedMatch.profileId]}*/}
            {/*        match={{*/}
            {/*            ...selectedMatch.match,*/}
            {/*            teams: Object.entries(groupBy(selectedMatch.match.players, 'team')).map(([teamId, players]) => ({*/}
            {/*                teamId: Number(teamId),*/}
            {/*                players,*/}
            {/*            })),*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
            {selectedSet && (
                <PlayoffPopup
                    visible={showSetPopup}
                    setVisible={setShowSetPopup}
                    match={selectedSet.match}
                    tournamentPath={selectedSet.tournamentPath} // TODO: If we have this just go to the tournament page directly?
                />
            )}
            <View className="flex-1 pt-4 gap-5">
                {appConfig.game === 'aoe2' && (
                    <View className="gap-2">
                        <View className="flex-row justify-between items-center px-4">
                            <Text variant="header-lg">{getTranslation('competitive.onlineVerifiedPlayers.title')}</Text>
                            <Link href="/competitive/games">{getTranslation('competitive.onlineVerifiedPlayers.viewGames')}</Link>
                        </View>

                        <PlayerList
                            hideIcons
                            selectedUser={(user) => openMatch(user.match.matchId)}
                            list={activePlayers.length > 0 ? activePlayers : ['loading', 'loading', 'loading', 'loading', 'loading']}
                            variant="horizontal"
                            playerStyle={{ width: 100 }}
                            footer={(player) =>
                                player ? (
                                    <>
                                        <Text color="subtle" variant="body-xs" numberOfLines={1}>
                                            {matchAttributes({
                                                ...player.match,
                                                teams: Object.entries(groupBy(player.match.players, 'team')).map(([teamId, players]) => ({
                                                    teamId: Number(teamId),
                                                    players,
                                                })),
                                            }).join(' - ')}
                                        </Text>
                                        <Text color="subtle" variant="body-xs" numberOfLines={1}>
                                            {player.match.mapName}
                                        </Text>
                                        {player.isLive ? <View className="top-1 right-1 w-2 h-2 rounded-full bg-red-600 absolute" /> : null}
                                    </>
                                ) : (
                                    <>
                                        <SkeletonText variant="body-xs" />
                                        <SkeletonText variant="body-xs" />
                                    </>
                                )
                            }
                        />
                    </View>
                )}

                {tournamentsEnabled && (
                    <View className="gap-2">
                        <View className="flex-row justify-between items-center px-4">
                            <Text variant="header-lg">{getTranslation('home.featuredTournaments')}</Text>
                            <Link href="/competitive/tournaments">{getTranslation('home.viewAll')}</Link>
                        </View>

                        <FlatList
                            initialNumToRender={3}
                            showsHorizontalScrollIndicator={false}
                            className="flex-none"
                            horizontal
                            keyboardShouldPersistTaps="always"
                            data={isLoading ? Array(10).fill(null) : featuredTournaments.slice(0, 10)}
                            contentContainerClassName="gap-2.5 px-4"
                            renderItem={({ item }) => <TournamentCard direction="vertical" {...item} />}
                            keyExtractor={(item, index) => item?.path || index}
                        />
                    </View>
                )}

                {tournamentsEnabled && (
                    <View className="gap-2">
                        <Text className="px-4" variant="header-lg">
                            {getTranslation('competitive.upcomingMatches.title')}
                        </Text>

                        <FlatList
                            data={isLoadingUpcomingMatches ? Array(10).fill(null) : filteredMatches}
                            renderItem={(match) => (
                                <TournamentMatch
                                    onPress={() =>
                                        setSelectedSet({
                                            match: match.item as PlayoffMatch,
                                            tournamentPath: encodeURIComponent(match.item.tournament?.path),
                                        })
                                    }
                                    style={{ width: 200 }}
                                    key={match.index}
                                    match={match.item}
                                />
                            )}
                            contentContainerClassName="gap-2.5 px-4"
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<Text>{getTranslation('competitive.upcomingMatches.empty')}</Text>}
                        />
                    </View>
                )}

                {liveTwitch && (
                    <View className="px-4 gap-3">
                        <View className="flex-row justify-between items-center">
                            <Text variant="header-lg">
                                {getTranslation('competitive.twitchStream.title', {
                                    user: liveTwitch.user_name,
                                })}
                            </Text>
                            <Tag leftComponent={<View className="w-2 h-2 rounded-full bg-red-600" />}>{liveTwitch.viewer_count.toString()}</Tag>
                        </View>

                        {isVideoPlaying ? (
                            <WebView
                                allowsFullscreenVideo
                                source={{ uri: liveTwitchUrl! }}
                                style={{ width: '100%', aspectRatio: 800 / 450 }}
                            />
                        ) : (
                            <>
                                {
                                    Platform.OS === 'ios' &&
                                    <Button className="self-start" onPress={playTwitchStream}>Open Stream</Button>
                                }
                                {
                                    Platform.OS !== 'ios' &&
                                    <TouchableOpacity className="relative" onPress={playTwitchStream}>
                                        <Image
                                            source={{ uri: liveTwitch.thumbnail_url.replace('{width}', '800').replace('{height}', '450') }}
                                            style={{ width: '100%', aspectRatio: 800 / 450 }}
                                        />
                                        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                                            <Icon icon="play-circle" size={40} color="subtle" />
                                        </View>
                                    </TouchableOpacity>
                                }
                            </>
                        )}
                    </View>
                )}
            </View>
            <Text variant="body-sm" className="px-4 text-center mt-6">
                Tournament data provided by{' '}
                <Link variant="body-sm" href="https://liquipedia.net/ageofempires">
                    liquipedia.net
                </Link>
            </Text>
        </ScrollView>
    );
}
