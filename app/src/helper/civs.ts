import {Civ, civs} from "@nex/data";
import {getString} from './strings';


export const civIconList = [
    require('../../../app/assets/civilizations/aztecs.png'),
    require('../../../app/assets/civilizations/berber.png'),
    require('../../../app/assets/civilizations/britons.png'),
    require('../../../app/assets/civilizations/bulgarians.png'),
    require('../../../app/assets/civilizations/burmese.png'),
    require('../../../app/assets/civilizations/byzantines.png'),
    require('../../../app/assets/civilizations/celts.png'),
    require('../../../app/assets/civilizations/chinese.png'),
    require('../../../app/assets/civilizations/cumans.png'),
    require('../../../app/assets/civilizations/ethiopians.png'),
    require('../../../app/assets/civilizations/franks.png'),
    require('../../../app/assets/civilizations/goths.png'),
    require('../../../app/assets/civilizations/huns.png'),
    require('../../../app/assets/civilizations/inca.png'),
    require('../../../app/assets/civilizations/indians.png'),
    require('../../../app/assets/civilizations/italians.png'),
    require('../../../app/assets/civilizations/japanese.png'),
    require('../../../app/assets/civilizations/khmer.png'),
    require('../../../app/assets/civilizations/koreans.png'),
    require('../../../app/assets/civilizations/lithuanians.png'),
    require('../../../app/assets/civilizations/magyars.png'),
    require('../../../app/assets/civilizations/malay.png'),
    require('../../../app/assets/civilizations/malians.png'),
    require('../../../app/assets/civilizations/mayans.png'),
    require('../../../app/assets/civilizations/mongols.png'),
    require('../../../app/assets/civilizations/persians.png'),
    require('../../../app/assets/civilizations/portuguese.png'),
    require('../../../app/assets/civilizations/saracens.png'),
    require('../../../app/assets/civilizations/slavs.png'),
    require('../../../app/assets/civilizations/spanish.png'),
    require('../../../app/assets/civilizations/tatars.png'),
    require('../../../app/assets/civilizations/teutons.png'),
    require('../../../app/assets/civilizations/turks.png'),
    require('../../../app/assets/civilizations/vietnamese.png'),
    require('../../../app/assets/civilizations/vikings.png'),
];

export const civHistoryList = [
    require('../../../app/assets/history/civs/history_aztecs.png'),
    require('../../../app/assets/history/civs/history_berbers.png'),
    require('../../../app/assets/history/civs/history_britons.png'),
    require('../../../app/assets/history/civs/history_bulgarians.png'),
    require('../../../app/assets/history/civs/history_burmese.png'),
    require('../../../app/assets/history/civs/history_byzantines.png'),
    require('../../../app/assets/history/civs/history_celts.png'),
    require('../../../app/assets/history/civs/history_chinese.png'),
    require('../../../app/assets/history/civs/history_cumans.png'),
    require('../../../app/assets/history/civs/history_ethiopians.png'),
    require('../../../app/assets/history/civs/history_franks.png'),
    require('../../../app/assets/history/civs/history_goths.png'),
    require('../../../app/assets/history/civs/history_huns.png'),
    require('../../../app/assets/history/civs/history_incas.png'),
    require('../../../app/assets/history/civs/history_indians.png'),
    require('../../../app/assets/history/civs/history_italians.png'),
    require('../../../app/assets/history/civs/history_japanese.png'),
    require('../../../app/assets/history/civs/history_khmer.png'),
    require('../../../app/assets/history/civs/history_koreans.png'),
    require('../../../app/assets/history/civs/history_lithuanians.png'),
    require('../../../app/assets/history/civs/history_magyars.png'),
    require('../../../app/assets/history/civs/history_malay.png'),
    require('../../../app/assets/history/civs/history_malians.png'),
    require('../../../app/assets/history/civs/history_mayans.png'),
    require('../../../app/assets/history/civs/history_mongols.png'),
    require('../../../app/assets/history/civs/history_persians.png'),
    require('../../../app/assets/history/civs/history_portuguese.png'),
    require('../../../app/assets/history/civs/history_saracens.png'),
    require('../../../app/assets/history/civs/history_slavs.png'),
    require('../../../app/assets/history/civs/history_spanish.png'),
    require('../../../app/assets/history/civs/history_tatars.png'),
    require('../../../app/assets/history/civs/history_teutons.png'),
    require('../../../app/assets/history/civs/history_turks.png'),
    require('../../../app/assets/history/civs/history_vietnamese.png'),
    require('../../../app/assets/history/civs/history_vikings.png'),
];

export function getCivNameById(civ: Civ) {
    return getString('civ', civs.indexOf(civ)) as string;
}

export function getCivIconByIndex(civ: number) {
    return civIconList[civ];
}

export function getCivIcon(civ: Civ) {
    return civIconList[civs.indexOf(civ as any)];
}

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}
