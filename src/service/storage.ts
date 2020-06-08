import { AsyncStorage } from 'react-native';

export interface ISettings {
    steam_id: string;
    profile_id: number;
}

export const loadSettingsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return null;
    }
    console.log("json settings", entry);
    return JSON.parse(entry) as ISettings;
};
