import { tournamentsEnabled, useFeaturedTournaments } from '@app/api/tournaments';
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
import { Href, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { Button } from '@app/components/button';
import { useAuthProfileId, useInfiniteBuilds } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import { BuildCard, BuildSkeletonCard } from '@app/view/components/build-order/build-card';
import { compact } from 'lodash';
import { useFavoritedBuilds } from '@app/service/favorite-builds';
import { appConfig, dataset } from '@nex/dataset';
import { RankedMaps } from '@app/components/ranked-maps';
import { AnimateIn } from '@app/components/animate-in';
import { Card } from '@app/components/card';
import { FeaturedVideos } from '@app/components/featured-videos';
import { useLoginPopup } from '@app/hooks/use-login-popup';
import { Icon } from '@app/components/icon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBookmark, faDiagramSankey, faRankingStar, faSearch } from '@fortawesome/sharp-solid-svg-icons';
import { faPlaystation, faSteam, faXbox } from '@fortawesome/free-brands-svg-icons';
import { Image } from '@app/components/uniwind/image';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import Head from 'expo-router/head';
import { after, type LiveActivity } from 'expo-widgets';
import { match1v1 } from '@app/widgets/demo-matches/match-1v1';
import { widgetGroupDir } from '@app/service/storage';
import MatchActivity, { MatchActivityProps } from '@app/widgets/AAMatchActivity.widget';
import { match2v2 } from '@app/widgets/demo-matches/match-2v2';
import { match4v4 } from '@app/widgets/demo-matches/match-4v4';
import { reducePayload } from '@app/widgets/demo-matches/demo-helper';
import { matchUneven } from '@app/widgets/demo-matches/match-uneven';
import { matchFFA } from '@app/widgets/demo-matches/match-ffa';
import { match2v2v2v2 } from '@app/widgets/demo-matches/match-2v2v2v2';
import { match2v2v1v1v1v1 } from '@app/widgets/demo-matches/match-2v2v1v1v1v1';

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

// console.log('name', appConfig.app.name)

export default function IndexPage() {
    const { shouldPromptLogin } = useLoginPopup();
    const appStyles = useTheme(appVariants);
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const tournaments = useFeaturedTournaments();
    const accountMostRecentMatches = useAccountMostRecentMatches(1);
    const accountMostRecentMatch = accountMostRecentMatches?.length ? accountMostRecentMatches[0] : null;
    const { data: news = Array<null>(3).fill(null) } = useNews();
    const { favoriteIds } = useFavoritedBuilds();
    const { followedIds } = useFollowedTournaments();
    const showTabBar = useShowTabBar();
    const welcomeCards: Array<{ icon: IconDefinition; title: string; description: string; href: Href }> = [
        { icon: faSearch, title: 'Find Players', description: 'Search players and view match history, civs, and ratings', href: '/players/search' },
        {
            icon: faRankingStar,
            title: 'Leaderboard',
            description: 'Track top players, rankings, and current competitive ladders',
            href: '/statistics/leaderboard',
        },
        {
            icon: faDiagramSankey,
            title: 'Tech Tree',
            description: 'Explore civilizations, units, upgrades, and unique bonuses',
            href: '/explore',
        },
        { icon: faBookmark, title: 'Sign in to Save', description: 'Follow players, save favorites, and sync across devices', href: '/more/account' },
    ];

    const { isLarge, isMedium, isSmall } = useBreakpoints();

    const count = useMemo(() => {
        if (isLarge) {
            return 3;
        } else if (isMedium) {
            return 2;
        }

        return 1;
    }, [isLarge, isMedium, isSmall]);

    // const [matchActivity, setMatchActivity] = useState<LiveActivity<MatchActivityProps>>();
    //
    // console.log('folder', widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''));
    //
    // const testMatches = [
    //     {
    //         ...match2v2,
    //         iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     },
    //     // {
    //     //     ...match4v4,
    //     //     iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     // },
    //     // {
    //     //     ...matchUneven,
    //     //     iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     // },
    //     // {
    //     //     ...matchFFA,
    //     //     iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     // },
    //     // {
    //     //     ...match2v2v2v2,
    //     //     iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     // },
    //     // {
    //     //     ...match2v2v1v1v1v1,
    //     //     iosAppGroupFolder: widgetGroupDir?.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', ''),
    //     // },
    // ].map(reducePayload);
    //
    // const startDeliveryTracking = (i: number) => {
    //     const firstPlayerProfileId = testMatches[i].match.teams[0].players[0].profileId;
    //     const matchId = testMatches[i].match.matchId;
    //     const link = `aoe2companion://players/${firstPlayerProfileId}/matches/${matchId}`;
    //     console.log('LINK', link);
    //     const instance = MatchActivity.start(testMatches[i]); //, link);
    //     setMatchActivity(instance);
    // };
    //
    // const updateDeliveryTrackingSingle = (activity: LiveActivity<MatchActivityProps>, i: number) => {
    //     activity?.update(testMatches[i]);
    // };
    //
    // const endDeliveryTracking = async () => {
    //     // await matchActivity?.end(
    //     //     after(new Date(Date.now() + 15 * 60 * 1000)),
    //     //     {
    //     //         etaMinutes: 0,
    //     //         status: 'Delivered',
    //     //     },
    //     //     new Date()
    //     // );
    // };
    //
    // useEffect(() => {
    //     console.log('EFFECT', MatchActivity.getInstances().length);
    //
    //     // const existingMatchActivity = MatchActivity.getInstances()[0];
    //     // if (existingMatchActivity == null) {
    //     //     startDeliveryTracking();
    //     // } else {
    //     //     updateDeliveryTrackingSingle(existingMatchActivity);
    //     // }
    //
    //     for (let i = 0; i < testMatches.length; i++) {
    //         const existingMatchActivity = MatchActivity.getInstances()[i];
    //         if (existingMatchActivity == null) {
    //             startDeliveryTracking(i);
    //         } else {
    //             updateDeliveryTrackingSingle(existingMatchActivity, i);
    //         }
    //     }
    //
    // }, [matchActivity]);

    return (
        <ScrollView contentContainerClassName="p-4 md:py-6">
            <Head>
                <title>{appConfig.app.name} - Stats, Matches, and Leaderboards</title>
            </Head>
            <Stack.Screen
                options={{
                    headerShown: showTabBar,
                    animation: 'none',
                    headerTitle:
                        Platform.OS === 'web'
                            ? () => (
                                  <View className="flex flex-row items-center gap-4">
                                      <Image source={dataset.appIconData} className="w-12 h-12 rounded shadow-blue-50 shadow-xs dark:shadow-none" />

                                      <Text variant="header-lg" color="subtle">
                                          {appConfig.app.name}
                                      </Text>
                                  </View>
                              )
                            : undefined,
                    headerRight: () =>
                        Platform.OS !== 'web' && (
                            <Button href={'/players/search'} icon={faSearch}>
                                {getTranslation('home.findPlayer')}
                            </Button>
                        ),
                    title: getTranslation('home.title'),
                }}
            />

            <AnimateIn skipFirstAnimation={Platform.OS !== 'web'}>
                {!shouldPromptLogin && (
                    <View className="-mx-4 pb-5 lg:pb-8">
                        <FollowedPlayers />
                    </View>
                )}
            </AnimateIn>

            <AnimateIn>
                {shouldPromptLogin && (
                    <View className="gap-2 pb-5 lg:pb-8">
                        <Text variant="header-lg">Get Started</Text>

                        <View className="gap-4">
                            <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {welcomeCards.map((card, i) => (
                                    <Card key={i} className="flex-1 items-center gap-2" href={card.href} direction="vertical">
                                        <View className="p-4 bg-blue-800 dark:bg-blue-700 rounded-full mb-1">
                                            <Icon icon={card.icon} size={24} color="white" />
                                        </View>
                                        <Text variant="header">{card.title}</Text>
                                        <Text align="center" color="subtle" className="hidden md:inline-block">
                                            {card.description}
                                        </Text>
                                    </Card>
                                ))}
                            </View>

                            <Card className="items-center md:justify-between md:flex-row gap-4" direction="vertical">
                                <Text variant="header-lg" className="text-center">
                                    Buy{' '}
                                    <Text variant="header-lg" className="italic">
                                        Age of Empires II: Definitive Edition
                                    </Text>
                                </Text>

                                <View className="flex-row gap-4">
                                    <Button
                                        icon={faSteam}
                                        href="https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/"
                                    >
                                        Steam
                                    </Button>
                                    <Button
                                        icon={faXbox}
                                        href="https://www.xbox.com/en-us/games/store/age-of-empires-ii-definitive-edition/9njdd0jgpp2q"
                                    >
                                        XBox
                                    </Button>
                                    <Button
                                        icon={faPlaystation}
                                        href="https://store.playstation.com/en-us/product/UP6312-PPSA18654_00-0965895154892062"
                                    >
                                        PS5
                                    </Button>
                                </View>
                            </Card>
                        </View>
                    </View>
                )}
            </AnimateIn>

            {/*<Text>GAME: {appConfig.game}</Text>*/}
            {/*<Text>HOST: {appConfig.hostAoeCompanion}</Text>*/}
            {/*<Text>URL: {getHost('aoe2companion')}</Text>*/}
            {/*<Text>NAME: {Constants.expoConfig?.slug}</Text>*/}
            {/*<Text>GAME: {Constants.expoConfig?.slug === 'aoe2companion' ? 'aoe2' : 'aoe4'}</Text>*/}

            {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
            {/*    <Button onPress={startDeliveryTracking}>Start Delivery Tracking</Button>*/}
            {/*</View>*/}

            {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
            {/*    <Button onPress={updateDeliveryTracking}>Update Delivery Tracking</Button>*/}
            {/*</View>*/}

            {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
            {/*    <Button onPress={endDeliveryTracking}>End Delivery Tracking</Button>*/}
            {/*</View>*/}

            {authProfileId && (
                <AnimateIn>
                    <View className="gap-2 pb-5 lg:pb-8">
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
                    <View className="pb-5 lg:pb-8">
                        <FavoritedBuilds favoriteIds={favoriteIds} />
                    </View>
                </AnimateIn>
            )}

            {/*{Platform.OS === 'web' && appConfig.game === 'aoe2' && (*/}
            {/*    <View className="pb-5 lg:pb-8">*/}
            {/*        <RedBullSnippet />*/}
            {/*    </View>*/}
            {/*)}*/}

            {tournamentsEnabled ? (
                <View className="gap-2 pb-5 lg:pb-8">
                    <View className="flex-row justify-between items-center">
                        <Text variant="header-lg">
                            {followedIds[0]
                                ? getTranslation(isMedium ? 'home.favoriteTournaments' : 'home.favoriteTournament')
                                : getTranslation(isMedium ? 'home.featuredTournaments' : 'home.featuredTournament')}
                        </Text>
                        <Link href="/competitive/tournaments">{getTranslation('home.viewAll')}</Link>
                    </View>
                    <View className="flex flex-row -mx-2">
                        {followedIds[0]
                            ? followedIds.slice(0, count).map((tournament) => (
                                  <View key={tournament} style={{ width: `${100 / count}%` }} className="px-2">
                                      <TournamentCardLarge path={tournament} />
                                  </View>
                              ))
                            : tournaments.data.slice(0, count).map((tournament) => (
                                  <View key={tournament.path} style={{ width: `${100 / count}%` }} className="px-2">
                                      <TournamentCardLarge {...tournament} />
                                  </View>
                              ))}
                    </View>
                </View>
            ) : null}

            <View className="gap-2 pb-5 lg:pb-8">
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

            {appConfig.game === 'aoe2' && (
                <View className="pb-5 lg:pb-8">
                    <RankedMaps />
                </View>
            )}

            {appConfig.game === 'aoe2' && <FeaturedVideos />}
        </ScrollView>
    );
}
