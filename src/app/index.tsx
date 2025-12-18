import { tournamentsEnabled, useFeaturedTournament } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Link } from '@app/components/link';
import { Match } from '@app/components/match/match';
import { NewsCard, NewsCardSkeleton } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useFollowedTournaments } from '@app/service/favorite-tournaments';
import { useAccountMostRecentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button } from '@app/components/button';
import { useAuthProfileId, useInfiniteBuilds } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import { BuildCard, BuildSkeletonCard } from '@app/view/components/build-order/build-card';
import { compact } from 'lodash';
import { useFavoritedBuilds } from '@app/service/favorite-builds';
import { appConfig } from '@nex/dataset';
import { RankedMaps } from '@app/components/ranked-maps';
import { AnimateIn } from '@app/components/animate-in';
import { useShowTabBar } from '../hooks/use-show-tab-bar';

const FavoritedBuilds: React.FC<{ favoriteIds: string[] }> = ({ favoriteIds }) => {
    const getTranslation = useTranslation();
    const { data, isPending } = useInfiniteBuilds({ build_ids: favoriteIds });
    const favorites = compact(data?.pages?.flatMap((p) => p.builds));

    return (
        <View className="gap-2">
            <View className="flex-row justify-between items-center">
                <Text variant="header-lg">{getTranslation('home.favoriteBuildOrders')}</Text>
                <Link href="/explore/build-orders">{getTranslation('home.viewAll')}</Link>
            </View>

            <FlatList
                showsHorizontalScrollIndicator={false}
                className="flex-none -mx-4"
                horizontal
                keyboardShouldPersistTaps="always"
                data={isPending ? favoriteIds.map(() => null) : favorites}
                contentContainerClassName="gap-2.5 px-4"
                renderItem={({ item }) => (item ? <BuildCard size="small" {...item} /> : <BuildSkeletonCard size="small" />)}
                keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
            />
        </View>
    );
};

export default function IndexPage() {
    const appStyles = useTheme(appVariants);
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const tournament = useFeaturedTournament();
    const accountMostRecentMatches = useAccountMostRecentMatches(1);
    const accountMostRecentMatch = accountMostRecentMatches?.length ? accountMostRecentMatches[0] : null;
    const { data: news = Array<null>(3).fill(null) } = useNews();
    const { favoriteIds } = useFavoritedBuilds();
    const { followedIds } = useFollowedTournaments();
    const showTabBar = useShowTabBar();

    return (
        <ScrollView contentContainerClassName="p-4">
            <Stack.Screen
                options={{
                    animation: 'none',
                    headerRight: () =>
                        showTabBar ? (
                            <Button href={'/matches/users/search'} icon="search">
                                {getTranslation('home.findPlayer')}
                            </Button>
                        ) : null,
                    title: getTranslation('home.title'),
                }}
            />

            <View className="-mx-4 mb-5">
                <FollowedPlayers />
            </View>

            {authProfileId && (
                <AnimateIn>
                    <View className="gap-2 pb-5">
                        <View className="flex-row justify-between items-center">
                            <Text variant="header-lg">
                                {getTranslation(accountMostRecentMatch?.finished === null ? 'home.current' : 'home.mostRecent')} Match
                            </Text>
                            <Link href="/matches/live/mine">Open My Dashboard</Link>
                        </View>
                        <View className="gap-2">
                            <Match
                                user={accountMostRecentMatch?.filteredPlayers[0]}
                                highlightedUsers={accountMostRecentMatch?.filteredPlayers}
                                match={accountMostRecentMatch}
                            />
                        </View>
                    </View>
                </AnimateIn>
            )}

            {favoriteIds.length > 0 && (
                <AnimateIn>
                    <View className='pb-5'>
                        <FavoritedBuilds favoriteIds={favoriteIds} />
                    </View>
                </AnimateIn>
            )}

            {tournamentsEnabled ? (
                <View className="gap-2 pb-5">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">
                            {followedIds[0] ? getTranslation('home.favoriteTournament') : getTranslation('home.featuredTournament')}
                        </Text>
                        <Link href="/competitive/tournaments">{getTranslation('home.viewAll')}</Link>
                    </View>
                    {followedIds[0] ? <TournamentCardLarge path={followedIds[0]} /> : <TournamentCardLarge {...tournament} />}
                </View>
            ) : null}

            <View className="gap-2 pb-5">
                <Text variant="header-lg">Recent News</Text>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-4 px-4"
                    className="-mx-4"
                    horizontal
                    data={news}
                    renderItem={({ item }) => (item ? <NewsCard {...item} /> : <NewsCardSkeleton />)}
                />
            </View>

            {appConfig.game === 'aoe2' && <RankedMaps />}
        </ScrollView>
    );
}
