import { View } from 'react-native';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Text } from './text';
import { Href, Link as ExpoLink } from 'expo-router';
import { appConfig } from '@nex/dataset';
import { Link } from './link';
import { useTranslation } from '@app/helper/translate';

export const Footer: React.FC = () => {
    const getTranslation = useTranslation();

    return (
        <View className="bg-blue-800 dark:bg-blue-900">
            <View className={cn('py-4 flex-row justify-around', containerClassName)}>
                <View className="items-center gap-1">
                    <Text variant="header">Customization</Text>

                    <Link href="/more/account">{getTranslation('account.title')}</Link>
                    <Link href="/more/settings">{getTranslation('settings.title')}</Link>
                </View>

                <View className="items-center gap-1">
                    <Text variant="header">Information</Text>

                    <Link href="/more/about">{getTranslation('about.title')}</Link>
                    <Link href="/more/changelog">{getTranslation('changelog.title')}</Link>
                    <Link href="/more/privacy">{getTranslation('privacy.title')}</Link>
                </View>

                <View className="items-center gap-1">
                    <Text variant="header">External Links</Text>

                    <Link href="https://discord.com/invite/gCunWKx">{getTranslation('account.discord.title')}</Link>
                    <Link href="https://www.buymeacoffee.com/denniskeil">{getTranslation('footer.buymeacoffee')}</Link>
                </View>
            </View>

            <View className={cn(containerClassName, 'py-4 web:max-w-3xl! justify-center dark')}>
                <Text variant="body-sm" color="white" align="center" className="inline-block">
                    Age of Empires II© Microsoft Corporation. {appConfig.hostAoeCompanion} was created under Microsoft's "
                    <ExpoLink
                        className="text-brand underline"
                        target="_blank"
                        href="https://www.xbox.com/en-US/developers/rules"
                        rel="noreferrer noopener"
                    >
                        Game Content Usage Rules
                    </ExpoLink>
                    " using assets from{' '}
                    <ExpoLink className="text-brand underline" target="_blank" href={appConfig.ms.url as Href} rel="noreferrer noopener">
                        {appConfig.ms.name}
                    </ExpoLink>
                    , and it is not endorsed by or affiliated with Microsoft.
                </Text>
            </View>
        </View>
    );
};
