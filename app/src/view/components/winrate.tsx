import {
    useWinrates,
    useWinratesBreakdown,
    useWinrateGroupings,
    WinrateGrouping,
    WinrateGroupingResponse,
    WinrateBreakdown,
    PriorCivStat,
    useWinratesPatches,
} from '@app/api/winrates';
import { Card } from '@app/components/card';
import { HeaderTitle } from '@app/components/header-title';
import { Icon } from '@app/components/icon';
import { ProgressBar } from '@app/components/progress-bar';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getCivHistoryImage, getCivIconLocal } from '@app/helper/civs';
import { Slider } from '@app/view/components/slider';
import { aoeCivKey, getCivNameById } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { format } from 'date-fns';
import { ImageBackground } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useAccountData } from '@app/queries/all';
import { Area, Bar, CartesianChart, Line } from 'victory-native-current';
import { DashPathEffect, matchFont } from '@shopify/react-native-skia';
import tw from '@app/tailwind';
import { useAppTheme } from '@app/theming';

export default function CivDetails() {
    const { name } = useLocalSearchParams<{ name: aoeCivKey }>();
    const nameLower = name?.toLowerCase() ?? '';
    const { colorScheme } = useColorScheme();
    const { winrates } = useWinrates();
    const { breakdown } = useWinratesBreakdown();
    const { groupings } = useWinrateGroupings();
    const [width, setWidth] = useState(0);
    const grouping = groupings?.find((g) => g.name === WinrateGrouping['1v1Random']);

    const language = useAccountData((data) => data.language);
    const stats = winrates?.civs.find((civ) => civ.civ_name === nameLower);

    const civ = name!;

    if (appConfig.game !== 'aoe2de' || !stats || !breakdown || !grouping || !nameLower) {
        return <View />;
    }

    const sameRank = stats.rank === stats.prior_rank;

    return (
        <ImageBackground
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
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
            <ScrollView className="flex-1" contentContainerStyle="p-4 gap-5">
                <View className="flex-row gap-4" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
                    <Card direction="vertical" className="px-4 py-3 flex-1">
                        <View className="flex-row justify-center items-center gap-2">
                            <Text variant="header">Win Rate</Text>

                            <View className="flex-row items-center">
                                <Text variant="label-sm">#{stats.rank}</Text>
                                {!sameRank && (
                                    <Icon
                                        icon={stats.rank > stats.prior_rank ? 'caret-down' : 'caret-up'}
                                        color={stats.rank > stats.prior_rank ? 'text-red-500' : 'text-green-500'}
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

                <StatsByRatingSlider width={width} grouping={grouping} breakdown={breakdown} civ={nameLower} />
                <StatsByPatchSlider width={width} breakdown={breakdown} civ={nameLower} />
            </ScrollView>
        </ImageBackground>
    );
}


const DATA = (length: number = 10) =>
    Array.from({ length }, (_, index) => ({
        month: index + 1,
        listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    }));


const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
    fontFamily,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
};
const font = matchFont(fontStyle as any);

const StatsByRatingSlider: React.FC<{ width: number; grouping: WinrateGroupingResponse; breakdown: WinrateBreakdown; civ: string }> = ({
    width,
    grouping,
    breakdown,
    civ,
}) => {
    const theme = useAppTheme();
    const { colorScheme } = useColorScheme();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Rating', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Rating', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
    ];

    return (
        <Slider
            paginationStyle={{ bottom: 0 }}
            className="-mx-4 pb-6"
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = Object.values(breakdown.byRating).map((byRating, i) => ({
                    index: i,
                    elo: byRating.elo_range,
                    [key]: byRating.civ_stats[civ][key],
                }));


                return (
                    <Card className="p-0 gap-0 mx-4 h-80" direction="vertical">
                        <Text variant="header" className="pt-4 mb-2" align="center">
                            {label}
                        </Text>
                        {width > 0 && (
                            <>
                                <CartesianChart
                                    data={data}
                                    padding={15}
                                    domain={{
                                        x: [-0.5, data.length - 0.5],
                                        y: domain,
                                    }}
                                    xAxis={{
                                        font,
                                        labelColor: theme.textColor,
                                        tickCount: data.length,
                                        lineWidth: 0,
                                        formatXLabel: (x) =>
                                            grouping.elo_groupings.find((eg) => eg.name === data[x].elo)?.label.replace(/ *\([^)]*\) */g, '') ?? '',
                                        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                    }}
                                    yAxis={[
                                        {
                                            font,
                                            labelColor: theme.textColor,
                                            yKeys: [key],
                                            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                            formatYLabel: tickFormat,
                                        },
                                    ]}
                                    xKey="index"
                                    yKeys={[key]}
                                >
                                    {({ points, chartBounds }) => (
                                        <Bar
                                            points={points[key]}
                                            chartBounds={chartBounds}
                                            barWidth={width / (data.length + 3)}
                                            color={colorScheme === 'dark' ? tw.color('gold-200') : tw.color('blue-500')}
                                        />
                                    )}
                                </CartesianChart>
                            </>
                        )}
                    </Card>
                );
            })}
        />
    );
};

const StatsByPatchSlider: React.FC<{ width: number; breakdown: WinrateBreakdown; civ: string }> = ({ width, breakdown, civ }) => {
    const { colorScheme } = useColorScheme();
    const { patches } = useWinratesPatches();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Patch', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Patch', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'rank', label: 'Rank by Patch', domain: [50, 0] },
    ];

    return (
        <Slider
            paginationStyle={{ bottom: 0 }}
            className="-mx-4 pb-6"
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = breakdown.priorStats.map((prior) => ({
                    patch: prior.patch,
                    date: patches?.find((patch) => patch.number === prior.patch)?.release_date,
                    [key]: prior.civ_stats[civ][key],
                }));

                return (
                    <Card className="p-0 gap-0 mx-4 h-80" direction="vertical">
                        <Text variant="header" className="pt-4 mb-2" align="center">
                            {label}
                        </Text>
                        {width > 0 && (
                            <>
                                <CartesianChart
                                    data={data}
                                    padding={15}
                                    domain={{
                                        x: [-0.5, data.length - 0.5],
                                        y: domain,
                                    }}
                                    xAxis={{
                                        font,
                                        labelColor: theme.textColor,
                                        tickCount: data.length,
                                        labelColor: '#000',
                                        lineWidth: 0,
                                        formatXLabel: (x) => format(new Date(x), 'yy-MMM'),
                                        // formatXLabel: (x) => format(new Date(x), 'yyyy MMM d'),
                                        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                        labelRotate: 0, //-90,
                                    }}
                                    yAxis={[
                                        {
                                            font,
                                            yKeys: [key],
                                            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                            formatYLabel: tickFormat,
                                        },
                                    ]}
                                    xKey="date"
                                    yKeys={[key]}
                                >
                                    {({ points, chartBounds }) =>
                                        domain[0] < domain[1] ? (
                                            <Area
                                                points={points[key]}
                                                y0={chartBounds.bottom}
                                                animate={{ type: 'timing', duration: 300 }}
                                                color={colorScheme === 'dark' ? tw.color('gold-200') : tw.color('blue-500')}
                                            />
                                        ) : (
                                            <Line
                                                points={points[key]}
                                                color={colorScheme === 'dark' ? tw.color('gold-200') : tw.color('blue-500')}
                                                strokeWidth={3}
                                                animate={{ type: 'timing', duration: 300 }}
                                            />
                                        )
                                    }
                                </CartesianChart>
                            </>
                        )}
                    </Card>
                );
            })}
        />
    );
};

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
