import { useFeaturedTournament } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Link } from '@app/components/link';
import { Match } from '@app/components/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useSelector } from '@app/redux/reducer';
import { useFavoritedBuilds } from '@app/service/storage';
import { useCurrentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import BuildCard from '@app/view/components/build-order/build-card';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import * as Notifications from 'expo-notifications';
import { Tabs, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';

export default function Page() {
    const tournament = useFeaturedTournament();
    const matches = useCurrentMatches(1);
    const currentMatch = matches?.length ? matches[0] : null;
    const { data: news = Array(3).fill(null) } = useNews(3);
    const auth = useSelector((state) => state.auth);
    const router = useRouter();
    const { favorites, refetch } = useFavoritedBuilds();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    const response = Notifications.useLastNotificationResponse();
    useEffect(() => {
        if (response && response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            router.navigate(`/matches?match_id=${response.notification.request.content?.data?.match_id}`);
        }
    }, [response]);

    return (
        <ScrollView contentContainerStyle="p-4 gap-5">
            <Tabs.Screen options={{ title: 'Home' }} />

            <View className="-mx-4">
                <FollowedPlayers />
            </View>

            {auth && (
                <View className="gap-2">
                    <Text variant="header-lg">{currentMatch?.finished === null ? 'Current' : 'Most Recent'} Match</Text>

                    <View className="gap-2">
                        <Match user={currentMatch?.filteredPlayers[0]} highlightedUsers={currentMatch?.filteredPlayers} match={currentMatch} />
                    </View>
                </View>
            )}

            {favorites.length > 0 && (
                <View className="gap-2">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">Favorite Build Orders</Text>
                        <Link href="/explore/build-orders">View All</Link>
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
            )}

            {Platform.OS !== 'web' ? (
                <View className="gap-2">
                    <Text variant="header-lg">Featured Tournament</Text>
                    <TournamentCardLarge {...tournament} />
                </View>
            ) : null}

            <View className="gap-2">
                <Text variant="header-lg">Recent News</Text>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle="gap-4"
                    horizontal
                    data={news}
                    renderItem={({ item: post }) => <NewsCard {...post} />}
                />
            </View>
        </ScrollView>
    );
}
