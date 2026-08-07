import React from 'react';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
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
    // Building the Skia paths for a large rating history is a long synchronous
    // block on the JS thread. Waiting for interactions to finish keeps that work
    // out of the navigation/modal transition, so the animation stays smooth and
    // the spinner covers the cost instead of a frozen screen.
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const handle = InteractionManager.runAfterInteractions(() => setReady(true));
        return () => handle.cancel();
    }, []);

    if (!ready) return chartFallback;

    return <SkiaLoader getComponent={loadRatingChart} componentProps={props} fallback={chartFallback} />;
}
