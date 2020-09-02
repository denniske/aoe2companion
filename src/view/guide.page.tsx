import React, {useState} from 'react';
import { WebView } from 'react-native-webview';
import { Platform, View} from 'react-native';

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

    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(400);

    return (
        <View
            style={{minHeight: 300, flex: 1, overflow: 'hidden'}}
            onLayout={({nativeEvent: {layout}}: any) => {
                console.log('layout', layout);
                setWidth(layout.width);
                setHeight(layout.height);
            }}
        >
            <WebView
                    allowUniversalAccessFromFileURLs
                    mixedContentMode = "always"
                    originWhitelist = {['*']}

                    source={{uri: 'https://buildorderguide.com/#/'}}
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
