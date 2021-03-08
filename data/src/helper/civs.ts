import {Tech, techs} from "./techs";
import {Unit, units} from "./units";
import {aoeData} from "../data/data";
import {removeAccentsAndCase, sanitizeGameDescription, unwrap} from "../lib/util";
import {getAoeString} from '../lib/aoe-data';
import {orderBy} from 'lodash';

export const civs = [
    'Aztecs',
    'Berbers',
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
] as const;

export interface ICivEntry {
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
        name: 'Burgundians',
        uniqueUnits: ['Coustillier', 'FlemishMilitia'],
        uniqueTechs: ['BurgundianVineyards', 'FlemishRevolution'],
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
        name: 'Sicilians',
        uniqueUnits: ['Serjeant'],
        uniqueTechs: ['FirstCrusade', 'Scutage'],
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

export function orderCivs(civs: Readonly<Civ[]>) {
    return orderBy(civs, c => removeAccentsAndCase(getCivNameById(c)), 'asc');
}

export function getCivNameById(civ: Civ) {
    const civStringKey = aoeData.civ_names[civ];
    return sanitizeGameDescription(getAoeString(civStringKey));
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
