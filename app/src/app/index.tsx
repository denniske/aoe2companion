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
import { ActivityIndicator, Platform, View } from 'react-native';
import { Button } from '@app/components/button';
import {
    useAccountData,
    useAuthProfileId,
    useMatch,
    useMatchAnalysis,
    useMatchAnalysisSvg,
    useWithRefetching,
} from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import SkiaLoader from '@app/components/skia-loader';

// export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
//     return (
//         <View style={{ flex: 1, backgroundColor: "red" }}>
//             <Text>{error.message}</Text>
//             <Text onPress={retry}>Try Again?</Text>
//         </View>
//     );
// }

export default function IndexPage() {
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const tournament = useFeaturedTournament();
    const matches = useCurrentMatches(1);
    const currentMatch = matches?.length ? matches[0] : null;
    const { data: news = Array(3).fill(null) } = useNews(3);
    const router = useRouter();
    const { favorites, refetch } = useFavoritedBuilds();
    const { followedIds, refetch: refetchTournament } = useFollowedTournaments();

    useFocusEffect(
        useCallback(() => {
            refetch();
            refetchTournament();
        }, [])
    );

    // useEffect(() => {
    //     // setTimeout(() => openMatch(382667281), 1000); // some water
    //     // setTimeout(() => openMatch(382486559), 1000); // some water
    //     // setTimeout(() => openMatch(382688100), 1000); // dennis gaia
    //     // setTimeout(() => openMatch(380883300), 1000); // mo 2v2 nomad water
    //     // setTimeout(() => openMatch(382250871), 1000); // mo 3v3 megarandom
    //     // setTimeout(() => openMatch(382255089), 1000); // mo 3v3
    //     // setTimeout(() => openMatch(382486559), 1000); // nomad
    //     // setTimeout(() => openMatch(357687089), 1000);
    // }, [isNavigationReady]);

    // const matchId = 384963389; // me trying walls
    // const matchId = 382486559; // nomad with water 4 players
    // const matchId = 3824865590000; // non existing match to test error handling
    const matchId = 396138956; // non existing match to test error handling
    // const matchId = 382919732;

    const { data: match, error: matchError, isLoading: matchLoading } = useWithRefetching(useMatch(matchId));
    // const { data: analysis, error: analysisError, isLoading: analysisLoading } = useWithRefetching(useMatchAnalysis(matchId, !!match));
    // const { data: analysisSvgUrl } = useWithRefetching(useMatchAnalysisSvg(matchId, !!analysis));

    // console.log('IndexPage', match, analysis, analysisError);

    return (
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
                    // headerTitle: () => (<span>{getTranslation('home.title')}</span>),
                }}
            />

            {/*<MatchMap3></MatchMap3>*/}
            {/*<MatchMap2></MatchMap2>*/}

            {/*{*/}
            {/*    matchError && (*/}
            {/*        <View className="bg-red-100 p-4 rounded-lg">*/}
            {/*            <Text className="text-red-800">*/}
            {/*                {matchError?.message}*/}
            {/*            </Text>*/}
            {/*        </View>*/}
            {/*    )*/}
            {/*}*/}
            {/*{*/}
            {/*    analysisError && (*/}
            {/*        <View className="bg-red-100 p-4 rounded-lg">*/}
            {/*            <Text className="text-red-800">*/}
            {/*                {analysisError?.message}*/}
            {/*            </Text>*/}
            {/*        </View>*/}
            {/*    )*/}
            {/*}*/}
            {/*{*/}
            {/*    analysis && !analysis?.error && (*/}
            {/*        <SkiaLoader*/}
            {/*            getComponent={() => import('@app/view/components/match-map/match-map')}*/}
            {/*            fallback={<Text style={{ textAlign: 'center' }}>Loading Skia...</Text>}*/}
            {/*            componentProps={{*/}
            {/*                match,*/}
            {/*                analysis,*/}
            {/*                analysisSvgUrl,*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    )*/}
            {/*}*/}

            {/*{*/}
            {/*    matchLoading || analysisLoading &&*/}
            {/*        <View className="flex-row gap-2">*/}
            {/*            <Text variant="body">Loading Analysis...</Text>*/}
            {/*            <ActivityIndicator animating size="small" color="#999"/>*/}
            {/*        </View>*/}
            {/*}*/}


            {/*<MatchMap2 match={match} analysis={analysis} analysisSvgUrl={analysisSvgUrl} />*/}


            {/*<MatchMap*/}
            {/*    match={match}*/}
            {/*    analysis={analysis}*/}
            {/*    analysisSvgUrl={analysisSvgUrl}*/}
            {/*/>*/}

            <View className="-mx-4">
                <FollowedPlayers />
            </View>

            {authProfileId && (
                <View className="gap-2">
                    <Text variant="header-lg">
                        {getTranslation(
                            currentMatch?.finished === null
                                ? 'home.current'
                                : 'home.mostRecent'
                        )}{' '}
                        Match
                    </Text>

                    <View className="gap-2">
                        <Match user={currentMatch?.filteredPlayers[0]} highlightedUsers={currentMatch?.filteredPlayers} match={currentMatch} />
                    </View>
                </View>
            )}

            {favorites.length > 0 && (
                <View className="gap-2">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">
                            {getTranslation('home.favoriteBuildOrders')}
                        </Text>
                        <Link href="/explore/build-orders">
                            {getTranslation('home.viewAll')}
                        </Link>
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
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">{followedIds[0] ? 'Favorite' : 'Featured'} Tournament</Text>
                        <Link href="/competitive/tournaments">
                            {getTranslation('home.viewAll')}
                        </Link>
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
                    renderItem={({ item: post }) => <NewsCard {...post} />}
                />
            </View>
        </ScrollView>
    );
}
