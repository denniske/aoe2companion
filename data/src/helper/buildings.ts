import {ICostDict, IUnitClassPair, Unit, UnitLine, unitLineIds, unitLines, unitList} from "./units";
import {aoeBuildingDataId, aoeData} from "../data/data";
import {sanitizeGameDescription, strRemoveFrom, strRemoveTo, unwrap} from "../lib/util";
import {getAoeString} from '../lib/aoe-data';
import {Civ} from "./civs";
import {TechEffect} from "./techs";


export interface IBuildingLine {
    civ?: Civ;
    unique?: boolean;
    buildings: Building[];
    upgrades: TechEffect[];
}

// type IBuildingLineDict = {
//     [building in BuildingLine]: IBuildingLine;
// };

interface IBuildingLineDict {
    [building: string]: IBuildingLine;
}

export const buildingLineIds = [
    'ArcheryRange',
    'Barracks',
    'Blacksmith',
    'Castle',
    'Caravanserai',
    'Dock',
    'Donjon',
    'Farm',
    'Feitoria',
    'FishTrap',
    'Folwark',
    'Gate',
    'Harbor',
    'House',
    'Krepost',
    'LumberCamp',
    'Market',
    'Mill',
    'MiningCamp',
    'Monastery',
    'Outpost',
    'PalisadeGate',
    'PalisadeWall',
    'SiegeWorkshop',
    'Stable',
    'TownCenter',
    'University',

    'StoneWall',
    // 'FortifiedWall',

    'WatchTower',
    // 'GuardTower',
    // 'Keep',

    'BombardTower',

    'Wonder',
];

const BuildingLineUnion = unwrap(buildingLineIds);
export type BuildingLine = typeof BuildingLineUnion;

