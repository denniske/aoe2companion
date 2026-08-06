import {
    PriorCivStat,
    useWinratesPatches,
    WinrateBreakdown,
    WinrateGroupingResponse,
} from '@app/api/winrates';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { Slider2 } from '@app/view/components/slider2';
import { formatDateShort, formatMonth, formatTime, formatYear } from '@nex/data';
import React from 'react';
import { Area, Bar, CartesianChart, Line } from 'victory-native-date';
import { DashPathEffect } from '@shopify/react-native-skia';
import { useChartFont } from '@app/view/components/chart-font';
import { useAppTheme } from '@app/theming';
import { useCSSVariable, useUniwind } from 'uniwind';

// Everything in this module touches Skia, so it must not be imported eagerly on
// web. It is loaded through SkiaLoader/WithSkiaWeb once CanvasKit is ready.
// See winrate.tsx.


// Font comes from the platform-split chart-font module: the system font on
// native, a bundled typeface on web (where matchFont is unavailable).

const StatsByRatingSlider: React.FC<{ width: number; grouping: WinrateGroupingResponse; breakdown: WinrateBreakdown; civ: string }> = ({
    width,
    grouping,
    breakdown,
    civ,
}) => {
    const appTheme = useAppTheme();
    const { theme } = useUniwind();
    const font = useChartFont();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Rating', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Rating', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
    ];

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;

    return (
        <Slider2
            paginationStyle={{ bottom: 0 }}
            className="-mx-4 pb-6"
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = Object.values(breakdown.byRating).map((byRating, i) => ({
                    index: i,
                    elo: byRating.elo_range,
                    [key]: byRating.civ_stats[civ][key],
                }));


                return (
                    <Card className="p-0 gap-0 mx-4 h-80" direction="vertical" key={key}>
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
                                        labelColor: appTheme.textColor,
                                        tickCount: data.length,
                                        lineWidth: 0,
                                        formatXLabel: (x) =>
                                            grouping.elo_groupings.find((eg) => eg.name === data[x].elo)?.label.replace(/ *\([^)]*\) */g, '') ?? '',
                                        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                    }}
                                    yAxis={[
                                        {
                                            font,
                                            labelColor: appTheme.textColor,
                                            yKeys: [key as any],
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
                                            color={theme === 'dark' ? colorGold200 : colorBlue500}
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
    const appTheme = useAppTheme();
    const { theme } = useUniwind();
    const { patches } = useWinratesPatches();
    const font = useChartFont();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: 'Win Rate by Patch', domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: 'Play Rate by Patch', domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'rank', label: 'Rank by Patch', domain: [50, 0] },
    ];

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;

    const formatTick = (date: Date) => {
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(date);
    };


    return (
        <Slider2
            paginationStyle={{ bottom: 0 }}
            className="-mx-4 pb-6"
            slides={graphs.map(({ label, key, domain, tickFormat }) => {
                const data = breakdown.priorStats
                    .map((prior) => {
                        const releaseDate = patches?.find((patch) => patch.number === prior.patch)?.release_date;
                        // The x axis becomes a time scale only when every x value is a
                        // real Date, so drop points whose patch has no release date
                        // rather than letting one undefined fall back to categorical.
                        return releaseDate
                            ? {
                                  date: new Date(releaseDate),
                                  patch: prior.patch,
                                  [key]: prior.civ_stats[civ][key],
                              }
                            : null;
                    })
                    .filter((datum): datum is NonNullable<typeof datum> => datum !== null);

                return (
                    <Card className="p-0 gap-0 mx-4 h-80" direction="vertical" key={key}>
                        <Text variant="header" className="pt-4 mb-2" align="center">
                            {label}
                        </Text>
                        {width > 0 && (
                            <>
                                <CartesianChart
                                    data={data}
                                    padding={15}
                                    domain={{
                                        // No x domain: index-space bounds would push the
                                        // date timestamps off-scale. Let the time scale
                                        // derive its bounds from the dates themselves.
                                        y: domain,
                                    }}
                                    xAxis={{
                                        font,
                                        labelColor: appTheme.textColor,
                                        lineWidth: 0,
                                        // tickCount: data.length,
                                        formatXLabel: (x) => formatTick(x instanceof Date ? x : new Date(x)),
                                        // formatXLabel: (x) => formatCustom(x instanceof Date ? x : new Date(x), 'yy-MMM'),
                                        // formatXLabel: (x) => formatCustom(new Date(x), 'yyyy MMM d'),
                                        // labelRotate: -25,
                                        linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                    }}
                                    yAxis={[
                                        {
                                            font,
                                            labelColor: appTheme.textColor,
                                            yKeys: [key],
                                            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
                                            formatYLabel: tickFormat,
                                        },
                                    ]}
                                    xKey={'date' as any}
                                    yKeys={[key as any]}
                                >
                                    {({ points, chartBounds }) =>
                                        domain[0] < domain[1] ? (
                                            <Area
                                                points={points[key]}
                                                y0={chartBounds.bottom}
                                                animate={{ type: 'timing', duration: 300 }}
                                                color={theme === 'dark' ? colorGold200 : colorBlue500}
                                            />
                                        ) : (
                                            <Line
                                                points={points[key]}
                                                color={theme === 'dark' ? colorGold200 : colorBlue500}
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

const WinrateCharts: React.FC<{
    width: number;
    grouping: WinrateGroupingResponse;
    breakdown: WinrateBreakdown;
    civ: string;
}> = ({ width, grouping, breakdown, civ }) => (
    <>
        <StatsByRatingSlider width={width} grouping={grouping} breakdown={breakdown} civ={civ} />
        <StatsByPatchSlider width={width} breakdown={breakdown} civ={civ} />
    </>
);

export default WinrateCharts;
