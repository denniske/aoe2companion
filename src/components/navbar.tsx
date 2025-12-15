import { useTranslation } from '@app/helper/translate';
import { Pressable, View } from 'react-native';
import { Text } from './text';
import { Href, useRouter } from 'expo-router';
import { Icon, IconName } from './icon';
import { useCurrentTabName } from './tab-bar';
import { Image } from './uniwind/image';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { appConfig, appIconData } from '@nex/dataset';

export const NavBar: React.FC = () => {
    const router = useRouter();
    const routeName = useCurrentTabName();

    const getTranslation = useTranslation();

    const routes: Array<{ key: string; label?: string; icon: IconName; path: Href }> = [
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
            label: getTranslation('nav.pros'),
            icon: 'ranking-star',
            path: '/competitive',
        },
        {
            key: 'more',
            icon: 'bars',
            path: '/more',
        },
    ] as const;

    return (
        <View className={cn('flex flex-row pt-8 pb-4', containerClassName)}>
            <Pressable
                className="flex-row items-center gap-4"
                onPress={() => {
                    if (router.canDismiss()) {
                        router.dismissAll();
                    }
                    router.replace('/');
                }}
            >
                <Image source={appIconData} className="w-12 h-12 rounded" />

                <Text variant="header-lg" color="default" className='hidden lg:flex'>
                    {appConfig.app.name}
                </Text>
            </Pressable>

            {routes.map((route) => {
                const isFocused = routeName?.startsWith(route.key);

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
                        className={cn('flex-row justify-center items-center gap-2', route.label ? 'flex-1' : 'pl-8')}
                    >
                        {route.icon && <Icon color={isFocused ? 'brand' : 'default'} size={20} icon={route.icon as IconName} />}
                        {route.label && (
                            <Text variant="label-lg" color={isFocused ? 'brand' : 'default'} className="uppercase mt-1">
                                {route.label}
                            </Text>
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
};
