import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function StatisticsPage() {
    if (appConfig.game !== 'aoe2de') {
        return <Redirect href="/statistics/leaderboard" />;
    }

    return (
        <View className="flex-1 p-4 gap-4">
            <Stack.Screen
                options={{
                    title: 'Statistics',
                }}
            />

            <Card href="/statistics/leaderboard" direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/hero.jpg')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">Leaderboards</Text>
            </Card>
            <Card href="/statistics/winrates" direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/gameplay/armenians.jpg')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">Winrates</Text>
            </Card>
        </View>
    );
}
