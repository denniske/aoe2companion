const Store = require('electron-store');


export interface IStoredConfig {
    hotkeyShowHideEnabled: boolean;
    hotkeySearchEnabled: boolean;
    overlayEnabled: boolean;
}

export interface IStoredSettings {
    id: string;
    steam_id?: string;
    profile_id?: number;
}

export interface IStoredData {
    config: IStoredConfig;
    settings: IStoredSettings;
}

export const store = new Store();
