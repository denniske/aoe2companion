import { useColorScheme } from 'react-native';

export function useDarkMode() {
    const deviceColorScheme = useColorScheme();
    return deviceColorScheme || 'light';
}
