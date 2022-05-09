import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import {Linking, Platform, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../theming';
import {appVariants} from '../styles';
import {MyText} from './components/my-text';
import {openLink} from "../helper/url";


export function WinratesTitle(props: any) {
    const appStyles = useTheme(appVariants);
    return (
        <TouchableOpacity onPress={() => openLink('https://www.ageofstatistics.com/statistics/winrates?game=aoe2&period=p03_v01&filter=rm_solo_all')}>
            <MyText style={appStyles.link}>ageofstatistics.com</MyText>
        </TouchableOpacity>
    );
}

export default function WinratesPage() {
    if (Platform.OS === 'web') {
        return (
            <iframe
                style={{ border: 'none' }}
                height="100%"
                src="https://www.ageofstatistics.com/statistics/winrates?game=aoe2&period=p03_v01&filter=rm_solo_all">
            </iframe>
        );
    }

    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(400);

    const runFirst = `
        // android: use timeout
        setTimeout(function() {
            document.querySelector("div>a.BuyMeACoffe-module--bmc-button--3AWbh").remove();
        }, 1000);
    
        // ios: need to wait until page loaded and use setTimeout to work     
        window.onload = function() {
            setTimeout(function() {
                document.querySelector("div>a.BuyMeACoffe-module--bmc-button--3AWbh").remove();
            }, 1000);
        };
        
        true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
        <View
            style={{ minHeight: 300, flex: 1, overflow: 'hidden' }}
            onLayout={({ nativeEvent: { layout } }: any) => {
                console.log('layout', layout);
                setWidth(layout.width);
                setHeight(layout.height);
            }}
        >
            <WebView
                allowUniversalAccessFromFileURLs
                mixedContentMode="compatibility"
                originWhitelist={['*']}
                javaScriptEnabled
                // Needed for injectedJavaScript to work
                onMessage={(event) => {
                    console.log('event: ', event)
                }}
                injectedJavaScript={runFirst}
                source={{ uri: 'https://aoestats.io/' }}
                scalesPageToFit={false}
                style={{
                    minHeight: 200,
                    backgroundColor: 'grey',
                    width: width,
                    height: height,
                    borderWidth: 1,
                    borderColor: 'transparent'
                }}
                onShouldStartLoadWithRequest={event => {
                    console.log('onShouldStartLoadWithRequest', event);
                    return true;
                }}
            />
        </View>
    );
}
