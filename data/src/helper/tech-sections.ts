import {Tech} from "./techs";
import {Civ, civDict, civs} from "./civs";
import {Building} from './buildings';

interface ITechSection {
    building?: Building;
    civ?: Civ;
    data: Tech[];
}

export const techSections: ITechSection[] = [
    {
        building: 'TownCenter',
        data: [
            "Loom",
            "Wheelbarrow",
            "HandCart",
            "TownWatch",
            "TownPatrol",
            "FeudalAge",
            "CastleAge",
            "ImperialAge",
        ],
    },
    {
        building: 'Mill',
        data: [
            "HorseCollar",
            "HeavyPlow",
            "CropRotation",
        ],
    },
    {
        building: 'LumberCamp',
        data: [
            "DoubleBitAxe",
            "BowSaw",
            "TwoManSaw",
        ],
    },
    {
        building: 'MiningCamp',
        data: [
            "StoneMining",
            "GoldMining",
            "StoneShaftMining",
            "GoldShaftMining",
        ],
    },
    {
        building: 'Market',
        data: [
            "Caravan",
            "Coinage",
            "Banking",
            "Guilds",
        ],
    },
    {
        building: 'Monastery',
        data: [
            "Sanctity",
            "Redemption",
            "Atonement",
            "HerbalMedicine",
            "Fervor",
            "Illumination",
            "BlockPrinting",
            "Theocracy",
            "Faith",
            "Heresy",
        ],
    },
    {
        building: 'Dock',
        data: [
            "Gillnets",
            "Shipwright",
            "Careening",
            "DryDock",
        ],
    },
    {
        building: 'University',
        data: [
            "Masonry",
            "Architecture",
            "SiegeEngineers",
            "TreadmillCrane",
            "MurderHoles",
            "ArrowSlits",
            "HeatedShot",
            "Ballistics",
            "Chemistry",
        ],
    },
    {
        building: 'Blacksmith',
        data: [
            "Forging",
            "IronCasting",
            "BlastFurnace",

            "ScaleMailArmor",
            "ChainMailArmor",
            "PlateMailArmor",

            "ScaleBardingArmor",
            "ChainBardingArmor",
            "PlateBardingArmor",

            "Fletching",
            "BodkinArrow",
            "Bracer",

            "PaddedArcherArmor",
            "LeatherArcherArmor",
            "RingArcherArmor",
        ],
    },
    {
        building: 'Stable',
        data: [
            "Bloodlines",
            "Husbandry",
        ],
    },
    {
        building: 'ArcheryRange',
        data: [
            "ThumbRing",
            "ParthianTactics",
        ],
    },
    {
        building: 'Barracks',
        data: [
            "Tracking",
            "Supplies",
            "Squires",
            "Arson",
        ],
    },
    {
        building: 'Castle',
        data: [
            "Hoardings",
            "Sappers",
            "Conscription",
            "SpiesTreason",
        ],
    },
    // ...civs.map(civ => ({
    //     civ: civ,
    //     data: civDict[civ].uniqueTechs,
    // })),
];
