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
        title: 'Military Production',
        data: [
            "Barracks",
            "ArcheryRange",
            "Stable",
            "SiegeWorkshop",
            "Dock",
            "Castle",
            "Krepost",
        ],
    },
    {
        title: 'Eco',
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
        title: 'People & Science',
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
        title: 'Special',
        data: [
            "Wonder",
        ],
    },
    {
        title: 'Towers',
        data: [
            "Outpost",
            "WatchTower",
            "GuardTower",
            "Keep",
            "BombardTower",
        ],
    },
    {
        title: 'Walls',
        data: [
            "PalisadeWall",
            "StoneWall",
            "FortifiedWall",
        ],
    },
    {
        title: 'Gates',
        data: [
            "PalisadeGate",
            "Gate",
        ],
    },
];
