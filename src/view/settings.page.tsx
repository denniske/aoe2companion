import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {DarkMode, setConfig, useMutate, useSelector} from "../redux/reducer";
import {capitalize} from "lodash-es";
import {saveConfigToStorage} from "../service/storage";
import Picker from "./components/picker";
import {ITheme, makeVariants, useTheme} from "../theming";


export default function SettingsPage() {
    const styles = useTheme(variants);
    const mutate = useMutate();
    const config = useSelector(state => state.config);

    const values: DarkMode[] = [
        'light',
        'dark',
        // 'auto',
    ];

    const nav = async (str: any) => {
        const newConfig = {
            ...config,
            darkMode: str.toLowerCase(),
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
                    <Picker value={config.darkMode} values={values} formatter={capitalize} onSelect={nav}/>
                </View>
            </View>

            {/*<View style={styles.row}>*/}
            {/*    <View style={styles.cellName}>*/}
            {/*        <MyText>Dark Mode</MyText>*/}
            {/*    </View>*/}
            {/*    <View style={styles.cellValue}>*/}
            {/*        <Checkbox.Android*/}
            {/*            status={checked ? 'checked' : 'unchecked'}*/}
            {/*            onPress={() => {*/}
            {/*                mutate(setDarkMode(checked ? 'dark' : 'light'));*/}
            {/*                setChecked(!checked);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </View>*/}
            {/*</View>*/}
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
