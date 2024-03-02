import { useUpcomingTournaments } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { Match } from '@app/components/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useCurrentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import { Tabs } from 'expo-router';
import { Age2TournamentCategory } from 'liquipedia';
import { View } from 'react-native';

export default function Page() {
    const { data: tournaments } = useUpcomingTournaments();
    const featuredTournaments = tournaments?.filter((tournament) => tournament.tier === Age2TournamentCategory.TierS);
    const matches = useCurrentMatches(2);
    const { data: news } = useNews(3);

    return (
        <ScrollView contentContainerStyle="p-4 g-5">
            <Tabs.Screen options={{ title: 'Home' }} />

            <View className="g-2">
                <Text variant="header-lg">Live and Recent Matches</Text>

                <View className="g-2">
                    {matches?.map((match) => (
                        <Match key={match.matchId} user={match.filteredPlayers[0]} highlightedUsers={match.filteredPlayers} match={match} />
                    ))}
                </View>
            </View>

            <View className="g-2">
                <Text variant="header-lg">Featured Tournaments</Text>
                {featuredTournaments?.map((tournament) => <TournamentCardLarge key={tournament.path} id={tournament.path} />)}
            </View>

            <View className="g-2">
                <Text variant="header-lg">Recent News</Text>

                <FlatList
                    contentContainerStyle="g-4"
                    horizontal
                    data={news}
                    renderItem={({ item: post }) => <NewsCard {...post} key={post.id} />}
                    keyExtractor={(post) => post.id.toString()}
                />
            </View>
        </ScrollView>
    );
}
