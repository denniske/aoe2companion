import React, {useState} from 'react';
import {Linking, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Constants from 'expo-constants';
import {useLinkTo} from '@react-navigation/native';
import {Button} from "react-native-paper";
import {appStyles} from "./styles";
import {MyText} from "./components/my-text";
import {setUpdateManifest, setUpdateStoreManifest, useMutate} from "../redux/reducer";
import {doCheckForStoreUpdate, doCheckForUpdateAsync} from "../service/update";


export default function AboutPage() {
    const linkTo = useLinkTo();
    const [state, setState] = useState('');
    const mutate = useMutate();

    const checkForUpdate = async () => {
        setState('checkingForUpdate');
        const update = await doCheckForUpdateAsync();
        if (update.isAvailable) {
            mutate(setUpdateManifest(update.manifest));
            setState('checked');
            return;
        }
        const storeUpdate = await doCheckForStoreUpdate();
        if (storeUpdate) {
            mutate(setUpdateStoreManifest(storeUpdate));
            setState('checked');
            return;
        }
        setState('checked');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <MyText style={styles.title}>AoE II Companion</MyText>

            <MyText style={styles.heading}>Created by</MyText>
            <MyText style={styles.content}>Dennis Keil</MyText>
            <MyText style={styles.content}>Niklas Ohlrogge</MyText>

            <MyText style={styles.heading}>Contributors</MyText>
            <MyText style={styles.content}>Johannes Berger</MyText>

            <MyText style={styles.heading}>Version</MyText>
            <MyText style={styles.content}>
                {Constants.manifest.releaseChannel || 'dev'}-{Constants.manifest.version}n{Constants.nativeAppVersion}+{Constants.nativeBuildVersion}
            </MyText>

            {
                state === '' &&
                <View>
                    <MyText/>
                    <Button onPress={checkForUpdate} mode="contained" dark={true}>Check for update</Button>
                </View>
            }
            {
                state === 'checkingForUpdate' &&
                <View>
                    <MyText/>
                    <MyText style={styles.content}>Checking for update...</MyText>
                </View>
            }

            <MyText style={styles.heading}>Source</MyText>

            <View style={styles.row}>
                <MyText style={styles.content}>Stats from </MyText>
                <TouchableOpacity onPress={() => Linking.openURL('https://aoe2.net')}>
                    <MyText style={appStyles.link}>aoe2.net</MyText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <MyText style={styles.content}>Game data from </MyText>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/SiegeEngineers/aoe2techtree')}>
                    <MyText style={appStyles.link}>aoe2techtree</MyText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <MyText style={styles.content}>Game data from </MyText>
                <TouchableOpacity onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>
                    <MyText style={appStyles.link}>Age of Empires II Wiki</MyText>
                </TouchableOpacity>
                <MyText style={styles.content}> at </MyText>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.fandom.com/')}>
                    <MyText style={appStyles.link}>Fandom</MyText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <MyText style={styles.content}>Flag Icons from </MyText>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/madebybowtie/FlagKit')}>
                    <MyText style={appStyles.link}>FlagKit</MyText>
                </TouchableOpacity>
            </View>

            <MyText style={styles.heading}>Legal</MyText>
            <MyText/>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => linkTo('/privacy')}>
                    <MyText style={appStyles.link}>Privacy Policy</MyText>
                </TouchableOpacity>
            </View>

            <View style={styles.expanded}/>

            <MyText/>
            <MyText/>

            <MyText style={styles.textJustify}>
                This app was created under Microsoft's "
                <MyText style={[styles.textJustify, appStyles.link]} onPress={() => {Linking.openURL('https://www.xbox.com/en-us/developers/rules')}}>
                Game Content Usage Rules
                </MyText>
                " using assets from Age of Empires II.
                This app is not affiliated with or endorsed by Microsoft Corporation. Age
                of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                registered trademarks of Microsoft Corporation in the U.S. and other countries.
            </MyText>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
    },
    textJustify: {
        textAlign: 'justify',
        fontSize: 12,
    },
    expanded: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    buttonRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: "flex-end",
        // backgroundColor: 'red',
    },
    button: {
        marginLeft: 10,
    },
    container: {
        minHeight: '100%',
        alignItems: 'center',
        padding: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 0,
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});
