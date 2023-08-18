import {Civ, civs, civsAoeNet} from "@nex/data";
import {civIconListData} from "@nex/dataset";


export const civIconList = civIconListData;

export const civHistoryList = [
    require('../../../app/assets/history/civs/history_aztecs.png'),
    require('../../../app/assets/history/civs/history_bengalis.png'),
    require('../../../app/assets/history/civs/history_berbers.png'),
    require('../../../app/assets/history/civs/history_bohemians.png'),
    require('../../../app/assets/history/civs/history_britons.png'),
    require('../../../app/assets/history/civs/history_bulgarians.png'),
    require('../../../app/assets/history/civs/history_burgundians.png'),
    require('../../../app/assets/history/civs/history_burmese.png'),
    require('../../../app/assets/history/civs/history_byzantines.png'),
    require('../../../app/assets/history/civs/history_celts.png'),
    require('../../../app/assets/history/civs/history_chinese.png'),
    require('../../../app/assets/history/civs/history_cumans.png'),
    require('../../../app/assets/history/civs/history_dravidians.png'),
    require('../../../app/assets/history/civs/history_ethiopians.png'),
    require('../../../app/assets/history/civs/history_franks.png'),
    require('../../../app/assets/history/civs/history_goths.png'),
    require('../../../app/assets/history/civs/history_gurjaras.png'),
    require('../../../app/assets/history/civs/history_huns.png'),
    require('../../../app/assets/history/civs/history_incas.png'),
    require('../../../app/assets/history/civs/history_hindustani.png'),
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
    require('../../../app/assets/history/civs/history_poles.png'),
    require('../../../app/assets/history/civs/history_portuguese.png'),
    require('../../../app/assets/history/civs/history_saracens.png'),
    require('../../../app/assets/history/civs/history_sicilians.png'),
    require('../../../app/assets/history/civs/history_slavs.png'),
    require('../../../app/assets/history/civs/history_spanish.png'),
    require('../../../app/assets/history/civs/history_tatars.png'),
    require('../../../app/assets/history/civs/history_teutons.png'),
    require('../../../app/assets/history/civs/history_turks.png'),
    require('../../../app/assets/history/civs/history_vietnamese.png'),
    require('../../../app/assets/history/civs/history_vikings.png'),
    require('../../../app/assets/history/civs/history_indians.png'),
];

export const civImageRoRList = [
    require('../../assets/civilizations/ror/egyptians.png'),
    require('../../assets/civilizations/ror/greeks.png'),
    require('../../assets/civilizations/ror/babylonians.png'),
    require('../../assets/civilizations/ror/assyrians.png'),
    require('../../assets/civilizations/ror/minoans.png'),
    require('../../assets/civilizations/ror/hittites.png'),
    require('../../assets/civilizations/ror/phoenicians.png'),
    require('../../assets/civilizations/ror/sumerians.png'),
    require('../../assets/civilizations/ror/persians.png'),
    require('../../assets/civilizations/ror/shang.png'),
    require('../../assets/civilizations/ror/yamato.png'),
    require('../../assets/civilizations/ror/choson.png'),
    require('../../assets/civilizations/ror/romans.png'),
    require('../../assets/civilizations/ror/carthaginians.png'),
    require('../../assets/civilizations/ror/palmyrans.png'),
    require('../../assets/civilizations/ror/macedonians.png'),
    require('../../assets/civilizations/ror/lacviet.png'),
];

export function getCivIconByIndex(civ: number) {
    // console.log('getCivIconByIndex', civ, civsAoeNet[civ]);
    if (civ >= 10000) {
        return civImageRoRList[civ - 10000];
    }
    return civIconList[civsAoeNet[civ] as Civ];
}

export function getCivIcon(data: { civ: any, civImageUrl: string }) {
    return { uri: data.civImageUrl };
}

export function getCivIconLocal(civ: string) {
    console.log('getCivIconLocal', civ);
    return civIconList[civ];
}

// export function getCivIcon(civ: Civ) {
//     console.log('getCivIcon', civ);
//     return civIconList[civ];
// }

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}
