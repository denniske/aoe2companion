import React from 'react';
import { privacyHtmlEn } from '../../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { Platform, View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPage() {
    const getTranslation = useTranslation();
    const htmlContent = privacyHtmlEn.replaceAll('{GAME}', (Constants.expoConfig?.scheme as string) || '');
    const { bottom } = useSafeAreaInsets();

    return (
        <View>
            <Stack.Screen options={{ title: getTranslation('privacy.title') }} />
            {Platform.OS === 'web' ? (
                <ScrollView contentContainerClassName='px-4 py-6'>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                </ScrollView>
            ) : (
                <WebView source={{ html: htmlContent }} scalesPageToFit={false} contentInset={{ bottom: 90 + bottom }} />
            )}
        </View>
    );
}
