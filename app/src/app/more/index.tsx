import { FlatList } from '@app/components/flat-list';
import { Icon, IconName } from '@app/components/icon';
import { Text } from '@app/components/text';
import { Stack, router } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';

interface Link {
    icon: IconName;
    title: string;
    path: string;
}

export default function More() {
    const isMajorRelease = Constants.expoConfig?.version?.includes('.0.0');

    const links: Link[] = [
        // { icon: 'user', title: 'Account', path: '/more/account' },
        { icon: 'cog', title: 'Settings', path: '/more/settings' },
        { icon: 'question-circle', title: 'About', path: '/more/about' },
        { icon: 'exchange-alt', title: 'Changelog', path: '/more/changelog' },
        { icon: 'hands-helping', title: 'Help', path: 'https://discord.com/invite/gCunWKx' },

        ...(
            !(Platform.OS === 'ios' && isMajorRelease) ?
            [{ icon: 'coffee', title: 'Buy me a coffee', path: 'https://www.buymeacoffee.com/denniskeil' } as Link] : []
        ),
    ];

    return (
        <>
            <Stack.Screen options={{
                animation: 'none',
                title: 'More',
            }} />
            <FlatList
                contentContainerStyle="p-4"
                data={links}
                ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full" />}
                renderItem={({ item: { icon, title, path } }) => (
                    <TouchableOpacity className="flex-row gap-3 py-4 items-center" onPress={() => router.push(path)}>
                        <Icon icon={icon} color="brand" size={24} />
                        <View>
                            <Text variant="header-sm">{title}</Text>
                        </View>
                        <View className="flex-1" />
                        <Icon icon="angle-right" color="brand" size={20} />
                    </TouchableOpacity>
                )}
            />
        </>
    );
}
