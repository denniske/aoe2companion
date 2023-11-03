import {flatMap} from 'lodash';
import {Building, getBuildingName} from "./buildings";
import {Civ} from './civs';


interface IGenericSection<T> {
    building?: Building;
    civ?: Civ;
    data: T[];
}

export function makeListFromSections<T>(sections: IGenericSection<T>[]) {
    return flatMap(sections, section => {
        return [
            {
                type: 'section',
                data: section.building ? getBuildingName(section.building) : section.civ!,
            },
            ...section.data.map(data => ({
                type: 'item',
                data: data,
            })),
        ]
    })
}

interface IBuildingSection {
    title: string;
    data: Building[];
}

export const buildingSections: IBuildingSection[] = [
    {
        title: 'building.section.military',
        data: [
            "Barracks",
            "ArcheryRange",
            "Stable",
            "SiegeWorkshop",
            "Dock",
            "Harbor",
            "Castle",
            "Krepost",
            "Donjon",
        ],
    },
    {
        title: 'building.section.economy',
        data: [
            "FishTrap",
            "Mill",
            "Folwark",
            "Farm",
            "LumberCamp",
            "MiningCamp",
            "MuleCart",
        ],
    },
    {
        title: 'building.section.peopleandscience',
        data: [
            "TownCenter",
            "House",
            "Blacksmith",
            "Market",
            "Monastery",
            "FortifiedChurch",
            "University",
        ],
    },
    {
        title: 'building.section.special',
        data: [
            "Wonder",
            "Feitoria",
            "Caravanserai",
        ],
    },
    {
        title: 'building.section.towers',
        data: [
            "Outpost",
            "WatchTower",
            "GuardTower",
            "Keep",
            "BombardTower",
        ],
    },
    {
        title: 'building.section.walls',
        data: [
            "PalisadeWall",
            "StoneWall",
            "FortifiedWall",
        ],
    },
    {
        title: 'building.section.gates',
        data: [
            "PalisadeGate",
            "Gate",
        ],
    },
];
