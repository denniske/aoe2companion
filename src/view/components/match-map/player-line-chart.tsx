import React from 'react';
import { PerfChart } from '@app/view/components/perf-chart/PerfChart';
import { AutoSize } from '@app/view/components/perf-chart/auto-size';
import type { ChartSeries } from '@app/view/components/perf-chart/types';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { useAppTheme } from '@app/theming';

/** One line + dots per player over game minutes, as used by the match analysis cards. */
export function PlayerLineChart({ series }: { series: ChartSeries[] }) {
    const theme = useAppTheme();
    const { isMedium } = useBreakpoints();

    return (
        <AutoSize style={{ height: 160, marginVertical: 12 }}>
            {(size) => (
                <PerfChart
                    {...size}
                    series={series}
                    fontSize={isMedium ? 12 : 11}
                    dark={theme.dark}
                    scatterRadius={2}
                    xAxis={{ type: 'linear' }}
                />
            )}
        </AutoSize>
    );
}
