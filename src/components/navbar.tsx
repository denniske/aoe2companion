import { useTranslation } from '@app/helper/translate';
import { Platform, Pressable, View } from 'react-native';
import { Text } from './text';
import { Href, usePathname, useRouter } from 'expo-router';
import { Icon, IconName } from './icon';
import { useCurrentTabName } from './tab-bar';
import { Image } from './uniwind/image';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { appConfig, appIconData } from '@nex/dataset';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { InlinePlayerSearch } from './inline-player-search';
import { useEffect } from 'react';

export const NavBar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (Platform.OS === 'web') {
            window.scrollTo({ top: 0 });
        }
    }, [pathname]);

    const getTranslation = useTranslation();

    const routes: Array<{ key: string; label: string; icon: IconName; path: Href }> = [
        {
            key: 'matches',
            label: getTranslation('nav.matches'),
            icon: 'chess',
            path: '/matches',
        },
        {
            key: 'explore',
            label: getTranslation('nav.explore'),
            icon: 'landmark',
            path: '/explore',
        },
        {
            key: 'statistics',
            label: getTranslation('nav.stats'),
            icon: 'chart-simple',
            path: '/statistics',
        },
        {
            key: 'competitive',
            label: getTranslation('nav.competitive'),
            icon: 'ranking-star',
            path: '/competitive',
        },
    ] as const;

    const { isLarge } = useBreakpoints();

    return (
        <View className="bg-[#F3EFE6] dark:bg-blue-900 relative z-50">
            <View className={cn('flex flex-row py-4 justify-between', containerClassName)}>
                <Pressable
                    className="flex-row items-center gap-4 lg:pr-4 xl:pr-8"
                    onPress={() => {
                        if (router.canDismiss()) {
                            router.dismissAll();
                        }
                        router.replace('/');
                    }}
                >
                    <Image source={appIconData} className="w-12 h-12 rounded shadow-blue-50 shadow-xs dark:shadow-none" />

                    <Text variant="header-lg" color="subtle" className="hidden xl:flex">
                        {appConfig.app.name}
                    </Text>
                </Pressable>

                {routes.map((route) => {
                    const isFocused = pathname === route.path;

                    const onPress = () => {
                        if (router.canDismiss()) {
                            router.dismissAll();
                        }
                        router.replace(route.path);
                    };

                    return (
                        <Pressable
                            onPress={() => onPress()}
                            key={route.key}
                            className={cn(
                                'flex-row justify-center items-center gap-2.5 rounded-lg px-5 xl:px-6',
                                isFocused
                                    ? 'bg-blue-700 dark:bg-blue-950 text-white fill-white'
                                    : 'text-subtle fill-subtle hocus:bg-gold-50 dark:hocus:bg-blue-700'
                            )}
                        >
                            <Icon fill="inherit" size={20} icon={route.icon as IconName} />
                            <Text variant="label-lg" color="text-inherit" className="uppercase mt-0.5">
                                {route.label}
                            </Text>
                        </Pressable>
                    );
                })}

                {isLarge && Platform.OS === 'web' ? (
                    <InlinePlayerSearch />
                ) : (
                    <Pressable
                        onPress={() => router.replace('/matches/users/search')}
                        className={cn(
                            'flex-row justify-center items-center gap-2.5 rounded-lg px-4 fill-subtle hocus:bg-gold-50 dark:hocus:bg-blue-700'
                        )}
                    >
                        <Icon fill="inherit" size={20} icon="search" />
                    </Pressable>
                )}

                {/* <Pressable
                    onPress={() => router.replace('/more/account')}
                    className={cn('flex-row justify-center items-center gap-2.5 rounded-lg px-4 fill-subtle hocus:bg-gold-50 dark:hocus:bg-blue-700')}
                >
                    <Icon fill="inherit" size={20} icon="user" />
                </Pressable> */}
            </View>
        </View>
    );
};
