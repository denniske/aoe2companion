import { View } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { formatCustom, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { orderBy } from 'lodash';

import { type SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated';
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
 * Nothing here re-renders on pointer movement. The cursor position lives in a
 * Reanimated shared value and every visual — rule, plates, text — is a derived
 * value read straight by Skia on the UI thread. To make that possible the label
 * strings are formatted up front (date-fns is not worklet-safe) and looked up by
 * index in a worklet.
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
    // The only piece of hover state. -1 means "pointer is away".
    const cursorX = useSharedValue(-1);

    useEffect(() => {
        const node = containerRef.current as unknown as HTMLElement | null;
        if (!node || typeof node.addEventListener !== 'function') return;

        const onMove = (event: PointerEvent) => {
            // Straight to the UI thread: no setState, no render, no frame delay.
            cursorX.value = event.clientX - node.getBoundingClientRect().left;
        };
        const onLeave = () => {
            cursorX.value = -1;
        };

        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        return () => {
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
        };
    }, [containerRef, cursorX]);

    /**
     * Everything the worklets need, precomputed once per dataset: the x pixel of
     * each datum, the formatted date per datum, and per series the formatted
     * "<label> - <value>" carried forward from the last non-null rating.
     */
    const lookup = useMemo(() => {
        const reference = visibleSeries.length > 0 ? ((points as never)[visibleSeries[0]!.id] as ChartPoint[]) : undefined;
        if (!reference || reference.length === 0) {
            return { xs: [] as number[], dates: [] as string[], rows: [] as string[][], boxWidth: 0 };
        }

        let longest = '';
        const remember = (text: string) => {
            if (text.length > longest.length) longest = text;
            return text;
        };

        const xs = reference.map((point) => point.x);
        const dates = reference.map((point) =>
            remember(formatCustom(point.xValue instanceof Date ? point.xValue : new Date(point.xValue), 'P'))
        );

        const rows = visibleSeries.map((series) => {
            const data = (points as never)[series.id] as ChartPoint[];
            let carried: number | null = null;
            return data.map((point) => {
                if (point.yValue != null) carried = point.yValue;
                return carried == null ? '' : remember(`${series.label} - ${carried}`);
            });
        });

        // Measure only the longest candidate — measuring every row would mean
        // tens of thousands of glyph lookups. A fixed width also stops the box
        // from jittering as the pointer moves.
        //
        // NOT font.measureText: that is a "Not implemented on React Native Web"
        // stub. Summing glyph widths is what getTextWidth does internally.
        const width = font ? font.getGlyphWidths(font.getGlyphIDs(longest)).reduce((a, b) => a + b, 0) : longest.length * 6;

        return { xs, dates, rows, boxWidth: Math.ceil(width) + ROW_PADDING_X * 2 };
    }, [points, visibleSeries, font]);

    const { left, right, top, bottom } = chartBounds;
    const { xs, dates, rows, boxWidth } = lookup;

    // Index of the most recent datum at or before the pointer.
    const index = useDerivedValue(() => {
        const x = cursorX.value;
        if (x < left || x > right || xs.length === 0) return -1;

        let lo = 0;
        let hi = xs.length - 1;
        let found = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (xs[mid]! <= x) {
                found = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return found;
    }, [xs, left, right]);

    const visible = useDerivedValue(() => (index.value >= 0 ? 1 : 0));
    const ruleStart = useDerivedValue(() => vec(cursorX.value, top), [top]);
    const ruleEnd = useDerivedValue(() => vec(cursorX.value, bottom), [bottom]);

    // Flip to the left of the rule near the right edge so the box stays inside.
    const boxX = useDerivedValue(() => (cursorX.value + boxWidth > right ? cursorX.value - boxWidth : cursorX.value), [boxWidth, right]);
    const textX = useDerivedValue(() => boxX.value + ROW_PADDING_X);
    const dateText = useDerivedValue(() => (index.value >= 0 ? dates[index.value]! : ''), [dates]);

    return (
        <Group opacity={visible}>
            <SkiaLine p1={ruleStart} p2={ruleEnd} color={dark ? '#DDDDDD' : '#222222'} strokeWidth={1} />

            {/* Date header: dark plate. */}
            <Rect x={boxX} y={top} width={boxWidth} height={ROW_HEIGHT} color={dark ? '#111111' : '#1A1A1A'} />
            {font ? <SkiaText x={textX} y={top + TEXT_BASELINE} text={dateText} font={font} color="#FFFFFF" /> : null}

            {/* One plate per series, filled with that series' own colour. */}
            {visibleSeries.map((series, i) => (
                <CursorRow
                    key={series.id}
                    series={series}
                    texts={rows[i] ?? []}
                    index={index}
                    boxX={boxX}
                    textX={textX}
                    y={top + ROW_HEIGHT * (i + 1)}
                    boxWidth={boxWidth}
                    font={font}
                />
            ))}
        </Group>
    );
}

/**
 * A single series row of the hover plate. Split into its own component so each
 * row can own the derived values it needs — hooks cannot be created in a loop.
 */
function CursorRow({
    series,
    texts,
    index,
    boxX,
    textX,
    y,
    boxWidth,
    font,
}: {
    series: Series;
    texts: string[];
    index: SharedValue<number>;
    boxX: SharedValue<number>;
    textX: SharedValue<number>;
    y: number;
    boxWidth: number;
    font: ReturnType<typeof useChartFont>;
}) {
    const text = useDerivedValue(() => (index.value >= 0 ? texts[index.value]! : ''), [texts]);
    // Series that have no rating yet at this position contribute no row.
    const opacity = useDerivedValue(() => (index.value >= 0 && texts[index.value] ? 1 : 0), [texts]);

    return (
        <Group opacity={opacity}>
            <Rect x={boxX} y={y} width={boxWidth} height={ROW_HEIGHT} color={series.color} />
            {font ? <SkiaText x={textX} y={y + TEXT_BASELINE} text={text} font={font} color="#FFFFFF" /> : null}
        </Group>
    );
}
