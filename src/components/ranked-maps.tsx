import { Link } from '@app/components/link';
import { Text } from '@app/components/text';
import { useMapsPoll, useMapsRanked } from '@app/queries/all';
import { formatDayAndTime } from '@nex/data';
import { isWithinInterval } from 'date-fns';
import { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import ButtonPicker from '../view/components/button-picker';
import { Link as ExpoLink } from 'expo-router';
import { Image } from '@/src/components/uniwind/image';
import { Skeleton, SkeletonText } from './skeleton';
import { AnimateIn } from './animate-in';
import { LeaderboardSnapshot } from './leaderboard-snapshot';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { Button } from './button';

export const RankedMaps: React.FC = () => {
    const { data: mapsRanked, isPending: isLoadingRankedMaps } = useMapsRanked();
    const { data: mapsPoll } = useMapsPoll();

    const [rankedMapLeaderboard, setRankedMapLeaderboard] = useState<string>();
    const values: string[] = mapsRanked?.leaderboards?.map((l) => l.leaderboardId) || [];
    const firstValue = mapsRanked?.leaderboards?.map((l) => l.leaderboardId)?.[0];
    const { isMedium } = useBreakpoints();
    const formatLeaderboard = (leaderboardId: string) => {
        const leaderboard = mapsRanked?.leaderboards?.find((l) => l.leaderboardId === leaderboardId);

        return (isMedium ? leaderboard?.leaderboardName : leaderboard?.abbreviation) ?? '';
    };

    return (
        <View>
            <Text variant="header-lg" className="pb-2">
                {isMedium ? 'Ranked Ladder' : 'Ranked Maps'}
            </Text>

            <AnimateIn skipFirstAnimation>
                {!!mapsPoll && (
                    <View className="flex-row justify-between items-center mb-4">
                        {isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.expired }) ? (
                            <Text variant="body">New Map Rotation on {formatDayAndTime(mapsPoll.expired)}</Text>
                        ) : (
                            <Text variant="body">Maps active since {formatDayAndTime(mapsPoll.expired)}</Text>
                        )}
                        {isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.finished }) ? (
                            <Link href="/explore/maps/poll">View Active Poll</Link>
                        ) : (
                            <Link href="/explore/maps/poll">View Poll Results</Link>
                        )}
                    </View>
                )}
            </AnimateIn>

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
                    <View className="md:flex-row gap-4">
                        <View className="hidden md:flex md:flex-1">
                            <Text variant="header-xs" className="pb-2">
                                Top 5 Players
                            </Text>

                            <LeaderboardSnapshot leaderboardId={rankedMapLeaderboard ?? firstValue} />

                            <View className="flex flex-row gap-4 justify-center">
                                <Button href="/statistics/leaderboard" className="self-center mt-2">
                                    View Full Leaderboard
                                </Button>
                                {Platform.OS === 'web' && rankedMapLeaderboard === 'ew_1v1_redbullwololo' ? (
                                    <Button href="/red-bull-wololo-live-standings" className="self-center mt-2">
                                        View Live Standings
                                    </Button>
                                ) : null}
                            </View>
                        </View>
                        <View className="md:flex-1">
                            <Text variant="header-xs" className="pb-2 hidden md:flex">
                                Current Maps
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
                                    : mapsRanked?.leaderboards
                                          ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                                          ?.maps?.map((map) => (
                                              <ExpoLink asChild href={`/explore/maps/${map.mapId}`} key={map.mapId}>
                                                  <TouchableOpacity className="flex-col justify-between items-center w-[25%] mb-4">
                                                      <Image source={{ uri: map.imageUrl }} className="mb-2 w-[75px] h-[75px]" />
                                                      <Text variant="label-sm" className="text-center mb-0.5">
                                                          {map.mapName}
                                                      </Text>
                                                      <Text variant={'body-sm'} className="text-center">
                                                          {map.percentage.toFixed(0)} %
                                                      </Text>
                                                  </TouchableOpacity>
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
