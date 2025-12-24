import { FlatList } from '@app/components/flat-list';
import { Icon, IconName } from '@app/components/icon';
import { Text } from '@app/components/text';
import { Href, Link, Redirect, Stack } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';
import { useTranslation } from '@app/helper/translate';
import { appConfig } from '@nex/dataset';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { Image } from '@app/components/uniwind/image';

interface Link {
    icon: IconName;
    title: string;
    path: Href;
}

export default function More() {
    const isMajorRelease = Constants.expoConfig?.version?.includes('.0.0');
    const getTranslation = useTranslation();

    const links: Link[] = [
        { icon: 'user', title: 'Account', path: '/more/account' },
        { icon: 'cog', title: getTranslation('settings.title'), path: '/more/settings' },
        { icon: 'question-circle', title: getTranslation('about.title'), path: '/more/about' },
        { icon: 'exchange-alt', title: getTranslation('changelog.title'), path: '/more/changelog' },
        { icon: 'hands-helping', title: getTranslation('footer.help'), path: 'https://discord.com/invite/gCunWKx' },

        // iOS does not allow donations and android did check for aoe2 also
        ...(!((Platform.OS === 'ios' || (appConfig.game === 'aoe2' && Platform.OS !== 'web')) && isMajorRelease)
            ? [{ icon: 'coffee', title: getTranslation('footer.buymeacoffee'), path: 'https://www.buymeacoffee.com/denniskeil' } as Link]
            : []),
    ];

    const showTabBar = useShowTabBar();

    if (!showTabBar) {
        return <Redirect href="/" />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('more.title'),
                }}
            />
            <FlatList
                contentContainerClassName="p-4"
                data={links}
                ItemSeparatorComponent={() => <View className="h-px bg-gray-200 dark:bg-gray-800 w-full" />}
                renderItem={({ item: { icon, title, path } }) => (
                    <Link asChild href={path} target={path.toString().startsWith('https:') ? '_blank' : undefined}>
                        <TouchableOpacity className="flex-row gap-3 py-4 items-center">
                            <Icon icon={icon} color="brand" size={24} />
                            <View>
                                <Text variant="header-sm">{title}</Text>
                            </View>
                            <View className="flex-1" />
                            <Icon icon="angle-right" color="brand" size={20} />
                        </TouchableOpacity>
                    </Link>
                )}
                ListFooterComponent={
                    Platform.OS === 'web' ? (
                        <View className="gap-4 pt-8">
                            <Link
                                href={`https://play.google.com/store/apps/details?id=${appConfig.app.android.bundleId}`}
                                target="_blank"
                                className="flex flex-col"
                            >
                                <Image
                                    source={require('../../../assets/app-button-play-store.png')}
                                    className="h-12 object-contain"
                                    contentFit="contain"
                                />
                            </Link>
                            <Link href={`https://apps.apple.com/app/id${appConfig.app.ios.bundleId}`} target="_blank" className="flex flex-col">
                                <Image
                                    source={require('../../../assets/app-button-app-store.png')}
                                    className="h-12 object-contain"
                                    contentFit="contain"
                                />
                            </Link>
                        </View>
                    ) : undefined
                }
            />
        </>
    );
}
