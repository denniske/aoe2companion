import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { WebView } from 'react-native-webview';
import {BackHandler, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image';
import {activateKeepAwake, activateKeepAwakeAsync, deactivateKeepAwake} from "expo-keep-awake";
import { setPrefValue, useMutate, useSelector} from "../redux/reducer";
import {useTheme} from '../theming';
import {appVariants} from '../styles';
import {MyText} from './components/my-text';
import {FontAwesome5} from "@expo/vector-icons";
import {createStylesheet} from '../theming-new';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {openLink} from "../helper/url";
import {RootStackParamList} from "../../App2";
import {saveCurrentPrefsToStorage} from "../service/storage";
import Picker from "./components/picker";
import {useLazyApi} from "../hooks/use-lazy-api";
import {fetchGuides, IGuide} from "../../../data/src/api/guides";


export function GuideTitle(props: any) {
    const appStyles = useTheme(appVariants);
    return (
        <TouchableOpacity onPress={() => openLink('https://buildorderguide.com')}>
            <MyText style={appStyles.link}>buildorderguide.com</MyText>
        </TouchableOpacity>
    );
}

export function GuideHeaderHome(props: any) {
    const styles = useStyles();
    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.actionLeft} onPress={props.onHomePressed}>
                <FontAwesome5 name="home" size={18} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
}

interface IGuideHeaderBookmarkProps {
    url: string;
    onBookmarkPressed: (guideId: string) => void,
    guides: IGuide[],
}

export function GuideHeaderBookmark(props: IGuideHeaderBookmarkProps) {
    const { url, onBookmarkPressed, guides } = props;
    const styles = useStyles();
    const match = /build\/(\w+)/g.exec(url);
    const guideId = match?.[1];
    const mutate = useMutate();

    const favorites = useSelector(state => state.prefs.guideFavorites) || [];

    const toggleFavorite = async () => {
        if (!guideId) return;
        const newFavorites = favorites.includes(guideId) ? favorites.filter(f => f !== guideId) : [...favorites, guideId];
        mutate(setPrefValue('guideFavorites', newFavorites));
        await saveCurrentPrefsToStorage();
    };

    if (match) {
        const bookmarkSolid = !guideId || favorites.includes(guideId);
        return (
            <View style={styles.menu}>
                <TouchableOpacity style={styles.actionRight} onPress={toggleFavorite}>
                    {
                        // <MyText>{guideId}</MyText>
                        <FontAwesome5 solid={bookmarkSolid} name="star" size={18} style={styles.icon} />
                    }
                </TouchableOpacity>
            </View>
        );
    }

    const favoriteList = favorites.length > 0 ? favorites : [''];

    const formatFavorite = (x: (string | null), inList?: boolean) => {
        if (guides) {
            return guides.find(g => g.id === x)?.title || x || 'No favorites yet';
        }
        return x || 'No favorites yet';
    };

    const onFavoriteSelected = (guideId: string) => {
        if (!guideId) return;
        onBookmarkPressed(guideId);
    };

    const icon = (x: any) => {
        if (guides) {
            const imageUrl = guides.find(g => g.id === x)?.imageURL;
            if (imageUrl) {
                return <Image style={styles.guideIcon} source={{uri: imageUrl}}/>;
            }
        }
        return null;
    };

    return (
        <View style={styles.menu}>
            <Picker
                style={styles.actionRightPicker}
                anchor={() => (
                    <FontAwesome5 solid="true" name="gratipay" size={18} style={styles.icon} />
                )}
                anchorStyle={styles.actionRightAnchor}
                itemHeight={40}
                textMinWidth={150}
                value={'never'}
                icon={icon}
                values={favoriteList}
                formatter={formatFavorite}
                onSelect={onFavoriteSelected}
            />
        </View>
    );
}

export default function GuidePage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Guide'>>();

    const baseUrl = `https://buildorderguide.com/?time=${new Date().getTime()}#`;
    // const baseUrl = `http://localhost:3000/?time=${new Date().getTime()}#`;

    if (Platform.OS === 'web') {
        const url = route.params?.build ? `${baseUrl}/build/${route.params.build}` : baseUrl;
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
    const [url, setUrl] = useState('https://buildorderguide.com');
    const webViewRef = useRef<WebView>();

    const guides = useLazyApi({}, fetchGuides);

    useEffect(() => {
        guides.reload();
    }, []);

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <GuideHeaderBookmark url={url} guides={guides.data} onBookmarkPressed={(guideId: string) => {
                const newURL = `${baseUrl}/build/${guideId}/0`;
                const redirectTo = 'window.location = "' + newURL + '"';
                webViewRef.current!.injectJavaScript(redirectTo);
            }} />,
            headerLeft: () => <GuideHeaderHome onHomePressed={() => {
                const redirectTo = 'window.location = "' + baseUrl + '"';
                webViewRef.current!.injectJavaScript(redirectTo);
            }} />,
        });
    }, [navigation, canGoBack, url, guides.data]);

    useEffect(() => {
        if (config.preventScreenLockOnGuidePage) {
            activateKeepAwakeAsync('guide-page');
        }
        return () => { deactivateKeepAwake('guide-page'); }
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

                    onNavigationStateChange={(navState) => {
                        setUrl(navState.url);
                        setCanGoBack(navState.canGoBack);
                    }}

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
    menu: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 8,
        // backgroundColor: 'yellow',
    },
    actionLeft: {
        // backgroundColor: 'purple',
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionRight: {
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionRightPicker: {
        width: 35,
    },
    actionRightAnchor: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: theme.textColor,
    },
    guideIcon: {
        width: 21,
        height: 15,
        marginRight: 10,
    },
}));
