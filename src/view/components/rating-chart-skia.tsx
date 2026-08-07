import { StyleSheet, TextInput, View } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { formatCustom, LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { orderBy } from 'lodash';

import Animated, {
    type SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { CartesianChart, Line, Scatter } from 'victory-native-date';

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

type ChartBounds = { left: number; right: number; top: number; bottom: number };

type Geometry = { points: Record<string, ChartPoint[]>; chartBounds: ChartBounds };

type Series = {
    /** Unique data key. NOT the leaderboard id — see the comment in `dataset`. */
    id: string;
    leaderboardId: LeaderboardId;
    label: string;
    color: string;
};

export default function RatingChartSkia(props: IRatingChartProps) {
    const { formatTick, filteredRatingHistories, hiddenLeaderboardIds, allowMouseInteraction } = props;

    const theme = useAppTheme();
    const font = useChartFont();

    // No cursor state here on purpose — the overlay owns it entirely.
    const containerRef = useRef<View | null>(null);

    // Point positions and plot bounds, published by the chart's render callback
    // for the overlay to read. A ref, so publishing costs no render.
    const geometryRef = useRef<Geometry | null>(null);


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

    // Measured from inside the render callback rather than an effect: the chart
    // only invokes that callback once it has measured its own layout, which is
    // after this component's effects have already run.
    const measuredKey = useRef('');
    const measure = () => {
        const key = `${dataset.data.length}|${visibleSeries.length}`;
        if (!MEASURE_DRAW || measuredKey.current === key) return;
        measuredKey.current = key;

        const started = performance.now();

        // Two numbers, because one cannot tell them apart: `sync` is the JS this
        // chart actually spends building the Skia scene (the microtask runs once
        // the current task — render plus commit — has finished), while `toFrame`
        // also includes whatever else the thread does before the next frame.
        // A large gap between them is contention, not chart cost.
        let sync = 0;
        queueMicrotask(() => {
            sync = performance.now() - started;
        });

        requestAnimationFrame(() => {
            // eslint-disable-next-line no-console
            console.log(
                `[chart] points=${dataset.data.length} series=${visibleSeries.length} ` +
                    `sync=${sync.toFixed(1)}ms toFrame=${(performance.now() - started).toFixed(1)}ms`
            );
        });
    };

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
                {({ points, chartBounds }) => {
                    geometryRef.current = { points: points as never, chartBounds };
                    // measure();

                    return (
                        <>
                            {visibleSeries.map((series) => (
                                <ChartSeries key={series.id} points={(points as never)[series.id]} color={series.color} />
                            ))}
                        </>
                    );
                }}
            </CartesianChart>

            {/* Plain RN views, not Skia. Drawing the cursor inside the chart's
                canvas forced Skia to repaint the entire scene — every line
                segment and dot — on each pointer move. As sibling views it
                costs nothing, and layout measures the labels for us. */}
            {allowMouseInteraction ? (
                <CursorOverlay
                    geometryRef={geometryRef}
                    visibleSeries={visibleSeries}
                    dark={theme.dark}
                />
            ) : null}
        </View>
    );
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ROW_PADDING_X = 9;

/**
 * Logs how long a chart draw costs: the synchronous JS to build the Skia scene,
 * and the wall time until the frame carrying it is presented. Flip on to compare
 * configurations (e.g. with and without the scatter dots).
 */
const MEASURE_DRAW = true;


/**
 * One series' line + dots. Split out and memoized so a re-render of the chart
 * does not rebuild the Skia path for thousands of points on the JS thread.
 */
const ChartSeries = React.memo(function ChartSeries({ points, color }: { points: ChartPoint[]; color: string }) {
    const defined = useMemo(() => points.filter((p) => p.yValue != null), [points]);

    return (
        <>
            <Line points={defined as never} color={color} strokeWidth={1.5} />
            {/*<Scatter points={points as never} shape="circle" radius={2} style="fill" color={color} />*/}
        </>
    );
});

/**
 * Hover cursor: a vertical rule and a stack of value plates.
 *
 * Deliberately *not* Skia. A Skia canvas repaints its whole scene every frame,
 * so drawing the cursor beside the series meant re-rasterizing thousands of
 * points per pointer move. As plain views the chart canvas is never touched.
 *
 * Nothing here uses React state either: the pointer position lives in a shared
 * value and every visual is an animated style/prop applied on the UI thread.
 * Label text is formatted up front (date-fns is not worklet-safe) and indexed
 * from a worklet.
 */
function CursorOverlay({
    geometryRef,
    visibleSeries,
    dark,
}: {
    geometryRef: React.RefObject<Geometry | null>;
    visibleSeries: Series[];
    dark: boolean;
}) {
    // The only piece of hover state. -1 means "pointer is away".
    const cursorX = useSharedValue(-1);
    // Written from onLayout, so the flip near the right edge needs no manual
    // text measurement — layout reports the real width.
    const boxWidth = useSharedValue(0);

    const overlayRef = useRef<View | null>(null);

    useEffect(() => {
        // Listen on the document and resolve our own node at event time. Binding
        // to the container directly needs its ref to be populated when the effect
        // runs, which it is not — the listener then never attaches and the cursor
        // silently does nothing. `document` is absent on native, where hover does
        // not apply anyway.
        if (typeof document === 'undefined') return;

        const onMove = (event: PointerEvent) => {
            const self = overlayRef.current as unknown as HTMLElement | null;
            const node = self?.parentElement;
            if (!node) return;

            const rect = node.getBoundingClientRect();
            const inside =
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom;

            cursorX.value = inside ? event.clientX - rect.left : -1;
        };

        document.addEventListener('pointermove', onMove);
        return () => document.removeEventListener('pointermove', onMove);
    }, [cursorX]);

    const geometry = geometryRef.current;
    const points = geometry?.points ?? {};
    const bounds = geometry?.chartBounds ?? { left: 0, right: 0, top: 0, bottom: 0 };

    /**
     * Precomputed once per dataset: x pixel of each datum, its formatted date,
     * and per series the "<label> - <value>" carried forward from the last
     * non-null rating. The worklets only index into these.
     */
    const lookup = useMemo(() => {
        const reference = visibleSeries.length > 0 ? points[visibleSeries[0]!.id] : undefined;
        if (!reference || reference.length === 0) {
            return { xs: [] as number[], dates: [] as string[], rows: [] as string[][] };
        }

        const xs = reference.map((point) => point.x);
        const dates = reference.map((point) =>
            formatCustom(point.xValue instanceof Date ? point.xValue : new Date(point.xValue), 'P')
        );

        const rows = visibleSeries.map((series) => {
            const data = points[series.id] ?? [];
            let carried: number | null = null;
            return data.map((point) => {
                if (point.yValue != null) carried = point.yValue;
                return carried == null ? '' : `${series.label} - ${carried}`;
            });
        });

        return { xs, dates, rows };
    }, [points, visibleSeries]);

    const { xs, dates, rows } = lookup;
    const { left, right, top, bottom } = bounds;

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

    const ruleStyle = useAnimatedStyle(() => ({
        opacity: index.value >= 0 ? 1 : 0,
        transform: [{ translateX: cursorX.value }],
    }));

    const boxStyle = useAnimatedStyle(() => {
        // Flip to the left of the rule near the right edge so it stays inside.
        const width = boxWidth.value;
        const x = cursorX.value + width > right ? cursorX.value - width + 1 : cursorX.value + 1;
        return {
            opacity: index.value >= 0 ? 1 : 0,
            transform: [{ translateX: x }],
        };
    }, [right]);

    const dateProps = useAnimatedProps(
        () => ({ text: index.value >= 0 ? dates[index.value]! : '' }) as never,
        [dates]
    );

    return (
        <View ref={overlayRef} pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        left: 0,
                        top,
                        width: 1,
                        height: Math.max(0, bottom - top),
                        backgroundColor: dark ? '#DDDDDD' : '#222222',
                    },
                    ruleStyle,
                ]}
            />

            <Animated.View
                onLayout={(event) => {
                    boxWidth.value = event.nativeEvent.layout.width;
                }}
                style={[{ position: 'absolute', left: 0, top, alignItems: 'flex-start' }, boxStyle]}
            >
                <AnimatedLabel
                    animatedProps={dateProps}
                    background={dark ? '#111111' : '#1A1A1A'}
                    fallback={dates[0] ?? ''}
                />

                {visibleSeries.map((series, i) => (
                    <CursorRow key={series.id} series={series} texts={rows[i] ?? []} index={index} />
                ))}
            </Animated.View>
        </View>
    );
}

