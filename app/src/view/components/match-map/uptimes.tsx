import React, { useState } from 'react';
import { View } from 'react-native';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { isEqual, last } from 'lodash';
import { formatTimeFromMs, getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { appConfig } from '@nex/dataset';
import { getCivIcon } from '@app/helper/civs';
import { Image } from 'expo-image';
import { getAgeIcon } from '@app/helper/units';
import startCase from 'lodash/startCase';
import { Age } from '@nex/data';
import { Text } from '@app/components/text';

interface Props {
    time: SharedValue<number>;
    teams: ILegendInfo;
}

const shallowArrayEqual = (a: any[], b: any[]): boolean => {
    if (a === b) return true;
    if (a.length !== b.length) {
        // console.log('len', a.length, b.length);
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            // console.log('a[i]', a[i], 'b[i]', b[i]);
            return false;
        }
    }

    return true;
};

export default function Uptimes({ time, teams }: Props) {

    return (
        <View
            className="bg-gray-800/0 gap-1.5 p-2"
        >
            <Text className="" variant="header-sm">
                Uptimes
            </Text>

            <View className="flex-row items-center gap-0 mb-2">
                <Text className="w-[118px] px-1">
                </Text>
                <View className="text-xs flex-1 px-1 flex-row justify-center border0 border-green-200">
                    <Image className={'w-5 h-5'} source={getAgeIcon('Feudal')} contentFit="contain" />
                </View>
                <View className="text-xs flex-1 px-1 flex-row justify-center border0 border-green-200">
                    <Image className={'w-5 h-5'} source={getAgeIcon('Castle')} contentFit="contain" />
                </View>
                <View className="text-xs flex-1 px-1 flex-row justify-center border0 border-green-200">
                    <Image className={'w-5 h-5'} source={getAgeIcon('Imperial')} contentFit="contain" />
                </View>
            </View>

            {teams.map((item) => (
                <View key={item.teamId} className="gap-0.5">
                    {item.players.map((player) => (
                        <View className="flex-row items-center gap-0" key={player.color}>
                            <Image className={'w-4 h-4'} source={player.civImageUrl} contentFit="contain" />
                            <Text variant="body-sm" className="w-[100px] px-1">
                                {player.name}
                            </Text>
                            {padArr(player.uptimes, 3).map(uptime => (
                                <Text key={uptime?.timestamp} className="text-xs flex-1 px-1 text-center">
                                    {uptime ? formatTimeFromMs(getTimestampMs(uptime.timestamp)) : ''}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

function padArr<T>(arr: T[], targetLength: number, padValue: T | null = null): (T | null)[] {
    if (arr.length >= targetLength) return arr.slice(0, targetLength);
    return [...arr, ...Array(targetLength - arr.length).fill(padValue)];
}
