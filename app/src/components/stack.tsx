import { Stack as ExpoStack } from 'expo-router';
import { Header } from './header';

export const Stack = () => {
    return <ExpoStack screenOptions={{ header: Header, headerTitle: 'Matches', contentStyle: { backgroundColor: 'transparent' } }} />;
};