export const buildingLines: IBuildingLineDict = {

    'Wonder': {
        buildings: ['Wonder'],
        upgrades: [

        ],
    },
    'ArcheryRange': {
        buildings: ['ArcheryRange'],
        upgrades: [

        ],
    },
    'Barracks': {
        buildings: ['Barracks'],
        upgrades: [

        ],
    },
    'Blacksmith': {
        buildings: ['Blacksmith'],
        upgrades: [

        ],
    },
    'Caravanserai': {
        buildings: ['Caravanserai'],
        upgrades: [

        ],
    },
    'Dock': {
        buildings: ['Dock'],
        upgrades: [

        ],
    },
    'Farm': {
        buildings: ['Farm'],
        upgrades: [

        ],
    },
    'Feitoria': {
        buildings: ['Feitoria'],
        upgrades: [

        ],
    },
    'FishTrap': {
        buildings: ['FishTrap'],
        upgrades: [

        ],
    },
    'Folwark': {
        buildings: ['Folwark'],
        upgrades: [

        ],
    },
    'Harbor': {
        buildings: ['Harbor'],
        upgrades: [

        ],
    },
    'House': {
        buildings: ['House'],
        upgrades: [

        ],
    },
    'LumberCamp': {
        buildings: ['LumberCamp'],
        upgrades: [

        ],
    },
    'Market': {
        buildings: ['Market'],
        upgrades: [

        ],
    },
    'Mill': {
        buildings: ['Mill'],
        upgrades: [

        ],
    },
    'MiningCamp': {
        buildings: ['MiningCamp'],
        upgrades: [

        ],
    },
    'Monastery': {
        buildings: ['Monastery'],
        upgrades: [

        ],
    },
    'SiegeWorkshop': {
        buildings: ['SiegeWorkshop'],
        upgrades: [

        ],
    },
    'Stable': {
        buildings: ['Stable'],
        upgrades: [

        ],
    },
    'TownCenter': {
        buildings: ['TownCenter'],
        upgrades: [

        ],
    },
    'University': {
        buildings: ['University'],
        upgrades: [

        ],
    },

    'WatchTower': {
        buildings: ['WatchTower', 'GuardTower', 'Keep'],
        upgrades: [
            'Masonry',
            'Architecture',
            'GreatWall',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ArrowSlits',
            'HeatedShot',
            'Yeomen',
            'Yasama',
            'Eupseong',
            'MurderHoles',
            'Stronghold',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'HerbalMedicine',
            'Detinets', // Except for Keep because Slavs don't have it, but not sure how to implement that
            'Crenellations',
        ],
    },
    'StoneWall': {
        buildings: ['StoneWall', 'FortifiedWall'],
        upgrades: [
            'GreatWall',
            'TreadmillCrane',
        ],
    },
    'BombardTower': {
        buildings: ['BombardTower'],
        upgrades: [
            'Masonry',
            'Architecture',
            'GreatWall',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'HeatedShot',
            'GreekFire-BombardTower',
            'MurderHoles',
            'Artillery',
            'Ballistics',
            'Arquebus',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
        ],
    },
    'Castle': {
        buildings: ['Castle'],
        upgrades: [
            'Masonry',
            'Architecture',
            'Hoardings',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'HeatedShot',
            'MurderHoles',
            'Crenellations',
            'Stronghold',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'Conscription',
            'Kasbah',
            'HerbalMedicine',
            'CumanMercenaries',
            'Detinets',
            'Stronghold-Castle',
        ],
    },
    'Donjon': {
        buildings: ['Donjon'],
        upgrades: [
            'Masonry',
            'Hoardings',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ArrowSlits',
            'HeatedShot',
            'MurderHoles',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'FirstCrusade',
            'Conscription',
            'HerbalMedicine',
        ],
    },
    'Krepost': {
        buildings: ['Krepost'],
        upgrades: [
            'Masonry',
            'Architecture',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'HeatedShot',
            'MurderHoles',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'Conscription',
            'HerbalMedicine',
        ],
    },
    'PalisadeWall': {
        buildings: ['PalisadeWall'],
        upgrades: [
            'GreatWall',
            'TreadmillCrane',
        ],
    },
    'PalisadeGate': {
        buildings: ['PalisadeGate'],
        upgrades: [
            'GreatWall',
            'TreadmillCrane',
        ],
    },
    'Gate': {
        buildings: ['Gate'],
        upgrades: [
            'GreatWall',
            'TreadmillCrane',
        ],
    },
    'Outpost': {
        buildings: ['Outpost'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
        ],
    },
};


export const buildingList = buildingLineIds.map(ul => ({
    name: ul,
    ...buildingLines[ul],
}))
export function getBuildingLineIdForBuilding(building: Building) {
    const buildingInfo = buildingList.find(ul => ul.buildings.includes(building));
    if (buildingInfo == null) {
        throw new Error(`Building ${building} has no building line.`)
    }
    return buildingInfo.name;
}


interface IBuilding {
    dataId: aoeBuildingDataId;
    name: Building;
}

interface IBuildingDict {
    [building: string]: IBuilding;
}

