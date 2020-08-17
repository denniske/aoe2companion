import {
    civsConfig, defaultDisabledBuildings, defaultDisabledUnits, horseDisabledBuildings, horseDisabledTechs,
    horseDisabledUnits
} from "../data/civs";
import {Tech, techs} from "./techs";
import {sanitizeGameDescription, unwrap} from "./util";
import {Unit, units} from "./units";
import {aoeData, aoeStringKey} from "../data/data";
import {Building, buildings} from "./buildings";

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

interface ICivEntry {
    name: Civ;
    uniqueUnits: Unit[];
    uniqueTechs: Tech[];
}

export const civList: ICivEntry[] = [
    {
        name: 'Aztecs',
        uniqueUnits: ['JaguarWarrior'],
        uniqueTechs: ['Atlatl', 'GarlandWars'],
    },
    {
        name: 'Berbers',
        uniqueUnits: ['CamelArcher', 'Genitour'],
        uniqueTechs: ['Kasbah', 'MaghrebiCamels'],
    },
    {
        name: 'Britons',
        uniqueUnits: ['Longbowman'],
        uniqueTechs: ['Yeomen', 'Warwolf'],
    },
    {
        name: 'Bulgarians',
        uniqueUnits: ['Konnik'],
        uniqueTechs: ['Stirrups', 'Bagains'],
    },
    {
        name: 'Burmese',
        uniqueUnits: ['Arambai'],
        uniqueTechs: ['Howdah', 'ManipurCavalry'],
    },
    {
        name: 'Byzantines',
        uniqueUnits: ['Cataphract'],
        uniqueTechs: ['GreekFire', 'Logistica'],
    },
    {
        name: 'Celts',
        uniqueUnits: ['WoadRaider'],
        uniqueTechs: ['Stronghold', 'FurorCeltica'],
    },
    {
        name: 'Chinese',
        uniqueUnits: ['ChuKoNu'],
        uniqueTechs: ['GreatWall', 'Rocketry'],
    },
    {
        name: 'Cumans',
        uniqueUnits: ['Kipchak'],
        uniqueTechs: ['SteppeHusbandry', 'CumanMercenaries'],
    },
    {
        name: 'Ethiopians',
        uniqueUnits: ['ShotelWarrior'],
        uniqueTechs: ['RoyalHeirs', 'TorsionEngines'],
    },
    {
        name: 'Franks',
        uniqueUnits: ['ThrowingAxeman'],
        uniqueTechs: ['Chivalry', 'BeardedAxe'],
    },
    {
        name: 'Goths',
        uniqueUnits: ['Huskarl'],
        uniqueTechs: ['Anarchy', 'Perfusion'],
    },
    {
        name: 'Huns',
        uniqueUnits: ['Tarkan'],
        uniqueTechs: ['Marauders', 'Atheism'],
    },
    {
        name: 'Incas',
        uniqueUnits: ['Kamayuk', 'Slinger'],
        uniqueTechs: ['AndeanSling', 'FabricShields'],
    },
    {
        name: 'Indians',
        uniqueUnits: ['ElephantArcher', 'ImperialCamelRider'],
        uniqueTechs: ['Sultans', 'Shatagni'],
    },
    {
        name: 'Italians',
        uniqueUnits: ['GenoeseCrossbowman', 'Condottiero'],
        uniqueTechs: ['Pavise', 'SilkRoad'],
    },
    {
        name: 'Japanese',
        uniqueUnits: ['Samurai'],
        uniqueTechs: ['Yasama', 'Kataparuto'],
    },
    {
        name: 'Khmer',
        uniqueUnits: ['BallistaElephant'],
        uniqueTechs: ['TuskSwords', 'DoubleCrossbow'],
    },
    {
        name: 'Koreans',
        uniqueUnits: ['WarWagon', 'TurtleShip'],
        uniqueTechs: ['Panokseon', 'Shinkichon'],
    },
    {
        name: 'Lithuanians',
        uniqueUnits: ['Leitis'],
        uniqueTechs: ['HillForts', 'TowerShields'],
    },
    {
        name: 'Magyars',
        uniqueUnits: ['MagyarHuszar'],
        uniqueTechs: ['CorvinianArmy', 'RecurveBow'],
    },
    {
        name: 'Malay',
        uniqueUnits: ['KarambitWarrior'],
        uniqueTechs: ['Thalassocracy', 'ForcedLevy'],
    },
    {
        name: 'Malians',
        uniqueUnits: ['Gbeto'],
        uniqueTechs: ['Tigui', 'Farimba'],
    },
    {
        name: 'Mayans',
        uniqueUnits: ['PlumedArcher'],
        uniqueTechs: ['ObsidianArrows', 'ElDorado'],
    },
    {
        name: 'Mongols',
        uniqueUnits: ['Mangudai'],
        uniqueTechs: ['Nomads', 'Drill'],
    },
    {
        name: 'Persians',
        uniqueUnits: ['WarElephant'],
        uniqueTechs: ['Kamandaran', 'Mahouts'],
    },
    {
        name: 'Portuguese',
        uniqueUnits: ['OrganGun', 'Caravel'],
        uniqueTechs: ['Carrack', 'Arquebus'],
    },
    {
        name: 'Saracens',
        uniqueUnits: ['Mameluke'],
        uniqueTechs: ['Madrasah', 'Zealotry'],
    },
    {
        name: 'Slavs',
        uniqueUnits: ['Boyar'],
        uniqueTechs: ['Orthodoxy', 'Druzhina'],
    },
    {
        name: 'Spanish',
        uniqueUnits: ['Conquistador', 'Missionary'],
        uniqueTechs: ['Inquisition', 'Supremacy'],
    },
    {
        name: 'Tatars',
        uniqueUnits: ['Keshik', 'FlamingCamel'],
        uniqueTechs: ['SilkArmor', 'TimuridSiegecraft'],
    },
    {
        name: 'Teutons',
        uniqueUnits: ['TeutonicKnight'],
        uniqueTechs: ['Ironclad', 'Crenellations'],
    },
    {
        name: 'Turks',
        uniqueUnits: ['Janissary'],
        uniqueTechs: ['Sipahi', 'Artillery'],
    },
    {
        name: 'Vietnamese',
        uniqueUnits: ['RattanArcher'],
        uniqueTechs: ['Chatras', 'PaperMoney'],
    },
    {
        name: 'Vikings',
        uniqueUnits: ['Berserk', 'Longboat'],
        uniqueTechs: ['Chieftains', 'Berserkergang'],
    },
];

