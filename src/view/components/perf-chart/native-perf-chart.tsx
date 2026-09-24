// Native entry for PerfChart. rating.tsx only renders it off web, but a static
// import alone evaluates @shopify/react-native-skia, which on web snapshots an
// undefined CanvasKit at module scope and breaks every later Skia call (e.g.
// the web rating chart's useFont). The .web sibling keeps Skia out of the bundle.
export { PerfChart } from './PerfChart';
