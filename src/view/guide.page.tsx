import React from 'react';
import { WebView } from 'react-native-webview';
import {Platform, View} from 'react-native';

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
        <View
            style={{minHeight: 300, flex: 1}}
        >
            <WebView
                    source={{uri: 'https://buildorderguide.com/#/'}}
                    scalesPageToFit={false}
                    style={{minHeight: 200, backgroundColor: 'grey'}}
                    onShouldStartLoadWithRequest={event => {
                        console.log('click', event);
                        return true;
                    }}
            />
        </View>
    );
}
