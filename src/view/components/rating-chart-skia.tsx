import { View } from 'react-native';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { formatCustom, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { orderBy } from 'lodash';

import { CartesianChart, Line, Scatter } from 'victory-native-date';
import { Group, Line as SkiaLine, Rect, Text as SkiaText, vec } from '@shopify/react-native-skia';
import { useChartFont } from '@app/view/components/chart-font';

export interface IRatingChartProps {
    formatTick: (date: Date) => string;
    ratingHistoryDuration?: string;
    filteredRatingHistories: (IProfileRatingsLeaderboard & { label?: string; color?: string })[] | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
    width: number;
    allowMouseInteraction?: boolean;
}

type ChartPoint = { x: number; y: number | null; xValue: number | Date; yValue: number | null };

export default function RatingChart(props: IRatingChartProps) {
    const { formatTick, filteredRatingHistories, hiddenLeaderboardIds, allowMouseInteraction } = props;

    const theme = useAppTheme();
    const font = useChartFont();

    // Canvas-space x of the pointer, or null when it is outside the chart.
    // Only tracked when the caller opts in, so touch platforms are unaffected.
    const [cursorX, setCursorX] = useState<number | null>(null);

    const containerRef = useRef<View | null>(null);

    // React Native Web's View does not forward `onPointerMove`, so bind the DOM
    // events directly. `addEventListener` is absent on native hosts, which makes
    // this a no-op there — hover is a pointer-only affordance anyway.
    useEffect(() => {
        const node = containerRef.current as unknown as HTMLElement | null;
        if (!allowMouseInteraction || !node || typeof node.addEventListener !== 'function') return;

        const onMove = (event: PointerEvent) => {
            const bounds = node.getBoundingClientRect();
            setCursorX(event.clientX - bounds.left);
        };
        const onLeave = () => setCursorX(null);

        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        return () => {
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
        };
    }, [allowMouseInteraction]);

    const dataset = useMemo(() => {
        if (!filteredRatingHistories) {
            return { yKeys: [], data: [] };
        }

        const data = orderBy(
            filteredRatingHistories.flatMap((o) =>
                o.ratings.map((r) => ({
                    x: r.date!,
                    [o.leaderboardId]: r.rating,
                }))
            ),
            ['x']
        );

        if (data.length > 0) {
            data.push({ x: new Date() });
        }

        return {
            yKeys: filteredRatingHistories.filter((h) => h.ratings.length > 0).map((o) => o.leaderboardId),
            data,
        };
    }, [filteredRatingHistories]);

    const visibleKeys = dataset.yKeys.filter((key) => !hiddenLeaderboardIds?.includes(key));

    const colorFor = (key: LeaderboardId) =>
        filteredRatingHistories?.find((h) => h.leaderboardId === key)?.color ?? getLeaderboardColor(key, theme.dark);

    if (dataset.data?.length === 0) {
        return <View />;
    }

    return (
        <View ref={containerRef} style={{ flex: 1, width: '100%', height: '100%' }}>
            <CartesianChart
                data={dataset.data}
                xKey={'x' as never}
                yKeys={dataset.yKeys as never}
                axisOptions={{
                    // the chart needs this empty config for some reason
                }}
                xAxis={{
                    font,
                    labelColor: theme.textColor,
                    // The datum type widens x to `number | Date` because of the
                    // dynamic leaderboardId keys, so normalize before formatting.
                    formatXLabel: (label: number | Date) => formatTick(label instanceof Date ? label : new Date(label)),
                    lineColor: theme.dark ? '#454545' : '#BBB',
                }}
                yAxis={[
                    {
                        font,
                        labelColor: theme.textColor,
                        lineColor: theme.dark ? '#454545' : '#BBB',
                    },
                ]}
            >
                {({ points, chartBounds }) => (
                    <>
                        {visibleKeys.map((key) => (
                            <ChartSeries key={key} points={(points as never)[key]} color={colorFor(key)} />
                        ))}

                        {cursorX != null && cursorX >= chartBounds.left && cursorX <= chartBounds.right ? (
                            <CursorOverlay
                                cursorX={cursorX}
                                points={points}
                                visibleKeys={visibleKeys}
                                chartBounds={chartBounds}
                                colorFor={colorFor}
                                font={font}
                                dark={theme.dark}
                            />
                        ) : null}
                    </>
                )}
            </CartesianChart>
        </View>
    );
}

const LABEL_HEIGHT = 15;
const LABEL_PADDING = 4;
const LABEL_WIDTH = 96;

/**
 * One series' line + dots. Split out and memoized so that moving the pointer —
 * which re-renders the chart on every mouse event — does not rebuild the Skia
 * path for thousands of points on the JS thread.
 */
const ChartSeries = React.memo(function ChartSeries({ points, color }: { points: ChartPoint[]; color: string }) {
    const defined = useMemo(() => points.filter((p) => p.yValue != null), [points]);

    return (
        <>
            <Line points={defined as never} color={color} strokeWidth={2} />
            <Scatter points={points as never} shape="circle" radius={1} style="fill" color={color} />
        </>
    );
});

/**
 * The vertical rule plus value labels shown while the pointer is over the
 * chart. The rule follows the pointer exactly rather than snapping to a datum;
 * each series reports its most recent value at or before that position.
 */
function CursorOverlay({
    cursorX,
    points,
    visibleKeys,
    chartBounds,
    colorFor,
    font,
    dark,
}: {
    cursorX: number;
    points: unknown;
    visibleKeys: LeaderboardId[];
    chartBounds: { left: number; right: number; top: number; bottom: number };
    colorFor: (key: LeaderboardId) => string;
    font: ReturnType<typeof useChartFont>;
    dark: boolean;
}) {
    // Most recent datum at or before the pointer, per series — a step lookup,
    // so the label holds the last known rating rather than jumping ahead.
    const entries = visibleKeys
        .map((key) => {
            const series = (points as never)[key] as ChartPoint[];
            let latest: ChartPoint | undefined;
            for (const point of series) {
                if (point.x > cursorX) break;
                if (point.yValue != null) latest = point;
            }
            return latest ? { key, point: latest } : null;
        })
        .filter((entry): entry is { key: LeaderboardId; point: ChartPoint } => entry !== null);

    if (entries.length === 0) return null;

    const hovered = entries[entries.length - 1]!.point;
    const dateLabel = formatCustom(hovered.xValue instanceof Date ? hovered.xValue : new Date(hovered.xValue), 'P');

    // Flip to the left of the rule near the right edge so the box stays inside.
    const flip = cursorX + LABEL_WIDTH > chartBounds.right;
    const labelX = flip ? cursorX - LABEL_WIDTH : cursorX;

    return (
        <Group>
            <SkiaLine
                p1={vec(cursorX, chartBounds.top)}
                p2={vec(cursorX, chartBounds.bottom)}
                color={dark ? '#DDDDDD' : '#333333'}
                strokeWidth={1}
            />

            <Rect
                x={labelX}
                y={chartBounds.top}
                width={LABEL_WIDTH}
                height={LABEL_HEIGHT * (entries.length + 1) + LABEL_PADDING}
                color={dark ? '#000000EE' : '#000000CC'}
            />

            {font ? (
                <SkiaText
                    x={labelX + LABEL_PADDING}
                    y={chartBounds.top + LABEL_HEIGHT}
                    text={dateLabel}
                    font={font}
                    color="#FFFFFF"
                />
            ) : null}

            {entries.map((entry, i) =>
                font ? (
                    <SkiaText
                        key={entry.key}
                        x={labelX + LABEL_PADDING}
                        y={chartBounds.top + LABEL_HEIGHT * (i + 2)}
                        text={`${entry.point.yValue}`}
                        font={font}
                        color={colorFor(entry.key)}
                    />
                ) : null
            )}
        </Group>
    );
}
