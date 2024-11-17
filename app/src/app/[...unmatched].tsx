import { Button } from '@app/components/button';
import { Header } from '@app/components/header';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Unmatched() {
    return (
        <View className="flex-1 items-center justify-center">
            <Stack.Screen options={{ title: 'Not Found', headerShown: true, header: Header }} />

            <Button href="/">Go Home</Button>
        </View>
    );
}
