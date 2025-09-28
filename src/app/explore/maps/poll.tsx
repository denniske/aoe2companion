import { Text } from '@app/components/text';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { useMapsPoll } from '@app/queries/all';
import { isAfter, isWithinInterval } from 'date-fns';
import ButtonPicker from '@app/view/components/button-picker';
import { formatAgo, formatDayAndTime } from '@nex/data';
import { ScrollView } from '@app/components/scroll-view';

export default function MapsPoll() {
    const getTranslation = useTranslation();

    const { data: mapsPoll } = useMapsPoll();
    // console.log('mapsPoll', mapsPoll);

    const [rankedMapLeaderboard, setRankedMapLeaderboard] = useState<string>();
    const values: string[] = mapsPoll?.questions?.map((l) => l.leaderboardId) || [];
    const firstValue = mapsPoll?.questions?.map((l) => l.leaderboardId)?.[0];
    const formatLeaderboard = (leaderboardId: string) => mapsPoll?.questions?.find((l) => l.leaderboardId === leaderboardId)?.abbreviation ?? '';

    if (!mapsPoll) {
        return <Text>No map poll found.</Text>;
    }

    const pollEnded = isAfter(new Date(), mapsPoll.finished);

    return (
        <ScrollView className="flex-1" contentContainerStyle="p-5">
            <Stack.Screen options={{ title: getTranslation('maps.poll.title') }} />

            {!!mapsPoll?.questions && mapsPoll?.questions?.length > 0 && (
                <>
                    <View className="flex-row justify-center items-center mt-1 mb-5">
                        {isWithinInterval(new Date(), { start: mapsPoll.started, end: mapsPoll.finished }) ? (
                            <Text variant="body">Poll ends in {formatAgo(mapsPoll.finished)}</Text>
                        ) : (
                            <Text variant="body">Poll finished on {formatDayAndTime(mapsPoll.finished)}</Text>
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
                    <Text variant="header" className="mt-2 mb-5">
                        Community Picks
                    </Text>
                    <View className="flex-row flex-wrap">
                        {mapsPoll?.questions
                            ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                            ?.options?.map((map) => (
                                <TouchableOpacity
                                    key={map.mapId}
                                    className="flex-col justify-between items-center w-[25%] mb-4"
                                    onPress={() => router.push(`/explore/maps/${map.mapId}`)}
                                >
                                    <Image source={{ uri: map.imageUrl }} className="mb-2 w-[75px] h-[75px]" />
                                    <Text variant={'body-sm'} className="text-center mb-1">
                                        {map.mapName}
                                    </Text>
                                    {pollEnded && (
                                        <Text variant={'body-sm'} className="text-center">
                                            {map.percentage.toFixed(0)} %
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                    </View>
                    <Text variant="header" className="mt-2 mb-5">
                        Dev Picks
                    </Text>
                    <View className="flex-row flex-wrap">
                        {mapsPoll?.questions
                            ?.find((l) => l.leaderboardId == (rankedMapLeaderboard ?? firstValue))
                            ?.devOptions?.map((map) => (
                                <TouchableOpacity
                                    key={map.mapId}
                                    className="flex-col justify-between items-center w-[25%]"
                                    onPress={() => router.push(`/explore/maps/${map.mapId}`)}
                                >
                                    <Image source={{ uri: map.imageUrl }} className="mb-2 w-[75px] h-[75px]" />
                                    <Text variant={'body-sm'} className="text-center mb-1">
                                        {map.mapName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}
