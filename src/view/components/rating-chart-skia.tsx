import { View } from 'react-native';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { LeaderboardId } from '@nex/data';
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
                {({ points, chartBounds }) => {
                    // Snap the cursor to the nearest datum of the first visible
                    // series; every series shares the same x positions.
                    const reference = visibleKeys.length > 0 ? ((points as never)[visibleKeys[0]!] as ChartPoint[]) : undefined;
                    const active =
                        cursorX != null && reference && reference.length > 0
                            ? reference.reduce((best, point) =>
                                  Math.abs(point.x - cursorX) < Math.abs(best.x - cursorX) ? point : best
                              )
                            : undefined;

                    return (
                        <>
                            {visibleKeys.map((key) => (
                                <Fragment key={key}>
                                    <Line
                                        points={((points as never)[key] as ChartPoint[]).filter((p) => p.yValue != null)}
                                        color={colorFor(key)}
                                        strokeWidth={1.25}
                                    />
                                    <Scatter points={(points as never)[key]} shape="circle" radius={1} style="fill" color={colorFor(key)} />
                                </Fragment>
                            ))}

                            {active ? (
                                <CursorOverlay
                                    active={active}
                                    points={points}
                                    visibleKeys={visibleKeys}
                                    chartBounds={chartBounds}
                                    colorFor={colorFor}
                                    formatTick={formatTick}
                                    font={font}
                                    dark={theme.dark}
                                />
                            ) : null}
                        </>
                    );
                }}
            </CartesianChart>
        </View>
    );
}

const LABEL_HEIGHT = 16;
const LABEL_PADDING = 6;
const LABEL_WIDTH = 120;

/**
 * The vertical rule plus value labels shown while the pointer is over the
 * chart. Drawn in Skia rather than as an absolutely positioned overlay so it
 * shares the chart's coordinate space on every platform.
 */
function CursorOverlay({
    active,
    points,
    visibleKeys,
    chartBounds,
    colorFor,
    formatTick,
    font,
    dark,
}: {
    active: ChartPoint;
    points: unknown;
    visibleKeys: LeaderboardId[];
    chartBounds: { left: number; right: number; top: number; bottom: number };
    colorFor: (key: LeaderboardId) => string;
    formatTick: (date: Date) => string;
    font: ReturnType<typeof useChartFont>;
    dark: boolean;
}) {
    const index = ((points as never)[visibleKeys[0]!] as ChartPoint[]).indexOf(active);
    const dateLabel = formatTick(active.xValue instanceof Date ? active.xValue : new Date(active.xValue));

    // Values for every visible series at the hovered x.
    const entries = visibleKeys
        .map((key) => ({ key, point: ((points as never)[key] as ChartPoint[])[index] }))
        .filter((entry): entry is { key: LeaderboardId; point: ChartPoint } => entry.point?.yValue != null);

    // Flip the label to the other side of the rule near the right edge so it
    // never runs off the chart.
    const flip = active.x + LABEL_WIDTH + LABEL_PADDING > chartBounds.right;
    const labelX = flip ? active.x - LABEL_WIDTH - LABEL_PADDING : active.x + LABEL_PADDING;

    return (
        <Group>
            <SkiaLine
                p1={vec(active.x, chartBounds.top)}
                p2={vec(active.x, chartBounds.bottom)}
                color={dark ? '#DDDDDD' : '#333333'}
                strokeWidth={1}
            />

            <Rect
                x={labelX}
                y={chartBounds.top}
                width={LABEL_WIDTH}
                height={LABEL_HEIGHT * (entries.length + 1) + LABEL_PADDING}
                color={dark ? '#000000DD' : '#000000BB'}
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
