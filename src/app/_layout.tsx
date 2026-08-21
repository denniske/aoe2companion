// The uniwind CSS entry is re-evaluated on every rebuild, which invalidates whichever
// module imports it. Keeping it in this thin module means the root layout component is
// defined in a module that is NOT invalidated, so Fast Refresh keeps its identity and
// React does not remount the navigator (which would drop the current route).
import '../../global.css';

export { default } from '../root-layout';
