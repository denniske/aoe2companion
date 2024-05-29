import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from 'expo-device';

export function maskAccountId(accountId: string) {
    if (accountId == null) return null;
    return `${accountId.substring(0, 8)}-****-****-****-************`;
}

export function maskToken(token: string) {
    if (token == null) return null;
    return token.replace(/ExponentPushToken\[(.+)\]/, (matched: string, group: string, index: number) => {
        const clearPart = group.substr(0, 6);
        const maskedPart = Array((group.length - 6)).fill('*').join('');
        return `ExponentPushToken[${clearPart}${maskedPart}]`;
    })
}

export async function getToken() {
    if (!Device.isDevice) return null;
    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        return (await Notifications.getExpoPushTokenAsync({
            projectId,
        })).data;
    } catch (e) {
        return null;
    }
}
