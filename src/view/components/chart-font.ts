import { Platform } from 'react-native';
import { matchFont } from '@shopify/react-native-skia';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });

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
