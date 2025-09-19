
export function useLastNotificationResponse() {
    return null;
}

export function addNotificationReceivedListener() {
    return null;
}

export function removeNotificationSubscription() {
    return null;
}

export function getPermissionsAsync() {}
export function requestPermissionsAsync() {}
export function getExpoPushTokenAsync() {}
export function setNotificationChannelAsync() {}
export function setNotificationHandler() {}

export enum AndroidImportance {
    UNKNOWN = 0,
    UNSPECIFIED = 1,
    NONE = 2,
    MIN = 3,
    LOW = 4,
    DEFAULT = 5,
    HIGH = 6,
    MAX = 7,
}

export const DEFAULT_ACTION_IDENTIFIER = "expo.modules.notifications.actions.DEFAULT"

