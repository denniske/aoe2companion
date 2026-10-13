import React from 'react';
import RatingChartSkia, { IRatingChartProps } from '@app/view/components/rating-chart-skia';

// Native only. Web resolves rating-chart.web.tsx instead, which must reach the
// chart body through a dynamic import — see the comment there. Importing it
// directly is fine here: CanvasKit is not involved on native.

export type { IRatingChartProps };

export default function RatingChart(props: IRatingChartProps) {
    return <RatingChartSkia {...props} />;
}
