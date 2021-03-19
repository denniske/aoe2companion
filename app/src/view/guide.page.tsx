import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { WebView } from 'react-native-webview';
import {BackHandler, Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import {useSelector} from "../redux/reducer";
import {useTheme} from '../theming';
import {appVariants} from '../styles';
import {MyText} from './components/my-text';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStylesheet} from '../theming-new';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {openLink} from "../helper/url";
import {RootStackParamList} from "../../App";


export function GuideTitle(props: any) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    return (
        <TouchableOpacity onPress={() => openLink('https://buildorderguide.com')}>
            <MyText style={appStyles.link}>buildorderguide.com</MyText>
        </TouchableOpacity>
    );
}

export function GuideActions(props: any) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    return (
        <TouchableOpacity style={styles.action} onPress={props.onHomePressed}>
            {
                props.canGoBack &&
                <Icon name="arrow-circle-left" size={20} style={styles.icon} />
            }
        </TouchableOpacity>
    );
}

export default function GuidePage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Guide'>>();

    if (Platform.OS === 'web') {
        const baseUrl = `https://buildorderguide.com/?time=${new Date().getTime()}#`;
        const url = route.params?.build ? `${baseUrl}/build/${route.params.build}/0` : baseUrl;
        return (
                <iframe
                        id="guide-iframe"
                        style={{border: 'none', background: 'white'}}
                        height="100%"
                        src={url}
                >
                </iframe>
        );
    }

    const config = useSelector(state => state.config);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(400);
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef<WebView>();
    // const [url, setUrl] = useState('https://buildorderguide.com');

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <GuideActions onHomePressed={() => webViewRef.current!.goBack()} canGoBack={canGoBack} />, // setUrl(`https://buildorderguide.com?t=${Date.now()}`)
        });
    }, [navigation, canGoBack]);

    useEffect(() => {
        if (config.preventScreenLockOnGuidePage) {
            activateKeepAwake();
        }
        return () => deactivateKeepAwake();
    });

    useFocusEffect(useCallback(() => {
        const onHardwareBackPressed = () => {
            if (canGoBack) {
                webViewRef.current!.goBack();
            }
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', onHardwareBackPressed);
        return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPressed);
    }, [canGoBack]));

    // const onHardwareBackPressed = useCallback(() => {
    //     if (canGoBack) {
    //         webViewRef.current!.goBack();
    //     }
    //     return true;
    // }, [canGoBack]);
    //
    // useFocusEffect(() => {
    //     BackHandler.addEventListener('hardwareBackPress', onHardwareBackPressed);
    //     return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPressed);
    // });

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

                    ref={webViewRef as any}

                    onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}

                    source={{uri: 'https://buildorderguide.com'}}
                    scalesPageToFit={false}
                    style={{
                        minHeight: 200,
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

const useStyles = createStylesheet(theme => StyleSheet.create({
    action: {
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 17,
    },
    icon: {
        color: '#777',
    },
}));
