import { Platform } from 'react-native';
import { matchFont } from '@shopify/react-native-skia';

// Android's 'serif' was leaving the axis labels in Noto Serif while iOS drew
// Helvetica -- 'sans-serif' is the alias Android maps to Roboto, which matches
// both the iOS labels and the Roboto the rest of the app uses.
const fontFamily = Platform.select({ ios: 'Helvetica', android: 'sans-serif', default: 'serif' });

// Native keeps the system font. `matchFont` resolves it through the platform
// font manager, which is *not* implemented on React Native Web — see the
// chart-font.web.ts sibling, which loads a bundled typeface instead.
const font = matchFont({
    fontFamily,
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: 'normal',
} as never);

export const useChartFont = () => font;
