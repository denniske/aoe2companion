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
    icon: string;
    data: Building[];
}

export const buildingSections: IBuildingSection[] = [
    {
        title: 'building.section.military',
        icon: 'swords',
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
        icon: 'leaf',
        data: [
            "FishTrap",
            "Mill",
            "Folwark",
            "Pasture",
            "Farm",
            "LumberCamp",
            "MiningCamp",
            "MuleCart",
        ],
    },
    {
        title: 'building.section.peopleandscience',
        icon: 'flask',
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
        icon: 'sparkles',
        data: [
            "Wonder",
            "Feitoria",
            "Caravanserai",
        ],
    },
    {
        title: 'building.section.towers',
        icon: 'tower-observation',
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
        icon: 'block-brick',
        data: [
            "PalisadeWall",
            "StoneWall",
            "FortifiedWall",
        ],
    },
    {
        title: 'building.section.gates',
        icon: 'door-open',
        data: [
            "PalisadeGate",
            "Gate",
        ],
    },
];
