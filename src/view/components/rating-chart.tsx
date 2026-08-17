import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import RatingChartSkia, { IRatingChartProps } from '@app/view/components/rating-chart-skia';

// Native only. Web resolves rating-chart.web.tsx instead, which must reach the
// chart body through a dynamic import — see the comment there. Importing it
// directly is fine here: CanvasKit is not involved on native.

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
    // block on the JS thread. Deferring it keeps that work out of the
    // navigation/modal transition, so the animation stays smooth and the spinner
    // covers the cost instead of a frozen screen.
    //
    // requestIdleCallback rather than InteractionManager: the latter is
    // deprecated and React Navigation 8 no longer drives it, so its queue can
    // resolve at the wrong moment. React Native implements requestIdleCallback
    // in its own timers, so this works on native as well as web. The timeout
    // guarantees the chart still appears on a busy thread.

    // const [ready, setReady] = React.useState(false);
    //
    // React.useEffect(() => {
    //     if (typeof requestIdleCallback !== 'function') {
    //         const timer = setTimeout(() => setReady(true), 0);
    //         return () => clearTimeout(timer);
    //     }
    //
    //     const handle = requestIdleCallback(
    //         () => {
    //             console.log('Rating chart idle called');
    //             setReady(true);
    //         },
    //         { timeout: 500 }
    //     );
    //     return () => cancelIdleCallback(handle);
    // }, []);
    //
    // if (!ready) return chartFallback;

    return <RatingChartSkia {...props} />;
}
