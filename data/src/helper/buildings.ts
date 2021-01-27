import {ICostDict, IUnitClassPair} from "./units";
import {aoeBuildingDataId, aoeData} from "../data/data";
import {sanitizeGameDescription, strRemoveFrom, strRemoveTo, unwrap} from "../lib/util";
import {getAoeString} from '../../../app/src/helper/translate-data';

interface IBuilding {
    dataId: aoeBuildingDataId;
    name: Building;
}

interface IBuildingDict {
    [building: string]: IBuilding;
}

export const buildingList: IBuilding[] = [
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
        "dataId": "78",
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
        "dataId": "790",
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


export const buildings: IBuildingDict = Object.assign({}, ...buildingList.map((x) => ({[x.name]: x})));

interface BuildingDict {
    [building: string]: any;
}

const buildingIds = [
    'ArcheryRange',
    'Barracks',
    'Blacksmith',
    'BombardTower',
    'Castle',
    'Dock',
    'Donjon',
    'Farm',
    'Feitoria',
    'FishTrap',
    'FortifiedWall',
    'Gate',
    'GuardTower',
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
