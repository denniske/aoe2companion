import { ScrollView } from '@app/components/scroll-view';
import { LeaderboardPreview } from '@app/components/stats-overview/leaderboard-preview';
import {
    CivWinratesTeaser,
    CountriesTeaser,
    MapCivTeaser,
    MatchupsTeaser,
    RatingGroupsTeaser,
    StatsTotals,
} from '@app/components/stats-overview/stats-overview-cards';
import { SectionTitle } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { appConfig } from '@nex/dataset';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

// POC: the leaderboard preview uses live data, everything else is mock data from
// components/stats-overview/mock-data.ts.
export default function StatisticsPage() {
    const getTranslation = useTranslation();

    if (appConfig.game !== 'aoe2') {
        return <Redirect href="/statistics/leaderboard" />;
    }

    // Cards are paired in rows of two on wide screens, each pair sized to hold about
    // the same amount of content so neither card in a row is left half empty.
    return (
        <ScrollView contentContainerClassName="py-4 gap-4 px-4">
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('statistics.title'),
                }}
            />

            <StatsTotals />

            <SectionTitle title="Top players" />
            <View className="gap-4 md:flex-row">
                <LeaderboardPreview className="md:flex-[2]" />
                <CountriesTeaser className="md:flex-1" />
            </View>

            <SectionTitle
                title="Meta"
                right={
                    <Text variant="body-xs" color="subtle">
                        RM 1v1 · last 30 days
                    </Text>
                }
            />
            <View className="gap-4 md:flex-row">
                <CivWinratesTeaser />
                <MatchupsTeaser />
            </View>

            <View className="gap-4 md:flex-row">
                <MapCivTeaser />
                <RatingGroupsTeaser />
            </View>
        </ScrollView>
    );
}
