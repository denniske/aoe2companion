import React, { useMemo } from 'react';
import { formatCustom, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { PerfChart } from '@app/view/components/perf-chart/PerfChart';
import type { ChartSeries } from '@app/view/components/perf-chart/types';

export interface IRatingChartProps {
    filteredRatingHistories: (IProfileRatingsLeaderboard & { label?: string; color?: string })[] | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
    width: number;
    height: number;
    allowMouseInteraction?: boolean;
}

const formatCursorDate = (x: number) => formatCustom(new Date(x), 'P');

export default function RatingChartSkia({ filteredRatingHistories, hiddenLeaderboardIds, width, height, allowMouseInteraction }: IRatingChartProps) {
    const theme = useAppTheme();

    // PerfChart wants epoch-ms points sorted ascending; the api hands them back
    // newest first.
    //
    // Compare mode puts two histories with the SAME leaderboardId in the list
    // (the player, and whoever they are compared against), so the series are
    // keyed by index rather than leaderboard id.
    const series = useMemo<ChartSeries[]>(
        () =>
            (filteredRatingHistories ?? [])
                .map((history, index) => ({ history, id: `series_${index}` }))
                .filter(({ history }) => history.ratings.length > 0 && !hiddenLeaderboardIds?.includes(history.leaderboardId))
                .map(({ history, id }) => ({
                    id,
                    label: history.label ?? history.leaderboardId,
                    color: history.color ?? getLeaderboardColor(history.leaderboardId, theme.dark),
                    data: history.ratings.map((r) => ({ x: new Date(r.date!).getTime(), y: r.rating })).sort((a, b) => a.x - b.x),
                })),
        [filteredRatingHistories, hiddenLeaderboardIds, theme.dark]
    );

    return (
        <PerfChart
            series={series}
            width={width}
            height={height}
            dark={theme.dark}
            cursor={allowMouseInteraction ? { formatX: formatCursorDate } : undefined}
        />
    );
}
