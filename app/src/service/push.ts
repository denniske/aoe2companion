import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export function maskToken(token: string) {
    if (token == null) return null;
    return token.replace(/ExponentPushToken\[(.+)\]/, (matched: string, group: string, index: number) => {
        const clearPart = group.substr(0, 6);
        const maskedPart = Array((group.length - 6)).fill('*').join('');
        return `ExponentPushToken[${clearPart}${maskedPart}]`;
    })
}

export async function getToken() {
    if (!Constants.isDevice) return null;
    try {
        return (await Notifications.getExpoPushTokenAsync({
            experienceId: Constants.manifest?.extra?.experienceId,
            projectId: Constants.manifest?.extra?.eas.projectId,
        })).data;
    } catch (e) {
        return null;
    }
}
