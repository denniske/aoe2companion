import { useFeaturedTournament } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Match } from '@app/components/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useSelector } from '@app/redux/reducer';
import { useCurrentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

export default function Page() {
    const tournament = useFeaturedTournament();
    const matches = useCurrentMatches(1);
    const currentMatch = matches?.length ? matches[0] : null;
    const { data: news = Array(3).fill(null) } = useNews(3);
    const auth = useSelector((state) => state.auth);

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
