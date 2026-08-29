import { Linking, Platform } from 'react-native';
import { showAlert } from '@app/helper/alert';

export async function openLink(url: string) {
    if (!url) {
        console.log('Open Link: No URL provided');
        return;
    }

    if (Platform.OS === 'web') {
        window.open(url, '_blank');
        return;
    }

    // `canOpenURL` is not a useful guard here: for http/https it always
    // returns true, and for custom schemes it only works when the scheme is
    // declared in LSApplicationQueriesSchemes. So we just try and report.
    // await Linking.canOpenURL(url)

    try {
        await Linking.openURL(url);
    } catch (e) {
        console.log('Open Link: failed to open', url, e);
        showAlert('Could not open link', `The URL ${url} cannot be opened on this device.`);
    }
}
