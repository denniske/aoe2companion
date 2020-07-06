import {civsConfig} from "../data/civs";
import {Tech, techs} from "./techs";
import {strRemoveTo, unwrap} from "./util";
import {Unit, units} from "./units";
import {aoeData, aoeStringKey} from "../data/data";

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

const CivUnion = unwrap(civs);
export type Civ = typeof CivUnion;

// type RRRR = keyof typeof civs;
// type ValueOf<T> = T[keyof T];
// export type Civ = ValueOf<typeof civs>;

export const civList = [
    require('../../assets/civilizations/aztecs.png'),
    require('../../assets/civilizations/berber.png'),
    require('../../assets/civilizations/britons.png'),
    require('../../assets/civilizations/bulgarians.png'),
    require('../../assets/civilizations/burmese.png'),
    require('../../assets/civilizations/byzantines.png'),
    require('../../assets/civilizations/celts.png'),
    require('../../assets/civilizations/chinese.png'),
    require('../../assets/civilizations/cumans.png'),
    require('../../assets/civilizations/ethiopians.png'),
    require('../../assets/civilizations/franks.png'),
    require('../../assets/civilizations/goths.png'),
    require('../../assets/civilizations/huns.png'),
    require('../../assets/civilizations/inca.png'),
    require('../../assets/civilizations/indians.png'),
    require('../../assets/civilizations/italians.png'),
    require('../../assets/civilizations/japanese.png'),
    require('../../assets/civilizations/khmer.png'),
    require('../../assets/civilizations/koreans.png'),
    require('../../assets/civilizations/lithuanians.png'),
    require('../../assets/civilizations/magyars.png'),
    require('../../assets/civilizations/malay.png'),
    require('../../assets/civilizations/malians.png'),
    require('../../assets/civilizations/mayans.png'),
    require('../../assets/civilizations/mongols.png'),
    require('../../assets/civilizations/persians.png'),
    require('../../assets/civilizations/portuguese.png'),
    require('../../assets/civilizations/saracens.png'),
    require('../../assets/civilizations/slavs.png'),
    require('../../assets/civilizations/spanish.png'),
    require('../../assets/civilizations/tatars.png'),
    require('../../assets/civilizations/teutons.png'),
    require('../../assets/civilizations/turks.png'),
    require('../../assets/civilizations/vietnamese.png'),
    require('../../assets/civilizations/vikings.png'),
];

export const civHistoryList = [
    require('../../assets/history/civs/history_aztecs.png'),
    require('../../assets/history/civs/history_berbers.png'),
    require('../../assets/history/civs/history_britons.png'),
    require('../../assets/history/civs/history_bulgarians.png'),
    require('../../assets/history/civs/history_burmese.png'),
    require('../../assets/history/civs/history_byzantines.png'),
    require('../../assets/history/civs/history_celts.png'),
    require('../../assets/history/civs/history_chinese.png'),
    require('../../assets/history/civs/history_cumans.png'),
    require('../../assets/history/civs/history_ethiopians.png'),
    require('../../assets/history/civs/history_franks.png'),
    require('../../assets/history/civs/history_goths.png'),
    require('../../assets/history/civs/history_huns.png'),
    require('../../assets/history/civs/history_incas.png'),
    require('../../assets/history/civs/history_indians.png'),
    require('../../assets/history/civs/history_italians.png'),
    require('../../assets/history/civs/history_japanese.png'),
    require('../../assets/history/civs/history_khmer.png'),
    require('../../assets/history/civs/history_koreans.png'),
    require('../../assets/history/civs/history_lithuanians.png'),
    require('../../assets/history/civs/history_magyars.png'),
    require('../../assets/history/civs/history_malay.png'),
    require('../../assets/history/civs/history_malians.png'),
    require('../../assets/history/civs/history_mayans.png'),
    require('../../assets/history/civs/history_mongols.png'),
    require('../../assets/history/civs/history_persians.png'),
    require('../../assets/history/civs/history_portuguese.png'),
    require('../../assets/history/civs/history_saracens.png'),
    require('../../assets/history/civs/history_slavs.png'),
    require('../../assets/history/civs/history_spanish.png'),
    require('../../assets/history/civs/history_tatars.png'),
    require('../../assets/history/civs/history_teutons.png'),
    require('../../assets/history/civs/history_turks.png'),
    require('../../assets/history/civs/history_vietnamese.png'),
    require('../../assets/history/civs/history_vikings.png'),
];

export function getCivIconByIndex(civ: number) {
    return civList[civ];
}

export function getCivIcon(civ: Civ) {
    return civList[civs.indexOf(civ as any)];
}

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}

export function getCivHasTech(civ: Civ, tech: Tech) {
    const entry = techs[tech];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).disableHorses && ['Bloodlines', 'Husbandry'].includes(tech)) {
        return false;
    }

    return !civsConfig[civ].disabled.techs.includes(parseInt(entry.dataId));
}

export function getCivHasUnit(civ: Civ, unit: Unit) {
    const entry = units[unit];
    const civConfig = civsConfig[civ];

    if (['ImperialSkirmisher', 'ImperialCamelRider'].includes(unit)) {
        return (civConfig as any).enabled?.units?.includes(parseInt(entry.dataId));
    }

    return !civsConfig[civ].disabled.units.includes(parseInt(entry.dataId));
}

export function getCivDescription(civ: Civ) {
    const civStringKey = aoeData.civ_helptexts[civ] as aoeStringKey;
    return aoeData.strings[civStringKey]
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<br>/g, '')
        .replace(/\s+\n/g, '\n');
}

export function getCivTeamBonus(civ: Civ) {
    let description = getCivDescription(civ);
    description = strRemoveTo(description, 'Team Bonus:\n');
    return description;
}
