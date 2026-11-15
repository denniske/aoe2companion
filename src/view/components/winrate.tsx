import { MIN_CELL_GAMES, useMeta } from '@app/api/meta';
import { MIN_RANKED_GAMES, ratingGroupLabel } from '@app/components/stats-overview/meta-helpers';
import { Card } from '@app/components/card';
import { HeaderTitle } from '@app/components/header-title';
import { ProgressBar } from '@app/components/progress-bar';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getCivHistoryImage } from '@app/helper/civs';
import { Civ } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { ImageBackground } from '@/src/components/uniwind/image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAccountData } from '@app/queries/all';
import SkiaLoader from '@app/components/skia-loader';
import { useUniwind } from 'uniwind';
import { useTranslation } from '@app/helper/translate';

// Hoisted rather than written inline in JSX: React Compiler cannot lower a
// dynamic `import()` expression and bails out on the whole component.
const loadWinrateCharts = () => import('@app/view/components/winrate-charts');

export default function CivDetails() {
    const getTranslation = useTranslation();
    const { name } = useLocalSearchParams<{ name: Civ }>();
    const nameLower = name?.toLowerCase() ?? '';
    const { theme } = useUniwind();
    // Our own /api/meta stats (ranked 1v1, last 30 days). We keep no per-patch history,
    // so the old by-patch charts and the rank-change arrow are gone.
    const { data: civData } = useMeta('civs');
    const { data: groupData } = useMeta('rating-groups');
    const [width, setWidth] = useState(0);

    const language = useAccountData((data) => data.language);
    // Rank among civs with enough games, the same cut the stats overview uses.
    const ranked = (civData?.civs ?? []).filter((c) => c.games >= MIN_RANKED_GAMES).sort((a, b) => b.winRate - a.winRate);
    const rank = ranked.findIndex((c) => c.civ === nameLower) + 1;
    const stats = civData?.civs.find((c) => c.civ === nameLower);
    // Same scale as the list page: up to the most played civ, at least 8%.
    const maxPlayrate = Math.max(8, Math.ceil(Math.max(0, ...(civData?.civs ?? []).map((c) => c.playRate)) * 100));

    // Play rate within a group is this civ's share of that group's civ picks.
    const ratings = (groupData?.groups ?? []).flatMap((group) => {
        const groupCiv = group.civs.find((c) => c.civ === nameLower);
        if (!groupCiv || groupCiv.games < MIN_CELL_GAMES) return [];
        const picks = group.civs.reduce((sum, c) => sum + c.games, 0);
        return [{ label: ratingGroupLabel(group).name, win_rate: groupCiv.winRate, play_rate: groupCiv.games / picks }];
    });

    // aoe2's civ keys are the capitalized id (romans -> Romans); links now carry the raw id.
    const civ = capitalize(nameLower) as Civ;

    if (!stats || !groupData || !nameLower) {
        return <View />;
    }

    return (
        <ImageBackground
            tintColor={theme === 'dark' ? 'white' : 'black'}
            imageStyle={styles.imageInner}
            contentFit="cover"
            // Only aoe2 has bundled civ history art; aoe4 gets the plain background.
            source={appConfig.game === 'aoe2' ? getCivHistoryImage(civ) : undefined}
            style={styles.image}
        >
            <Stack.Screen
                options={{
                    // The plain title feeds the breadcrumb and the browser tab; headerTitle only draws the header.
                    title: stats.civName,
                    headerTitle: () => <HeaderTitle icon={{ uri: stats.civImageUrl }} title={stats.civName} subtitle={getTranslation('winrates.subtitle')} />,
                }}
            />
            <ScrollView className="flex-1" contentContainerClassName="p-4 gap-5">
                <View className="flex-row gap-4" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
                    <Card direction="vertical" className="px-4 py-3 flex-1">
                        <View className="flex-row justify-center items-center gap-2">
                            <Text variant="header">{getTranslation('winrates.winrate')}</Text>

                            {rank > 0 && <Text variant="label-sm">#{rank}</Text>}
                        </View>

                        <ProgressBar percent={stats.winRate * 100} status={stats.winRate >= 0.5 ? 'positive' : 'negative'} />

                        <Text className="self-center">{getTranslation('winrates.wins', { wins: stats.wins.toLocaleString(language), count: stats.wins })}</Text>
                    </Card>

                    <Card direction="vertical" className="px-4 py-3 flex-1">
                        <Text variant="header" className="self-center">
                            {getTranslation('winrates.playrate')}
                        </Text>

                        <ProgressBar percent={stats.playRate * 100} max={maxPlayrate} />
                        <Text className="self-center">{getTranslation('winrates.games', { games: stats.games.toLocaleString(language), count: stats.games })}</Text>
                    </Card>
                </View>

                <SkiaLoader
                    getComponent={loadWinrateCharts}
                    componentProps={{ width, ratings }}
                    fallback={<View className="h-80" />}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imageInner: {
        opacity: 0.1,
        alignSelf: 'flex-end',
        bottom: -50,
        top: undefined,
        height: 400,
    },
    image: {
        flex: 1,
    },
});
