import { tournamentsEnabled, useFeaturedTournament } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Link } from '@app/components/link';
import { Match } from '@app/components/match/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useFollowedTournaments } from '@app/service/followed-tournaments';
import { useFavoritedBuilds } from '@app/service/storage';
import { useAccountMostRecentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '@app/components/button';
import { useAuthProfileId, useInfiniteBuilds, useMapsPoll, useMapsRanked } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { Image } from 'expo-image';
import ButtonPicker from '@app/view/components/button-picker';
import { isWithinInterval } from 'date-fns';
import { formatDayAndTime } from '@nex/data';
import { useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import { BuildCard } from '@app/view/components/build-order/build-card';
import { compact } from 'lodash';

export function FavoritedBuilds() {
    const getTranslation = useTranslation();
    const { favoriteIds } = useFavoritedBuilds();
    const { data } = useInfiniteBuilds({ build_ids: favoriteIds });
    const favorites = compact(data?.pages?.flatMap((p) => p.builds));

    return (
        <View className="gap-2">
            <View className="flex-row justify-between items-center">
                <Text variant="header-lg">{getTranslation('home.favoriteBuildOrders')}</Text>
                <Link href="/explore/build-orders">{getTranslation('home.viewAll')}</Link>
            </View>

            <FlatList
                showsHorizontalScrollIndicator={false}
                className="flex-none"
                horizontal
                keyboardShouldPersistTaps="always"
                data={favorites}
                contentContainerStyle="gap-2.5"
                renderItem={({ item }) => <BuildCard size="small" {...item} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

export default function IndexPage() {
    const appStyles = useTheme(appVariants);
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const tournament = useFeaturedTournament();
    const accountMostRecentMatches = useAccountMostRecentMatches(1);
    const accountMostRecentMatch = accountMostRecentMatches?.length ? accountMostRecentMatches[0] : null;
    const { data: news = Array(3).fill(null) } = useNews();
    const { favoriteIds } = useFavoritedBuilds();
    const router = useRouter();
    const { followedIds } = useFollowedTournaments();
    const { data: mapsRanked } = useMapsRanked();
    const { data: mapsPoll } = useMapsPoll();

    const [rankedMapLeaderboard, setRankedMapLeaderboard] = useState<string>();
    const values: string[] = mapsRanked?.leaderboards?.map((l) => l.leaderboardId) || [];
    const firstValue = mapsRanked?.leaderboards?.map((l) => l.leaderboardId)?.[0];
    const formatLeaderboard = (leaderboardId: string) => mapsRanked?.leaderboards?.find((l) => l.leaderboardId === leaderboardId)?.abbreviation ?? '';

    return (
        // <ScrollView contentContainerStyle="p-4 gap-5" className="scrollbar dark:scrollbar-dark">
        <ScrollView contentContainerStyle="p-4 gap-5">
            <Stack.Screen
                options={{
                    animation: 'none',
                    headerRight: () => (
                        <Button href={'/matches/users/search'} icon="search">
                            {getTranslation('home.findPlayer')}
                        </Button>
                    ),
                    title: getTranslation('home.title'),
                }}
            />

            <View className="-mx-4">
                <FollowedPlayers />
            </View>

            {authProfileId && (
                <View className="gap-2">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">
                            {getTranslation(accountMostRecentMatch?.finished === null ? 'home.current' : 'home.mostRecent')} Match
                        </Text>
                        <Link href="/matches/current">Open My Dashboard</Link>
                    </View>
                    <View className="gap-2">
                        <Match
                            user={accountMostRecentMatch?.filteredPlayers[0]}
                            highlightedUsers={accountMostRecentMatch?.filteredPlayers}
                            match={accountMostRecentMatch}
                        />
                    </View>
                </View>
            )}

            {favoriteIds.length > 0 && (
                <FavoritedBuilds />
            )}

            {tournamentsEnabled ? (
                <View className="gap-2">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">
                            {followedIds[0] ? getTranslation('home.favoriteTournament') : getTranslation('home.featuredTournament')}
                        </Text>
                        <Link href="/competitive/tournaments">{getTranslation('home.viewAll')}</Link>
                    </View>
                    {followedIds[0] ? <TournamentCardLarge path={followedIds[0]} /> : <TournamentCardLarge {...tournament} />}
                </View>
            ) : null}

            <View className="gap-2">
                <Text variant="header-lg">Recent News</Text>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle="gap-4 px-4"
                    className="-mx-4"
                    horizontal
                    data={news}
                    renderItem={({ item }) => <NewsCard {...item} />}
                />
            </View>

            <View className="gap-2">
                <Text variant="header-lg" className="mb-1">
                    Ranked Maps
                </Text>
                {!!mapsPoll && (
                    <View className="flex-row justify-between items-center mb-3">
                        {
                            isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.expired }) ?
                                <Text variant="body">New Map Rotation on {formatDayAndTime(mapsPoll.expired)}</Text> :
                                <Text variant="body">Maps active since {formatDayAndTime(mapsPoll.expired)}</Text>
                        }
                        {
                            isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.finished }) ?
                                <Link href="/explore/maps/poll">View Active Poll</Link> :
                                <Link href="/explore/maps/poll">View Poll Results</Link>
                        }
                    </View>
                )}
                {!!mapsRanked?.leaderboards && mapsRanked?.leaderboards?.length > 0 && (
                    <>
                        <View className="mb-3">
                            <ButtonPicker
                                flex={true}
                                value={rankedMapLeaderboard ?? firstValue}
                                values={values}
                                formatter={formatLeaderboard}
                                onSelect={setRankedMapLeaderboard}
                            />
                        </View>
                        <View className="flex-row flex-wrap">
                            {mapsRanked?.leaderboards
                                ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                                ?.maps?.map((map) => (
                                    <TouchableOpacity
                                        key={map.mapId}
                                        className="flex-col justify-between items-center w-[25%] mb-4"
                                        onPress={() => router.push(`/explore/maps/${map.mapId}` as any)}
                                    >
                                        <Image source={{ uri: map.imageUrl }} className="mb-2 w-[75px] h-[75px]" />
                                        <Text variant={'body-sm'} className="text-center mb-1">
                                            {map.mapName}
                                        </Text>
                                        <Text variant={'body-sm'} className="text-center">
                                            {map.percentage.toFixed(0)} %
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}



// <Button onPress={crashSetImage}>Crash</Button>
//
// {authProfileId && (
//     <View className="gap-2">
//         <Text variant="header-lg">
//             Current Lobby/Match
//         </Text>
//         <Link href="/matches/current">
//             {getTranslation('home.viewAll')}
//         </Link>
//         {/*<View className="gap-2">*/}
//         {/*    <Match user={accountMostRecentMatch?.filteredPlayers[0]} highlightedUsers={accountMostRecentMatch?.filteredPlayers} match={accountMostRecentMatch} />*/}
//         {/*</View>*/}
//     </View>
// )}