import {flatMap} from "lodash";
import {Building} from "./buildings";


interface IGenericSection<T> {
    title: string;
    data: T[];
}

export function makeListFromSections<T>(sections: IGenericSection<T>[]) {
    return flatMap(sections, section => {
        return [
            {
                type: 'section',
                data: section.title,
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
            "Farm",
            "LumberCamp",
            "MiningCamp",
            "Feitoria",
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
            "University",
        ],
    },
    {
        title: 'building.section.special',
        data: [
            "Wonder",
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
