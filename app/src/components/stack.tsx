import tw from '@app/tailwind';
import { Stack as ExpoStack } from 'expo-router';

import { Header } from './header';

export const Stack = () => {
    return <ExpoStack screenOptions={{ header: Header, headerTitle: 'Matches', contentStyle: tw`bg-gold-50 dark:bg-blue-950` }} />;
};
