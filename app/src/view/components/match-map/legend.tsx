import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { isEqual, last } from 'lodash';
import { getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { appConfig } from '@nex/dataset';
import { getCivIcon } from '@app/helper/civs';
import { Image } from 'expo-image';
import { getAgeIcon } from '@app/helper/units';
import startCase from 'lodash/startCase';
import { Age } from '@nex/data';


type ILegendTeams = Array<{
    teamId?: number
    players: Array<{
        name: string
        civImageUrl: string
        color: string
        resigned: boolean
        age: string
    }>
}>


interface Props {
    time: SharedValue<number>;
    legendInfo: ILegendInfo;
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

export default function Legend({ time, legendInfo }: Props) {
    const [currentLegendTeams, setCurrentLegendTeams] = useState<ILegendTeams>([]);

    console.log('RERENDER LEGEND');

    const updateMessages = (time: number) => {
        // console.log('updateMessages', time)

        const newLegendInfo = legendInfo.map(team => ({
            ...team,
            players: team.players.map(player => ({
                name: player.name,
                color: player.color,
                civImageUrl: player.civImageUrl,
                resigned: player.resignation ? getTimestampMs(player.resignation?.timestamp) < time : false,
                age: last(player.uptimes.filter(uptime => uptime.time < time))?.unit ?? 'Dark Age',
            })),
        }));

        if (!isEqual(newLegendInfo, currentLegendTeams)) {
            console.log('update');
            setCurrentLegendTeams(newLegendInfo);
        }
    };

    useAnimatedReaction(
        () => time.value,
        (newTime, prevTime) => {
            if (newTime !== prevTime) {
                runOnJS(updateMessages)(newTime);
            }
        },
        [currentLegendTeams]
    );

    return (
        <View
            style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
            }}
            className="mx-3 bg-gray-800/60 gap-1.5 p-2"
        >
            {currentLegendTeams.map((item) => (
                <View key={item.teamId} className="gap-0.5">
                    {item.players.map((player) => (
                        <View className="flex-row justify-end items-center gap-0" key={player.color}>
                            <Text
                                style={{
                                    color: player.color?.toLowerCase(),
                                    fontSize: 10,
                                }}
                            >
                                {player.name} ({player.age}) {player.resigned ? 'resigned' : ''}
                            </Text>
                            <Image className={'w-4 h-3'} source={player.civImageUrl} contentFit="contain" />
                            <Image className={'w-4 h-3'} source={getAgeIcon(startCase(player.age.replace('Age', '')) as Age)} contentFit="contain" />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}
