import React, { useState } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useLinkTo } from '@react-navigation/native';
import { Button } from '@app/components/button';
import { MyText } from '@app/view/components/my-text';
import { setUpdateManifest, setUpdateStoreManifest, useMutate } from '../../redux/reducer';
import { doCheckForStoreUpdate, doCheckForUpdateAsync } from '../../service/update';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import Space from '@app/view/components/space';
import { openLink } from '../../helper/url';
import { appConfig } from '@nex/dataset';
import { channel, runtimeVersion, updateId } from 'expo-updates';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { useTranslation } from '@app/helper/translate';
import { getAppVersion } from '@app/api/util';
import { Text } from '@app/components/text';
import { ExpoUpdatesManifest } from 'expo-manifests';

export default function AboutPage() {
    const getTranslation = useTranslation();
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
                mutate(setUpdateManifest(update.manifest! as ExpoUpdatesManifest));
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
        <ScrollView contentContainerClassName="min-h-full items-center p-5 gap-y-6">
            <Stack.Screen options={{ title: getTranslation('about.title') }} />

            <Space />

            <Text variant="header">{Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name}</Text>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">{getTranslation('about.heading.createdby')}</Text>
                <MyText>Dennis Keil</MyText>
                <MyText>Niklas Ohlrogge</MyText>
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">{getTranslation('about.heading.contributors')}</Text>
                <MyText>Aftermath</MyText>
                <MyText>Enver Arco</MyText>
                <MyText>FifthSense</MyText>
                <MyText>Jeremy Keeler</MyText>
                <MyText>Johannes Berger</MyText>
                <MyText>Noah Brandyberry</MyText>
                <MyText>Subbramanian Lakshmanan</MyText>
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">{getTranslation('about.heading.supporters')}</Text>
                <MyText>Akita_AoE</MyText>
                <MyText>Ak-guy</MyText>
                <MyText>AnziehenOnMe</MyText>
                <MyText>Amberk</MyText>
                <MyText>Andreas Teppe</MyText>
                <MyText>axør</MyText>
                <MyText>BananaBenito</MyText>
                <MyText>Chillingsith</MyText>
                <MyText>Christian Jimenez</MyText>
                <MyText>Colin</MyText>
                <MyText>Darkwest</MyText>
                <MyText>ddk_deepak</MyText>
                <MyText>Dr. Bounty</MyText>
                <MyText>Dumb Ian</MyText>
                <MyText>edvorg</MyText>
                <MyText>EhBahSuper</MyText>
                <MyText>El Alejandro campeador</MyText>
                <MyText>elite4seth</MyText>
                <MyText>eltrevador</MyText>
                <MyText>Fabian Riebe</MyText>
                <MyText>Freddy Rayes</MyText>
                <MyText>Gareth Deacon'</MyText>
                <MyText>|GZ| tAMe</MyText>
                <MyText>Hans</MyText>
                <MyText>Hestia</MyText>
                <MyText>Jannis V</MyText>
                <MyText>John</MyText>
                <MyText>Jolann</MyText>
                <MyText>Jonas</MyText>
                <MyText>JJ_Ronda</MyText>
                <MyText>Kloakan</MyText>
                <MyText>kobukguille</MyText>
                <MyText>leo</MyText>
                <MyText>LiterallyPicasso</MyText>
                <MyText>Lorenz Wimmer</MyText>
                <MyText>Lukas</MyText>
                <MyText>Lucas Clement</MyText>
                <MyText>Maritos</MyText>
                <MyText>Markus</MyText>
                <MyText>Martin</MyText>
                <MyText>Maxifruité</MyText>
                <MyText>Maximilian Moschner</MyText>
                <MyText>maxkorpinen</MyText>
                <MyText>Mikael Laukkanen</MyText>
                <MyText>moleMTL</MyText>
                <MyText>momobo96</MyText>
                <MyText>Mrandreagalassi</MyText>
                <MyText>Noel</MyText>
                <MyText>Noorulhuda Paleja</MyText>
                <MyText>Pedro Bessone Bessone Tepedino</MyText>
                <MyText>Pikmans030</MyText>
                <MyText>pseudovictor</MyText>
                <MyText>Radu</MyText>
                <MyText>Ray</MyText>
                <MyText>Riccardo Pilotti</MyText>
                <MyText>Ron</MyText>
                <MyText>Samuel Monarrez</MyText>
                <MyText>Sihing Mo</MyText>
                <MyText>S1nglecut</MyText>
                <MyText>Sebastian Janus</MyText>
                <MyText>Sebastiaan Van Hoorebeke</MyText>
                <MyText>Spirit Airlinez</MyText>
                <MyText>Stormtrooper</MyText>
                <MyText>The Lag Monster</MyText>
                <MyText>Tom B</MyText>
                <MyText>Triftransbar</MyText>
                <MyText>Ultima Gaina</MyText>
                <MyText>Vianney</MyText>
                <MyText>Zachary Bird</MyText>
                <MyText>@compumaster</MyText>
                <MyText>@cooljoe</MyText>
                <MyText>@gloorfindel</MyText>
                <MyText>@hend0s</MyText>
                <MyText>@qotile</MyText>
                <MyText>@wired14</MyText>
                <MyText>+ {getTranslation('about.anonymoussupporters')}</MyText>
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">{getTranslation('about.heading.version')}</Text>
                <TouchableOpacity onPress={incrementVersionClickCount}>
                    <MyText>
                        {channel || 'dev'} {getAppVersion()} (
                        {runtimeVersion || 'dev'})
                    </MyText>
                    <MyText>
                        n{nativeApplicationVersion}+{nativeBuildVersion}
                    </MyText>
                </TouchableOpacity>

                {updateId && <MyText>{updateId}</MyText>}

                {/*<MyText>{(Constants.expoConfig2?.metadata as any)?.branchName || 'dev'}</MyText>*/}
                {/*<MyText>{(Constants.expoConfig2?.metadata as any)?.updateGroup || 'dev'}</MyText>*/}

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
                        <MyText>{getTranslation('about.update.checkingforupdate')}</MyText>
                    </View>
                )}
                {state === 'upToDate' && (
                    <View>
                        <Space />
                        <MyText>{getTranslation('about.update.uptodate')}</MyText>
                    </View>
                )}

                {errorUpdate?.length > 0 && (
                    <>
                        <Text variant="header-xs">Error Update</Text>
                        <MyText>{errorUpdate}</MyText>
                    </>
                )}
                {errorStoreUpdate?.length > 0 && (
                    <>
                        <Text variant="header-xs">Error Store Update</Text>
                        <MyText>{errorStoreUpdate}</MyText>
                    </>
                )}
                {debugUpdate?.length > 0 && (
                    <>
                        <Text variant="header-xs">Debug Update</Text>
                        <MyText>{debugUpdate}</MyText>
                    </>
                )}
                {debugStoreUpdate?.length > 0 && (
                    <>
                        <Text variant="header-xs">Debug Store Update</Text>
                        <MyText>{debugStoreUpdate}</MyText>
                    </>
                )}

                {debugManifest?.length > 0 && (
                    <>
                        <Text variant="header-xs">Debug Manifest</Text>
                        <MyText>{debugManifest}</MyText>
                    </>
                )}
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">{getTranslation('about.heading.source')}</Text>

                {appConfig.game === 'aoe2' && (
                    <>
                        <View className="flex-row">
                            <MyText>Game data from </MyText>
                            <TouchableOpacity onPress={() => openLink('https://github.com/SiegeEngineers/aoe2techtree')}>
                                <MyText style={appStyles.link}>aoe2techtree</MyText>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row">
                            <MyText>Player info from </MyText>
                            <TouchableOpacity onPress={() => openLink('https://github.com/SiegeEngineers/aoc-reference-data')}>
                                <MyText style={appStyles.link}>aoc-reference-data</MyText>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row">
                            <MyText>Game data from </MyText>
                            <TouchableOpacity onPress={() => openLink('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>
                                <MyText style={appStyles.link}>Age of Empires II Wiki</MyText>
                            </TouchableOpacity>
                            <MyText> at </MyText>
                            <TouchableOpacity onPress={() => openLink('https://www.fandom.com/')}>
                                <MyText style={appStyles.link}>Fandom</MyText>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                {appConfig.game === 'aoe4' && (
                    <>
                        <View className="flex-row">
                            <MyText>Match data from </MyText>
                            <TouchableOpacity onPress={() => openLink('https://aoe4world.com/')}>
                                <MyText style={appStyles.link}>aoe4world.com</MyText>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row">
                            <MyText>Game data from </MyText>
                            <TouchableOpacity onPress={() => openLink('https://ageofempires.fandom.com/wiki/Age_of_Empires_IV:Portal')}>
                                <MyText style={appStyles.link}>Age of Empires IV Wiki</MyText>
                            </TouchableOpacity>
                            <MyText> at </MyText>
                            <TouchableOpacity onPress={() => openLink('https://www.fandom.com/')}>
                                <MyText style={appStyles.link}>Fandom</MyText>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">Checkout my other apps</Text>

                {appConfig.game === 'aoe4' ? (
                    <View className="flex-row">
                        <MyText> </MyText>
                        <TouchableOpacity onPress={openAoe2CompanionInStore}>
                            <MyText style={appStyles.link}>AoE II Companion</MyText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex-row">
                        <MyText> </MyText>
                        <TouchableOpacity onPress={openAoe4CompanionInStore}>
                            <MyText style={appStyles.link}>AoE IV Companion</MyText>
                        </TouchableOpacity>
                    </View>
                )}

                <View className="flex-row">
                    <MyText> </MyText>
                    <TouchableOpacity onPress={open59SecondsInStore}>
                        <MyText style={appStyles.link}>59seconds - online charade</MyText>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="items-center gap-y-1">
                <Text variant="header-xs">Legal</Text>
                <View className="flex-row">
                    <TouchableOpacity onPress={() => linkTo('/privacy')}>
                        <MyText style={appStyles.link}>Privacy Policy</MyText>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1" />

            <Space />

            {appConfig.game === 'aoe2' && (
                <Text variant="body-sm" className="text-justify">
                    This app was created under Microsoft's "
                    <Text
                        variant="body-sm"
                        color="link"
                        onPress={() => {
                            openLink('https://www.xbox.com/en-us/developers/rules');
                        }}
                    >
                        Game Content Usage Rules
                    </Text>
                    " using assets from Age of Empires II. This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD
                    and Age of Empires II: Definitive Edition are trademarks or registered trademarks of Microsoft Corporation in the U.S. and other
                    countries.
                </Text>
            )}
            {appConfig.game === 'aoe4' && (
                <Text variant="body-sm" className="text-justify">
                    This app was created under Microsoft's "
                    <Text
                        variant="body-sm"
                        color="link"
                        onPress={() => {
                            openLink('https://www.xbox.com/en-us/developers/rules');
                        }}
                    >
                        Game Content Usage Rules
                    </Text>
                    " using assets from Age of Empires IV. This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires IV is
                    a trademark or registered trademark of Microsoft Corporation in the U.S. and other countries. 1
                </Text>
            )}
        </ScrollView>
    );
}
