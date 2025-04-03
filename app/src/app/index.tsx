import { useFeaturedTournament } from '@app/api/tournaments';
import { FlatList } from '@app/components/flat-list';
import { FollowedPlayers } from '@app/components/followed-players';
import { Link } from '@app/components/link';
import { Match } from '@app/components/match';
import { NewsCard } from '@app/components/news-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { setMainPageShown, useMutate, useSelector } from '@app/redux/reducer';
import { useFollowedTournaments } from '@app/service/followed-tournaments';
import { useFavoritedBuilds } from '@app/service/storage';
import { useCurrentMatches } from '@app/utils/match';
import { useNews } from '@app/utils/news';
import BuildCard from '@app/view/components/build-order/build-card';
import { TournamentCardLarge } from '@app/view/tournaments/tournament-card-large';
import * as Notifications from '../service/notifications';
import { Stack, useFocusEffect, useRootNavigationState, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Button } from '@app/components/button';
import {
    useAccountData,
    useAuthProfileId,
    useMatch,
    useMatchAnalysis,
    useMatchAnalysisSvg,
    withRefetching,
} from '@app/queries/all';
import MatchMap2 from '@app/view/components/match-map2';
import MatchMap from '@app/view/components/match-map';

// export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
//     return (
//         <View style={{ flex: 1, backgroundColor: "red" }}>
//             <Text>{error.message}</Text>
//             <Text onPress={retry}>Try Again?</Text>
//         </View>
//     );
// }

export default function Page() {
    const authProfileId = useAuthProfileId();
    const tournament = useFeaturedTournament();
    const matches = useCurrentMatches(1);
    const currentMatch = matches?.length ? matches[0] : null;
    const { data: news = Array(3).fill(null) } = useNews(3);
    const router = useRouter();
    const { favorites, refetch } = useFavoritedBuilds();
    const { followedIds, refetch: refetchTournament } = useFollowedTournaments();
    const configMainPage = useAccountData(data => data.mainPage);
    const mainPageShown = useSelector((state) => state.mainPageShown);
    const rootNavigation = useRootNavigationState();
    const isNavigationReady = rootNavigation?.key != null;
    const mutate = useMutate();

    useFocusEffect(
        useCallback(() => {
            refetch();
            refetchTournament();
        }, [])
    );

    const response = Notifications.useLastNotificationResponse();
    useEffect(() => {
        if (response && response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            router.navigate(`/matches?match_id=${response.notification.request.content?.data?.match_id}`);
        }
    }, [response]);

    useEffect(() => {
        if (Platform.OS !== 'web' && isNavigationReady && configMainPage && mainPageShown !== true) {
            router.navigate(configMainPage);
            mutate(setMainPageShown(true));
        }
    }, [isNavigationReady]);


    const openMatch = (matchId: number) => {
        router.push(`/matches/single/${matchId}`);
    };

    useEffect(() => {
        // setTimeout(() => openMatch(382667281), 1000); // some water
        // setTimeout(() => openMatch(382486559), 1000); // some water
        // setTimeout(() => openMatch(382688100), 1000); // dennis gaia
        // setTimeout(() => openMatch(380883300), 1000); // mo 2v2 nomad water
        // setTimeout(() => openMatch(382250871), 1000); // mo 3v3 megarandom
        // setTimeout(() => openMatch(382255089), 1000); // mo 3v3
        // setTimeout(() => openMatch(382486559), 1000); // nomad
        // setTimeout(() => openMatch(357687089), 1000);
    }, [isNavigationReady]);

    const matchId = 382486559;

    const { data: match } = withRefetching(useMatch(matchId));
    const { data: analysis } = withRefetching(useMatchAnalysis(matchId));
    const { data: analysisSvgUrl } = withRefetching(useMatchAnalysisSvg(matchId, !!analysis));

    return (
        <ScrollView contentContainerStyle="p-4 gap-5">
            <Stack.Screen
                options={{
                    animation: 'none',
                    headerRight: () => (
                        <Button href={'/matches/users/search'} icon="search">
                            Find Player
                        </Button>
                    ),
                    title: 'Home',
                }}
            />

            <MatchMap2></MatchMap2>

            {/*<MatchMap*/}
            {/*    match={match}*/}
            {/*    analysis={analysis}*/}
            {/*    analysisSvgUrl={analysisSvgUrl}*/}
            {/*/>*/}

            {/*<View className="-mx-4">*/}
            {/*    <FollowedPlayers />*/}
            {/*</View>*/}

            {/*{authProfileId && (*/}
            {/*    <View className="gap-2">*/}
            {/*        <Text variant="header-lg">{currentMatch?.finished === null ? 'Current' : 'Most Recent'} Match</Text>*/}

            {/*        <View className="gap-2">*/}
            {/*            <Match user={currentMatch?.filteredPlayers[0]} highlightedUsers={currentMatch?.filteredPlayers} match={currentMatch} />*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*)}*/}

            {/*{favorites.length > 0 && (*/}
            {/*    <View className="gap-2">*/}
            {/*        <View className="flex-row justify-between items-center">*/}
            {/*            <Text variant="header-lg">Favorite Build Orders</Text>*/}
            {/*            <Link href="/explore/build-orders">View All</Link>*/}
            {/*        </View>*/}

            {/*        <FlatList*/}
            {/*            showsHorizontalScrollIndicator={false}*/}
            {/*            className="flex-none"*/}
            {/*            horizontal*/}
            {/*            keyboardShouldPersistTaps="always"*/}
            {/*            data={favorites}*/}
            {/*            contentContainerStyle="gap-2.5"*/}
            {/*            renderItem={({ item }) => <BuildCard size="small" {...item} />}*/}
            {/*            keyExtractor={(item) => item.id.toString()}*/}
            {/*        />*/}
            {/*    </View>*/}
            {/*)}*/}

            {/*{Platform.OS !== 'web' ? (*/}
            {/*    <View className="gap-2">*/}
            {/*        <View className="flex-row justify-between items-center">*/}
            {/*            <Text variant="header-lg">{followedIds[0] ? 'Favorite' : 'Featured'} Tournament</Text>*/}
            {/*            <Link href="/competitive/tournaments">View All</Link>*/}
            {/*        </View>*/}
            {/*        {followedIds[0] ? <TournamentCardLarge path={followedIds[0]} /> : <TournamentCardLarge {...tournament} />}*/}
            {/*    </View>*/}
            {/*) : null}*/}

            {/*<View className="gap-2">*/}
            {/*    <Text variant="header-lg">Recent News</Text>*/}

            {/*    <FlatList*/}
            {/*        showsHorizontalScrollIndicator={false}*/}
            {/*        contentContainerStyle="gap-4 px-4"*/}
            {/*        className="-mx-4"*/}
            {/*        horizontal*/}
            {/*        data={news}*/}
            {/*        renderItem={({ item: post }) => <NewsCard {...post} />}*/}
            {/*    />*/}
            {/*</View>*/}
        </ScrollView>
    );
}
