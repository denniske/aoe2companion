import {Civ, civs} from "@nex/data";
import {civIconListData} from "@nex/dataset";


export const civIconList = civIconListData;

export const civHistoryList = [
    require('../../assets/history/civs2/history_armenians.png'),
    require('../../assets/history/civs/history_aztecs.png'),
    require('../../assets/history/civs2/history_bengalis.png'),
    require('../../assets/history/civs/history_berbers.png'),
    require('../../assets/history/civs/history_bohemians.png'),
    require('../../assets/history/civs/history_britons.png'),
    require('../../assets/history/civs/history_bulgarians.png'),
    require('../../assets/history/civs2/history_burgundians.png'),
    require('../../assets/history/civs/history_burmese.png'),
    require('../../assets/history/civs/history_byzantines.png'),
    require('../../assets/history/civs/history_celts.png'),
    require('../../assets/history/civs/history_chinese.png'),
    require('../../assets/history/civs/history_cumans.png'),
    require('../../assets/history/civs2/history_dravidians.png'),
    require('../../assets/history/civs/history_ethiopians.png'),
    require('../../assets/history/civs/history_franks.png'),
    require('../../assets/history/civs2/history_georgians.png'),
    require('../../assets/history/civs/history_goths.png'),
    require('../../assets/history/civs2/history_gurjaras.png'),
    require('../../assets/history/civs/history_huns.png'),
    require('../../assets/history/civs/history_incas.png'),
    require('../../assets/history/civs/history_hindustani.png'),
    require('../../assets/history/civs/history_italians.png'),
    require('../../assets/history/civs/history_japanese.png'),
    require('../../assets/history/civs2/history_jurchens.png'),
    require('../../assets/history/civs2/history_khitans.png'),
    require('../../assets/history/civs/history_khmer.png'),
    require('../../assets/history/civs/history_koreans.png'),
    require('../../assets/history/civs2/history_lithuanians.png'),
    require('../../assets/history/civs/history_magyars.png'),
    require('../../assets/history/civs/history_malay.png'),
    require('../../assets/history/civs/history_malians.png'),
    require('../../assets/history/civs/history_mayans.png'),
    require('../../assets/history/civs/history_mongols.png'),
    require('../../assets/history/civs/history_persians.png'),
    require('../../assets/history/civs2/history_poles.png'),
    require('../../assets/history/civs/history_portuguese.png'),
    require('../../assets/history/civs2/history_romans.png'),
    require('../../assets/history/civs/history_saracens.png'),
    require('../../assets/history/civs2/history_shu.png'),
    require('../../assets/history/civs/history_sicilians.png'),
    require('../../assets/history/civs/history_slavs.png'),
    require('../../assets/history/civs/history_spanish.png'),
    require('../../assets/history/civs/history_tatars.png'),
    require('../../assets/history/civs/history_teutons.png'),
    require('../../assets/history/civs/history_turks.png'),
    require('../../assets/history/civs/history_vietnamese.png'),
    require('../../assets/history/civs/history_vikings.png'),
    require('../../assets/history/civs2/history_wei.png'),
    require('../../assets/history/civs2/history_wu.png'),
    require('../../assets/history/civs/history_indians.png'),
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

export function getCivIcon(data: { civ: any, civImageUrl: string }) {
    return { uri: data.civImageUrl };
}

export function getCivIconLocal(civ: string) {
    return civIconList[civ];
}

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}

export const genericCivIcon = require('../../assets/civilizations/generic.png');