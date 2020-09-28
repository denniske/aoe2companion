import {civDict, civs, Tech} from "@nex/data";

interface ITechSection {
    title: string;
    data: Tech[];
}

export const techSections: ITechSection[] = [
    {
        title: 'Town Center',
        data: [
            "Loom",
            "Wheelbarrow",
            "HandCart",
            "TownWatch",
            "TownPatrol",
        ],
    },
    {
        title: 'Mill',
        data: [
            "HorseCollar",
            "HeavyPlow",
            "CropRotation",
        ],
    },
    {
        title: 'Lumber Camp',
        data: [
            "DoubleBitAxe",
            "BowSaw",
            "TwoManSaw",
        ],
    },
    {
        title: 'Mining Camp',
        data: [
            "StoneMining",
            "GoldMining",
            "StoneShaftMining",
            "GoldShaftMining",
        ],
    },
    {
        title: 'Market',
        data: [
            "Caravan",
            "Coinage",
            "Banking",
            "Guilds",
        ],
    },
    {
        title: 'Monastery',
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
        title: 'Dock',
        data: [
            "Gillnets",
            "Shipwright",
            "Careening",
            "DryDock",
        ],
    },
    {
        title: 'University',
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
        title: 'Blacksmith',
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
        title: 'Stable',
        data: [
            "Bloodlines",
            "Husbandry",
        ],
    },
    {
        title: 'Archery Range',
        data: [
            "ThumbRing",
            "ParthianTactics",
        ],
    },
    {
        title: 'Barracks',
        data: [
            "Tracking",
            "Supplies",
            "Squires",
            "Arson",
        ],
    },
    {
        title: 'Castle',
        data: [
            "Hoardings",
            "Sappers",
            "Conscription",
            "SpiesTreason",
        ],
    },
    {
        title: 'Age',
        data: [
            "FeudalAge",
            "CastleAge",
            "ImperialAge",
        ],
    },
    ...civs.map(civ => ({
        title: civ,
        data: civDict[civ].uniqueTechs,
    })),
];
