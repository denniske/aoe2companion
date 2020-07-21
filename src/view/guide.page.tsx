import React from 'react';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

export default function GuidePage() {
    if (Platform.OS === 'web') {
        return (
                <iframe
                        style={{border: 'none'}}
                        height="100%"
                        src="https://buildorderguide.com/#/">
                </iframe>
        );
    }

    return (
            <WebView
                    source={{uri: 'https://buildorderguide.com/#/'}}
                    scalesPageToFit={false}
            />
    );
}
