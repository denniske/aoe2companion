import React from 'react';
import { privacyHtmlEn } from '../../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslation } from '@app/helper/translate';

export default function PrivacyPage() {
    const getTranslation = useTranslation();
    const htmlContent = privacyHtmlEn.replace('{GAME}', Constants.expoConfig?.scheme as string || '');
    return (
        <>
            <Stack.Screen options={{ title: getTranslation('privacy.title') }} />
            <WebView source={{ html: htmlContent }} scalesPageToFit={false} />;
        </>
    );
}
