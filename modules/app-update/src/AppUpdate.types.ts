export type ChangeEventPayload = {
    value: string;
};

export type ExpoAppUpdateViewProps = {
    name: string;
};

export type ExpoAppUpdateModuleEvents = {};

export enum UpdateAvailability {
    UNKNOWN = 0,
    UPDATE_NOT_AVAILABLE = 1,
    UPDATE_AVAILABLE = 2,
    DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS = 3,
}

export enum InstallStatus {
    UNKNOWN = 0,
    REQUIRES_UI_INTENT = 10,
    PENDING = 1,
    DOWNLOADING = 2,
    DOWNLOADED = 11,
    INSTALLING = 3,
    INSTALLED = 4,
    FAILED = 5,
    CANCELED = 6,
}

export interface AppUpdateInfo {
    updateAvailable: boolean;
    android?: AndroidInfo;
    ios?: IosInfo;
}

export interface AndroidInfo {
    availableVersionCode: number;
    clientVersionStalenessDays: any;
    installStatus: InstallStatus;
    isUpdateTypeAllowed: boolean;
    packageName: string;
    updateAvailability: UpdateAvailability;
    updatePriority: number;
}

export interface IosInfo {
    version: string;
}