export const buildingDefList: IBuilding[] = [
    {
        "dataId": "1189",
        "name": "Harbor",
    },
    {
        "dataId": "1754",
        "name": "Caravanserai",
    },
    {
        "dataId": "1734",
        "name": "Folwark",
    },
    {
        "dataId": "1665",
        "name": "Donjon",
    },
    {
        "dataId": "87",
        "name": "ArcheryRange",
    },
    {
        "dataId": "12",
        "name": "Barracks",
    },
    {
        "dataId": "103",
        "name": "Blacksmith",
    },
    {
        "dataId": "236",
        "name": "BombardTower",
    },
    {
        "dataId": "82",
        "name": "Castle",
    },
    {
        "dataId": "45",
        "name": "Dock",
    },
    {
        "dataId": "50",
        "name": "Farm",
    },
    {
        "dataId": "1021",
        "name": "Feitoria",
    },
    {
        "dataId": "199",
        "name": "FishTrap",
    },
    {
        "dataId": "155",
        "name": "FortifiedWall",
    },
    {
        "dataId": "487",
        "name": "Gate",
    },
    {
        "dataId": "234",
        "name": "GuardTower",
    },
    {
        "dataId": "70",
        "name": "House",
    },
    {
        "dataId": "235",
        "name": "Keep",
    },
    {
        "dataId": "1251",
        "name": "Krepost",
    },
    {
        "dataId": "562",
        "name": "LumberCamp",
    },
    {
        "dataId": "84",
        "name": "Market",
    },
    {
        "dataId": "68",
        "name": "Mill",
    },
    {
        "dataId": "584",
        "name": "MiningCamp",
    },
    {
        "dataId": "104",
        "name": "Monastery",
    },
    {
        "dataId": "598",
        "name": "Outpost",
    },
    {
        "dataId": "792",
        "name": "PalisadeGate",
    },
    {
        "dataId": "72",
        "name": "PalisadeWall",
    },
    {
        "dataId": "49",
        "name": "SiegeWorkshop",
    },
    {
        "dataId": "101",
        "name": "Stable",
    },
    {
        "dataId": "117",
        "name": "StoneWall",
    },
    {
        "dataId": "109",
        "name": "TownCenter",
    },
    {
        "dataId": "209",
        "name": "University",
    },
    {
        "dataId": "79",
        "name": "WatchTower",
    },
    {
        "dataId": "276",
        "name": "Wonder",
    },
];


export const buildings: IBuildingDict = Object.assign({}, ...buildingDefList.map((x) => ({[x.name]: x})));

interface BuildingDict {
    [building: string]: any;
}

const buildingIds = [
    'ArcheryRange',
    'Barracks',
    'Blacksmith',
    'BombardTower',
    'Castle',
    'Caravanserai',
    'Dock',
    'Donjon',
    'Farm',
    'Feitoria',
    'FishTrap',
    'Folwark',
    'FortifiedWall',
    'Gate',
    'GuardTower',
    'Harbor',
    'House',
    'Keep',
    'Krepost',
    'LumberCamp',
    'Market',
    'Mill',
    'MiningCamp',
    'Monastery',
    'Outpost',
    'PalisadeGate',
    'PalisadeWall',
    'SiegeWorkshop',
    'Stable',
    'StoneWall',
    'TownCenter',
    'University',
    'WatchTower',
    'Wonder',
] as const;

const BuildingUnion = unwrap(buildingIds);
export type Building = typeof BuildingUnion;

export interface IBuildingInfo {
    Cost: ICostDict;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    Attack: number;
    Attacks: ReadonlyArray<IUnitClassPair>;
    GarrisonCapacity: number;
    HP: number;
    LineOfSight: number;
    MeleeArmor: number;
    PierceArmor: number;
    Armours: ReadonlyArray<IUnitClassPair>;
    Range: number;
    TrainTime: number;
}

export function getBuildingData(building: Building) {
    const buildingEntry = buildings[building];
    if (buildingEntry == null) {
        throw Error(`getBuildingName ${building} - no dataId`);
    }
    const dataId = buildingEntry.dataId;
    if (aoeData.data.buildings[dataId] == null) {
        throw Error(`getUnitData ${building} - no data`);
    }
    return aoeData.data.buildings[dataId] as IBuildingInfo;
}

export function getBuildingName(building: Building) {
    const data = getBuildingData(building);
    return getAoeString(data.LanguageNameId.toString());
}

export function getBuildingDescription(building: Building) {
    const data = getBuildingData(building);
    let description = sanitizeGameDescription(getAoeString(data.LanguageHelpId.toString()));

    description = strRemoveTo(description, '\n');
    if (description.indexOf('Upgrades:') >= 0)
        description = strRemoveFrom(description, 'Upgrades:');
    if (description.indexOf('‹hp›') >= 0)
        description = strRemoveFrom(description, '‹hp›');

    description = description.replace(/\n/g, ' ');
    description = description.replace(/  /g, ' ');
    description = description.trim();

    // console.log("new desc", JSON.stringify(description));

    return description;
}
