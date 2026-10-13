// Entry for screens that are not otherwise loaded behind SkiaLoader. On native
// this is PerfChart itself; the .web sibling defers it until CanvasKit is ready.
export { PerfChart as LazyPerfChart } from './PerfChart';
