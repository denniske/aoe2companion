import React from 'react';
import { privacyHtmlEn } from '../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';

export default function PrivacyPage() {
    const htmlContent = privacyHtmlEn;
    //require('../../assets/legal/privacy-policy-html-en');

    console.log("htmlContent2", htmlContent);

    return (
            <WebView
                    source={{html: htmlContent}}
                    scalesPageToFit={false}
            />
    );
}
