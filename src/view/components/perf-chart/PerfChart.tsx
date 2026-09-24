import React, { useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import {
    Canvas,
    Path,
    Points,
    Text,
    Group,
    Line as SkiaLine,
    Skia,
    matchFont,
    type SkFont,
    type SkPath,
    type SkPoint,
} from '@shopify/react-native-skia';

import { computeDomain, yTicks as computeYTicks } from './domain';
import { computeXTicks } from './xaxis';
import { lightTheme, darkTheme, type ChartSeries, type ChartTheme } from './types';

const now = () => globalThis.performance?.now?.() ?? Date.now();

export interface PerfChartProps {
    series: ChartSeries[];
    width: number;
    height: number;
    dark?: boolean;
    theme?: ChartTheme;
    /** Default dot radius for scatter series. */
    scatterRadius?: number;
    fontSize?: number;
    /** Outer padding between the plot and the canvas edge (label area is added). */
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Approx. target y tick count before "nice" rounding. */
    yTickCount?: number;
    onMeasure?: (ms: number) => void;
}

function measureWidth(font: SkFont, text: string): number {
    // getTextWidth is the cheap path; fall back to the glyph-rect API.
    const anyFont = font as unknown as { getTextWidth?: (t: string) => number };
    if (typeof anyFont.getTextWidth === 'function') return anyFont.getTextWidth(text);
    return font.measureText(text).width;
}

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
    onMeasure,
}: PerfChartProps) {
    const theme = themeProp ?? (dark ? darkTheme : lightTheme);
    const onMeasureRef = useRef(onMeasure);
    useEffect(() => {
        onMeasureRef.current = onMeasure;
    }, [onMeasure]);

    const font = useMemo(
        () => matchFont({ fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif', fontSize }),
        [fontSize],
    );

    const padTop = padding?.top ?? 10;
    const padRight = padding?.right ?? 14;
    const padBottom = padding?.bottom ?? 0;
    const padLeft = padding?.left ?? 0;

    const scene = useMemo(() => {
        const t0 = now();

        const labelGap = 6;

        const domain = computeDomain(series);
        const yTickValues = computeYTicks(domain.yMin, domain.yMax, yTickCount);
        // Keep the real data extent but let the axis breathe to the outermost ticks.
        const yLo = Math.min(domain.yMin, yTickValues[0] ?? domain.yMin);
        const yHi = Math.max(domain.yMax, yTickValues[yTickValues.length - 1] ?? domain.yMax);

        const yLabels = yTickValues.map((v) => String(Math.round(v)));
        const yLabelWidth = yLabels.reduce((m, l) => Math.max(m, measureWidth(font, l)), 0);

        const plotLeft = padLeft + yLabelWidth + labelGap;
        const plotRight = width - padRight;
        const plotTop = padTop;
        const plotBottom = height - padBottom - fontSize - labelGap;

        const plotW = Math.max(1, plotRight - plotLeft);
        const plotH = Math.max(1, plotBottom - plotTop);

        const kx = plotW / (domain.xMax - domain.xMin || 1);
        const ky = plotH / (yHi - yLo || 1);
        const mapX = (x: number) => plotLeft + (x - domain.xMin) * kx;
        const mapY = (y: number) => plotBottom - (y - yLo) * ky;

        const xTicks = computeXTicks({
            xMin: domain.xMin,
            xMax: domain.xMax,
            plotLeft,
            plotRight,
            measureLabel: (txt) => measureWidth(font, txt),
        });

        // --- Grid ---
        const grid = Skia.PathBuilder.Make();
        for (let i = 0; i < yTickValues.length; i++) {
            const py = mapY(yTickValues[i]);
            grid.moveTo(plotLeft, py);
            grid.lineTo(plotRight, py);
        }
        for (let i = 0; i < xTicks.length; i++) {
            const px = mapX(xTicks[i].value);
            grid.moveTo(px, plotTop);
            grid.lineTo(px, plotBottom);
        }

        // --- Series lines + scatter ---
        const lines: { path: SkPath; color: string }[] = [];
        const scatters: { points: SkPoint[]; color: string; radius: number }[] = [];

        for (let s = 0; s < series.length; s++) {
            const serie = series[s];
            const data = serie.data;
            if (data.length === 0) continue;

            if (serie.line !== false) {
                const b = Skia.PathBuilder.Make();
                let started = false;
                for (let i = 0; i < data.length; i++) {
                    const px = mapX(data[i].x);
                    const py = mapY(data[i].y);
                    if (!started) {
                        b.moveTo(px, py);
                        started = true;
                    } else {
                        b.lineTo(px, py);
                    }
                }
                lines.push({ path: b.build(), color: serie.color });
            }

            if (serie.scatter) {
                const pts: SkPoint[] = new Array(data.length);
                for (let i = 0; i < data.length; i++) {
                    pts[i] = { x: mapX(data[i].x), y: mapY(data[i].y) };
                }
                scatters.push({ points: pts, color: serie.color, radius: scatterRadius });
            }
        }

        const result = {
            grid: grid.build(),
            lines,
            scatters,
            xTicks,
            yTicks: yTickValues.map((v, i) => ({ value: v, label: yLabels[i], y: mapY(v) })),
            plotLeft,
            plotRight,
            plotTop,
            plotBottom,
            buildMs: 0,
        };

        result.buildMs = now() - t0;
        return result;
    }, [series, width, height, font, scatterRadius, fontSize, yTickCount, padTop, padRight, padBottom, padLeft]);

    useEffect(() => {
        if (scene) onMeasureRef.current?.(scene.buildMs);
    }, [scene]);

    if (!font) return null;

    const axisBaselineY = scene.plotBottom + 6 + fontSize;

    return (
        <Canvas style={{ width, height }}>
            {/* grid */}
            <Path path={scene.grid} style="stroke" strokeWidth={1} color={theme.gridColor} />

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
            {scene.lines.map((l, i) => (
                <Path key={`l${i}`} path={l.path} style="stroke" strokeWidth={1.5} color={l.color} strokeJoin="round" strokeCap="round" />
            ))}
            {scene.scatters.map((sc, i) => (
                <Points
                    key={`s${i}`}
                    points={sc.points}
                    mode="points"
                    color={sc.color}
                    strokeWidth={sc.radius * 2}
                    strokeCap="round"
                />
            ))}

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
                        y={axisBaselineY}
                        text={tick.label}
                        font={font}
                        color={theme.textColor}
                    />
                ))}
            </Group>
        </Canvas>
    );
}

export default PerfChart;
