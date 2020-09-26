import {Tech, techs} from "./techs";
import {Unit, units} from "./units";
import {Building, buildings} from "./buildings";
import {
    civsConfig, defaultDisabledBuildings, defaultDisabledUnits, horseDisabledBuildings, horseDisabledTechs,
    horseDisabledUnits
} from "../data/civs";
import {aoeData, aoeStringKey} from "../data/data";
import {sanitizeGameDescription, unwrap} from "../lib/util";

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
