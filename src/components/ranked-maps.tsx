import { PressableOpacity } from '@app/components/pressable-opacity';
import { Link } from '@app/components/link';
import { Text } from '@app/components/text';
import { useMapsPoll, useMapsRanked } from '@app/queries/all';
import { formatDayAndTime } from '@nex/data';
import { isWithinInterval } from 'date-fns';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import ButtonPicker from '../view/components/button-picker';
import { Link as ExpoLink } from 'expo-router';
import { Image } from '@/src/components/uniwind/image';
import { Skeleton, SkeletonText } from './skeleton';
import { AnimateIn } from './animate-in';
import { LeaderboardSnapshot } from './leaderboard-snapshot';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { Button } from './button';
import { useTranslation } from '@app/helper/translate';

export const RankedMaps: React.FC = () => {
    const getTranslation = useTranslation();
    const { data: mapsRanked, isPending: isLoadingRankedMaps } = useMapsRanked();
    const { data: mapsPoll } = useMapsPoll();

    const [rankedMapLeaderboard, setRankedMapLeaderboard] = useState<string>();
    const values: string[] = mapsRanked?.leaderboards?.map((l) => l.leaderboardId) || [];
    const firstValue = mapsRanked?.leaderboards?.map((l) => l.leaderboardId)?.[0];
    const { isMedium } = useBreakpoints();
    const selectedLeaderboardId = rankedMapLeaderboard ?? firstValue;
    const selectedLeaderboard = mapsRanked?.leaderboards?.find((l) => l.leaderboardId === selectedLeaderboardId);

    // A poll only covers some of the leaderboards - aoe2 votes on the rm pools but not on the ew
    // ones - so what matters is whether this leaderboard is on the ballot, not whether a poll
    // exists at all. Linking to the results for a leaderboard the poll never asked about would
    // open a page with nothing on it.
    const pollQuestion = mapsPoll?.questions?.find((q) => q.leaderboardId === selectedLeaderboardId);

    // While the vote is still open it is the poll that says when the pool changes next; once it has
    // expired the pool it produced is live and the date comes from that pool instead.
    const pollRunning = !!mapsPoll && !!pollQuestion && isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.expired });
    const pollOpen = !!mapsPoll && !!pollQuestion && isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.finished });

    const formatLeaderboard = (leaderboardId: string) => {
        const leaderboard = mapsRanked?.leaderboards?.find((l) => l.leaderboardId === leaderboardId);

        return (isMedium ? leaderboard?.leaderboardName : leaderboard?.abbreviation) ?? '';
    };

    return (
        <View>
            <Text variant="header-lg" className="pb-2">
                {getTranslation(isMedium ? 'maps.rankedladder' : 'maps.rankedmaps')}
            </Text>

            {((!!mapsRanked?.leaderboards && mapsRanked?.leaderboards?.length > 0) || isLoadingRankedMaps) && (
                <>
                    <View className="mb-3">
                        {isLoadingRankedMaps ? (
                            <Skeleton className="w-full h-[38px] rounded-lg" alt />
                        ) : (
                            <ButtonPicker
                                flex={true}
                                value={rankedMapLeaderboard ?? firstValue}
                                values={values}
                                image={(value) => (value === 'ew_1v1_redbullwololo' ? require('../../assets/red-bull-wololo.png') : undefined)}
                                formatter={formatLeaderboard}
                                onSelect={setRankedMapLeaderboard}
                            />
                        )}
                    </View>

                    <AnimateIn skipFirstAnimation>
                        <View className="flex-row justify-between items-start gap-2 mb-4">
                            {pollRunning ? (
                                <Text variant="body" className="flex-1 min-w-0">
                                    {getTranslation('maps.rotation.newon', { date: formatDayAndTime(mapsPoll!.expired) })}
                                </Text>
                            ) : selectedLeaderboard?.poolStarted ? (
                                <Text variant="body" className="flex-1 min-w-0">
                                    {getTranslation('maps.rotation.activesince', { date: formatDayAndTime(selectedLeaderboard.poolStarted) })}
                                </Text>
                            ) : (
                                <View className="flex-1 min-w-0" />
                            )}
                            {!pollQuestion ? (
                                <Text variant="body" color="subtle" className="shrink-0 text-right">
                                    {getTranslation('maps.poll.none')}
                                </Text>
                            ) : pollOpen ? (
                                <Link href="/explore/maps/poll" className="shrink-0 text-right">{getTranslation('maps.poll.viewactive')}</Link>
                            ) : (
                                <Link href="/explore/maps/poll" className="shrink-0 text-right">{getTranslation('maps.poll.viewresults')}</Link>
                            )}
                        </View>
                    </AnimateIn>

                    <View className="md:flex-row gap-4">
                        <View className="hidden md:flex md:flex-1">
                            <Text variant="header-xs" className="pb-2">
                                {getTranslation('maps.top5players')}
                            </Text>

                            <LeaderboardSnapshot leaderboardId={rankedMapLeaderboard ?? firstValue} />

                            <View className="flex flex-row gap-4 justify-center">
                                <Button href="/statistics/leaderboard" className="self-center mt-2">
                                    {getTranslation('maps.viewfullleaderboard')}
                                </Button>
                                {Platform.OS === 'web' && rankedMapLeaderboard === 'ew_1v1_redbullwololo' ? (
                                    <ExpoLink className="flex rounded self-center mt-2" href="/red-bull-wololo-live-standings" target="_blank">
                                        <Button>
                                            {getTranslation('maps.viewlivestandings')}
                                        </Button>
                                    </ExpoLink>
                                ) : null}
                            </View>
                        </View>
                        <View className="md:flex-1">
                            <Text variant="header-xs" className="pb-2 hidden md:flex">
                                {getTranslation('maps.currentmaps')}
                            </Text>

                            <View className="flex-row flex-wrap md:flex-1">
                                {isLoadingRankedMaps
                                    ? Array(2)
                                          .fill(null)
                                          .map((_, index) => (
                                              <View key={index} className="flex-col justify-between items-center w-[25%] mb-4">
                                                  <View className="mb-2 w-[75px] h-[75px] justify-center items-center">
                                                      <Skeleton className="w-12 h-12 rotate-45" alt />
                                                  </View>
                                                  <SkeletonText variant="label-sm" className="text-center mb-0.5 w-20!" alt />
                                                  <SkeletonText variant="body-sm" className="text-center w-6!" alt />
                                              </View>
                                          ))
                                    : selectedLeaderboard?.maps?.map((map) => (
                                              <ExpoLink asChild href={`/explore/maps/${map.mapId}`} key={map.mapId}>
                                                  <PressableOpacity className="flex-col justify-between items-center w-[25%] mb-4">
                                                      <Image source={{ uri: map.imageUrl }} className="mb-2 w-[75px] h-[75px]" />
                                                      <Text variant="label-sm" className="text-center mb-0.5">
                                                          {map.mapName}
                                                      </Text>
                                                      <Text variant={'body-sm'} className="text-center">
                                                          {map.percentage.toFixed(0)} %
                                                      </Text>
                                                  </PressableOpacity>
                                              </ExpoLink>
                                          ))}
                            </View>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};
