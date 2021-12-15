import {ICivService, registerService, SERVICE_NAME} from "../data/src";

class CivService implements ICivService {
    getCivs(): any {
        return [
            // 'Aztecs',
            'Berbers',
            'Bohemians',
            'Britons',
            'Bulgarians',
            'Burgundians',
            'Burmese',
            'Byzantines',
            'Celts',
            'Chinese',
            'Cumans',
            'Ethiopians',
            'Franks',
            'Goths',
            'Huns',
            'Incas',
            'Indians',
            'Italians',
            'Japanese',
            'Khmer',
            'Koreans',
            'Lithuanians',
            'Magyars',
            'Malay',
            'Malians',
            'Mayans',
            'Mongols',
            'Persians',
            'Poles',
            'Portuguese',
            'Saracens',
            'Sicilians',
            'Slavs',
            'Spanish',
            'Tatars',
            'Teutons',
            'Turks',
            'Vietnamese',
            'Vikings',
        ];
    }
}

console.log('REGISTERING CIV444 SERVICE');

registerService(SERVICE_NAME.CIV_SERVICE, new CivService(), true);

export const lol = 4;
