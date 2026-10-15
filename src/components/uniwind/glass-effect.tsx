import { GlassView as BaseGlassView } from 'expo-glass-effect';
import { withUniwind } from 'uniwind';

// Manual mapping: the automatic one treats every prop ending in "Style" as a style,
// which would turn glassEffectStyle into an array and blank the glass (uni-stack/uniwind#731).
export const GlassView = withUniwind(BaseGlassView, {
    style: {
        fromClassName: 'className',
    },
});

export { isLiquidGlassAvailable } from 'expo-glass-effect';
