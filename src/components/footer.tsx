import { Platform, Pressable, View } from 'react-native';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Text } from './text';
import { Href, Link as ExpoLink, router } from 'expo-router';
import { appConfig, appIconData } from '@nex/dataset';
import { Link } from './link';
import { useTranslation } from '@app/helper/translate';
import { Image } from './uniwind/image';

export const Footer: React.FC = () => {
    const getTranslation = useTranslation();

    return (
        <View className="bg-[#F3EFE6] dark:bg-blue-900 mt-2">
            <View className={cn('py-4 flex-row items-center', containerClassName)}>
                <Pressable
                    className="flex-row items-center gap-4 lg:pr-4 xl:pr-8 hidden lg:flex"
                    onPress={() => {
                        if (router.canDismiss()) {
                            router.dismissAll();
                        }
                        router.replace('/');
                    }}
                >
                    <Image source={appIconData} className="w-12 h-12 rounded shadow-blue-50 shadow-xs dark:shadow-none" />

                    <Text variant="header-lg" color="subtle">
                        {appConfig.app.name}
                    </Text>
                </Pressable>

                <View className="flex-2 flex-row justify-around">
                    <Link color="subtle" href="/more/about">
                        {getTranslation('about.title')}
                    </Link>
                    <Link color="subtle" href="/more/changelog">
                        {getTranslation('changelog.title')}
                    </Link>
                    <Link color="subtle" href="/more/privacy">
                        {getTranslation('privacy.title')}
                    </Link>
                </View>

                {Platform.OS === 'web' && (
                    <View className="flex-3 flex-row justify-around items-center gap-2">
                        <a href="https://discord.gg/gCunWKx" target="_blank">
                            <img src="https://img.shields.io/discord/727175083977736262.svg?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=2c2f33" />
                        </a>
                        <a href="https://www.buymeacoffee.com/denniskeil" target="_blank">
                            <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshields-io-buymeacoffee.vercel.app%2Fapi%3Fusername%3Ddenniskeil" />
                        </a>
                        <a href="https://github.com/denniske/aoe2companion" target="_blank">
                            <img src={`https://img.shields.io/badge/github-aoe2companion-brightgreen?label=Github&logo=github`} />
                        </a>
                    </View>
                )}
            </View>

            <View className={cn(containerClassName, 'py-4 web:max-w-3xl! justify-center')}>
                <Text variant="body-sm" color="subtle" align="center" className="inline-block">
                    Age of Empires II© Microsoft Corporation. {appConfig.hostAoeCompanion} was created under Microsoft's "
                    <ExpoLink
                        className="text-subtle underline"
                        target="_blank"
                        href="https://www.xbox.com/en-US/developers/rules"
                        rel="noreferrer noopener"
                    >
                        Game Content Usage Rules
                    </ExpoLink>
                    " using assets from{' '}
                    <ExpoLink className="text-subtle underline" target="_blank" href={appConfig.ms.url as Href} rel="noreferrer noopener">
                        {appConfig.ms.name}
                    </ExpoLink>
                    , and it is not endorsed by or affiliated with Microsoft.
                </Text>
            </View>
        </View>
    );
};
