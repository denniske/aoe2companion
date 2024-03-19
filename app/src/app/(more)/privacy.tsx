import React from 'react';
import { privacyHtmlEn } from '../../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { getTranslation } from '@app/helper/translate';
import { Stack } from 'expo-router';

export default function PrivacyPage() {
    const htmlContent = privacyHtmlEn.replace('{APP}', Constants.expoConfig?.scheme || '');
    return (
        <>
            <Stack.Screen options={{ title: getTranslation('privacy.title') }} />
            <WebView source={{ html: htmlContent }} scalesPageToFit={false} />;
        </>
    );
}
