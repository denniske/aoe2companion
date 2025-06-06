import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function StatisticsPage() {
    if (appConfig.game !== 'aoe2de') {
        return <Redirect href="/statistics/leaderboard" />;
    }

    return (
        <View className="flex-1 p-4 gap-4">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: 'Statistics',
                }}
            />

            <Card href="/statistics/leaderboard" direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/statistics/hero.webp')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">Leaderboards</Text>
            </Card>
            <Card href={Platform.OS === 'web' ? 'https://aoestats.io' : '/statistics/winrates'} direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/statistics/armenians.webp')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">Winrates</Text>
            </Card>
        </View>
    );
}
