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
    'FortifiedChurch',
    'MuleCart',
];

const BuildingLineUnion = unwrap(buildingLineIds);
export type BuildingLine = typeof BuildingLineUnion;

export const buildingLines: IBuildingLineDict = {

    'Wonder': {
        buildings: ['Wonder'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'Atheism',
        ],
    },
    'Barracks': {
        buildings: ['Barracks'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Conscription',
            'Perfusion',
            'Anarchy-Barracks',
            'FlemishRevolution-Barracks',
        ],
    },
    'ArcheryRange': {
        buildings: ['ArcheryRange'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Conscription',
        ],
    },
    'Stable': {
        buildings: ['Stable'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Conscription',
            'Chivalry',
            'Marauders-Stable',
        ],
    },
    'SiegeWorkshop': {
        buildings: ['SiegeWorkshop'],
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
    'Dock': {
        buildings: ['Dock'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Shipwright-Harbor',
            'Thalassocracy',
        ],
    },
    'Harbor': {
        buildings: ['Harbor'],
        upgrades: [
            'Masonry',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'HeatedShot',
            'Chemistry',
            'MurderHoles',
            'Ballistics',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Shipwright-Harbor',
        ],
    },
    'Blacksmith': {
        buildings: ['Blacksmith'],
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
    'Caravanserai': {
        buildings: ['Caravanserai'],
        upgrades: [
            'Masonry',
            'TownWatch',
            'TownPatrol',
            'Faith',
        ],
    },
    'Farm': {
        buildings: ['Farm'],
        upgrades: [
            'HorseCollar-Farm',
            'HeavyPlow-Farm',
            'CropRotation-Farm',
            'TreadmillCrane',
        ],
    },
    'Feitoria': {
        buildings: ['Feitoria'],
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
    'FishTrap': {
        buildings: ['FishTrap'],
        upgrades: [

        ],
    },
    'House': {
        buildings: ['House'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Nomads',
        ],
    },
    'LumberCamp': {
        buildings: ['LumberCamp'],
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
    'MiningCamp': {
        buildings: ['MiningCamp'],
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
    'Market': {
        buildings: ['Market'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'TreadmillCrane',
            'Guilds',
            'GrandTrunkRoad-Market',
        ],
    },
    'Mill': {
        buildings: ['Mill'],
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
    'Folwark': {
        buildings: ['Folwark'],
        upgrades: [
            'Masonry',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'TreadmillCrane',
        ],
    },
    'Monastery': {
        buildings: ['Monastery'],
        upgrades: [
            'Masonry',
            'Architecture',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'HussiteReforms-Monastery',
            'GrandTrunkRoad-Monastery',
        ],
    },
    'TownCenter': {
        buildings: ['TownCenter'],
        upgrades: [
            'Masonry',
            'Architecture',
            'Fletching-TownCenter',
            'BodkinArrow-TownCenter',
            'Bracer-TownCenter',
            'Chemistry',
            'Tigui',
            'HillForts',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'HerbalMedicine',
            'FirstCrusade-TownCenter',
        ],
    },
    'University': {
        buildings: ['University'],
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
            'Yeomen-Tower',
            'Yasama',
            'SvanTowers-Tower',
            'Eupseong',
            'MurderHoles',
            'Stronghold-Tower',
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
            'SvanTowers',
            'MurderHoles',
            'Crenellations',
            'Stronghold-Castle',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane',
            'Conscription',
            'Kasbah',
            'HerbalMedicine',
            'CumanMercenaries',
            'Detinets',
            'TimuridSiegecraft-Castle',
            'Citadels',
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
    'FortifiedChurch': {
        buildings: ['FortifiedChurch'],
        upgrades: [
            'Masonry',
            'Architecture-Georgians',
            'Fletching-FortifiedChurch',
            'BodkinArrow-FortifiedChurch',
            'Bracer-FortifiedChurch',
            'Chemistry',
            'SvanTowers',
            'MurderHoles',
            'Ballistics',
            'TownWatch',
            'TownPatrol',
            'TreadmillCrane-Georgians',
            'HerbalMedicine',
        ],
    },
    'MuleCart': {
        buildings: ['MuleCart'],
        upgrades: [
            'Masonry',
            'Architecture-Georgians',
            'TownWatch',
            'TownPatrol',
            'Faith',
            'Heresy',
            'Wheelbarrow-Speed',
            'HandCart-Speed',
            'TreadmillCrane-Georgians',
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
        "dataId": "1806",
        "name": "FortifiedChurch",
    },
    {
        "dataId": "1808",
        "name": "MuleCart",
    },
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
    'FortifiedChurch',
    'MuleCart',
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
