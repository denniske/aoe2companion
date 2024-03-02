import { fetchProfiles } from '@app/api/helper/api';
import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { useUpcomingTournaments } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { Match } from '@app/components/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useSelector } from '@app/redux/reducer';
import { useCurrentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import PlayerList from '@app/view/components/player-list';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import { Tabs, router } from 'expo-router';
import { Age2TournamentCategory } from 'liquipedia';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

export default function Page() {
    const { data: tournaments } = useUpcomingTournaments();
    const featuredTournaments = tournaments?.filter((tournament) => tournament.tier === Age2TournamentCategory.TierS);
    const matches = useCurrentMatches(1);
    const currentMatch = matches?.length ? matches[0] : null;
    const { data: news } = useNews(3);
    const auth = useSelector((state) => state.auth);
    const [authProfile, setAuthProfile] = useState<IProfilesResultProfile>();

    const completeUserIdInfo = async () => {
        const loadedProfiles = await fetchProfiles({ profileId: auth?.profileId });
        if (loadedProfiles) {
            const profile = loadedProfiles.profiles?.[0];
            setAuthProfile(profile);
        }
    };

    useEffect(() => {
        if (auth?.profileId) {
            completeUserIdInfo();
        } else {
            setAuthProfile(undefined);
        }
    }, [auth]);

    const following = useSelector((state) => state.following);

    return (
        <ScrollView contentContainerStyle="p-4 gap-5">
            <Tabs.Screen options={{ title: 'Home' }} />

            <View className="gap-2 -mx-4">
                <Text variant="header-lg" className="px-4">
                    Followed Players
                </Text>
                <PlayerList
                    variant="horizontal"
                    list={[authProfile || 'select', ...following, 'follow']}
                    selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)}
                />
            </View>

            {currentMatch ? (
                <View className="gap-2">
                    <Text variant="header-lg">{currentMatch.finished === null ? 'Current' : 'Most Recent'} Match</Text>

                    <View className="gap-2">
                        <Match user={currentMatch.filteredPlayers[0]} highlightedUsers={currentMatch.filteredPlayers} match={currentMatch} />
                    </View>
                </View>
            ) : null}

            {Platform.OS !== 'web' ? (
                <View className="gap-2">
                    <Text variant="header-lg">Featured Tournaments</Text>
                    {featuredTournaments?.map((tournament) => <TournamentCardLarge key={tournament.path} id={tournament.path} />)}
                </View>
            ) : null}

            <View className="gap-2">
                <Text variant="header-lg">Recent News</Text>

                <FlatList
                    contentContainerStyle="gap-4"
                    horizontal
                    data={news}
                    renderItem={({ item: post }) => <NewsCard {...post} key={post.id} />}
                    keyExtractor={(post) => post.id.toString()}
                />
            </View>
        </ScrollView>
    );
}
