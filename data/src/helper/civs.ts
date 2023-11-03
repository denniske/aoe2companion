import {Tech} from "./techs";
import {Unit} from "./units";
import {aoeData} from "../data/data";
import {removeAccentsAndCase, sanitizeGameDescription, unwrap} from "../lib/util";
import {getAoeString} from '../lib/aoe-data';
import {orderBy} from 'lodash';
import {appConfig, civsAoeNetData, civsData, civEnumListData} from "@nex/dataset";

export const civs = civsData;
export const civsAoeNet = civsAoeNetData;
export const civEnumList = civEnumListData;

export interface ICivEntry {
    name: Civ;
    uniqueUnits: Unit[];
    uniqueTechs: Tech[];
}

export const civList: ICivEntry[] = [
    {
        name: 'Armenians',
        uniqueUnits: ['CompositeBowman', 'WarriorPriest'],
        uniqueTechs: ['CilicianFleet', 'Fereters'],
    },
    {
        name: 'Aztecs',
        uniqueUnits: ['JaguarWarrior'],
        uniqueTechs: ['Atlatl', 'GarlandWars'],
    },
    {
        name: 'Bengalis',
        uniqueUnits: ['Ratha'],
        uniqueTechs: ['Paiks', 'Mahayana'],
    },
    {
        name: 'Dravidians',
        uniqueUnits: ['UrumiSwordsman', 'Thirisadai'],
        uniqueTechs: ['MedicalCorps', 'WootzSteel'],
    },
    {
        name: 'Gurjaras',
        uniqueUnits: ['ChakramThrower', 'ShrivamshaRider', 'CamelScout'],
        uniqueTechs: ['Kshatriyas', 'FrontierGuards'],
    },
    {
        name: 'Berbers',
        uniqueUnits: ['CamelArcher', 'Genitour'],
        uniqueTechs: ['Kasbah', 'MaghrebiCamels'],
    },
    {
        name: 'Bohemians',
        uniqueUnits: ['HussiteWagon', 'Houfnice'],
        uniqueTechs: ['WagenburgTactics', 'HussiteReforms'],
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
        name: 'Burgundians',
        uniqueUnits: ['Coustillier', 'FlemishMilitia'],
        uniqueTechs: ['BurgundianVineyards', 'FlemishRevolution'],
    },
    {
        name: 'Burmese',
        uniqueUnits: ['Arambai'],
        uniqueTechs: ['ManipurCavalry', 'Howdah'],
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
        uniqueTechs: ['BeardedAxe', 'Chivalry'],
    },
    {
        name: 'Georgians',
        uniqueUnits: ['Monaspa'],
        uniqueTechs: ['SvanTowers', 'AznauriCavalry'],
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
        name: 'Hindustanis',
        uniqueUnits: ['Ghulam', 'ImperialCamelRider'],
        uniqueTechs: ['GrandTrunkRoad', 'Shatagni'],
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
        uniqueTechs: ['Eupseong', 'Shinkichon'],
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
        uniqueTechs: ['HulcheJavelineers', 'ElDorado'],
    },
    {
        name: 'Mongols',
        uniqueUnits: ['Mangudai'],
        uniqueTechs: ['Nomads', 'Drill'],
    },
    {
        name: 'Persians',
        uniqueUnits: ['WarElephant'],
        uniqueTechs: ['Kamandaran', 'Citadels'],
    },
    {
        name: 'Poles',
        uniqueUnits: ['Obuch', 'WingedHussar'],
        uniqueTechs: ['SzlachtaPrivileges', 'LechiticLegacy'],
    },
    {
        name: 'Portuguese',
        uniqueUnits: ['OrganGun', 'Caravel'],
        uniqueTechs: ['Carrack', 'Arquebus'],
    },
    {
        name: 'Romans',
        uniqueUnits: ['Centurion', 'Legionary'],
        uniqueTechs: ['Ballistas', 'Comitatenses'],
    },
    {
        name: 'Saracens',
        uniqueUnits: ['Mameluke'],
        uniqueTechs: ['Bimaristan', 'Counterweights'],
    },
    {
        name: 'Sicilians',
        uniqueUnits: ['Serjeant'],
        uniqueTechs: ['FirstCrusade', 'Hauberk'],
    },
    {
        name: 'Slavs',
        uniqueUnits: ['Boyar'],
        uniqueTechs: ['Detinets', 'Druzhina'],
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
        uniqueTechs: ['Chieftains', 'Bogsveigar'],
    },
];

type ICivDict = {
    [civ in Civ]: ICivEntry;
};

export const civDict: ICivDict = Object.assign({}, ...civList.map((x) => ({[x.name]: x})));

const CivUnion = unwrap(civs);
export type Civ = typeof CivUnion;

export function orderCivs(civs: Readonly<Civ[]>) {
    return orderBy(civs, c => removeAccentsAndCase(getCivNameById(c) || 'none'), 'asc');
}

const rorCivNameDict = {
    0: "Egyptians",
    1: "Greeks",
    2: "Babylonians",
    3: "Assyrians",
    4: "Minoans",
    5: "Hittites",
    6: "Phoenicians",
    7: "Sumerians",
    8: "Persians",
    9: "Shang",
    10: "Yamato",
    11: "Choson",
    12: "Romans",
    13: "Carthaginians",
    14: "Palmyrans",
    15: "Macedonians",
    16: "LacViet",
};

const aoe4CivNameDict = {
    0: "Abbasid Dynasty",
    1: "Chinese",
    2: "Delhi Sultanate",
    3: "English",
    4: "French",
    5: "Holy Roman",
    6: "Mongols",
    7: "Rus",
    8: "Malians",
    9: "Ottomans",
}

export function getCivNameById(civ: Civ) {
    if (appConfig.game === 'aoe2de') {
        const civNameKey = aoeData.civ_names[civ];
        return getAoeString(civNameKey);
    }
    return aoe4CivNameDict[civs.indexOf(civ)];
}

// export function getCivEnumById(civ: Civ) {
//     return civEnumList[civ];
// }

export function getCivIdByEnum(civEnum: string): Civ {
    return civEnumList[civEnum];
}

export function getCivDescription(civ: Civ) {
    const civStringKey = aoeData.civ_helptexts[civ];
    return sanitizeGameDescription(getAoeString(civStringKey));
}

export function parseCivDescription(civ: Civ) {
    let description = getCivDescription(civ);
    // console.log("desc", JSON.stringify(description));

    description = description.replace(/ +\n/g, '\n');

    const parts = description.split('\n\n');
    // console.log(parts);

    if (parts.length < 5) return null;

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
    return parseCivDescription(civ)?.teamBonus;
}
