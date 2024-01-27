import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function Page() {
    return (
        <View className="p-4 flex-1">
            <Tabs.Screen options={{ title: 'Home' }} />
            <Text variant="header">Live and Recent Matches</Text>
            <Card></Card>
        </View>
    );
}
