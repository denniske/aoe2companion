import { View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatCustom, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { orderBy } from 'lodash';

import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
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

type Series = {
    /** Unique data key. NOT the leaderboard id — see the comment in `dataset`. */
    id: string;
    leaderboardId: LeaderboardId;
    label: string;
    color: string;
};

export default function RatingChart(props: IRatingChartProps) {
    const { formatTick, filteredRatingHistories, hiddenLeaderboardIds, allowMouseInteraction } = props;

    const theme = useAppTheme();
    const font = useChartFont();

    // No cursor state here on purpose. The overlay owns it, so pointer moves
    // re-render only the overlay — never this component, and therefore never
    // CartesianChart, whose re-render rebuilds paths for the whole dataset.
    const containerRef = useRef<View | null>(null);

    const dataset = useMemo(() => {
        if (!filteredRatingHistories) {
            return { series: [] as Series[], data: [] as Record<string, unknown>[] };
        }

        // Compare mode puts two histories with the SAME leaderboardId in the
        // list (the player, and whoever they are compared against). Keying the
        // series by leaderboard id therefore collides: both would write to one
        // data key, share a single colour, and produce duplicate React keys.
        // Index the series instead, so each history gets its own identity.
        const series: Series[] = filteredRatingHistories
            .map((history, index) => ({
                id: `series_${index}`,
                leaderboardId: history.leaderboardId,
                label: history.label ?? history.leaderboardId,
                color: history.color ?? getLeaderboardColor(history.leaderboardId, theme.dark),
                empty: history.ratings.length === 0,
            }))
            .filter((entry) => !entry.empty);

        const data = orderBy(
            filteredRatingHistories.flatMap((history, index) =>
                history.ratings.map((rating) => ({
                    x: rating.date!,
                    [`series_${index}`]: rating.rating,
                }))
            ),
            ['x']
        );

        if (data.length > 0) {
            data.push({ x: new Date() });
        }

        return { series, data };
    }, [filteredRatingHistories, theme.dark]);

    const visibleSeries = useMemo(
        () => dataset.series.filter((s) => !hiddenLeaderboardIds?.includes(s.leaderboardId)),
        [dataset.series, hiddenLeaderboardIds]
    );

    const yKeys = useMemo(() => dataset.series.map((s) => s.id), [dataset.series]);

    if (dataset.data?.length === 0) {
        return <View />;
    }

    return (
        <View ref={containerRef} style={{ flex: 1, width: '100%', height: '100%' }}>
            <CartesianChart
                data={dataset.data}
                xKey={'x' as never}
                yKeys={yKeys as never}
                axisOptions={{
                    // the chart needs this empty config for some reason
                }}
                xAxis={{
                    font,
                    labelColor: theme.textColor,
                    // The datum type widens x to `number | Date` because of the
                    // dynamic series keys, so normalize before formatting.
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
                        {visibleSeries.map((series) => (
                            <ChartSeries key={series.id} points={(points as never)[series.id]} color={series.color} />
                        ))}

                        {allowMouseInteraction ? (
                            <CursorOverlay
                                containerRef={containerRef}
                                points={points}
                                visibleSeries={visibleSeries}
                                chartBounds={chartBounds}
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

const ROW_HEIGHT = 21;
const ROW_PADDING_X = 9;
const TEXT_BASELINE = 14;

/**
 * One series' line + dots. Split out and memoized so a re-render of the chart
 * does not rebuild the Skia path for thousands of points on the JS thread.
 */
const ChartSeries = React.memo(function ChartSeries({ points, color }: { points: ChartPoint[]; color: string }) {
    const defined = useMemo(() => points.filter((p) => p.yValue != null), [points]);

    return (
        <>
            <Line points={defined as never} color={color} strokeWidth={1.5} />
            <Scatter points={points as never} shape="circle" radius={2} style="fill" color={color} />
        </>
    );
});

/**
 * The vertical rule plus value labels shown while the pointer is over the
 * chart. The rule follows the pointer exactly rather than snapping to a datum;
 * each series reports its most recent value at or before that position.
 *
 * Owns the pointer state, so a mouse move re-renders only this component —
 * CartesianChart above it is untouched. The rule itself is driven by a
 * Reanimated shared value straight into Skia, so it tracks the cursor without
 * any React render at all; only the text labels need a render, and those are
 * coalesced to one per frame.
 */
function CursorOverlay({
    containerRef,
    points,
    visibleSeries,
    chartBounds,
    font,
    dark,
}: {
    containerRef: React.RefObject<View | null>;
    points: unknown;
    visibleSeries: Series[];
    chartBounds: { left: number; right: number; top: number; bottom: number };
    font: ReturnType<typeof useChartFont>;
    dark: boolean;
}) {
    // Drives the rule on the UI thread. -1 means "pointer is away".
    const cursorX = useSharedValue(-1);
    // Drives the labels, which need JS (date formatting, glyph measurement).
    const [labelX, setLabelX] = useState<number | null>(null);

    useEffect(() => {
        const node = containerRef.current as unknown as HTMLElement | null;
        if (!node || typeof node.addEventListener !== 'function') return;

        let frame: number | null = null;
        let pending: number | null = null;

        const flush = () => {
            frame = null;
            setLabelX(pending);
        };

        const onMove = (event: PointerEvent) => {
            const x = event.clientX - node.getBoundingClientRect().left;
            // Straight to the UI thread: no render, no frame delay.
            cursorX.value = x;

            // pointermove outruns the display refresh, and every label update is
            // a React render — coalesce them to one per frame.
            pending = x;
            if (frame == null) frame = requestAnimationFrame(flush);
        };
        const onLeave = () => {
            cursorX.value = -1;
            pending = null;
            if (frame == null) frame = requestAnimationFrame(flush);
        };

        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        return () => {
            if (frame != null) cancelAnimationFrame(frame);
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
        };
    }, [containerRef, cursorX]);

    const { left, right, top, bottom } = chartBounds;

    const ruleStart = useDerivedValue(() => vec(cursorX.value, top), [top]);
    const ruleEnd = useDerivedValue(() => vec(cursorX.value, bottom), [bottom]);
    const ruleOpacity = useDerivedValue(
        () => (cursorX.value >= left && cursorX.value <= right ? 1 : 0),
        [left, right]
    );

    const inBounds = labelX != null && labelX >= left && labelX <= right;

    // Most recent datum at or before the pointer, per series — a step lookup,
    // so the label holds the last known rating rather than jumping ahead.
    const entries = !inBounds
        ? []
        : visibleSeries
              .map((series) => {
                  const data = (points as never)[series.id] as ChartPoint[] | undefined;
                  if (!data) return null;

                  let latest: ChartPoint | undefined;
                  for (const point of data) {
                      if (point.x > labelX!) break;
                      if (point.yValue != null) latest = point;
                  }
                  return latest ? { series, point: latest } : null;
              })
              .filter((entry): entry is { series: Series; point: ChartPoint } => entry !== null);

    return (
        <Group>
            {/* Driven entirely from the shared value — never re-rendered. */}
            <Group opacity={ruleOpacity}>
                <SkiaLine p1={ruleStart} p2={ruleEnd} color={dark ? '#DDDDDD' : '#222222'} strokeWidth={1} />
            </Group>

            {entries.length > 0 ? (
                <CursorLabels entries={entries} cursorX={labelX!} chartBounds={chartBounds} font={font} dark={dark} />
            ) : null}
        </Group>
    );
}

function CursorLabels({
    entries,
    cursorX,
    chartBounds,
    font,
    dark,
}: {
    entries: { series: Series; point: ChartPoint }[];
    cursorX: number;
    chartBounds: { left: number; right: number; top: number; bottom: number };
    font: ReturnType<typeof useChartFont>;
    dark: boolean;
}) {
    const newest = entries.reduce((a, b) => (b.point.x > a.point.x ? b : a));
    const dateLabel = formatCustom(
        newest.point.xValue instanceof Date ? newest.point.xValue : new Date(newest.point.xValue),
        'P'
    );
    const rows = [dateLabel, ...entries.map((entry) => `${entry.series.label} - ${entry.point.yValue}`)];

    // NOT font.measureText: that is a "Not implemented on React Native Web"
    // stub. Summing glyph widths is what getTextWidth does internally and works
    // on every platform (and avoids getTextWidth's deprecation warning).
    const measure = (text: string) => {
        if (!font) return text.length * 6;
        return font.getGlyphWidths(font.getGlyphIDs(text)).reduce((a, b) => a + b, 0);
    };
    const boxWidth = Math.ceil(Math.max(...rows.map(measure))) + ROW_PADDING_X * 2;

    // Flip to the left of the rule near the right edge so the box stays inside.
    const flip = cursorX + boxWidth > chartBounds.right;
    const boxX = flip ? cursorX - boxWidth : cursorX;

    return (
        <Group>
            {/* Date header: dark plate. */}
            <Rect x={boxX} y={chartBounds.top} width={boxWidth} height={ROW_HEIGHT} color={dark ? '#111111' : '#1A1A1A'} />
            {font ? (
                <SkiaText
                    x={boxX + ROW_PADDING_X}
                    y={chartBounds.top + TEXT_BASELINE}
                    text={dateLabel}
                    font={font}
                    color="#FFFFFF"
                />
            ) : null}

            {/* One plate per series, filled with that series' own colour. */}
            {entries.map((entry, i) => {
                const y = chartBounds.top + ROW_HEIGHT * (i + 1);
                return (
                    <Group key={entry.series.id}>
                        <Rect x={boxX} y={y} width={boxWidth} height={ROW_HEIGHT} color={entry.series.color} />
                        {font ? (
                            <SkiaText
                                x={boxX + ROW_PADDING_X}
                                y={y + TEXT_BASELINE}
                                text={`${entry.series.label} - ${entry.point.yValue}`}
                                font={font}
                                color="#FFFFFF"
                            />
                        ) : null}
                    </Group>
                );
            })}
        </Group>
    );
}
