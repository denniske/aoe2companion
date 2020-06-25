import React from 'react';
import { WebView } from 'react-native-webview';

export default function GuidePage() {
    return (
            <WebView
                    source={{uri: 'https://buildorderguide.com/#/'}}
                    scalesPageToFit={false}
            />
    );
}
