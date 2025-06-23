import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

export default function StatisticsPage() {
    if (appConfig.game !== 'aoe2de') {
        return <Redirect href="/statistics/leaderboard" />;
    }

    const getTranslation = useTranslation();

    return (
        <View className="flex-1 p-4 gap-4">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('statistics.title'),
                }}
            />

            <Card href="/statistics/leaderboard" direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/statistics/hero.webp')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">{getTranslation('leaderboards.title')}</Text>
            </Card>
            <Card href={Platform.OS === 'web' ? 'https://aoestats.io' : '/statistics/winrates'} direction="vertical" className="overflow-hidden">
                <View className="-mx-2 -mt-3 mb-1">
                    <Image source={require('../../../assets/statistics/armenians.webp')} className="h-36 w-full" />
                </View>
                <Text variant="label-lg">{getTranslation('winrates.title')}</Text>
            </Card>
        </View>
    );
}
