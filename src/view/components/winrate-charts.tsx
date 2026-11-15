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

/** One rating group's numbers for the civ, from /api/meta/rating-groups. */
export interface RatingGroupStat {
    label: string;
    win_rate: number;
    play_rate: number;
}

const chartPadding = { top: 15, right: 15, bottom: 15, left: 15 };
const gridDash = [4, 4];

const WinrateCharts: React.FC<{ width: number; ratings: RatingGroupStat[] }> = ({ width, ratings }) => {
    const appTheme = useAppTheme();
    const getTranslation = useTranslation();
    const { theme } = useUniwind();
    const winRates = ratings.map((r) => r.win_rate);
    const playRates = ratings.map((r) => r.play_rate);
    // Fixed 40-60% / 0-8% axes as before, widened when a group falls outside them
    // (the top groups are small, so their rates swing further).
    const graphs: { key: 'win_rate' | 'play_rate'; label: string; domain: [number, number]; tickFormat: (y: number) => string }[] = [
        {
            key: 'win_rate',
            label: getTranslation('winrates.chart.winratebyrating'),
            domain: [Math.min(0.4, ...winRates.map((v) => v - 0.02)), Math.max(0.6, ...winRates.map((v) => v + 0.02))],
            tickFormat: (y) => `${Math.round(y * 100)}%`,
        },
        {
            key: 'play_rate',
            label: getTranslation('winrates.chart.playratebyrating'),
            domain: [0, Math.max(0.08, ...playRates.map((v) => v * 1.15))],
            tickFormat: (y) => `${Math.round(y * 100)}%`,
        },
    ];

    const colorGold200 = useCSSVariable('--color-gold-200') as string;
    const colorBlue500 = useCSSVariable('--color-blue-500') as string;

    if (ratings.length === 0) return null;

    return (
        <Slider2
            paginationStyle={{ bottom: 0 }}
            className="-mx-4 pb-6"
            slides={graphs.map(({ label, key, domain, tickFormat }) => (
                <Card className="p-0 gap-0 mx-4 h-80" direction="vertical" key={key}>
                    <Text variant="header" className="pt-4 mb-2" align="center">
                        {label}
                    </Text>
                    {width > 0 && (
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
                                            data: ratings.map((r, i) => ({ x: i, y: r[key] })),
                                        },
                                    ]}
                                    xAxis={{ type: 'band', grid: false, formatLabel: (x) => ratings[x]?.label ?? '' }}
                                    yAxis={{ domain, formatLabel: tickFormat }}
                                />
                            )}
                        </AutoSize>
                    )}
                </Card>
            ))}
        />
    );
};

export default WinrateCharts;
