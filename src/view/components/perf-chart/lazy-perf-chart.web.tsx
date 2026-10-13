import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import SkiaLoader from '@app/components/skia-loader';
import type { PerfChartProps } from './PerfChart';

// `@shopify/react-native-skia` builds its whole API at module scope with
// `JsiSkApi(global.CanvasKit)`, so any *static* import that reaches PerfChart
// snapshots an undefined CanvasKit at bundle-evaluation time and every later
// Skia call fails. Nothing here may reference the chart module except through
// this dynamic import (the `import type` above is erased).
//
// Hoisted rather than written inline in JSX: React Compiler cannot lower a
// dynamic `import()` expression and bails out on the whole component.
const loadPerfChart = () => import('./PerfChart');

export function LazyPerfChart(props: PerfChartProps) {
    // Fills the box the chart will occupy so nothing shifts once it swaps in.
    const fallback = (
        <View style={{ width: props.width, height: props.height, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating size="small" color="#999" />
        </View>
    );
    return <SkiaLoader getComponent={loadPerfChart} componentProps={props} fallback={fallback} />;
}
