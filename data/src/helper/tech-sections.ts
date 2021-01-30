import {Tech} from "./techs";
import {civDict, civs} from "./civs";
import {getBuildingName} from './buildings';

interface ITechSection {
    title: string;
    data: Tech[];
}

export const techSections: ITechSection[] = [
    {
        title: getBuildingName('TownCenter'),
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
        title: getBuildingName('Mill'),
        data: [
            "HorseCollar",
            "HeavyPlow",
            "CropRotation",
        ],
    },
    {
        title: getBuildingName('LumberCamp'),
        data: [
            "DoubleBitAxe",
            "BowSaw",
            "TwoManSaw",
        ],
    },
    {
        title: getBuildingName('MiningCamp'),
        data: [
            "StoneMining",
            "GoldMining",
            "StoneShaftMining",
            "GoldShaftMining",
        ],
    },
    {
        title: getBuildingName('Market'),
        data: [
            "Caravan",
            "Coinage",
            "Banking",
            "Guilds",
        ],
    },
    {
        title: getBuildingName('Monastery'),
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
        title: getBuildingName('Dock'),
        data: [
            "Gillnets",
            "Shipwright",
            "Careening",
            "DryDock",
        ],
    },
    {
        title: getBuildingName('University'),
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
        title: getBuildingName('Blacksmith'),
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
        title: getBuildingName('Stable'),
        data: [
            "Bloodlines",
            "Husbandry",
        ],
    },
    {
        title: getBuildingName('ArcheryRange'),
        data: [
            "ThumbRing",
            "ParthianTactics",
        ],
    },
    {
        title: getBuildingName('Barracks'),
        data: [
            "Tracking",
            "Supplies",
            "Squires",
            "Arson",
        ],
    },
    {
        title: getBuildingName('Castle'),
        data: [
            "Hoardings",
            "Sappers",
            "Conscription",
            "SpiesTreason",
        ],
    },
    ...civs.map(civ => ({
        title: civ,
        data: civDict[civ].uniqueTechs,
    })),
];
