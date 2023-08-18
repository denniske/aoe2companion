import React from 'react';
import { privacyHtmlEn } from '../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function PrivacyPage() {
    const htmlContent = privacyHtmlEn.replace('{APP}', Constants.expoConfig?.scheme || '');
    return (
            <WebView
                    source={{html: htmlContent}}
                    scalesPageToFit={false}
            />
    );
}
