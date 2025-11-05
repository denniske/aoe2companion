import {
    PriorCivStat,
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
import { ProgressBar } from '@app/components/progress-bar';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getCivHistoryImage, getCivIconLocal } from '@app/helper/civs';
import {
    LineSegment,
    VictoryArea,
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
} from 'victory-native';
import { Slider } from '@app/view/components/slider';
import { aoeCivKey, getCivNameById } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { format } from 'date-fns';
import { ImageBackground } from '@/src/components/uniwind/image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAccountData } from '@app/queries/all';
import { cloneDeep, merge } from 'lodash';
import { useCSSVariable, useResolveClassNames, useUniwind } from 'uniwind';


export default function CivDetails() {
    const { name } = useLocalSearchParams<{ name: aoeCivKey }>();
    const nameLower = name?.toLowerCase() ?? '';
    const { theme } = useUniwind()
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

const StatsByRatingSlider: React.FC<{ width: number; grouping: WinrateGroupingResponse; breakdown: WinrateBreakdown; civ: string }> = ({
    width,
    grouping,
    breakdown,
    civ,
}) => {
    const { theme } = useUniwind()
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Rating', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Rating', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
    ];

    const newVictoryTheme = useNewVictoryTheme();

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;

    return (
        <Slider
            className="-mx-4 pb-6"
            tabs={graphs.map(({label}) => label)}
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = Object.values(breakdown.byRating).map((byRating) => ({
                    elo: byRating.elo_range,
                    [key]: byRating.civ_stats[civ][key],
                }));

                return (
                    <Card className="p-0 gap-0 mx-4" direction="vertical">
                        <Text variant="header" className="pt-4 -mb-6" align="center">
                            {label}
                        </Text>
                        {width > 0 && (
                            <>
                            <VictoryChart
                                height={300}
                                width={width}
                                domainPadding={{ x: 10 }}
                                domain={{ y: domain }}
                                theme={theme === 'dark' ? newVictoryTheme.customDark : newVictoryTheme.custom}
                            >
                                <VictoryAxis dependentAxis crossAxis tickFormat={tickFormat} />
                                <VictoryAxis
                                    crossAxis
                                    gridComponent={<LineSegment active={false} style={{ stroke: 'transparent' }} />}
                                    tickFormat={(x) => grouping.elo_groupings.find((eg) => eg.name === x)?.label.replace(/ *\([^)]*\) */g, '') ?? ''}
                                />

                                <VictoryBar
                                    data={data}
                                    x="elo"
                                    y={key}
                                    style={{ data: { fill: theme === 'dark' ? colorGold200 : colorBlue500 } }}
                                />
                            </VictoryChart>
                            </>
                        )}
                    </Card>
                );
            })}
        />
    );
};



const StatsByPatchSlider: React.FC<{ width: number; breakdown: WinrateBreakdown; civ: string }> = ({ width, breakdown, civ }) => {
    const { theme } = useUniwind()
    const { patches } = useWinratesPatches();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Patch', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Patch', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'rank', label: 'Rank by Patch', domain: [50, 0] },
    ];

    const newVictoryTheme = useNewVictoryTheme();

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;
    const colorGold200_80 = useResolveClassNames('text-gold-200/80').color as string;
    const colorBlue500_80 = useResolveClassNames('text-blue-500/80').color as string;

    return (
        <Slider
            className="-mx-4 pb-6"
            tabs={graphs.map(({label}) => label)}
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = breakdown.priorStats.map((prior) => ({
                    patch: prior.patch,
                    date: patches?.find((patch) => patch.number === prior.patch)?.release_date,
                    [key]: prior.civ_stats[civ][key],
                }));

                return (
                    <Card className="p-0 gap-0 mx-4" direction="vertical">
                        <Text variant="header" className="pt-4 -mb-6" align="center">
                            {label}
                        </Text>
                        {width > 0 && (
                            <VictoryChart
                                height={300}
                                width={width}
                                domain={{ y: domain }}
                                theme={theme === 'dark' ? newVictoryTheme.customDark : newVictoryTheme.custom}
                            >
                                <VictoryAxis dependentAxis crossAxis tickFormat={tickFormat} />
                                <VictoryAxis crossAxis tickFormat={(x) => format(new Date(x), 'M/d')} />

                                {domain[0] > domain[1] ? (
                                    <VictoryLine
                                        data={data}
                                        x="date"
                                        y={key}
                                        style={{ data: { stroke: theme === 'dark' ? colorGold200 : colorBlue500 } }}
                                    />
                                ) : (
                                    <VictoryArea
                                        data={data}
                                        x="date"
                                        y={key}
                                        style={{
                                            data: {
                                                stroke: theme === 'dark' ? colorGold200 : colorBlue500,
                                                fill: theme === 'dark' ? colorGold200_80 : colorBlue500_80,
                                            },
                                        }}
                                    />
                                )}
                            </VictoryChart>
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

function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function (key) {
        const value = obj[key];
        if (key === 'fontFamily') {
            obj[key] = obj[key].replace("'Roboto',", "'System',");
        }
        if (typeof value === 'object') {
            replaceRobotoWithSystemFont(obj[key]);
        }
    });
    return obj;
}

let _themeWithSystemFont = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));
let _themeWithSystemFontDark = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

function useNewVictoryTheme() {
    const colorBlack = useCSSVariable('--color-black') as string;
    const colorWhite = useCSSVariable('--color-white') as string;

    const themeWithSystemFont = merge(_themeWithSystemFont, {
        axis: {
            style: {
                tickLabels: {
                    fill: colorBlack,
                },
            },
        },
        line: {
            style: {
                labels: {
                    fill: colorBlack,
                },
            },
        },
    });

    const themeWithSystemFontDark = merge(_themeWithSystemFontDark, {
        axis: {
            style: {
                tickLabels: {
                    fill: colorWhite,
                },
            },
        },
        line: {
            style: {
                labels: {
                    fill: colorWhite,
                },
            },
        },
    });

    return { ...VictoryTheme, custom: themeWithSystemFont, customDark: themeWithSystemFontDark };
}
