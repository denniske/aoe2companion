import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {DarkMode, setConfig, useMutate, useSelector} from "../redux/reducer";
import {capitalize} from "lodash-es";
import {saveConfigToStorage} from "../service/storage";
import Picker from "./components/picker";
import {ITheme, makeVariants, useTheme} from "../theming";
import { Checkbox } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {appVariants} from "../styles";


export default function SettingsPage() {
    const styles = useTheme(variants);
    const mutate = useMutate();
    const config = useSelector(state => state.config);
    const navigation = useNavigation();
    const appStyles = useTheme(appVariants);

    const values: DarkMode[] = [
        'light',
        'dark',
        'system',
    ];

    const setDarkMode = async (darkMode: any) => {
        const newConfig = {
            ...config,
            darkMode: darkMode.toLowerCase(),
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    const setPushNotificationsEnabled = async (pushNotificationsEnabled: any) => {
        const newConfig = {
            ...config,
            pushNotificationsEnabled,
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Dark Mode</MyText>
                    <MyText style={styles.small}>(except build order guides)</MyText>
                </View>
                <View style={styles.cellValue}>
                    <Picker value={config.darkMode} values={values} formatter={capitalize} onSelect={setDarkMode}/>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Push notifications</MyText>
                    <MyText style={styles.small}>Receive push notifications when a player you are following starts a game.</MyText>
                </View>
                <View style={styles.cellValueRow}>
                    <Checkbox.Android
                        status={config.pushNotificationsEnabled ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setPushNotificationsEnabled(!config.pushNotificationsEnabled);
                        }}
                    />
                    {
                        config.pushNotificationsEnabled &&
                        <MyText style={appStyles.link} onPress={() => navigation.navigate('Push')}>Troubleshoot</MyText>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

const padding = 5;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        cellName: {
            padding: padding,
            flex: 1,
        },
        cellValue: {
            padding: padding,
            flex: 1,
        },
        cellValueRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: padding,
            flex: 1,
        },
        row: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        container: {
            minHeight: '100%',
            alignItems: 'center',
            padding: 20,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

const variants = makeVariants(getStyles);
