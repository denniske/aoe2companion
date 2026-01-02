import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { appConfig } from '@nex/dataset';
import { Image } from '@/src/components/uniwind/image';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { ScrollView } from '@app/components/scroll-view';

export default function StatisticsPage() {
    if (appConfig.game !== 'aoe2') {
        return <Redirect href="/statistics/leaderboard" />;
    }

    const getTranslation = useTranslation();

    return (
        <ScrollView contentContainerClassName="py-4 gap-4 px-4 md:flex-row">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('statistics.title'),
                }}
            />

            <Card href="/statistics/leaderboard" direction="vertical" className="overflow-hidden md:flex-1">
                <View className="-mx-4 -mt-4 mb-1">
                    <Image source={require('../../../../assets/statistics/hero.webp')} className="h-36 lg:h-64 w-full" />
                </View>
                <Text variant="label-lg">{getTranslation('leaderboards.title')}</Text>
            </Card>
            <Card
                href={Platform.OS === 'web' ? undefined : '/statistics/winrates'}
                onPress={Platform.OS === 'web' ? () => window.open('https://aoestats.io', '_blank') : undefined}
                direction="vertical"
                className="overflow-hidden md:flex-1"
            >
                <View className="-mx-4 -mt-4 mb-1">
                    <Image source={require('../../../../assets/statistics/armenians.webp')} className="h-36 lg:h-64 w-full" />
                </View>
                <Text variant="label-lg">{getTranslation('winrates.title')}</Text>
            </Card>
        </ScrollView>
    );
}
