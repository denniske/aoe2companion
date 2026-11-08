import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

// Shared shell for the statistics detail pages: a one-line description and the scope every
// number on the page shares. The title is only set on the screen; the web layout and the native
// header both render it already.
export const StatsPage: React.FC<{ title: string; description: string; matches?: number | null; mirrorsExcluded?: boolean; children: React.ReactNode }> = ({
    title,
    description,
    matches,
    mirrorsExcluded = true,
    children,
}) => (
    <ScrollView contentContainerClassName="py-4 gap-4 px-4">
        <Stack.Screen options={{ title }} />
        <View className="gap-1">
            <Text variant="body" color="subtle">
                {description}
            </Text>
            <Text variant="body-xs" color="subtle">
                Ranked 1v1 · last 30 days{matches ? ` · ${matches.toLocaleString()} matches` : ''}
                {mirrorsExcluded ? ' · mirror matches excluded' : ''}
            </Text>
        </View>
        {children}
    </ScrollView>
);
