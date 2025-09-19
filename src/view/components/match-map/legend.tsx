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
import { IMatchNew } from '@app/api/helper/api.types';


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
    match: IMatchNew;
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

const analysisAgeToAge: Record<string, string> = {
    'dark_age': 'DarkAge',
    'feudal_age': 'FeudalAge',
    'castle_age': 'CastleAge',
    'imperial_age': 'ImperialAge',
}

const startingAges: Record<string, string> = {
    'standard': 'dark_age',
    'dark_age': 'dark_age',
    'feudal_age': 'feudal_age',
    'castle_age': 'castle_age',
    'imperial_age': 'imperial_age',
    'post_imperial_age': 'imperial_age',
}

export default function Legend({ time, legendInfo, match }: Props) {
    const [currentLegendTeams, setCurrentLegendTeams] = useState<ILegendTeams>([]);

    // console.log('RERENDER LEGEND');

    const updateMessages = (time: number) => {
        // console.log('updateMessages', time)

        const newLegendInfo = legendInfo.map(team =>{
            return {
                ...team,
                players: team.players.map((player) => {
                    let age = last(player.uptimes.filter(uptime => getTimestampMs(uptime.timestamp) < time))?.age ?? startingAges[match.startingAge] ?? 'dark';
                    // console.log('age', player.name, age, match.startingAge, analysisAgeToAge[age]);
                    return {
                        name: player.name,
                        color: player.color,
                        civImageUrl: player.civImageUrl,
                        resigned: player.resignation ? getTimestampMs(player.resignation?.timestamp) < time : false,
                        age: analysisAgeToAge[age],
                    };
                }),
            };
        });

        if (!isEqual(newLegendInfo, currentLegendTeams)) {
            // console.log('update');
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

    // console.log('match.startingAge', match.startingAge);
    // console.log('uptimes', legendInfo[0].players[0].uptimes);
    // console.log('LEGEND', currentLegendTeams);

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
                                    textDecorationLine: player.resigned ? 'line-through' : 'none',
                                }}
                            >
                                {player.name}
                            </Text>
                            <Image className={'w-4 h-3'} source={player.civImageUrl} contentFit="contain" />
                            <Image className={'w-4 h-3'} source={getAgeIcon(player.age as Age)} contentFit="contain" />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}
