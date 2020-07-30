import {aoeData, aoeStringKey, aoeBuildingDataId} from "../data/data";
import {sanitizeGameDescription, strRemoveFrom, strRemoveTo} from "./util";
import {ICostDict} from "./units";

interface IBuilding {
    dataId: aoeBuildingDataId;
    name: Building;
}

interface IBuildingDict {
    [building: string]: IBuilding;
}


export const buildingList: IBuilding[] = [
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

const buildingIcons = {
    'ArcheryRange': require('../../assets/buildings/ArcheryRange.png'),
    'Barracks': require('../../assets/buildings/Barracks.png'),
    'Blacksmith': require('../../assets/buildings/Blacksmith.png'),
    'BombardTower': require('../../assets/buildings/BombardTower.png'),
    'Castle': require('../../assets/buildings/Castle.png'),
    'Dock': require('../../assets/buildings/Dock.png'),
    'Farm': require('../../assets/buildings/Farm.png'),
    'Feitoria': require('../../assets/buildings/Feitoria.png'),
    'FishTrap': require('../../assets/buildings/FishTrap.png'),
    'FortifiedWall': require('../../assets/buildings/FortifiedWall.png'),
    'Gate': require('../../assets/buildings/Gate.png'),
    'GuardTower': require('../../assets/buildings/GuardTower.png'),
    'House': require('../../assets/buildings/House.png'),
    'Keep': require('../../assets/buildings/Keep.png'),
    'Krepost': require('../../assets/buildings/Krepost.png'),
    'LumberCamp': require('../../assets/buildings/LumberCamp.png'),
    'Market': require('../../assets/buildings/Market.png'),
    'Mill': require('../../assets/buildings/Mill.png'),
    'MiningCamp': require('../../assets/buildings/MiningCamp.png'),
    'Monastery': require('../../assets/buildings/Monastery.png'),
    'Outpost': require('../../assets/buildings/Outpost.png'),
    'PalisadeGate': require('../../assets/buildings/PalisadeGate.png'),
    'PalisadeWall': require('../../assets/buildings/PalisadeWall.png'),
    'SiegeWorkshop': require('../../assets/buildings/SiegeWorkshop.png'),
    'Stable': require('../../assets/buildings/Stable.png'),
    'StoneWall': require('../../assets/buildings/StoneWall.png'),
    'TownCenter': require('../../assets/buildings/TownCenter.png'),
    'University': require('../../assets/buildings/University.png'),
    'WatchTower': require('../../assets/buildings/GuardTower.png'),
    'Wonder': require('../../assets/buildings/Wonder.png'),
};

export type Building = keyof typeof buildingIcons;

export interface IBuildingInfo {
    Cost: ICostDict;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    Attack: number;
    GarrisonCapacity: number;
    HP: number;
    LineOfSight: number;
    MeleeArmor: number;
    PierceArmor: number;
    Range: number;
    TrainTime: number;
}

export function getBuildingIcon(building: Building) {
    return buildingIcons[building];
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
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}

export function getBuildingDescription(building: Building) {
    const data = getBuildingData(building);
    let description = sanitizeGameDescription(aoeData.strings[data.LanguageHelpId.toString() as aoeStringKey]);

    description = strRemoveTo(description, '\n');
    if (description.indexOf('Upgrades:') >= 0)
        description = strRemoveFrom(description, 'Upgrades:');
    if (description.indexOf('‹hp›') >= 0)
        description = strRemoveFrom(description, '‹hp›');

    description = description.replace(/\n/g, ' ');
    description = description.replace(/  /g, ' ');
    description = description.trim();

    console.log("new desc", JSON.stringify(description));

    return description;
}
