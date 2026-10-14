import { GlassView as BaseGlassView } from 'expo-glass-effect';
import { withUniwind } from 'uniwind';

// Don't pass glassEffectStyle to this: withUniwind treats every prop ending in "Style" as a
// style prop and turns it into an array, which the native view rejects and renders nothing.
// The default ('regular') is what we want anyway.
export const GlassView = withUniwind(BaseGlassView);

export { isLiquidGlassAvailable } from 'expo-glass-effect';
