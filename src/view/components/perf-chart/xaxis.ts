import { scaleLinear, scaleTime } from 'd3-scale';
import { formatCustom } from '@nex/data';
import type { ChartXAxisType } from './types';

export interface XTick {
    value: number;
    label: string;
    /** Pixel x of the tick (label is centered on this, then clamped to plot). */
    x: number;
    /** Label row: 1 drops the label one line lower (staggered band labels). */
    row: number;
}

const isMidnight = (d: Date) => d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;

/**
 * Label a time tick by the calendar boundary it sits on. d3 places ticks on
 * those boundaries, so this reads like a multi-scale axis: "2024" at a year,
 * "Mar" at a month, "Mar 3" at a day, "14:00" within a day. Formatted through
 * date-fns with the app locale, so month names follow the selected language.
 */
export function formatTimeTick(d: Date): string {
    if (!isMidnight(d)) return formatCustom(d, 'HH:mm');
    if (d.getDate() !== 1) return formatCustom(d, 'MMM d');
    if (d.getMonth() !== 0) return formatCustom(d, 'MMM');
    return formatCustom(d, 'yyyy');
}

/**
 * Smart x-axis labels.
 *
 * d3 gives us candidate ticks on natural boundaries (calendar boundaries for a
 * time axis, round numbers for a linear one, every category for a band axis).
 * We then keep a tick only if its label clears every label already kept by
 * `minGap` pixels - so the axis never renders
 * overlapping text no matter how narrow the chart or how wide the range.
 * `measureLabel` returns the rendered pixel width of a string (Skia font
 * measurement). A band axis is the exception: see below.
 */
export function computeXTicks(opts: {
    type?: ChartXAxisType;
    xMin: number;
    xMax: number;
    plotLeft: number;
    plotRight: number;
    measureLabel: (text: string) => number;
    /** Overrides the default label for a tick value. */
    formatLabel?: (value: number) => string;
    minGap?: number;
    /** Rough target before overlap culling. Derived from width if omitted. */
    targetCount?: number;
}): XTick[] {
    const { xMin, xMax, plotLeft, plotRight, measureLabel } = opts;
    const type = opts.type ?? 'time';
    const minGap = opts.minGap ?? 12;
    const plotWidth = Math.max(1, plotRight - plotLeft);
    const target = opts.targetCount ?? Math.max(2, Math.floor(plotWidth / 68));

    let candidates: XTick[];
    if (type === 'time') {
        const scale = scaleTime().domain([new Date(xMin), new Date(xMax)]).range([plotLeft, plotRight]);
        candidates = scale.ticks(target).map((d) => ({
            value: +d,
            label: opts.formatLabel ? opts.formatLabel(+d) : formatTimeTick(d),
            x: scale(d),
            row: 0,
        }));
    } else {
        const scale = scaleLinear().domain([xMin, xMax]).range([plotLeft, plotRight]);
        const values =
            type === 'band'
                ? Array.from({ length: Math.max(0, Math.floor(xMax) - Math.ceil(xMin) + 1) }, (_, i) => Math.ceil(xMin) + i)
                : scale.ticks(target);
        candidates = values.map((v) => ({
            value: v,
            label: opts.formatLabel ? opts.formatLabel(v) : String(v),
            x: scale(v),
            row: 0,
        }));
    }

    // Every category needs its label, so a band axis is never culled. When
    // neighbours collide, every other label moves down a row instead.
    if (type === 'band') {
        const halfWidths = candidates.map((tick) => measureLabel(tick.label) / 2);
        const collides = candidates.some(
            (tick, i) => i > 0 && tick.x - halfWidths[i] < candidates[i - 1].x + halfWidths[i - 1] + minGap / 3
        );
        return candidates.map((tick, i) => ({ ...tick, row: collides ? i % 2 : 0 }));
    }

    // Greedy non-overlap pass, most significant ticks first (on a time axis a
    // year beats a month beats a day), then left to right. A tick is kept only
    // if its label box clears every label already kept by `minGap`.
    const order = candidates
        .map((tick, i) => ({ tick, i, rank: type === 'time' ? timeTickRank(new Date(tick.value)) : 0 }))
        .sort((a, b) => b.rank - a.rank || a.i - b.i);

    const kept: XTick[] = [];
    const boxes: [number, number][] = [];
    for (const { tick } of order) {
        if (!tick.label) continue;
        const halfW = measureLabel(tick.label) / 2;
        // Clamp the label box inside the plot so edge labels stay readable.
        const centre = Math.min(Math.max(tick.x, plotLeft + halfW), plotRight - halfW);
        const left = centre - halfW;
        const right = centre + halfW;
        if (boxes.some(([l, r]) => left < r + minGap && right > l - minGap)) continue;
        boxes.push([left, right]);
        kept.push({ ...tick, x: centre });
    }

    return kept.sort((a, b) => a.value - b.value);
}

/** How significant a time tick's boundary is: year 3, month 2, day 1, else 0. */
function timeTickRank(d: Date): number {
    if (!isMidnight(d)) return 0;
    if (d.getDate() !== 1) return 1;
    return d.getMonth() === 0 ? 3 : 2;
}
