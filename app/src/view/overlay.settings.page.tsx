import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {MyText} from "./components/my-text";
import {Button} from "react-native-paper";
import {useSelector} from "../redux/reducer";
import Space from "./components/space";
import {createStylesheet} from '../theming-new';
import {sendTestPushNotificationElectron} from '../api/following';
import {closeOverlayWindowAsync, getElectronPushToken, isAoeRunningAsync, showOverlayWindowAsync} from '../helper/electron';
import {sleep} from '@nex/data';


export default function OverlaySettingsPage() {
    const styles = useStyles();
    const [aoeDetectionStatus, setAoeDetectionStatus] = useState('');
    const [overlayStatus, setOverlayStatus] = useState('');
    const [pushToken, setPushToken] = useState<string>();
    const config = useSelector(state => state.config);

    const sendTestNotificaitonForOverlay = async () => {
        if (!pushToken) {
            setOverlayStatus('Error: Could not retrieve push token.');
            return;
        }
        await sendTestPushNotificationElectron(pushToken);
        setOverlayStatus('Sent overlay test notification.');
    };

    const showTestOverlay = async () => {
        showOverlayWindowAsync();
    };

    const closeTestOverlay = async () => {
        closeOverlayWindowAsync();
    };

    const checkAoeRunning = async () => {
        const isAoeRunning = await isAoeRunningAsync();
        setAoeDetectionStatus('Checking...');
        await sleep(2000);
        setAoeDetectionStatus(isAoeRunning ? 'AoE II DE is currently running.' : 'AoE II DE is currently not running.');
    };

    const fetchElectronPushToken = async () => {
        setPushToken(await getElectronPushToken());
    };

    useEffect(() => {
        fetchElectronPushToken();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <MyText>The overlay will only be displayed when the AoE II DE game is running. To verify this is working start the game and press the button below.</MyText>
            <Space/>
            <Button style={styles.button} mode="outlined" onPress={checkAoeRunning}>
                Check AoE detection
            </Button>
            <MyText>{aoeDetectionStatus}</MyText>

            <Space/>
            <Space/>

            {/*<Space/>*/}
            {/*<Button style={styles.button} mode="outlined" onPress={showTestOverlay}>*/}
            {/*    {'Show Overlay'}*/}
            {/*</Button>*/}
            {/*<Space/>*/}
            {/*<Space/>*/}

            <MyText>You can send a test notification. If the windows notification pops up, the overlay should show. You don't need to click on the notification.</MyText>
            <Space/>
            <Button style={styles.button} mode="outlined" onPress={sendTestNotificaitonForOverlay} disabled={!pushToken}>
                Send test notification for overlay
            </Button>
            <MyText>{overlayStatus}</MyText>
        </ScrollView>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    button: {
        marginVertical: 12,
    },
    note: {
        color: theme.textNoteColor,
        textAlign: 'center',
    },
}));
