import {
    useWinrateGroupings,
    useWinrates,
    useWinratesBreakdown,
    useWinratesPatches,
    WinrateBreakdown,
    WinrateGrouping,
    WinrateGroupingResponse,
} from '@app/api/winrates';
import { Card } from '@app/components/card';
import { HeaderTitle } from '@app/components/header-title';
import { Icon } from '@app/components/icon';
import { faCaretDown, faCaretUp } from '@fortawesome/sharp-solid-svg-icons';
import { ProgressBar } from '@app/components/progress-bar';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getCivHistoryImage, getCivIconLocal } from '@app/helper/civs';
import { Civ, formatDateShort, formatMonth, formatTime, formatYear, getCivNameById } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { ImageBackground } from '@/src/components/uniwind/image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAccountData } from '@app/queries/all';
import SkiaLoader from '@app/components/skia-loader';
import { useUniwind } from 'uniwind';

// Hoisted rather than written inline in JSX: React Compiler cannot lower a
// dynamic `import()` expression and bails out on the whole component.
const loadWinrateCharts = () => import('@app/view/components/winrate-charts');

export default function CivDetails() {
    const { name } = useLocalSearchParams<{ name: Civ }>();
    const nameLower = name?.toLowerCase() ?? '';
    const { theme } = useUniwind();
    const { winrates } = useWinrates();
    const { breakdown } = useWinratesBreakdown();
    const { groupings } = useWinrateGroupings();
    const [width, setWidth] = useState(0);
    const grouping = groupings?.find((g) => g.name === WinrateGrouping['1v1Random']);

    const language = useAccountData((data) => data.language);
    const stats = winrates?.civs.find((civ) => civ.civ_name === nameLower);

    const civ = name!;

    if (appConfig.game !== 'aoe2' || !stats || !breakdown || !grouping || !nameLower) {
        return <View />;
    }

    const sameRank = stats.rank === stats.prior_rank;

    return (
        <ImageBackground
            tintColor={theme === 'dark' ? 'white' : 'black'}
            imageStyle={styles.imageInner}
            contentFit="cover"
            source={getCivHistoryImage(civ)}
            style={styles.image}
        >
            <Stack.Screen
                options={{
                    headerTitle: () => <HeaderTitle icon={getCivIconLocal(civ)} title={getCivNameById(civ)} subtitle="Statistics" />,
                }}
            />
            <ScrollView className="flex-1" contentContainerClassName="p-4 gap-5">
                <View className="flex-row gap-4" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
                    <Card direction="vertical" className="px-4 py-3 flex-1">
                        <View className="flex-row justify-center items-center gap-2">
                            <Text variant="header">Win Rate</Text>

                            <View className="flex-row items-center">
                                <Text variant="label-sm">#{stats.rank}</Text>
                                {!sameRank && (
                                    <Icon
                                        icon={stats.rank > stats.prior_rank ? faCaretDown : faCaretUp}
                                        color={stats.rank > stats.prior_rank ? 'accent-red-500' : 'accent-green-500'}
                                    />
                                )}
                            </View>
                        </View>

                        <ProgressBar percent={stats.win_rate * 100} status={stats.win_rate >= 0.5 ? 'positive' : 'negative'} />

                        <Text className="self-center">{stats.wins.toLocaleString(language)} wins</Text>
                    </Card>

                    <Card direction="vertical" className="px-4 py-3 flex-1">
                        <Text variant="header" className="self-center">
                            Play Rate
                        </Text>

                        <ProgressBar percent={stats.play_rate * 100} max={8} />
                        <Text className="self-center">{stats.num_games.toLocaleString(language)} wins</Text>
                    </Card>
                </View>

                <SkiaLoader
                    getComponent={loadWinrateCharts}
                    componentProps={{ width, grouping, breakdown, civ: nameLower }}
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
