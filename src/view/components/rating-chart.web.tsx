import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import SkiaLoader from '@app/components/skia-loader';
import type { IRatingChartProps } from '@app/view/components/rating-chart-skia';

// Web-only sibling of rating-chart.tsx, and the reason the split exists:
// `@shopify/react-native-skia` builds its whole API at module scope with
// `JsiSkApi(global.CanvasKit)`. Any *static* import that reaches the chart body
// therefore snapshots an undefined CanvasKit at bundle-evaluation time, and
// every later Skia call fails with "Cannot read properties of undefined
// (reading 'XYWHRect')" — no matter that WithSkiaWeb loads CanvasKit later.
//
// So nothing here may reference the chart module except through the dynamic
// import below (the `import type` above is erased and adds no runtime edge).
// The native file keeps its direct import, where none of this applies.
const loadRatingChart = () => import('@app/view/components/rating-chart-skia');

export type { IRatingChartProps };

// Shown while the chart chunk and CanvasKit load. Fills the same box the chart
// will occupy so nothing shifts once it swaps in.
const chartFallback = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating size="small" color="#999" />
    </View>
);

export default function RatingChart(props: IRatingChartProps) {
    return <SkiaLoader getComponent={loadRatingChart} componentProps={props} fallback={chartFallback} />;
}
