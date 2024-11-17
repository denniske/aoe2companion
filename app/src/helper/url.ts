import {Linking, Platform} from "react-native";


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
