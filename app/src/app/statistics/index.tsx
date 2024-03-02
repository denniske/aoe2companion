import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Card } from '@app/components/card';
import { Stack } from 'expo-router';
import { Text } from '@app/components/text';
import { Image } from 'expo-image';

export default function StatisticsPage() {
    return (
        <View className="flex-1 p-4 g-4">
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
