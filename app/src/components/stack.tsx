import tw from '@app/tailwind';
import { Stack as ExpoStack } from 'expo-router';

import { Header } from './header';

export const Stack = () => {
    const backgroundColor = tw.style('bg-gold-50 dark:bg-blue-950').backgroundColor as string;
    return <ExpoStack screenOptions={{ header: Header, headerTitle: 'Matches', contentStyle: { backgroundColor } }} />;
};
