import { SafeAreaProvider as BaseSafeAreaProvider, SafeAreaView as BaseSafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

export const SafeAreaProvider = withUniwind(BaseSafeAreaProvider);
export const SafeAreaView = withUniwind(BaseSafeAreaView);

export { useSafeAreaInsets };