type ICivDict = {
    [civ in Civ]: ICivEntry;
};

export const civDict: ICivDict = Object.assign({}, ...civList.map((x) => ({[x.name]: x})));

const CivUnion = unwrap(civs);
export type Civ = typeof CivUnion;

// const CivUnion2 = unwrap2(civDict, c => c.name);
// export type Civ2 = typeof CivUnion2;

// type RRRR = keyof typeof civs;
// type ValueOf<T> = T[keyof T];
// export type Civ = ValueOf<typeof civs>;

export const civIconList = [
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
    return civIconList[civ];
}

export function getCivIcon(civ: Civ) {
    return civIconList[civs.indexOf(civ as any)];
}

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}

export function getCivHasTech(civ: Civ, tech: Tech) {
    const entry = techs[tech];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).disableHorses && horseDisabledTechs.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !civConfig.disabled.techs.includes(parseInt(entry.dataId));
}

export function getCivHasBuilding(civ: Civ, building: Building) {
    const entry = buildings[building];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).enabled?.buildings?.includes(parseInt(entry.dataId))) {
        return true;
    }

    if (defaultDisabledBuildings.includes(parseInt(entry.dataId))) {
        return false;
    }

    if ((civConfig as any).disableHorses && horseDisabledBuildings.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !((civConfig.disabled as any).buildings || []).includes(parseInt(entry.dataId));
}

export function getCivHasUnit(civ: Civ, unit: Unit) {
    const entry = units[unit];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).enabled?.units?.includes(parseInt(entry.dataId))) {
        return true;
    }

    if (defaultDisabledUnits.includes(parseInt(entry.dataId))) {
        return false;
    }

    if ((civConfig as any).disableHorses && horseDisabledUnits.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !civConfig.disabled.units.includes(parseInt(entry.dataId));
}

export function getCivDescription(civ: Civ) {
    const civStringKey = aoeData.civ_helptexts[civ] as aoeStringKey;
    return sanitizeGameDescription(aoeData.strings[civStringKey]);
}

export function parseCivDescription(civ: Civ) {
    let description = getCivDescription(civ);
    // console.log("desc", JSON.stringify(description));

    description = description.replace(/ +\n/g, '\n');

    const parts = description.split('\n\n');
    // console.log(parts);

    const type = parts[0];

    const boni = parts[1].split('\u2022').map(s => s.replace('\n', '').trim()).filter(s => s);

    const [uniqueUnitsTitle, ...uniqueUnitsRest] = parts[2].split('\n');
    const [uniqueTechsTitle, ...uniqueTechsRest] = parts[3].split('\n');
    const [teamBonusTitle, teamBonus] = parts[4].split('\n');

    const result = {
        type,
        boni,
        uniqueUnitsTitle,
        uniqueTechsTitle,
        teamBonusTitle,
        teamBonus,
    };
    // console.log(result);

    return result;
}

export function getCivTeamBonus(civ: Civ) {
    return parseCivDescription(civ).teamBonus;
}
