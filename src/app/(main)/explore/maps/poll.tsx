import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { Image } from '@/src/components/uniwind/image';
import { Link, Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { useMapsPoll } from '@app/queries/all';
import { isAfter, isWithinInterval } from 'date-fns';
import ButtonPicker from '@app/view/components/button-picker';
import { formatAgo, formatDayAndTime } from '@nex/data';
import { ScrollView } from '@app/components/scroll-view';
import cn from 'classnames';
import { Icon } from '@app/components/icon';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';

export default function MapsPoll() {
    const getTranslation = useTranslation();

    const { data: mapsPoll } = useMapsPoll();
    // console.log('mapsPoll', mapsPoll);

    const [rankedMapLeaderboard, setRankedMapLeaderboard] = useState<string>();
    const values: string[] = mapsPoll?.questions?.map((l) => l.leaderboardId) || [];
    const firstValue = mapsPoll?.questions?.map((l) => l.leaderboardId)?.[0];
    const formatLeaderboard = (leaderboardId: string) => mapsPoll?.questions?.find((l) => l.leaderboardId === leaderboardId)?.abbreviation ?? '';

    if (!mapsPoll) {
        return <Text>{getTranslation('maps.poll.notfound')}</Text>;
    }

    const pollEnded = isAfter(new Date(), mapsPoll.finished);
    const question = mapsPoll?.questions?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue));
    const hasWinners = question?.options?.some((option) => option.won) ?? false;

    return (
        <ScrollView className="flex-1" contentContainerClassName="p-5">
            <Stack.Screen options={{ title: getTranslation('maps.poll.title') }} />

            {!!mapsPoll?.questions && mapsPoll?.questions?.length > 0 && (
                <>
                    <View className="flex-row justify-center items-center mt-1 mb-5">
                        {isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.finished }) ? (
                            <Text variant="body">{getTranslation('maps.poll.endsin', { time: formatAgo(mapsPoll.finished) })}</Text>
                        ) : (
                            <Text variant="body">{getTranslation('maps.poll.finishedon', { date: formatDayAndTime(mapsPoll.finished) })}</Text>
                        )}
                    </View>
                    <View className="mb-3">
                        <ButtonPicker
                            flex={true}
                            value={rankedMapLeaderboard ?? firstValue}
                            values={values}
                            formatter={formatLeaderboard}
                            onSelect={setRankedMapLeaderboard}
                        />
                    </View>
                    <View className="mt-2 mb-5 flex-row justify-between items-baseline gap-2">
                        <Text variant="header">{getTranslation('maps.poll.communitypicks')}</Text>
                        {!!hasWinners && (
                            <Text variant="body-sm" color="subtle" className="shrink-0 text-right">
                                {getTranslation('maps.poll.won')}
                            </Text>
                        )}
                    </View>
                    <View className="flex-row flex-wrap">
                        {mapsPoll?.questions
                            ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                            ?.options?.map((map) => (
                                <Link asChild href={`/explore/maps/${map.mapId}`} key={map.mapId}>
                                    <PressableOpacity className="flex-col justify-between items-center w-[25%] mb-4">
                                        <View className="mb-2 w-[75px] h-[75px]">
                                            <Image source={{ uri: map.imageUrl }} className={cn('w-[75px] h-[75px]', map.won === false && 'opacity-40')} />
                                            {!!map.won && (
                                                <View className="absolute bottom-0 right-0 rounded-full bg-gold-50 dark:bg-blue-950">
                                                    <Icon icon={faCircleCheck} size={18} color="brand" />
                                                </View>
                                            )}
                                        </View>
                                        <Text variant={'body-sm'} className={cn('text-center mb-1', map.won && 'font-bold')}>
                                            {map.mapName}
                                        </Text>
                                        {pollEnded && (
                                            <Text variant={'body-sm'} className="text-center">
                                                {map.percentage.toFixed(0)} %
                                            </Text>
                                        )}
                                    </PressableOpacity>
                                </Link>
                            ))}
                    </View>
                    <Text variant="header" className="mt-2 mb-5">
                        {getTranslation('maps.poll.devpicks')}
                    </Text>
                    <View className="flex-row flex-wrap">
                        {mapsPoll?.questions
                            ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                            ?.devOptions?.map((map) => (
                                <Link asChild href={`/explore/maps/${map.mapId}`} key={map.mapId}>
                                    <PressableOpacity className="flex-col justify-between items-center w-[25%]">
                                        <View className="mb-2 w-[75px] h-[75px]">
                                            <Image source={{ uri: map.imageUrl }} className={cn('w-[75px] h-[75px]', map.won === false && 'opacity-40')} />
                                            {!!map.won && (
                                                <View className="absolute bottom-0 right-0 rounded-full bg-gold-50 dark:bg-blue-950">
                                                    <Icon icon={faCircleCheck} size={18} color="brand" />
                                                </View>
                                            )}
                                        </View>
                                        <Text variant={'body-sm'} className={cn('text-center mb-1', map.won && 'font-bold')}>
                                            {map.mapName}
                                        </Text>
                                    </PressableOpacity>
                                </Link>
                            ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}
