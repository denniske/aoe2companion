
export const civs = [
    'Aztecs',
    'Berbers',
    'Britons',
    'Bulgarians',
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
    'Portuguese',
    'Saracens',
    'Slavs',
    'Spanish',
    'Tatars',
    'Teutons',
    'Turks',
    'Vietnamese',
    'Vikings',
] as const;

export function getCivName(civ: number) {
    return civs[civ];
}

export function getCivIconByIndex(civ: number) {
    return '/civilizations/' + getCivName(civ).toLowerCase() + '.png';
}
