import {Linking, Platform} from "react-native";
import { showAlert } from '@app/helper/alert';


export function openLink(url: string) {
    if (!url) {
        console.log('Open Link: No URL provided');
        return;
    }
    if (Platform.OS === 'web') {
        window.open(url, '_blank');
    } else {
        Linking.openURL(url);
    }
}

export async function openLinkWithCheck(url: string) {
    if (!url) {
        console.log('Open Link: No URL provided');
        return;
    }
    if (Platform.OS === 'web') {
        window.open(url, '_blank');
    } else {
        if (await Linking.canOpenURL(url)) {
            await Linking.openURL(url);
        } else {
            showAlert('Could not open link', `The URL ${url} cannot be opened on this device.`);
        }
    }
}
