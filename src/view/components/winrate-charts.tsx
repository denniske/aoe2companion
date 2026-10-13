import {
    PriorCivStat,
    useWinratesPatches,
    WinrateBreakdown,
    WinrateGroupingResponse,
} from '@app/api/winrates';
import { Card } from '@app/components/card';
import { useTranslation } from '@app/helper/translate';
import { Text } from '@app/components/text';
import { Slider2 } from '@app/view/components/slider2';
import React from 'react';
import { PerfChart } from '@app/view/components/perf-chart/PerfChart';
import { AutoSize } from '@app/view/components/perf-chart/auto-size';
import { useAppTheme } from '@app/theming';
import { useCSSVariable, useUniwind } from 'uniwind';

// Everything in this module touches Skia, so it must not be imported eagerly on
// web. It is loaded through SkiaLoader/WithSkiaWeb once CanvasKit is ready.
// See winrate.tsx.


const chartPadding = { top: 15, right: 15, bottom: 15, left: 15 };
const gridDash = [4, 4];

const StatsByRatingSlider: React.FC<{ width: number; grouping: WinrateGroupingResponse; breakdown: WinrateBreakdown; civ: string }> = ({
    width,
    grouping,
    breakdown,
    civ,
}) => {
    const appTheme = useAppTheme();
    const getTranslation = useTranslation();
    const { theme } = useUniwind();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: getTranslation('winrates.chart.winratebyrating'), domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: getTranslation('winrates.chart.playratebyrating'), domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
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
                                <AutoSize className="flex-1">
                                    {(size) => (
                                        <PerfChart
                                            {...size}
                                            dark={appTheme.dark}
                                            padding={chartPadding}
                                            gridDash={gridDash}
                                            series={[
                                                {
                                                    id: key,
                                                    color: theme === 'dark' ? colorGold200 : colorBlue500,
                                                    bar: true,
                                                    data: data.map((d) => ({ x: d.index, y: d[key] as number })),
                                                },
                                            ]}
                                            xAxis={{
                                                type: 'band',
                                                grid: false,
                                                formatLabel: (x) =>
                                                    grouping.elo_groupings.find((eg) => eg.name === data[x]?.elo)?.label.replace(/ *\([^)]*\) */g, '') ?? '',
                                            }}
                                            yAxis={{ domain, formatLabel: tickFormat }}
                                        />
                                    )}
                                </AutoSize>
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
    const getTranslation = useTranslation();
    const { patches } = useWinratesPatches();
    const graphs: { key: keyof PriorCivStat; label: string; domain: [number, number]; tickFormat?: (x: any) => string }[] = [
        { key: 'win_rate', label: getTranslation('winrates.chart.winratebypatch'), domain: [0.4, 0.6], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'play_rate', label: getTranslation('winrates.chart.playratebypatch'), domain: [0, 0.08], tickFormat: (y) => `${Math.round(y * 100)}%` },
        { key: 'rank', label: getTranslation('winrates.chart.rankbypatch'), domain: [50, 0] },
    ];

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;



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
                                <AutoSize className="flex-1">
                                    {(size) => (
                                        <PerfChart
                                            {...size}
                                            dark={appTheme.dark}
                                            padding={chartPadding}
                                            gridDash={gridDash}
                                            series={[
                                                {
                                                    id: key,
                                                    color: theme === 'dark' ? colorGold200 : colorBlue500,
                                                    // A top-down domain (rank) reads as a line; filling
                                                    // "below" it would shade the better ranks.
                                                    ...(domain[0] < domain[1] ? { area: true } : { strokeWidth: 3 }),
                                                    data: data.map((d) => ({ x: d.date.getTime(), y: d[key] as number })).sort((a, b) => a.x - b.x),
                                                },
                                            ]}
                                            xAxis={{ type: 'time', grid: false }}
                                            yAxis={{ domain, formatLabel: tickFormat }}
                                        />
                                    )}
                                </AutoSize>
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
