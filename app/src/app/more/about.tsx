import React, { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import { Button } from '@app/components/button';
import { MyText } from '@app/view/components/my-text';
import { setUpdateManifest, setUpdateStoreManifest, useMutate } from '../../redux/reducer';
import { doCheckForStoreUpdate, doCheckForUpdateAsync } from '../../service/update';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import Space from '@app/view/components/space';
import { createStylesheet } from '../../theming-new';
import { openLink } from '../../helper/url';
import { appConfig } from '@nex/dataset';
import { channel, manifest, updateId, runtimeVersion } from 'expo-updates';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { useTranslation } from '@app/helper/translate';
import { getAppVersion } from '@app/api/util';

export default function AboutPage() {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const linkTo = useLinkTo();
    const [state, setState] = useState('');
    const [errorUpdate, setErrorUpdate] = useState('');
    const [errorStoreUpdate, setErrorStoreUpdate] = useState('');
    const [debugUpdate, setDebugUpdate] = useState('');
    const [debugStoreUpdate, setDebugStoreUpdate] = useState('');
    const [debugManifest, setDebugManifest] = useState('');
    const [versionClickCount, setVersionClickCount] = useState(0);
    const mutate = useMutate();

    const checkForUpdate = async () => {
        setState('checkingForUpdate');

        setErrorUpdate('');
        setErrorStoreUpdate('');

        try {
            const update = await doCheckForUpdateAsync();
            setDebugUpdate(JSON.stringify(update));

            if (update.isAvailable) {
                mutate(setUpdateManifest(update.manifest!));
                setState('');
                return;
            }
        } catch (e: any) {
            setState('');
            setErrorUpdate(e.toString());
        }

        try {
            const storeUpdate = await doCheckForStoreUpdate();
            setDebugStoreUpdate(JSON.stringify(storeUpdate));

            if (storeUpdate?.isAvailable) {
                mutate(setUpdateStoreManifest(storeUpdate));
                setState('');
                return;
            }
        } catch (e: any) {
            setState('');
            setErrorStoreUpdate(e.toString());
        }

        if (errorUpdate || errorStoreUpdate) {
            setState('');
        } else {
            setState('upToDate');
        }
    };

    const incrementVersionClickCount = () => {
        // setVersionClickCount(errorPageClickCount + 1);
        // if (errorPageClickCount > 5) {
        // navigation.navigate('Donation', { debug: true });
        // navigation.navigate('Error');
        // }

        try {
            // delete Constants.expoConfig?.assets;
            setDebugManifest(JSON.stringify(Constants.expoConfig || { empty: true }, null, 4));
        } catch (e) {}
    };

    const openAoe2CompanionInStore = async () => {
        if (Platform.OS === 'web') {
            window.open('https://aoe2companion.com', '_blank');
            return;
        }
        const storeUrl = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=com.aoe2companion',
            ios: 'itms-apps://apps.apple.com/app/id1518463195',
        });
        const url = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=com.aoe2companion',
            ios: 'https://apps.apple.com/app/id1518463195',
        });
        if (await Linking.canOpenURL(storeUrl!)) {
            await Linking.openURL(storeUrl!);
            return;
        }
        await Linking.openURL(url!);
    };

    const openAoe4CompanionInStore = async () => {
        if (Platform.OS === 'web') {
            window.open('https://www.aoe4companion.com', '_blank');
            return;
        }
        const storeUrl = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=com.aoe4companion',
            ios: 'itms-apps://apps.apple.com/app/id1601333682',
        });
        const url = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=com.aoe4companion',
            ios: 'https://apps.apple.com/app/id1601333682',
        });
        if (await Linking.canOpenURL(storeUrl!)) {
            await Linking.openURL(storeUrl!);
            return;
        }
        await Linking.openURL(url!);
    };

    const open59SecondsInStore = async () => {
        if (Platform.OS === 'web') {
            window.open('https://59seconds.app', '_blank');
            return;
        }
        const storeUrl = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=app.fiftynineseconds.game',
            ios: 'itms-apps://apps.apple.com/app/id1489505410',
        });
        const url = Platform.select({
            android: 'https://play.google.com/store/apps/details?id=app.fiftynineseconds.game',
            ios: 'https://apps.apple.com/app/id1489505410',
        });
        if (await Linking.canOpenURL(storeUrl!)) {
            await Linking.openURL(storeUrl!);
            return;
        }
        await Linking.openURL(url!);
    };

    // console.log('Constants.expoConfig2', JSON.stringify(Constants.expoConfig2, null, 2));

    return (
        <ScrollView contentContainerStyle="min-h-full items-center p-5">
            <Stack.Screen options={{ title: getTranslation('about.title') }} />

            <MyText style={styles.title}>{Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name}</MyText>

            <MyText style={styles.heading}>{getTranslation('about.heading.createdby')}</MyText>
            <MyText style={styles.content}>Dennis Keil</MyText>
            <MyText style={styles.content}>Niklas Ohlrogge</MyText>

            <MyText style={styles.heading}>{getTranslation('about.heading.contributors')}</MyText>
            <MyText style={styles.content}>Aftermath</MyText>
            <MyText style={styles.content}>Enver Arco</MyText>
            <MyText style={styles.content}>FifthSense</MyText>
            <MyText style={styles.content}>Jeremy Keeler</MyText>
            <MyText style={styles.content}>Johannes Berger</MyText>
            <MyText style={styles.content}>Noah Brandyberry</MyText>
            <MyText style={styles.content}>Subbramanian Lakshmanan</MyText>

            <MyText style={styles.heading}>{getTranslation('about.heading.supporters')}</MyText>
            <MyText style={styles.content}>Akita_AoE</MyText>
            <MyText style={styles.content}>Ak-guy</MyText>
            <MyText style={styles.content}>AnziehenOnMe</MyText>
            <MyText style={styles.content}>Amberk</MyText>
            <MyText style={styles.content}>Andreas Teppe</MyText>
            <MyText style={styles.content}>axør</MyText>
            <MyText style={styles.content}>BananaBenito</MyText>
            <MyText style={styles.content}>Chillingsith</MyText>
            <MyText style={styles.content}>Christian Jimenez</MyText>
            <MyText style={styles.content}>Colin</MyText>
            <MyText style={styles.content}>Darkwest</MyText>
            <MyText style={styles.content}>ddk_deepak</MyText>
            <MyText style={styles.content}>Dr. Bounty</MyText>
            <MyText style={styles.content}>Dumb Ian</MyText>
            <MyText style={styles.content}>edvorg</MyText>
            <MyText style={styles.content}>EhBahSuper</MyText>
            <MyText style={styles.content}>El Alejandro campeador</MyText>
            <MyText style={styles.content}>elite4seth</MyText>
            <MyText style={styles.content}>eltrevador</MyText>
            <MyText style={styles.content}>Fabian Riebe</MyText>
            <MyText style={styles.content}>Freddy Rayes</MyText>
            <MyText style={styles.content}>Gareth Deacon'</MyText>
            <MyText style={styles.content}>|GZ| tAMe</MyText>
            <MyText style={styles.content}>Hans</MyText>
            <MyText style={styles.content}>Hestia</MyText>
            <MyText style={styles.content}>Jannis V</MyText>
            <MyText style={styles.content}>John</MyText>
            <MyText style={styles.content}>Jolann</MyText>
            <MyText style={styles.content}>Jonas</MyText>
            <MyText style={styles.content}>JJ_Ronda</MyText>
            <MyText style={styles.content}>Kloakan</MyText>
            <MyText style={styles.content}>kobukguille</MyText>
            <MyText style={styles.content}>leo</MyText>
            <MyText style={styles.content}>LiterallyPicasso</MyText>
            <MyText style={styles.content}>Lorenz Wimmer</MyText>
            <MyText style={styles.content}>Lukas</MyText>
            <MyText style={styles.content}>Lucas Clement</MyText>
            <MyText style={styles.content}>Maritos</MyText>
            <MyText style={styles.content}>Markus</MyText>
            <MyText style={styles.content}>Martin</MyText>
            <MyText style={styles.content}>Maxifruité</MyText>
            <MyText style={styles.content}>Maximilian Moschner</MyText>
            <MyText style={styles.content}>maxkorpinen</MyText>
            <MyText style={styles.content}>Mikael Laukkanen</MyText>
            <MyText style={styles.content}>moleMTL</MyText>
            <MyText style={styles.content}>momobo96</MyText>
            <MyText style={styles.content}>Mrandreagalassi</MyText>
            <MyText style={styles.content}>Noel</MyText>
            <MyText style={styles.content}>Noorulhuda Paleja</MyText>
            <MyText style={styles.content}>Pedro Bessone Bessone Tepedino</MyText>
            <MyText style={styles.content}>Pikmans030</MyText>
            <MyText style={styles.content}>pseudovictor</MyText>
            <MyText style={styles.content}>Radu</MyText>
            <MyText style={styles.content}>Ray</MyText>
            <MyText style={styles.content}>Riccardo Pilotti</MyText>
            <MyText style={styles.content}>Ron</MyText>
            <MyText style={styles.content}>Samuel Monarrez</MyText>
            <MyText style={styles.content}>Sihing Mo</MyText>
            <MyText style={styles.content}>S1nglecut</MyText>
            <MyText style={styles.content}>Sebastian Janus</MyText>
            <MyText style={styles.content}>Sebastiaan Van Hoorebeke</MyText>
            <MyText style={styles.content}>Spirit Airlinez</MyText>
            <MyText style={styles.content}>Stormtrooper</MyText>
            <MyText style={styles.content}>The Lag Monster</MyText>
            <MyText style={styles.content}>Tom B</MyText>
            <MyText style={styles.content}>Triftransbar</MyText>
            <MyText style={styles.content}>Ultima Gaina</MyText>
            <MyText style={styles.content}>Vianney</MyText>
            <MyText style={styles.content}>Zachary Bird</MyText>
            <MyText style={styles.content}>@compumaster</MyText>
            <MyText style={styles.content}>@cooljoe</MyText>
            <MyText style={styles.content}>@gloorfindel</MyText>
            <MyText style={styles.content}>@hend0s</MyText>
            <MyText style={styles.content}>@qotile</MyText>
            <MyText style={styles.content}>@wired14</MyText>
            <MyText style={styles.content2}>+ {getTranslation('about.anonymoussupporters')}</MyText>

            <MyText style={styles.heading}>{getTranslation('about.heading.version')}</MyText>
            <TouchableOpacity onPress={incrementVersionClickCount}>
                <MyText style={styles.content}>
                    {channel || 'dev'} {getAppVersion()} (
                    {runtimeVersion || 'dev'})
                </MyText>
                <MyText style={styles.content}>
                    n{nativeApplicationVersion}+{nativeBuildVersion}
                </MyText>
            </TouchableOpacity>

            {updateId && <MyText style={styles.content}>{updateId}</MyText>}

            {/*<MyText style={styles.content}>{(Constants.expoConfig2?.metadata as any)?.branchName || 'dev'}</MyText>*/}
            {/*<MyText style={styles.content}>{(Constants.expoConfig2?.metadata as any)?.updateGroup || 'dev'}</MyText>*/}

            {Platform.OS === 'web' && state === '' && (
                <View>
                    <Space />
                    <Button onPress={checkForUpdate}>
                        {getTranslation('about.update.checkforupdate')}
                    </Button>
                </View>
            )}
            {state === 'checkingForUpdate' && (
                <View>
                    <Space />
                    <MyText style={styles.content}>{getTranslation('about.update.checkingforupdate')}</MyText>
                </View>
            )}
            {state === 'upToDate' && (
                <View>
                    <Space />
                    <MyText style={styles.content}>{getTranslation('about.update.uptodate')}</MyText>
                </View>
            )}

            {errorUpdate?.length > 0 && (
                <>
                    <MyText style={styles.heading}>Error Update</MyText>
                    <MyText style={styles.content}>{errorUpdate}</MyText>
                </>
            )}
            {errorStoreUpdate?.length > 0 && (
                <>
                    <MyText style={styles.heading}>Error Store Update</MyText>
                    <MyText style={styles.content}>{errorStoreUpdate}</MyText>
                </>
            )}
            {debugUpdate?.length > 0 && (
                <>
                    <MyText style={styles.heading}>Debug Update</MyText>
                    <MyText style={styles.content}>{debugUpdate}</MyText>
                </>
            )}
            {debugStoreUpdate?.length > 0 && (
                <>
                    <MyText style={styles.heading}>Debug Store Update</MyText>
                    <MyText style={styles.content}>{debugStoreUpdate}</MyText>
                </>
            )}

            {debugManifest?.length > 0 && (
                <>
                    <MyText style={styles.heading}>Debug Manifest</MyText>
                    <MyText style={styles.content}>{debugManifest}</MyText>
                </>
            )}

            <MyText style={styles.heading}>{getTranslation('about.heading.source')}</MyText>

            {appConfig.game === 'aoe2de' && (
                <>
                    <View style={styles.row}>
                        <MyText style={styles.content}>Game data from </MyText>
                        <TouchableOpacity onPress={() => openLink('https://github.com/SiegeEngineers/aoe2techtree')}>
                            <MyText style={appStyles.link}>aoe2techtree</MyText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <MyText style={styles.content}>Player info from </MyText>
                        <TouchableOpacity onPress={() => openLink('https://github.com/SiegeEngineers/aoc-reference-data')}>
                            <MyText style={appStyles.link}>aoc-reference-data</MyText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <MyText style={styles.content}>Game data from </MyText>
                        <TouchableOpacity onPress={() => openLink('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>
                            <MyText style={appStyles.link}>Age of Empires II Wiki</MyText>
                        </TouchableOpacity>
                        <MyText style={styles.content}> at </MyText>
                        <TouchableOpacity onPress={() => openLink('https://www.fandom.com/')}>
                            <MyText style={appStyles.link}>Fandom</MyText>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {appConfig.game === 'aoe4' && (
                <>
                    <View style={styles.row}>
                        <MyText style={styles.content}>Match data from </MyText>
                        <TouchableOpacity onPress={() => openLink('https://aoe4world.com/')}>
                            <MyText style={appStyles.link}>aoe4world.com</MyText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <MyText style={styles.content}>Game data from </MyText>
                        <TouchableOpacity onPress={() => openLink('https://ageofempires.fandom.com/wiki/Age_of_Empires_IV:Portal')}>
                            <MyText style={appStyles.link}>Age of Empires IV Wiki</MyText>
                        </TouchableOpacity>
                        <MyText style={styles.content}> at </MyText>
                        <TouchableOpacity onPress={() => openLink('https://www.fandom.com/')}>
                            <MyText style={appStyles.link}>Fandom</MyText>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <MyText style={styles.heading}>Checkout my other apps</MyText>

            {appConfig.game === 'aoe4' ? (
                <View style={styles.row}>
                    <MyText style={styles.content}> </MyText>
                    <TouchableOpacity onPress={openAoe2CompanionInStore}>
                        <MyText style={appStyles.link}>AoE II Companion</MyText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.row}>
                    <MyText style={styles.content}> </MyText>
                    <TouchableOpacity onPress={openAoe4CompanionInStore}>
                        <MyText style={appStyles.link}>AoE IV Companion</MyText>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.row}>
                <MyText style={styles.content}> </MyText>
                <TouchableOpacity onPress={open59SecondsInStore}>
                    <MyText style={appStyles.link}>59seconds - online charade</MyText>
                </TouchableOpacity>
            </View>

            <MyText style={styles.heading}>Legal</MyText>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => linkTo('/privacy')}>
                    <MyText style={appStyles.link}>Privacy Policy</MyText>
                </TouchableOpacity>
            </View>

            <View style={styles.expanded} />

            <Space />
            <Space />

            {appConfig.game === 'aoe2de' && (
                <MyText style={styles.textJustify}>
                    This app was created under Microsoft's "
                    <MyText
                        style={[styles.textJustify, appStyles.link]}
                        onPress={() => {
                            openLink('https://www.xbox.com/en-us/developers/rules');
                        }}
                    >
                        Game Content Usage Rules
                    </MyText>
                    " using assets from Age of Empires II. This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD
                    and Age of Empires II: Definitive Edition are trademarks or registered trademarks of Microsoft Corporation in the U.S. and other
                    countries.
                </MyText>
            )}
            {appConfig.game === 'aoe4' && (
                <MyText style={styles.textJustify}>
                    This app was created under Microsoft's "
                    <MyText
                        style={[styles.textJustify, appStyles.link]}
                        onPress={() => {
                            openLink('https://www.xbox.com/en-us/developers/rules');
                        }}
                    >
                        Game Content Usage Rules
                    </MyText>
                    " using assets from Age of Empires IV. This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires IV is
                    a trademark or registered trademark of Microsoft Corporation in the U.S. and other countries. 1
                </MyText>
            )}
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
        content2: {
            color: theme.textNoteColor,
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
            justifyContent: 'flex-end',
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
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            margin: 0,
            borderRadius: 5,
            padding: 15,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    })
);
