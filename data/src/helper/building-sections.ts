import {flatMap} from "lodash";
import {Building} from "./buildings";
import {getUiTranslation} from '../lib/aoe-data';


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
        title: getUiTranslation('building.section.military'),
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
        title: getUiTranslation('building.section.economy'),
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
        title: getUiTranslation('building.section.peopleandscience'),
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
        title: getUiTranslation('building.section.special'),
        data: [
            "Wonder",
        ],
    },
    {
        title: getUiTranslation('building.section.towers'),
        data: [
            "Outpost",
            "WatchTower",
            "GuardTower",
            "Keep",
            "BombardTower",
        ],
    },
    {
        title: getUiTranslation('building.section.walls'),
        data: [
            "PalisadeWall",
            "StoneWall",
            "FortifiedWall",
        ],
    },
    {
        title: getUiTranslation('building.section.gates'),
        data: [
            "PalisadeGate",
            "Gate",
        ],
    },
];