/** One series row of the hover plate. Own component so it can own its hooks. */
function CursorRow({ series, texts, index }: { series: Series; texts: string[]; index: SharedValue<number> }) {
    const animatedProps = useAnimatedProps(
        () => ({ text: index.value >= 0 ? texts[index.value]! : '' }) as never,
        [texts]
    );

    return <AnimatedLabel animatedProps={animatedProps} background={series.color} fallback={texts[0] ?? ''} />;
}

/**
 * A text plate whose content is driven from the UI thread.
 *
 * Uses TextInput rather than Text because only TextInput exposes a `text` prop
 * that Reanimated can set natively — the standard way to animate text content
 * without a React render.
 */
function AnimatedLabel({
    animatedProps,
    background,
    fallback,
}: {
    animatedProps: ReturnType<typeof useAnimatedProps>;
    background: string;
    fallback: string;
}) {
    return (
        <AnimatedTextInput
            editable={false}
            defaultValue={fallback}
            animatedProps={animatedProps}
            style={{
                backgroundColor: background,
                color: '#FFFFFF',
                fontSize: 11,
                lineHeight: 14,
                paddingHorizontal: ROW_PADDING_X,
                paddingVertical: 4,
                borderWidth: 0,
                alignSelf: 'stretch',
            }}
        />
    );
}
