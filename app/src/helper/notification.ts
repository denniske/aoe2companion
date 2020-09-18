
let savedNotification: any = null;

export function hasSavedNotification() {
    return savedNotification != null;
}

export function setSavedNotification(notification: any) {
    savedNotification = notification;
}
