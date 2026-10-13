import { useFont } from '@shopify/react-native-skia';

// `matchFont` (used by the native sibling, chart-font.ts) is not implemented on
// React Native Web — it throws "Not implemented on React Native Web" from the
// CanvasKit font manager. Load a bundled typeface instead, the same way
// match-map/map-utils.ts does for its Skia labels. Null until it has loaded.
export const useChartFont = (fontSize = 11) => useFont(require('../../../assets/font/Roboto.ttf'), fontSize);
