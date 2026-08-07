import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import SkiaLoader from '@app/components/skia-loader';
import type { IRatingChartProps } from '@app/view/components/rating-chart-skia';

// Hoisted rather than written inline in JSX: React Compiler cannot lower a
// dynamic `import()` expression and bails out on the whole component. The lazy
// loading behaviour is unchanged — the import still only runs when SkiaLoader
// calls this.
//
// The chart body lives in a separate module so that on web nothing touching
// Skia (including the module-scope `matchFont` call) is evaluated until
// CanvasKit has finished loading.
const loadRatingChart = () => import('@app/view/components/rating-chart-skia');

export type { IRatingChartProps };

// Shown while the chart chunk (and, on web, CanvasKit) loads. Fills the same
// box the chart will occupy so nothing shifts once it swaps in.
const chartFallback = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating size="small" color="#999" />
    </View>
);

export default function RatingChart(props: IRatingChartProps) {
    return <SkiaLoader getComponent={loadRatingChart} componentProps={props} fallback={chartFallback} />;
}
