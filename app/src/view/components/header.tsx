import { Dimensions, Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { RootStackParamList } from '../../../App2';
import { getRootNavigation } from '../../service/navigation';
import { MyText } from './my-text';
import { iconHeight, iconWidth } from '@nex/data';
import { setConfig, setInitialState, useMutate, useSelector } from '../../redux/reducer';
import { useTheme } from '../../theming';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { appVariants } from '../../styles';
import { clearCache } from '../../redux/cache';
import { IConfig, saveConfigToStorage } from '../../service/storage';
import { reloadAsync } from 'expo-updates';
import { createStylesheet } from '../../theming-new';
import { closeAppWindowAsync, isElectron } from '../../helper/electron';
import Constants from 'expo-constants';
import { appIconData } from '@nex/dataset';
import { sleep } from '@nex/data';
// import {captureImage} from "../../ci/capture";
// let imageNumber = 0;

export default function Header() {
    const appStyles = useTheme(appVariants);
    const styles = useStyles();
    const [capturing, setCapturing] = useState(false);
    const mutate = useMutate();
    const config = useSelector((state) => state.config);
    const state = useSelector((state) => state);

    const capture = async () => {
        // console.log('CAPTURE');
        // setCapturing(true);
        // await sleep(500);
        // const os = Platform.OS;
        // const width = Math.round(Dimensions.get('window').width);
        // await captureImage(`${os}-${width}-${imageNumber++}`);
        // setCapturing(false);
    };

    const nav = async (route: keyof RootStackParamList) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{ name: route }],
        });
    };

    const toggleDarkMode = async () => {
        const newConfig: IConfig = {
            ...config,
            darkMode: config.darkMode === 'light' ? 'dark' : 'light',
        };
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const resetState = () => {
        clearCache();
        console.clear();
        mutate(setInitialState());
    };

    const restart = async () => {
        await reloadAsync();
    };

    return (
        <View style={styles.header}>
            {__DEV__ && !capturing && <MyText>{(JSON.stringify(state).length / 1000).toFixed()} KB</MyText>}
            {__DEV__ && !capturing && Platform.OS !== 'web' && (
                <TouchableOpacity onPress={toggleDarkMode}>
                    <FontAwesome5 style={styles.menuButton} name="lightbulb" color="#666" size={18} />
                </TouchableOpacity>
            )}
            {__DEV__ && !capturing && (
                <TouchableOpacity onPress={capture}>
                    <FontAwesome style={styles.menuButton} name="camera" color="#666" size={18} />
                </TouchableOpacity>
            )}
            {__DEV__ && !capturing && (
                <TouchableOpacity onPress={resetState}>
                    <FontAwesome style={styles.menuButton} name="refresh" color="#666" size={18} />
                </TouchableOpacity>
            )}
            {__DEV__ && !capturing && (
                <TouchableOpacity onPress={restart}>
                    <FontAwesome5 style={styles.menuButton} name="power-off" color="#666" size={18} />
                </TouchableOpacity>
            )}

            {isElectron() && (
                <TouchableOpacity onPress={closeAppWindowAsync}>
                    <FontAwesome5 style={styles.menuButton} name="times" color="#666" size={18} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        websiteLink: {
            ...(Platform.OS === 'web' ? { '-webkit-app-region': 'no-drag' } : {}),
        } as ViewStyle,
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
        },
        menuButton: {
            ...(Platform.OS === 'web' ? { '-webkit-app-region': 'no-drag' } : {}),
            // backgroundColor: 'blue',
            margin: 0,
            marginHorizontal: 10,
        },
        menuButtonDots: {
            // backgroundColor: 'blue',
            margin: 0,
            marginLeft: 0,
        },
        header: {
            // backgroundColor: 'blue',
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            marginRight: 5,
            width: iconWidth,
            height: iconHeight,
        },
        container: {
            ...(Platform.OS === 'web' ? { '-webkit-app-region': 'drag' } : {}),
            backgroundColor: theme.backgroundColor,
            flexDirection: 'row',
            // marginTop: Constants.statusBarHeight,
            height: 36,
            paddingTop: Platform.OS === 'ios' ? 0 : 6,
            paddingBottom: Platform.OS === 'ios' ? 4 : 0,
            paddingLeft: 16,
            paddingRight: 12, // because of three dots icon
        },
    })
);
