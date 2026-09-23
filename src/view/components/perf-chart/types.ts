export interface ChartPoint {
    /** Epoch milliseconds. Numeric for speed - convert Date once at the edge. */
    x: number;
    y: number;
}

export interface ChartSeries {
    id: string;
    color: string;
    /** Must be sorted ascending by x. */
    data: ChartPoint[];
    /** Draw scatter dots for this series. */
    scatter?: boolean;
    /** Draw the connecting line for this series. Defaults to true. */
    line?: boolean;
}

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
