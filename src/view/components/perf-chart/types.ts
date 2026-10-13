export interface ChartPoint {
    /**
     * Epoch milliseconds on a time axis, a plain number on a linear axis, the
     * category index on a band axis. Numeric for speed - convert Date once at
     * the edge.
     */
    x: number;
    y: number;
}

export interface ChartSeries {
    id: string;
    color: string;
    /** Must be sorted ascending by x. */
    data: ChartPoint[];
    /** Shown in the hover cursor. Defaults to the id. */
    label?: string;
    /** Draw scatter dots for this series. */
    scatter?: boolean;
    /** Dot radius, overriding the chart's `scatterRadius`. */
    scatterRadius?: number;
    /** Draw the connecting line for this series. Defaults to true unless `area` or `bar` is set. */
    line?: boolean;
    /** Line width. Defaults to 1.5. */
    strokeWidth?: number;
    /** Fill the area between the line and the bottom of the plot. */
    area?: boolean;
    /** Draw a bar per point, from the bottom of the plot up to the value. */
    bar?: boolean;
    /** Bar width in px. Defaults to 60% of the slot between two points. */
    barWidth?: number;
}

/**
 * - `time`:   x is epoch ms, ticks land on calendar boundaries.
 * - `linear`: x is a plain number, ticks are "nice" round values.
 * - `band`:   x is a category index 0..n-1, one candidate tick per category.
 */
export type ChartXAxisType = 'time' | 'linear' | 'band';

export interface ChartTheme {
    dark: boolean;
    textColor: string;
    gridColor: string;
    axisColor: string;
    background: string;
}

export const lightTheme: ChartTheme = {
    dark: false,
    textColor: '#333333',
    gridColor: '#EAEAEA',
    axisColor: '#BBBBBB',
    background: '#FFFFFF',
};

export const darkTheme: ChartTheme = {
    dark: true,
    textColor: '#DDDDDD',
    gridColor: '#2A2A2A',
    axisColor: '#454545',
    background: '#111111',
};
