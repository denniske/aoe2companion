import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

export interface XTick {
    value: number;
    label: string;
    /** Pixel x of the tick (label is centered on this, then clamped to plot). */
    x: number;
}

const DAY = 86400000;

/**
 * Pick a date format from the visible span so labels stay compact:
 *  - > ~2 years    -> "2021"
 *  - > ~4 months   -> "Mar 21"
 *  - otherwise     -> "Mar 3"
 */
function formatterForSpan(spanMs: number): (d: Date) => string {
    if (spanMs > 730 * DAY) return timeFormat('%Y');
    if (spanMs > 120 * DAY) return timeFormat('%b %y');
    return timeFormat('%b %-d');
}

/**
 * Smart x-axis labels.
 *
 * d3 gives us candidate ticks on natural calendar boundaries. We then walk them
 * left-to-right and keep a tick only if its label clears the previously kept
 * label by `minGap` pixels - so the axis never renders overlapping text no
 * matter how narrow the chart or how wide the date range. `measureLabel`
 * returns the rendered pixel width of a string (Skia font measurement).
 */
export function computeXTicks(opts: {
    xMin: number;
    xMax: number;
    plotLeft: number;
    plotRight: number;
    measureLabel: (text: string) => number;
    minGap?: number;
    /** Rough target before overlap culling. Derived from width if omitted. */
    targetCount?: number;
}): XTick[] {
    const { xMin, xMax, plotLeft, plotRight, measureLabel } = opts;
    const minGap = opts.minGap ?? 12;
    const plotWidth = Math.max(1, plotRight - plotLeft);

    const scale = scaleTime().domain([new Date(xMin), new Date(xMax)]).range([plotLeft, plotRight]);
    const fmt = formatterForSpan(xMax - xMin);

    const target = opts.targetCount ?? Math.max(2, Math.floor(plotWidth / 68));
    const rawTicks = scale.ticks(target);

    const candidates: XTick[] = rawTicks.map((d) => {
        const label = fmt(d);
        return { value: +d, label, x: scale(d) };
    });

    // Greedy non-overlap pass. `keptRightEdge` is the right edge (px) of the
    // last label we committed to drawing.
    const kept: XTick[] = [];
    let keptRightEdge = -Infinity;
    for (const tick of candidates) {
        const halfW = measureLabel(tick.label) / 2;
        // Clamp the label box inside the plot so edge labels stay readable.
        const centre = Math.min(Math.max(tick.x, plotLeft + halfW), plotRight - halfW);
        const leftEdge = centre - halfW;
        if (leftEdge < keptRightEdge + minGap) continue;
        kept.push({ ...tick, x: centre });
        keptRightEdge = centre + halfW;
    }

    return kept;
}
