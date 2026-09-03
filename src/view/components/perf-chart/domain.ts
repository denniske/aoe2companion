import type { ChartSeries } from './types';

export interface Domain {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

/**
 * Auto axis sizing. One linear pass over every point (no allocation, no sort),
 * so it stays cheap at 5000+ entries. The y range is padded a little and snapped
 * to a "nice" step so the top/bottom gridlines land on round rating values.
 */
export function computeDomain(series: ChartSeries[], yPaddingRatio = 0.08): Domain {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let s = 0; s < series.length; s++) {
        const data = series[s].data;
        for (let i = 0; i < data.length; i++) {
            const { x, y } = data[i];
            if (x < xMin) xMin = x;
            if (x > xMax) xMax = x;
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
    }

    if (!isFinite(xMin)) {
        // No data - hand back a harmless unit domain.
        return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
    }

    if (xMin === xMax) {
        xMin -= 1;
        xMax += 1;
    }

    const span = yMax - yMin || 1;
    const pad = span * yPaddingRatio;
    const niceStep = niceNum(span / 4, true);
    yMin = Math.floor((yMin - pad) / niceStep) * niceStep;
    yMax = Math.ceil((yMax + pad) / niceStep) * niceStep;

    return { xMin, xMax, yMin, yMax };
}

/** Classic Heckbert "nice numbers" for axis steps. */
export function niceNum(range: number, round: boolean): number {
    const exp = Math.floor(Math.log10(range));
    const frac = range / Math.pow(10, exp);
    let niceFrac: number;
    if (round) {
        if (frac < 1.5) niceFrac = 1;
        else if (frac < 3) niceFrac = 2;
        else if (frac < 7) niceFrac = 5;
        else niceFrac = 10;
    } else {
        if (frac <= 1) niceFrac = 1;
        else if (frac <= 2) niceFrac = 2;
        else if (frac <= 5) niceFrac = 5;
        else niceFrac = 10;
    }
    return niceFrac * Math.pow(10, exp);
}

/** Evenly spaced "nice" y tick values covering [yMin, yMax]. */
export function yTicks(yMin: number, yMax: number, target = 5): number[] {
    const step = niceNum((yMax - yMin) / Math.max(1, target - 1), true);
    const start = Math.ceil(yMin / step) * step;
    const ticks: number[] = [];
    for (let v = start; v <= yMax + step * 0.5; v += step) {
        // Kill floating point dust like 999.9999999.
        ticks.push(Math.round(v * 1e6) / 1e6);
    }
    return ticks;
}
