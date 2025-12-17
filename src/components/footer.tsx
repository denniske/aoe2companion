import { Platform, Pressable, View } from 'react-native';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Text } from './text';
import { Href, Link as ExpoLink, router } from 'expo-router';
import { appConfig, appIconData } from '@nex/dataset';
import { Link } from './link';
import { useTranslation } from '@app/helper/translate';
import { useAuthProfileId, useFollowedAndMeProfileIds } from '@app/queries/all';
import { Image } from './uniwind/image';

export const Footer: React.FC = () => {
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const profileIds = useFollowedAndMeProfileIds();

    return (
        <View className="bg-[#F3EFE6] dark:bg-blue-900 mt-4">
            <View className={cn('py-4 flex-row items-start', containerClassName)}>
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

                <View className="items-center gap-1 flex-1">
                    <Text variant="header" color="subtle">
                        {getTranslation('account.title')}
                    </Text>

                    <Link color="subtle" href="/more/account">
                        {getTranslation('main.heading.profile')}
                    </Link>
                    <Link color="subtle" href="/more/settings">
                        {getTranslation('settings.title')}
                    </Link>
                </View>

                <View className="items-center gap-1 flex-1">
                    <Text variant="header" color="subtle">
                        Ongoing Matches
                    </Text>

                    {authProfileId && (
                        <Link color="subtle" href="/matches/live/mine">
                            {getTranslation('footer.mine')}
                        </Link>
                    )}

                    {profileIds?.length ? (
                        <Link color="subtle" href="/matches/live/following">
                            {getTranslation('footer.following')}
                        </Link>
                    ) : null}

                    <Link color="subtle" href="/competitive/games">
                        {getTranslation('competitive.title')}
                    </Link>

                    <Link color="subtle" href="/matches/live/lobbies">
                        {getTranslation('lobbies.title')}
                    </Link>

                    <Link color="subtle" href="/matches/live/all">
                        {getTranslation('footer.all')}
                    </Link>
                </View>

                <View className="items-center gap-1 flex-1">
                    <Text variant="header" color="subtle">
                        Information
                    </Text>

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
            </View>

            {Platform.OS === 'web' && (
                <View className={cn(containerClassName, 'py-4 web:max-w-3xl! justify-center flex-row gap-4')}>
                    &nbsp;&nbsp;
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
