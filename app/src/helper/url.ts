import {getElectron, isElectron} from "./electron";
import {Linking, Platform} from "react-native";


export function openLink(url: string) {
    if (Platform.OS === 'web') {
        if (isElectron()) {
            getElectron().shell.openExternal(url);
        } else {
            window.open(url, '_blank');
        }
    } else {
        Linking.openURL(url);
    }
}
