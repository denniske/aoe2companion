import { Stack as ExpoStack } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Header } from './header';

export const Stack = () => {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === 'dark' ? '#0E1017' : '#FFFCF5';
    return <ExpoStack screenOptions={{ header: Header, headerTitle: 'Matches', contentStyle: { backgroundColor } }} />;
};
