import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

// Shared shell for the statistics detail pages: one-line description and the
// mock-data note every POC page carries until the backend exists. The title is only
// set on the screen; the web layout and the native header both render it already.
export const StatsPage: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <ScrollView contentContainerClassName="py-4 gap-4 px-4">
        <Stack.Screen options={{ title }} />
        <View className="gap-1">
            <Text variant="body" color="subtle">
                {description}
            </Text>
            <Text variant="body-xs" color="subtle">
                RM 1v1 · last 30 days · mock data
            </Text>
        </View>
        {children}
    </ScrollView>
);
