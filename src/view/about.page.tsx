import React, {useEffect, useState} from 'react';
import {
    Linking, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import Constants from 'expo-constants';
import {useLinkTo} from '@react-navigation/native';
import {checkForUpdateAsync, fetchUpdateAsync, reloadAsync} from "expo-updates";
import {Button} from "react-native-paper";
import {Manifest} from "expo-updates/build/Updates.types";

export default function AboutPage() {
    const linkTo = useLinkTo();
    const [updateManifest, setUpdateManifest] = useState<Manifest>();
    const [updating, setUpdating] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    const init = async () => {
        const update = await checkForUpdateAsync();
        if (update.isAvailable) {
            setUpdateManifest(update.manifest);
        }
    };

    useEffect(() => {
        if (!__DEV__) {
            init();
        }
    });

    const fetchUpdate = async () => {
        setUpdating(true);
        await fetchUpdateAsync();
        setUpdateModalVisible(true);
        setUpdating(false);
    };

    const update = async () => {
        await reloadAsync();
    };

    const closeUpdateModal = () => {
        setUpdateModalVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AoE II Companion</Text>

            <Text style={styles.heading}>Created by</Text>
            <Text style={styles.content}>Dennis Keil</Text>
            <Text style={styles.content}>Niklas Ohlrogge</Text>

            <Text style={styles.heading}>Contributors</Text>
            <Text style={styles.content}>Johannes Berger</Text>

            <Text style={styles.heading}>Version</Text>
            <Text
                style={styles.content}>{Constants.manifest.releaseChannel || 'dev'}-{Constants.manifest.version}n{Constants.nativeAppVersion}+{Constants.nativeBuildVersion}</Text>

            {
                updateManifest &&
                <View>
                    <Text/>
                    <Button onPress={fetchUpdate} mode="contained" dark={true}>Update to {updateManifest.version}</Button>
                </View>
            }
            {
                updating &&
                <Text style={styles.content}>Loading Update...</Text>
            }
            <Modal animationType="none" transparent={true} visible={updateModalVisible}>
                <TouchableWithoutFeedback onPress={closeUpdateModal}>
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalView}>
                                <Text style={styles.content}>Do you want to restart now to apply the update?</Text>
                                <Text/>
                                <View style={styles.buttonRow}>
                                    <Button style={styles.button} onPress={closeUpdateModal} mode="outlined">Restart Later</Button>
                                    <Button style={styles.button} onPress={update} mode="contained" dark={true}>Restart</Button>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            <Text style={styles.heading}>Source</Text>

            <View style={styles.row}>
                <Text style={styles.content}>Stats from </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://aoe2.net')}>
                    <Text style={styles.link}>aoe2.net</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <Text style={styles.content}>Game data from </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/SiegeEngineers/aoe2techtree')}>
                    <Text style={styles.link}>aoe2techtree</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <Text style={styles.content}>Game data from </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>
                    <Text style={styles.link}>Age of Empires II Wiki</Text>
                </TouchableOpacity>
                <Text style={styles.content}> at </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.fandom.com/')}>
                    <Text style={styles.link}>Fandom</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <Text style={styles.content}>Flag Icons from </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/madebybowtie/FlagKit')}>
                    <Text style={styles.link}>FlagKit</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.heading}>Legal</Text>
            <Text/>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => linkTo('/privacy')}>
                    <Text style={styles.link}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.expanded}/>

            <Text/>
            <Text/>

            <Text style={styles.textJustify}>
                This app was created under Microsoft's "
                <Text style={styles.link} onPress={() => {Linking.openURL('https://www.xbox.com/en-us/developers/rules')}}>
                Game Content Usage Rules
                </Text>
                " using assets from Age of Empires II.
                This app is not affiliated with or endorsed by Microsoft Corporation. Age
                of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                registered trademarks of Microsoft Corporation in the U.S. and other countries.
            </Text>
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
        // backgroundColor: 'red',
        justifyContent: "flex-end",
    },
    button: {
        marginLeft: 10,
    },
    link: {
        color: '#397AF9',
    },
    container: {
        // flex: 1,
        minHeight: '100%',
        backgroundColor: 'white',
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
        backgroundColor: "white",
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
