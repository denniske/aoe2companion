import React, { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import {
    Canvas,
    DashPathEffect,
    Path,
    Text,
    Group,
    Line as SkiaLine,
    Skia,
    type SkFont,
    type SkPath,
} from '@shopify/react-native-skia';

import { useChartFont } from '@app/view/components/chart-font';
import { computeDomain, yTicks as computeYTicks } from './domain';
import { computeXTicks } from './xaxis';
import { CursorOverlay, type CursorLookup } from './cursor-overlay';
import { lightTheme, darkTheme, type ChartSeries, type ChartTheme, type ChartXAxisType } from './types';

const now = () => globalThis.performance?.now?.() ?? Date.now();

export interface PerfChartProps {
    series: ChartSeries[];
    width: number;
    height: number;
    dark?: boolean;
    theme?: ChartTheme;
    /** Default dot radius for scatter series. */
    scatterRadius?: number;
    /**
     * The chart resolves its own font (see chart-font). There is deliberately
     * no `font` prop: in development React 19's performance tracks diff changed
     * props up to three levels deep, and on web an SkFont reaches the whole
     * CanvasKit module, whose wasm heap it then walks key by key until the tab
     * runs out of memory.
     */
    fontSize?: number;
    /** Outer padding between the plot and the canvas edge (label area is added). */
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Approx. target y tick count before "nice" rounding. */
    yTickCount?: number;
    xAxis?: {
        type?: ChartXAxisType;
        /** Fixed x range. Defaults to the data extent (`[-0.5, n - 0.5]` for a band axis). */
        domain?: [number, number];
        formatLabel?: (value: number) => string;
        /** Vertical grid lines at the x ticks. Defaults to true. */
        grid?: boolean;
    };
    yAxis?: {
        /** Fixed y range. May be inverted (e.g. `[50, 0]` to put rank 1 on top). */
        domain?: [number, number];
        formatLabel?: (value: number) => string;
    };
    /** Dash intervals for the grid, e.g. `[4, 4]`. Solid when omitted. */
    gridDash?: number[];
    /**
     * Hover cursor (web only - it follows the pointer). `formatX` labels the
     * cursor header, `formatValue` each series row (default "<label> - <y>").
     * Each row carries the series' last value at or before the pointer.
     */
    cursor?: {
        formatX: (x: number) => string;
        formatValue?: (series: ChartSeries, y: number) => string;
    };
    onMeasure?: (ms: number) => void;
}

function measureWidth(font: SkFont, text: string): number {
    // getTextWidth is the cheap path; fall back to the glyph-rect API.
    const anyFont = font as unknown as { getTextWidth?: (t: string) => number };
    if (typeof anyFont.getTextWidth === 'function') return anyFont.getTextWidth(text);
    return font.measureText(text).width;
}

const defaultYLabel = (v: number) => String(Math.round(v));

export function PerfChart({
    series,
    width,
    height,
    dark = false,
    theme: themeProp,
    scatterRadius = 2.5,
    fontSize = 11,
    padding,
    yTickCount = 5,
    xAxis,
    yAxis,
    gridDash,
    cursor,
    onMeasure,
}: PerfChartProps) {
    const theme = themeProp ?? (dark ? darkTheme : lightTheme);
    const onMeasureRef = useRef(onMeasure);
    useEffect(() => {
        onMeasureRef.current = onMeasure;
    }, [onMeasure]);

    // On web the font is fetched, so it is null for the first render(s).
    const font = useChartFont(fontSize);

    const padTop = padding?.top ?? 10;
    const padRight = padding?.right ?? 14;
    const padBottom = padding?.bottom ?? 0;
    const padLeft = padding?.left ?? 0;

    const xType = xAxis?.type ?? 'time';
    // Domains unpacked to numbers so an inline `domain={[a, b]}` does not
    // rebuild the scene on every render.
    const xd0 = xAxis?.domain?.[0];
    const xd1 = xAxis?.domain?.[1];
    const xFormat = xAxis?.formatLabel;
    const xGrid = xAxis?.grid ?? true;
    const yd0 = yAxis?.domain?.[0];
    const yd1 = yAxis?.domain?.[1];
    const yFormat = yAxis?.formatLabel ?? defaultYLabel;

    const scene = useMemo(() => {
        if (!font || width <= 0 || height <= 0) return null;
        const t0 = now();

        const labelGap = 6;

        const domain = computeDomain(series);
        let xMin = domain.xMin;
        let xMax = domain.xMax;
        if (xd0 != null && xd1 != null) {
            xMin = xd0;
            xMax = xd1;
        } else if (xType === 'band') {
            xMin = -0.5;
            xMax = series.reduce((m, s) => Math.max(m, s.data.length), 0) - 0.5;
        }

        // A fixed y domain is taken as is (and may run top-down); otherwise keep
        // the real data extent but let the axis breathe to the outermost ticks.
        let yLo: number;
        let yHi: number;
        let yTickValues: number[];
        if (yd0 != null && yd1 != null) {
            yLo = yd0;
            yHi = yd1;
            yTickValues = computeYTicks(Math.min(yLo, yHi), Math.max(yLo, yHi), yTickCount);
        } else {
            yTickValues = computeYTicks(domain.yMin, domain.yMax, yTickCount);
            yLo = Math.min(domain.yMin, yTickValues[0] ?? domain.yMin);
            yHi = Math.max(domain.yMax, yTickValues[yTickValues.length - 1] ?? domain.yMax);
        }

        const yLabels = yTickValues.map(yFormat);
        const yLabelWidth = yLabels.reduce((m, l) => Math.max(m, measureWidth(font, l)), 0);

        const plotLeft = padLeft + yLabelWidth + labelGap;
        const plotRight = width - padRight;
        const plotTop = padTop;

        // Only needs the horizontal extent, and decides how many label rows the
        // bottom of the canvas has to reserve.
        const xTicks = computeXTicks({
            type: xType,
            xMin,
            xMax,
            plotLeft,
            plotRight,
            formatLabel: xFormat,
            measureLabel: (txt) => measureWidth(font, txt),
        });

        const xLabelRows = xTicks.some((t) => t.row > 0) ? 2 : 1;
        const plotBottom = height - padBottom - fontSize * xLabelRows - (xLabelRows - 1) * 2 - labelGap;

        const plotW = Math.max(1, plotRight - plotLeft);
        const plotH = Math.max(1, plotBottom - plotTop);

        const kx = plotW / (xMax - xMin || 1);
        const ky = plotH / (yHi - yLo || 1);
        const mapX = (x: number) => plotLeft + (x - xMin) * kx;
        const mapY = (y: number) => plotBottom - (y - yLo) * ky;

        // --- Grid ---
        const grid = Skia.PathBuilder.Make();
        for (let i = 0; i < yTickValues.length; i++) {
            const py = mapY(yTickValues[i]);
            grid.moveTo(plotLeft, py);
            grid.lineTo(plotRight, py);
        }
        if (xGrid) {
            for (let i = 0; i < xTicks.length; i++) {
                const px = mapX(xTicks[i].value);
                grid.moveTo(px, plotTop);
                grid.lineTo(px, plotBottom);
            }
        }

        // --- Series ---
        const lines: { path: SkPath; color: string; strokeWidth: number }[] = [];
        const fills: { path: SkPath; color: string }[] = [];
        const dots: { path: SkPath; color: string }[] = [];

        for (let s = 0; s < series.length; s++) {
            const serie = series[s];
            const data = serie.data;
            if (data.length === 0) continue;

            if (serie.bar) {
                let minStep = Infinity;
                for (let i = 1; i < data.length; i++) minStep = Math.min(minStep, data[i].x - data[i - 1].x);
                const slot = (isFinite(minStep) && minStep > 0 ? minStep : 1) * kx;
                const barW = serie.barWidth ?? slot * 0.6;
                const b = Skia.PathBuilder.Make();
                for (let i = 0; i < data.length; i++) {
                    const px = mapX(data[i].x);
                    const py = Math.min(Math.max(mapY(data[i].y), plotTop), plotBottom);
                    b.addRect(Skia.XYWHRect(px - barW / 2, py, barW, plotBottom - py));
                }
                fills.push({ path: b.build(), color: serie.color });
            }

            const drawLine = serie.line ?? !(serie.area || serie.bar);
            if (drawLine || serie.area) {
                const b = Skia.PathBuilder.Make();
                for (let i = 0; i < data.length; i++) {
                    const px = mapX(data[i].x);
                    const py = mapY(data[i].y);
                    if (i === 0) b.moveTo(px, py);
                    else b.lineTo(px, py);
                }
                if (drawLine) {
                    lines.push({ path: b.build(), color: serie.color, strokeWidth: serie.strokeWidth ?? 1.5 });
                }
                if (serie.area) {
                    // Rebuilt rather than reusing the line path: build() consumes the builder.
                    const a = Skia.PathBuilder.Make();
                    a.moveTo(mapX(data[0].x), plotBottom);
                    for (let i = 0; i < data.length; i++) a.lineTo(mapX(data[i].x), mapY(data[i].y));
                    a.lineTo(mapX(data[data.length - 1].x), plotBottom);
                    a.close();
                    fills.push({ path: a.build(), color: serie.color });
                }
            }

            if (serie.scatter) {
                // One filled path of circles rather than `Points` with round
                // caps: on web (CanvasKit/WebGL) drawing many round points
                // intermittently crashed the renderer.
                const radius = serie.scatterRadius ?? scatterRadius;
                const b = Skia.PathBuilder.Make();
                for (let i = 0; i < data.length; i++) {
                    b.addCircle(mapX(data[i].x), mapY(data[i].y), radius);
                }
                dots.push({ path: b.build(), color: serie.color });
            }
        }

        // Fixed domains can put data outside the plot; keep it inside, with a
        // little slack so dots and line caps on the edge are not cut in half.
        const clipSlack = 4;
        const clip = Skia.XYWHRect(plotLeft - clipSlack, plotTop - clipSlack, plotW + clipSlack * 2, plotH + clipSlack * 2);

        const result = {
            grid: grid.build(),
            clip,
            lines,
            fills,
            dots,
            xTicks,
            yTicks: yTickValues.map((v, i) => ({ value: v, label: yLabels[i], y: mapY(v) })),
            plotLeft,
            plotRight,
            plotTop,
            plotBottom,
            mapX,
            buildMs: 0,
        };

        result.buildMs = now() - t0;
        return result;
    }, [series, width, height, font, scatterRadius, fontSize, yTickCount, padTop, padRight, padBottom, padLeft, xType, xd0, xd1, xFormat, xGrid, yd0, yd1, yFormat]);

    useEffect(() => {
        if (scene) onMeasureRef.current?.(scene.buildMs);
    }, [scene]);

    const formatX = cursor?.formatX;
    const formatValue = cursor?.formatValue;

    // Only built when a cursor is requested: a union of every series' x values,
    // with each series' value carried forward from its last point at or before.
    const cursorLookup = useMemo<CursorLookup | null>(() => {
        if (!formatX || !scene) return null;
        const xsSet = new Set<number>();
        for (const s of series) for (const p of s.data) xsSet.add(p.x);
        const values = [...xsSet].sort((a, b) => a - b);

        const rows = series.map((s) => {
            const texts: string[] = new Array(values.length);
            let j = 0;
            let carried: number | null = null;
            for (let i = 0; i < values.length; i++) {
                while (j < s.data.length && s.data[j].x <= values[i]) carried = s.data[j++].y;
                texts[i] = carried == null ? '' : formatValue ? formatValue(s, carried) : `${s.label ?? s.id} - ${carried}`;
            }
            return { id: s.id, color: s.color, texts };
        });

        return { xs: values.map(scene.mapX), xLabels: values.map(formatX), rows };
    }, [formatX, formatValue, series, scene]);

    if (!font || !scene) return <View style={{ width, height }} />;

    const axisBaselineY = scene.plotBottom + 6 + fontSize;

    return (
        <View style={{ width, height }}>
            <Canvas style={{ width, height }}>
                {/* grid */}
                <Path path={scene.grid} style="stroke" strokeWidth={1} color={theme.gridColor}>
                    {gridDash ? <DashPathEffect intervals={gridDash} /> : null}
                </Path>

                {/* plot frame (left + bottom axis) */}
                <SkiaLine
                    p1={{ x: scene.plotLeft, y: scene.plotTop }}
                    p2={{ x: scene.plotLeft, y: scene.plotBottom }}
                    strokeWidth={1}
                    color={theme.axisColor}
                />
                <SkiaLine
                    p1={{ x: scene.plotLeft, y: scene.plotBottom }}
                    p2={{ x: scene.plotRight, y: scene.plotBottom }}
                    strokeWidth={1}
                    color={theme.axisColor}
                />

                {/* series */}
                <Group clip={scene.clip}>
                    {scene.fills.map((f, i) => (
                        <Path key={`f${i}`} path={f.path} style="fill" color={f.color} />
                    ))}
                    {scene.lines.map((l, i) => (
                        <Path
                            key={`l${i}`}
                            path={l.path}
                            style="stroke"
                            strokeWidth={l.strokeWidth}
                            color={l.color}
                            strokeJoin="round"
                            strokeCap="round"
                        />
                    ))}
                    {scene.dots.map((d, i) => (
                        <Path key={`d${i}`} path={d.path} style="fill" color={d.color} />
                    ))}
                </Group>

                {/* y labels */}
                <Group>
                    {scene.yTicks.map((tick, i) => (
                        <Text
                            key={`y${i}`}
                            x={scene.plotLeft - 6 - measureWidth(font, tick.label)}
                            y={tick.y + fontSize / 3}
                            text={tick.label}
                            font={font}
                            color={theme.textColor}
                        />
                    ))}
                </Group>

                {/* x labels */}
                <Group>
                    {scene.xTicks.map((tick, i) => (
                        <Text
                            key={`x${i}`}
                            x={tick.x - measureWidth(font, tick.label) / 2}
                            y={axisBaselineY + tick.row * (fontSize + 2)}
                            text={tick.label}
                            font={font}
                            color={theme.textColor}
                        />
                    ))}
                </Group>
            </Canvas>

            {/* Plain RN views, not Skia: drawing the cursor inside the canvas
                would repaint every line segment and dot on each pointer move. */}
            {cursorLookup ? (
                <CursorOverlay
                    lookup={cursorLookup}
                    bounds={{ left: scene.plotLeft, right: scene.plotRight, top: scene.plotTop, bottom: scene.plotBottom }}
                    dark={theme.dark}
                />
            ) : null}
        </View>
    );
}

export default PerfChart;
