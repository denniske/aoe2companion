import {Civ} from "./civs";
import {getUnitLineIdForUnit, ICostDict, sortedUnitLines, Unit, UnitLine, unitLines} from "./units";
import {aoeData, aoeTechDataId} from "../data/data";
import {keysOf, sanitizeGameDescription, strRemoveTo, unwrap} from "../lib/util";
import {getAoeString} from '../lib/aoe-data';
import {flatMap} from 'lodash';
import {Building, BuildingLine, buildingLineIds, buildingLines, getBuildingLineIdForBuilding} from "./buildings";

export type Effect =
    'carryCapacity' |
    'gatheringSpeed' |
    'hitPoints' |
    'attack' |
    'range' |
    'firingRate' |
    'accuracy' |
    'armor' |
    'speed' |
    'sight' |
    'conversionDefense' |
    'creationSpeed' |
    'capacity' |
    'other';

type IEffect = Partial<{
    [key in Effect]: string;
}>;

export type Age = 'Dark' | 'Feudal' | 'Castle' | 'Imperial';

export function getAgeFromAgeTech(ageTech: Tech) {
    // if (ageTech === 'DarkAge') return 'Dark';
    if (ageTech === 'FeudalAge') return 'Feudal';
    if (ageTech === 'CastleAge') return 'Castle';
    if (ageTech === 'ImperialAge') return 'Imperial';
    return null;
}

interface ITech {
    dataId: aoeTechDataId;
    name: Tech;
    effect?: IEffect;
    civ?: Civ;
    age?: Age;
}

export interface ITechEffect {
    name?: string;
    tech?: Tech;
    civ?: Civ;
    unit?: Unit;
    onlyUnits?: Unit[];
    building?: Building;
    effect: IEffect;
}

interface ITechDict {
    [tech: string]: ITech;
}

type ITechEffectDict = {
    [techEffect in TechEffect]: ITechEffect;
};
type ITechEffectDict2 = {
    [techEffect: string]: ITechEffect;
};

// use this when adding tech effects and remove afterwards
// : ITechEffectDict2

const techEffectDictInternal = {

    // For Buildings


    'TreadmillCrane-Georgians': {
        tech: 'TreadmillCrane',
        civ: 'Georgians',
        effect: {
            other: '+20% construction speed',
        },
    },
    'Architecture-Georgians': {
        tech: 'Architecture',
        civ: 'Georgians',
        effect: {
            hitPoints: '+10%',
            armor: '+1/+1, +3 building armor',
        },
    },

    'Fletching-FortifiedChurch': {
        tech: 'Fletching',
        effect: {
            attack: '+1',
        },
    },
    'BodkinArrow-FortifiedChurch': {
        tech: 'BodkinArrow',
        effect: {
            attack: '+1',
        },
    },
    'Bracer-FortifiedChurch': {
        tech: 'Bracer',
        effect: {
            attack: '+1',
        },
    },

    'SvanTowers-Tower': {
        tech: 'SvanTowers',
        civ: 'Georgians',
        effect: {
            attack: '+2, enables pass-through damage',
        },
    },
    'SvanTowers': {
        tech: 'SvanTowers',
        civ: 'Georgians',
        effect: {
            attack: '+2',
        },
    },
    'Atheism': {
        tech: 'Atheism',
        civ: 'Huns',
        effect: {
            other: 'adds 100 years to Wonder victories for all players',
        },
    },
    'Guilds': {
        tech: 'Guilds',
        effect: {
            other: 'reduces commodity trading fee to 15%',
        },
    },
    'FirstCrusade-TownCenter': {
        tech: 'FirstCrusade',
        civ: 'Sicilians',
        effect: {
            other: 'creates 5 Serjeants once at up to 5 Town Centers each',
        },
    },
    'Fletching-TownCenter': {
        tech: 'Fletching',
        effect: {
            attack: '+1',
            sight: '+1',
        },
    },
    'BodkinArrow-TownCenter': {
        tech: 'BodkinArrow',
        effect: {
            attack: '+1',
            sight: '+1',
        },
    },
    'Bracer-TownCenter': {
        tech: 'Bracer',
        effect: {
            attack: '+1',
            sight: '+1',
        },
    },
    'Tigui': {
        tech: 'Tigui',
        civ: 'Malians',
        effect: {
            attack: '+8 arrows always',
        },
    },
    'HillForts': {
        tech: 'HillForts',
            civ: 'Lithuanians',
        effect: {
            range: '+3',
        },
    },
    'HorseCollar-Farm': {
        tech: 'HorseCollar',
        effect: {
            other: '+75 food quantity',
        },
    },
    'HeavyPlow-Farm': {
        tech: 'HeavyPlow',
        effect: {
            other: '+125 food quantity',
        },
    },
    'CropRotation-Farm': {
        tech: 'CropRotation',
        effect: {
            other: '+175 food quantity',
        },
    },
    'Thalassocracy': {
        tech: 'Thalassocracy',
        civ: 'Malay',
        effect: {
            other: 'upgrades to Harbor',
        },
    },
    'Perfusion': {
        tech: 'Perfusion',
        civ: 'Goths',
        effect: {
            creationSpeed: '+100%',
        },
    },
    'TimuridSiegecraft-Castle': {
        tech: 'TimuridSiegecraft',
        civ: 'Tatars',
        effect: {
            other: 'allows creation of Flaming Camel',
        },
    },
    'Marauders-Stable': {
        tech: 'Marauders',
        civ: 'Huns',
        effect: {
            other: 'allows creation of Tarkans',
        },
    },
    'Anarchy-Barracks': {
        tech: 'Anarchy',
        civ: 'Goths',
        effect: {
            other: 'allows creation of Huskarls',
        },
    },
    'FlemishRevolution-Barracks': {
        tech: 'FlemishRevolution',
        civ: 'Burgundians',
        effect: {
            other: 'allows creation of Flemish Militia',
        },
    },

    'Nomads': {
        tech: 'Nomads',
        civ: 'Mongols',
        effect: {
            other: 'houses do not lose their population room when destroyed',
        },
    },
    'Masonry': {
        tech: 'Masonry',
        effect: {
            hitPoints: '+10%',
            armor: '+1/+1, +3 building armor',
        },
    },
    'Architecture': {
        tech: 'Architecture',
        effect: {
            hitPoints: '+10%',
            armor: '+1/+1, +3 building armor',
        },
    },
    'GreatWall': {
        tech: 'GreatWall',
        civ: 'Chinese',
        effect: {
            hitPoints: '+30%',
        },
    },

    'ArrowSlits': {
        tech: 'ArrowSlits',
        effect: {
            attack: '+1',
        },
    },
    'HeatedShot': {
        tech: 'HeatedShot',
        effect: {
            attack: '+125% attack against ships',
        },
    },

    'Yeomen-Tower': {
        tech: 'Yeomen',
        civ: 'Britons',
        effect: {
            attack: '+2',
        },
    },
    'Yasama': {
        tech: 'Yasama',
        civ: 'Japanese',
        effect: {
            attack: 'adds two extra arrows',
        },
    },

    'Eupseong': {
        tech: 'Eupseong',
        civ: 'Koreans',
        effect: {
            range: '+2',
        },
    },

    'MurderHoles': {
        tech: 'MurderHoles',
        effect: {
            range: 'eliminates minimum range',
        },
    },

    'Stronghold-Infantry': {
        tech: 'Stronghold',
        civ: 'Celts',
        effect: {
            other: 'regenerate 30 HP/min when within 7 tiles radius of a team Celts Castle',
        },
    },
    'Stronghold-Castle': {
        tech: 'Stronghold',
        civ: 'Celts',
        effect: {
            other: 'heal allied infantry in a 7 tile radius',
            firingRate: '+33%',
        },
    },
    'Stronghold-Tower': {
        tech: 'Stronghold',
        civ: 'Celts',
        effect: {
            firingRate: '+33%',
        },
    },

    'TownWatch': {
        tech: 'TownWatch',
        effect: {
            sight: '+4',
        },
    },
    'TownPatrol': {
        tech: 'TownPatrol',
        effect: {
            sight: '+4',
        },
    },

    'HerbalMedicine': {
        tech: 'HerbalMedicine',
        civ: 'Aztecs',
        effect: {
            other: 'garrisoned units heal faster',
        },
    },

    'Crenellations': {
        tech: 'Crenellations',
        civ: 'Teutons',
        effect: {
            other: 'garrisoned infantry fire arrows',
        },
    },

    'Detinets': {
        tech: 'Detinets',
        civ: 'Slavs',
        effect: {
            other: 'replaces 40% of stone cost with wood',
        },
    },

    'Hoardings': {
        tech: 'Hoardings',
        effect: {
            hitPoints: '+21%',
        },
    },

    'CumanMercenaries': {
        tech: 'CumanMercenaries',
        civ: 'Cumans',
        effect: {
            other: 'grants to each ally the possibility to train 5 Elite Kipchaks for free per Castle',
        },
    },


    // For Units

    'CilicianFleet-BlastRadius': {
        tech: 'CilicianFleet',
        civ: 'Armenians',
        effect: {
            attack: '+20% blast radius',
        },
    },
    'CilicianFleet-Range': {
        tech: 'CilicianFleet',
        civ: 'Armenians',
        effect: {
            range: '+1',
        },
    },

    'Fereters-HP': {
        tech: 'Fereters',
        civ: 'Armenians',
        effect: {
            hitPoints: '+30',
        },
    },

    'AznauriCavalry': {
        tech: 'AznauriCavalry',
        civ: 'Georgians',
        effect: {
            other: '-15% population space',
        },
    },
    'Fereters': {
        tech: 'Fereters',
        effect: {
            hitPoints: '+30',
            other: '+100% heal speed',
        },
    },
    'Centurion': {
        unit: 'Centurion',
        effect: {
            other: '+10% (+15%) movement speed and +20% attack speed within 10 (12) tiles radius of a (Elite) Centurion',
        },
    },
    'Comitatenses': {
        tech: 'Comitatenses',
        civ: 'Romans',
        effect: {
            attack:  '+5 charge attack',
            creationSpeed:  '+50%',
        },
    },
    'Ballistas': {
        tech: 'Ballistas',
        civ: 'Romans',
        effect: {
            firingRate:  '+33%',
        },
    },
    'PaperMoney': {
        tech: 'PaperMoney',
        civ: 'Vietnamese',
        effect: {
            other: 'Lumberjacks slowly generate gold in addition to wood.',
        },
    },
    'Counterweights': {
        tech: 'Counterweights',
        civ: 'Saracens',
        effect: {
            attack: '+15%',
        },
    },
    'Kshatriyas': {
        tech: 'Kshatriyas',
        civ: 'Gurjaras',
        effect: {
            other: 'food cost -25%',
        },
    },
    'FrontierGuards': {
        tech: 'FrontierGuards',
        civ: 'Gurjaras',
        effect: {
            armor: '+4/+0',
        },
    },
    'MedicalCorps': {
        tech: 'MedicalCorps',
        civ: 'Dravidians',
        effect: {
            other: 'regenerate 30 HP per minute',
        },
    },
    'WootzSteel': {
        tech: 'WootzSteel',
        civ: 'Dravidians',
        effect: {
            attack: 'attack ignores armor',
        },
    },
    'Paiks': {
        tech: 'Paiks',
        civ: 'Bengalis',
        effect: {
            firingRate:  '+20%',
        },
    },
    'Mahayana': {
        tech: 'Mahayana',
        civ: 'Bengalis',
        effect: {
            other: 'take -10% population space',
        },
    },

    'BurgundianVineyards': {
        tech: 'BurgundianVineyards',
        civ: 'Burgundians',
        effect: {
            other: 'generate gold while farming',
        },
    },
    'FlemishRevolution': {
        tech: 'FlemishRevolution',
        civ: 'Burgundians',
        effect: {
            other: 'turns them into Flemish Militia',
        },
    },
    'WagenburgTactics': {
        tech: 'WagenburgTactics',
        civ: 'Bohemians',
        effect: {
            speed: '+15%',
        },
    },
    'HussiteReforms-Monastery': {
        tech: 'HussiteReforms',
        civ: 'Bohemians',
        effect: {
            other: 'gold cost of monks and techs replaced with food',
        },
    },
    'HussiteReforms': {
        tech: 'HussiteReforms',
        civ: 'Bohemians',
        effect: {
            other: 'gold cost replaced with food',
        },
    },
    'SzlachtaPrivileges': {
        tech: 'SzlachtaPrivileges',
        civ: 'Poles',
        effect: {
            other: 'gold cost -60%',
        },
    },
    'LechiticLegacy': {
        tech: 'LechiticLegacy',
        civ: 'Poles',
        effect: {
            attack: '33% blast damage in 0.5 tile radius',
        },
    },
    // 'FeudalAge-ScoutCavalry': {
    //     tech: 'FeudalAge',
    //     unit: 'ScoutCavalry',
    //     effect: {
    //         attack: '+2',
    //         speed: '+0.35',
    //         sight: '+2',
    //     },
    // },
    // 'CastleAge-ScoutCavalry': {
    //     tech: 'CastleAge',
    //     unit: 'ScoutCavalry',
    //     effect: {
    //         sight: '+2',
    //     },
    // },
    // 'ImperialAge-ScoutCavalry': {
    //     tech: 'ImperialAge',
    //     unit: 'ScoutCavalry',
    //     effect: {
    //         sight: '+2',
    //     },
    // },
    // 'ImperialAge-LightCavalry': {
    //     tech: 'ImperialAge',
    //     unit: 'LightCavalry',
    //     effect: {
    //         sight: '+2',
    //     },
    // },
    'Wheelbarrow-Speed': {
        tech: 'Wheelbarrow',
        effect: {
            speed: '+10%',
        },
    },
    'HandCart-Speed': {
        tech: 'HandCart',
        effect: {
            speed: '+10%',
        },
    },
    'Wheelbarrow': {
        tech: 'Wheelbarrow',
        effect: {
            carryCapacity: '+3',
            speed: '+10%',
        },
    },
    'HandCart': {
        tech: 'HandCart',
        effect: {
            carryCapacity: '+7',
            speed: '+10%',
        },
    },
    'HeavyPlow': {
        tech: 'HeavyPlow',
        effect: {
            carryCapacity: '+1, only Farmers',
        },
    },
    'DoubleBitAxe': {
        tech: 'DoubleBitAxe',
        effect: {
            gatheringSpeed: 'wood +20%',
        },
    },
    'BowSaw': {
        tech: 'BowSaw',
        effect: {
            gatheringSpeed: 'wood +20%',
        },
    },
    'TwoManSaw': {
        tech: 'TwoManSaw',
        effect: {
            gatheringSpeed: 'wood +10%',
        },
    },
    'StoneMining': {
        tech: 'StoneMining',
        effect: {
            gatheringSpeed: 'stone +15%',
        },
    },
    'StoneShaftMining': {
        tech: 'StoneShaftMining',
        effect: {
            gatheringSpeed: 'stone +15%',
        },
    },
    'GoldMining': {
        tech: 'GoldMining',
        effect: {
            gatheringSpeed: 'gold +15%',
        },
    },
    'GoldShaftMining': {
        tech: 'GoldShaftMining',
        effect: {
            gatheringSpeed: 'gold +15%',
        },
    },
    'Loom': {
        tech: 'Loom',
        effect: {
            hitPoints: '+15',
            armor: '+1/+2',
        },
    },
    'Sappers': {
        tech: 'Sappers',
        effect: {
            attack: '+15 attack against buildings and fortifications',
        },
    },
    'TreadmillCrane': {
        tech: 'TreadmillCrane',
        effect: {
            other: '+20% construction speed',
        },
    },
    'Supremacy': {
        tech: 'Supremacy',
        civ: 'Spanish',
        effect: {
            hitPoints: '+40',
            attack: '+6',
            armor: '+2/+2',
        },
    },
    'Gillnets': {
        tech: 'Gillnets',
        effect: {
            other: '+25% working speed',
        },
    },
    'Caravan': {
        tech: 'Caravan',
        effect: {
            speed: '+50%',
        },
    },
    'SilkRoad': {
        tech: 'SilkRoad',
        civ: 'Italians',
        effect: {
            other: '-50% cost',
        },
    },
    'GrandTrunkRoad-GatheringSpeed': {
        tech: 'GrandTrunkRoad',
        civ: 'Hindustanis',
        effect: {
            gatheringSpeed: 'gold +10%',
        },
    },
    'GrandTrunkRoad-Monastery': {
        tech: 'GrandTrunkRoad',
        civ: 'Hindustanis',
        effect: {
            other: '+10% relic gold generation',
        },
    },
    'GrandTrunkRoad-Market': {
        tech: 'GrandTrunkRoad',
        civ: 'Hindustanis',
        effect: {
            other: 'reduces commodity trading fee to 10%',
        },
    },
    'GrandTrunkRoad': {
        tech: 'GrandTrunkRoad',
        civ: 'Hindustanis',
        effect: {
            other: '+10% gold generation',
        },
    },
    'Sanctity-5': {
        tech: 'Sanctity',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Sanctity': {
        tech: 'Sanctity',
        effect: {
            hitPoints: '+15',
        },
    },
    'Redemption-5': {
        tech: 'Redemption',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Redemption': {
        tech: 'Redemption',
        effect: {
            other: 'convert buildings and siege weapons',
        },
    },
    'Atonement-5': {
        tech: 'Atonement',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Atonement': {
        tech: 'Atonement',
        effect: {
            other: 'convert monks',
        },
    },
    'HerbalMedicine-5': {
        tech: 'HerbalMedicine',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Fervor-5': {
        tech: 'Fervor',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Fervor': {
        tech: 'Fervor',
        effect: {
            speed: '+15%',
        },
    },
    'Illumination-5': {
        tech: 'Illumination',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Illumination': {
        tech: 'Illumination',
        effect: {
            other: 'regain faith faster',
        },
    },
    'BlockPrinting-5': {
        tech: 'BlockPrinting',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'BlockPrinting': {
        tech: 'BlockPrinting',
        effect: {
            range: '+3',
        },
    },
    'Theocracy-5': {
        tech: 'Theocracy',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Theocracy': {
        tech: 'Theocracy',
        effect: {
            other: 'only one Monk rests after conversion',
        },
    },
    'Inquisition': {
        tech: 'Inquisition',
        civ: 'Spanish',
        effect: {
            other: 'monks convert faster',
        },
    },
    'Inquisition-1': {
        tech: 'Inquisition',
        civ: 'Spanish',
        effect: {
            range: '+1',
        },
    },

    'GreekFire-Dromon': {
        tech: 'GreekFire',
        civ: 'Byzantines',
        effect: {
            attack: '+0.2 blast radius',
        },
    },
    'GreekFire-BombardTower': {
        tech: 'GreekFire',
        civ: 'Byzantines',
        effect: {
            attack: '+0.5 blast radius with 25% damage',
        },
    },
    'GreekFire': {
        tech: 'GreekFire',
        civ: 'Byzantines',
        effect: {
            range: '+1',
        },
    },
    'Carrack': {
        tech: 'Carrack',
        civ: 'Portuguese',
        effect: {
            armor: '+1/+1',
        },
    },
    'Shipwright': {
        tech: 'Shipwright',
        effect: {
            creationSpeed: '+54%',
            other: 'wood cost -20%',
        },
    },
    'Shipwright-Harbor': {
        tech: 'Shipwright',
        effect: {
            creationSpeed: '+54%',
        },
    },
    'Careening-5': {
        tech: 'Careening',
        effect: {
            armor: '+0/+1',
            capacity: '+5',
        },
    },
    'Careening': {
        tech: 'Careening',
        effect: {
            armor: '+0/+1',
        },
    },
    'DryDock-10': {
        tech: 'DryDock',
        effect: {
            speed: '+15%',
            capacity: '+10',
        },
    },
    'DryDock': {
        tech: 'DryDock',
        effect: {
            speed: '+15%',
        },
    },
    'Warwolf': {
        tech: 'Warwolf',
        civ: 'Britons',
        effect: {
            attack: 'gives blast damage',
            accuracy: 'increases accuracy against units to 100%',
        },
    },
    'TimuridSiegecraft': {
        tech: 'TimuridSiegecraft',
        civ: 'Tatars',
        effect: {
            range: '+2',
        },
    },
    'Kataparuto': {
        tech: 'Kataparuto',
        civ: 'Japanese',
        effect: {
            firingRate: '+33%',
            other: 'pack/unpack 4x faster',
        },
    },
    'Artillery': {
        tech: 'Artillery',
        civ: 'Turks',
        effect: {
            range: '+2',
        },
    },
    'Shinkichon': {
        tech: 'Shinkichon',
        civ: 'Koreans',
        effect: {
            range: '+1',
        },
    },
    'FurorCeltica': {
        tech: 'FurorCeltica',
        civ: 'Celts',
        effect: {
            hitPoints: '+40%',
        },
    },
    'SiegeEngineers-20-1': {
        tech: 'SiegeEngineers',
        effect: {
            attack: '+20% attack against buildings',
            range: '+1',
        },
    },
    'SiegeEngineers-20': {
        tech: 'SiegeEngineers',
        effect: {
            attack: '+20% attack against buildings',
        },
    },
    'SiegeEngineers-40': {
        tech: 'SiegeEngineers',
        effect: {
            attack: '+40% attack against buildings',
        },
    },
    'TorsionEngines': {
        tech: 'TorsionEngines',
        civ: 'Ethiopians',
        effect: {
            attack: 'increases blast damage radius',
        },
    },
    'DoubleCrossbow': {
        tech: 'DoubleCrossbow',
        civ: 'Khmer',
        effect: {
            attack: 'gives a second projectile',
        },
    },
    'Ironclad': {
        tech: 'Ironclad',
        civ: 'Teutons',
        effect: {
            armor: '+4/+0',
        },
    },
    'Drill': {
        tech: 'Drill',
        civ: 'Mongols',
        effect: {
            speed: '+50%',
        },
    },
    'Shatagni': {
        tech: 'Shatagni',
        civ: 'Hindustanis',
        effect: {
            range: '+2',
        },
    },
    'Arquebus': {
        tech: 'Arquebus',
        civ: 'Portuguese',
        effect: {
            accuracy: 'hit moving targets',
        },
    },
    'RoyalHeirs': {
        tech: 'RoyalHeirs',
        civ: 'Ethiopians',
        effect: {
            other: '-3 damage from mounted units',
        },
    },
    'Bogsveigar': {
        tech: 'Bogsveigar',
        civ: 'Vikings',
        effect: {
            attack: '+1',
        },
    },
    'Anarchy': {
        tech: 'Anarchy',
        civ: 'Goths',
        effect: {
            other: 'allows creation at Barracks',
        },
    },
    'BeardedAxe': {
        tech: 'BeardedAxe',
        civ: 'Franks',
        effect: {
            range: '+1',
        },
    },
    'ElDorado': {
        tech: 'ElDorado',
        civ: 'Mayans',
        effect: {
            hitPoints: '+40',
        },
    },
    'Bagains': {
        tech: 'Bagains',
        civ: 'Bulgarians',
        onlyUnits: ['TwoHandedSwordsman'],
        effect: {
            armor: '+5/+0',
        },
    },
    'ForcedLevy': {
        tech: 'ForcedLevy',
        civ: 'Malay',
        effect: {
            other: 'changes gold cost to extra food cost',
        },
    },
    'GarlandWars': {
        tech: 'GarlandWars',
        civ: 'Aztecs',
        effect: {
            attack: '+4',
        },
    },
    'Druzhina': {
        tech: 'Druzhina',
        civ: 'Slavs',
        effect: {
            attack: 'gives trample damage',
        },
    },
    'Chieftains': {
        tech: 'Chieftains',
        civ: 'Vikings',
        effect: {
            attack: 'gives +5 attack against cavalry and +4 against camels',
            other: 'generates gold when killing Villagers, trade units, and Monks',
        },
    },
    'Supplies': {
        tech: 'Supplies',
        effect: {
            other: '-15 food cost',
        },
    },
    'CorvinianArmy': {
        tech: 'CorvinianArmy',
        civ: 'Magyars',
        effect: {
            other: 'eliminates the gold cost',
        },
    },
    'Marauders': {
        tech: 'Marauders',
        civ: 'Huns',
        effect: {
            other: 'allows creation at Stables',
        },
    },
    'Citadels': {
        tech: 'Citadels',
        civ: 'Persians',
        effect: {
            attack: '+4 attack, +3 against rams, +3 against infantry',
            other: 'receive -25% bonus damage',
        },
    },
    'Logistica': {
        tech: 'Logistica',
        civ: 'Byzantines',
        effect: {
            attack: '+6 attack against infantry and adds trample damage',
        },
    },
    'Chatras': {
        tech: 'Chatras',
        civ: 'Vietnamese',
        effect: {
            hitPoints: '+100',
        },
    },
    'TuskSwords': {
        tech: 'TuskSwords',
        civ: 'Khmer',
        effect: {
            attack: '+3',
        },
    },
    'Howdah': {
        tech: 'Howdah',
        civ: 'Burmese',
        effect: {
            armor: '+1/+1',
        },
    },
    'Hauberk': {
        tech: 'Hauberk',
        civ: 'Sicilians',
        effect: {
            armor: '+1/+2',
        },
    },
    'Bimaristan': {
        tech: 'Bimaristan',
        civ: 'Saracens',
        effect: {
            other: 'monks automatically heal multiple nearby units',
        },
    },
    'Farimba': {
        tech: 'Farimba',
        civ: 'Malians',
        effect: {
            attack: '+5',
        },
    },
    'ManipurCavalry': {
        tech: 'ManipurCavalry',
        civ: 'Burmese',
        effect: {
            attack: '+5 attack against archers',
        },
    },
    'Stirrups': {
        tech: 'Stirrups',
        civ: 'Bulgarians',
        effect: {
            firingRate: '+33% attack speed',
        },
    },
    'ScaleBardingArmor': {
        tech: 'ScaleBardingArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'ChainBardingArmor': {
        tech: 'ChainBardingArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'PlateBardingArmor': {
        tech: 'PlateBardingArmor',
        effect: {
            armor: '+1/+2',
        },
    },
    'Chivalry': {
        tech: 'Chivalry',
        civ: 'Franks',
        effect: {
            creationSpeed: '+40%',
        },
    },

    'Kasbah': {
        tech: 'Kasbah',
        civ: 'Berbers',
        effect: {
            creationSpeed: '+25%',
        },
    },
    'MaghrebiCamels': {
        tech: 'MaghrebiCamels',
        civ: 'Berbers',
        effect: {
            other: 'gives regeneration ability',
        },
    },
    'Rocketry-2': {
        tech: 'Rocketry',
        civ: 'Chinese',
        effect: {
            attack: '+2',
        },
    },
    'Rocketry-4': {
        tech: 'Rocketry',
        civ: 'Chinese',
        effect: {
            attack: '+4',
        },
    },
    'Bloodlines': {
        tech: 'Bloodlines',
        effect: {
            hitPoints: '+20',
        },
    },
    'Sipahi': {
        tech: 'Sipahi',
        civ: 'Turks',
        effect: {
            hitPoints: '+20',
        },
    },
    'ParthianTactics-Bengalis': {
        tech: 'ParthianTactics',
        civ: 'Bengalis',
        effect: {
            attack: '+2 attack against Spearmen',
            armor: '+1/+2',
        },
    },
    'ParthianTactics': {
        tech: 'ParthianTactics',
        effect: {
            attack: '+2 attack against Spearmen',
            armor: '+1/+2',
        },
    },
    'RecurveBow': {
        tech: 'RecurveBow',
        civ: 'Magyars',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    'SilkArmor': {
        tech: 'SilkArmor',
        civ: 'Tatars',
        effect: {
            armor: '+1/+1',
        },
    },
    'Husbandry': {
        tech: 'Husbandry',
        effect: {
            speed: '+10%',
        },
    },
    'SteppeHusbandry': {
        tech: 'SteppeHusbandry',
        civ: 'Cumans',
        effect: {
            creationSpeed: '+50%',
        },
    },

    'Atlatl': {
        tech: 'Atlatl',
        civ: 'Aztecs',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    'TowerShields': {
        tech: 'TowerShields',
        civ: 'Lithuanians',
        effect: {
            armor: '+2 pierce armor',
        },
    },
    'HulcheJavelineers': {
        tech: 'HulcheJavelineers',
        civ: 'Mayans',
        effect: {
            attack: 'gives a second projectile',
        },
    },
    'Yeomen': {
        tech: 'Yeomen',
        civ: 'Britons',
        effect: {
            range: '+1',
        },
    },
    'Pavise': {
        tech: 'Pavise',
        civ: 'Italians',
        effect: {
            armor: '+1/+1',
        },
    },
    'Kamandaran': {
        tech: 'Kamandaran',
        civ: 'Persians',
        effect: {
            other: 'replaces the cost gold for wood, for total 60 wood each unit',
        },
    },

    'ThumbRing-No': {
        tech: 'ThumbRing',
        effect: {
            accuracy: 'increases accuracy to 100%',
        },
    },
    'ThumbRing-11': {
        tech: 'ThumbRing',
        effect: {
            firingRate: '+11%',
            accuracy: 'increases accuracy to 100%',
        },
    },
    'ThumbRing-18': {
        tech: 'ThumbRing',
        effect: {
            firingRate: '+18%',
            accuracy: 'increases accuracy to 100%',
        },
    },
    'ThumbRing-25': {
        tech: 'ThumbRing',
        effect: {
            firingRate: '+25%',
            accuracy: 'increases accuracy to 100%',
        },
    },
    'ThumbRing-11-No': {
        tech: 'ThumbRing',
        effect: {
            firingRate: '+11%',
        },
    },
    'ThumbRing-18-No': {
        tech: 'ThumbRing',
        effect: {
            firingRate: '+18%',
        },
    },
    'Ballistics': {
        tech: 'Ballistics',
        effect: {
            accuracy: 'hit moving targets',
        },
    },
    'AndeanSling': {
        tech: 'AndeanSling',
        civ: 'Incas',
        effect: {
            range: 'eliminates the minimum range',
        },
    },
    'AndeanSling-1': {
        tech: 'AndeanSling',
        civ: 'Incas',
        effect: {
            attack: '+1',
        },
    },

    'PaddedArcherArmor': {
        tech: 'PaddedArcherArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'LeatherArcherArmor': {
        tech: 'LeatherArcherArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'RingArcherArmor': {
        tech: 'RingArcherArmor',
        effect: {
            armor: '+1/+2',
        },
    },

    'Fletching': {
        tech: 'Fletching',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    'BodkinArrow': {
        tech: 'BodkinArrow',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    'Bracer': {
        tech: 'Bracer',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },

    'Chemistry': {
        tech: 'Chemistry',
        effect: {
            attack: '+1',
        },
    },

    'Forging': {
        tech: 'Forging',
        effect: {
            attack: '+1',
        },
    },
    'IronCasting': {
        tech: 'IronCasting',
        effect: {
            attack: '+1',
        },
    },
    'BlastFurnace': {
        tech: 'BlastFurnace',
        effect: {
            attack: '+2',
        },
    },
    'Forging-Villager': {
        tech: 'Forging',
        civ: 'Incas',
        effect: {
            attack: '+1',
        },
    },
    'IronCasting-Villager': {
        tech: 'IronCasting',
        civ: 'Incas',
        effect: {
            attack: '+1',
        },
    },
    'BlastFurnace-Villager': {
        tech: 'BlastFurnace',
        civ: 'Incas',
        effect: {
            attack: '+2',
        },
    },
    'Arson': {
        tech: 'Arson',
        effect: {
            attack: '+2 attack against standard buildings',
        },
    },
    'Gambesons': {
        tech: 'Gambesons',
        effect: {
            armor: '0/+1',
        },
    },
    'ScaleMailArmor': {
        tech: 'ScaleMailArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'ChainMailArmor': {
        tech: 'ChainMailArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    'PlateMailArmor': {
        tech: 'PlateMailArmor',
        effect: {
            armor: '+1/+2',
        },
    },
    'ScaleMailArmor-Villager': {
        tech: 'ScaleMailArmor',
        civ: 'Incas',
        effect: {
            armor: '+1/+1',
        },
    },
    'ChainMailArmor-Villager': {
        tech: 'ChainMailArmor',
        civ: 'Incas',
        effect: {
            armor: '+1/+1',
        },
    },
    'PlateMailArmor-Villager': {
        tech: 'PlateMailArmor',
        civ: 'Incas',
        effect: {
            armor: '+1/+2',
        },
    },
    'FabricShields': {
        tech: 'FabricShields',
        civ: 'Incas',
        effect: {
            armor: '+1/+2',
        },
    },
    'Squires': {
        tech: 'Squires',
        effect: {
            speed: '+10%',
        },
    },
    'Tracking': {
        tech: 'Tracking',
        effect: {
            sight: '+2',
        },
    },
    'Faith-5': {
        tech: 'Faith',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Faith': {
        tech: 'Faith',
        effect: {
            conversionDefense: '',
        },
    },
    'Devotion-5': {
        tech: 'Devotion',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Devotion': {
        tech: 'Devotion',
        effect: {
            conversionDefense: '',
        },
    },
    'FirstCrusade': {
        tech: 'FirstCrusade',
        civ: 'Silicians',
        effect: {
            conversionDefense: '',
        },
    },
    'Heresy-Malay': {
        tech: 'Heresy',
        civ: 'Malay',
        effect: {
            conversionDefense: '',
        },
    },
    'Heresy-Gurjaras': {
        tech: 'Heresy',
        civ: 'Gurjaras',
        effect: {
            conversionDefense: '',
        },
    },
    'Heresy-5': {
        tech: 'Heresy',
        civ: 'Aztecs',
        effect: {
            hitPoints: '+5',
        },
    },
    'Heresy': {
        tech: 'Heresy',
        effect: {
            conversionDefense: '',
        },
    },
    'Conscription': {
        tech: 'Conscription',
        effect: {
            creationSpeed: '+33%',
        },
    },
};

function addNameToTechEffectDict(dict: ITechEffectDict): ITechEffectDict {
    for (const key in dict) {
        dict[key as TechEffect].name = key as string;
    }
    return dict;
}

export const techEffectDict = addNameToTechEffectDict(techEffectDictInternal as any) as ITechEffectDict;

export const techList: ITech[] = [
    {
        "dataId": "922",
        "name": "CilicianFleet",
        "civ": "Armenians",
        "age": 'Castle',
    },
    {
        "dataId": "921",
        "name": "Fereters",
        "civ": "Armenians",
        "age": 'Castle',
    },
    {
        "dataId": "923",
        "name": "SvanTowers",
        "civ": "Georgians",
        "age": 'Castle',
    },
    {
        "dataId": "924",
        "name": "AznauriCavalry",
        "civ": "Georgians",
        "age": 'Castle',
    },
    {
        "dataId": "883",
        "name": "Ballistas",
        "civ": "Romans",
        "age": 'Castle',
    },
    {
        "dataId": "884",
        "name": "Comitatenses",
        "civ": "Romans",
        "age": 'Imperial',
    },
    {
        "dataId": "875",
        "name": "Gambesons",
    },
    {
        "dataId": "454",
        "name": "Counterweights",
        "civ": "Saracens",
        "age": 'Imperial',
    },
    {
        "dataId": "835",
        "name": "Kshatriyas",
        "civ": "Gurjaras",
        "age": 'Castle',
    },
    {
        "dataId": "836",
        "name": "FrontierGuards",
        "civ": "Gurjaras",
        "age": 'Imperial',
    },
    {
        "dataId": "831",
        "name": "MedicalCorps",
        "civ": "Dravidians",
        "age": 'Castle',
    },
    {
        "dataId": "832",
        "name": "WootzSteel",
        "civ": "Dravidians",
        "age": 'Imperial',
    },
    {
        "dataId": "833",
        "name": "Paiks",
        "civ": "Bengalis",
        "age": 'Castle',
    },
    {
        "dataId": "834",
        "name": "Mahayana",
        "civ": "Bengalis",
        "age": 'Imperial',
    },

    {
        "dataId": "506",
        "name": "GrandTrunkRoad",
        "civ": "Hindustanis",
        "age": 'Castle',
    },

    {
        "dataId": "455",
        "name": "Detinets",
        "civ": "Slavs",
        "age": 'Castle',
    },
    {
        "dataId": "454",
        "name": "Counterweights",
        "civ": "Slavs",
        "age": 'Castle',
    },

    {
        "dataId": "784",
        "name": "WagenburgTactics",
        "civ": "Bohemians",
        "age": 'Castle',
    },
    {
        "dataId": "785",
        "name": "HussiteReforms",
        "civ": "Bohemians",
        "age": 'Imperial',
    },
    {
        "dataId": "782",
        "name": "SzlachtaPrivileges",
        "civ": "Poles",
        "age": 'Castle',
    },
    {
        "dataId": "783",
        "name": "LechiticLegacy",
        "civ": "Poles",
        "age": 'Imperial',
    },

    {
        "dataId": "754",
        "name": "BurgundianVineyards",
        "civ": "Burgundians",
        "age": 'Castle',
    },
    {
        "dataId": "755",
        "name": "FlemishRevolution",
        "civ": "Burgundians",
        "age": 'Imperial',
    },
    {
        "dataId": "756",
        "name": "FirstCrusade",
        "civ": "Sicilians",
        "age": 'Castle',
    },
    {
        "dataId": "757",
        "name": "Hauberk",
        "civ": "Sicilians",
        "age": 'Imperial',
    },
    {
        "dataId": "101",
        "name": "FeudalAge",
    },
    {
        "dataId": "102",
        "name": "CastleAge",
    },
    {
        "dataId": "103",
        "name": "ImperialAge",
    },
    {
        "dataId": "64",
        "name": "BombardTower",
    },
    {
        "dataId": "63",
        "name": "Keep",
    },
    {
        "dataId": "140",
        "name": "GuardTower",
    },
    {
        "dataId": "194",
        "name": "FortifiedWall",
    },

    {
        "dataId": "51",
        "name": "Architecture",
    },
    {
        "dataId": "608",
        "name": "ArrowSlits",
    },
    {
        "dataId": "17",
        "name": "Banking",
    },
    {
        "dataId": "23",
        "name": "Coinage",
    },
    {
        "dataId": "15",
        "name": "Guilds",
    },
    {
        "dataId": "380",
        "name": "HeatedShot",
    },
    {
        "dataId": "379",
        "name": "Hoardings",
    },
    {
        "dataId": "50",
        "name": "Masonry",
    },
    {
        "dataId": "322",
        "name": "MurderHoles",
    },
    {
        "dataId": "280",
        "name": "TownPatrol",
    },
    {
        "dataId": "8",
        "name": "TownWatch",
    },
    {
        "dataId": "408",
        "name": "SpiesTreason",
    },
    {
        "dataId": "14",
        "name": "HorseCollar",
    },
    {
        "dataId": "12",
        "name": "CropRotation",
    },
    {
        "dataId": "629",
        "name": "PaperMoney",
        "civ": "Vietnamese",
        "age": 'Imperial',
    },
    {
        "dataId": "11",
        "name": "Crenellations",
        "civ": "Teutons",
        "age": 'Imperial',
    },
    {
        "dataId": "487",
        "name": "Nomads",
        "civ": "Mongols",
        "age": 'Castle',
    },
    {
        "dataId": "576",
        "name": "Tigui",
        "civ": "Malians",
        "age": 'Castle',
    },
    {
        "dataId": "624",
        "name": "Thalassocracy",
        "civ": "Malay",
        "age": 'Castle',
    },
    {
        "dataId": "691",
        "name": "HillForts",
        "civ": "Lithuanians",
        "age": 'Castle',
    },
    {
        "dataId": "484",
        "name": "Yasama",
        "civ": "Japanese",
        "age": 'Castle',
    },
    {
        "dataId": "21",
        "name": "Atheism",
        "civ": "Huns",
        "age": 'Imperial',
    },
    {
        "dataId": "690",
        "name": "CumanMercenaries",
        "civ": "Cumans",
        "age": 'Imperial',
    },
    {
        "dataId": "462",
        "name": "GreatWall",
        "civ": "Chinese",
        "age": 'Castle',
    },
    {
        "dataId": "482",
        "name": "Stronghold",
        "civ": "Celts",
        "age": 'Castle',
    },
    {
        "dataId": "213",
        "name": "Wheelbarrow"
    },
    {
        "dataId": "249",
        "name": "HandCart"
    },
    {
        "dataId": "13",
        "name": "HeavyPlow"
    },
    {
        "dataId": "202",
        "name": "DoubleBitAxe"
    },
    {
        "dataId": "203",
        "name": "BowSaw"
    },
    {
        "dataId": "221",
        "name": "TwoManSaw"
    },
    {
        "dataId": "278",
        "name": "StoneMining"
    },
    {
        "dataId": "279",
        "name": "StoneShaftMining"
    },
    {
        "dataId": "55",
        "name": "GoldMining"
    },
    {
        "dataId": "182",
        "name": "GoldShaftMining"
    },
    {
        "dataId": "22",
        "name": "Loom"
    },
    {
        "dataId": "321",
        "name": "Sappers"
    },
    {
        "dataId": "54",
        "name": "TreadmillCrane"
    },
    {
        "dataId": "440",
        "name": "Supremacy",
        "civ": "Spanish",
        "age": 'Imperial',
    },
    {
        "dataId": "65",
        "name": "Gillnets"
    },
    {
        "dataId": "48",
        "name": "Caravan"
    },
    {
        "dataId": "499",
        "name": "SilkRoad",
        "civ": "Italians",
        "age": 'Imperial',
    },
    {
        "dataId": "231",
        "name": "Sanctity",
    },
    {
        "dataId": "316",
        "name": "Redemption",
    },
    {
        "dataId": "319",
        "name": "Atonement",
    },
    {
        "dataId": "441",
        "name": "HerbalMedicine",
    },
    {
        "dataId": "252",
        "name": "Fervor",
    },
    {
        "dataId": "233",
        "name": "Illumination",
    },
    {
        "dataId": "230",
        "name": "BlockPrinting",
    },
    {
        "dataId": "438",
        "name": "Theocracy",
    },
    {
        "dataId": "492",
        "name": "Inquisition",
        "civ": "Spanish",
        "age": 'Castle',
    },
    {
        "dataId": "464",
        "name": "GreekFire",
        "civ": "Byzantines",
        "age": 'Castle',
    },
    {
        "dataId": "572",
        "name": "Carrack",
        "civ": "Portuguese",
        "age": 'Castle',
    },
    {
        "dataId": "486",
        "name": "Eupseong",
        "civ": "Koreans",
        "age": 'Castle',
    },
    {
        "dataId": "373",
        "name": "Shipwright"
    },
    {
        "dataId": "374",
        "name": "Careening"
    },
    {
        "dataId": "375",
        "name": "DryDock"
    },
    {
        "dataId": "461",
        "name": "Warwolf",
        "civ": "Britons",
        "age": 'Imperial',
    },
    {
        "dataId": "688",
        "name": "TimuridSiegecraft",
        "civ": "Tatars",
        "age": 'Imperial',
    },
    {
        "dataId": "59",
        "name": "Kataparuto",
        "civ": "Japanese",
        "age": 'Imperial',
    },
    {
        "dataId": "10",
        "name": "Artillery",
        "civ": "Turks",
        "age": 'Imperial',
    },
    {
        "dataId": "445",
        "name": "Shinkichon",
        "civ": "Koreans",
        "age": 'Imperial',
    },
    {
        "dataId": "5",
        "name": "FurorCeltica",
        "civ": "Celts",
        "age": 'Imperial',
    },
    {
        "dataId": "377",
        "name": "SiegeEngineers"
    },
    {
        "dataId": "575",
        "name": "TorsionEngines",
        "civ": "Ethiopians",
        "age": 'Imperial',
    },
    {
        "dataId": "623",
        "name": "DoubleCrossbow",
        "civ": "Khmer",
        "age": 'Imperial',
    },
    {
        "dataId": "489",
        "name": "Ironclad",
        "civ": "Teutons",
        "age": 'Castle',
    },
    {
        "dataId": "6",
        "name": "Drill",
        "civ": "Mongols",
        "age": 'Imperial',
    },
    {
        "dataId": "507",
        "name": "Shatagni",
        "civ": "Hindustanis",
        "age": 'Imperial',
    },
    {
        "dataId": "573",
        "name": "Arquebus",
        "civ": "Portuguese",
        "age": 'Imperial',
    },
    {
        "dataId": "574",
        "name": "RoyalHeirs",
        "civ": "Ethiopians",
        "age": 'Castle',
    },
    {
        "dataId": "49",
        "name": "Bogsveigar",
        "civ": "Vikings",
        "age": 'Imperial',
    },
    {
        "dataId": "16",
        "name": "Anarchy",
        "civ": "Goths",
        "age": 'Castle',
    },
    {
        "dataId": "83",
        "name": "BeardedAxe",
        "civ": "Franks",
        "age": 'Castle',
    },
    {
        "dataId": "4",
        "name": "ElDorado",
        "civ": "Mayans",
        "age": 'Imperial',
    },
    {
        "dataId": "686",
        "name": "Bagains",
        "civ": "Bulgarians",
        "age": 'Imperial',
    },
    {
        "dataId": "625",
        "name": "ForcedLevy",
        "civ": "Malay",
        "age": 'Imperial',
    },
    {
        "dataId": "24",
        "name": "GarlandWars",
        "civ": "Aztecs",
        "age": 'Imperial',
    },
    {
        "dataId": "513",
        "name": "Druzhina",
        "civ": "Slavs",
        "age": 'Imperial',
    },
    {
        "dataId": "463",
        "name": "Chieftains",
        "civ": "Vikings",
        "age": 'Castle',
    },
    {
        "dataId": "457",
        "name": "Perfusion",
        "civ": "Goths",
        "age": 'Imperial',
    },
    {
        "dataId": "716",
        "name": "Supplies"
    },
    {
        "dataId": "514",
        "name": "CorvinianArmy",
        "civ": "Magyars",
        "age": 'Castle',
    },
    {
        "dataId": "483",
        "name": "Marauders",
        "civ": "Huns",
        "age": 'Castle',
    },
    {
        "dataId": "7",
        "name": "Citadels",
        "civ": "Persians",
        "age": 'Imperial',
    },
    {
        "dataId": "61",
        "name": "Logistica",
        "civ": "Byzantines",
        "age": 'Imperial',
    },
    {
        "dataId": "626",
        "name": "Howdah",
        "civ": "Burmese",
        "age": 'Imperial',
    },
    {
        "dataId": "622",
        "name": "TuskSwords",
        "civ": "Khmer",
        "age": 'Castle',
    },
    {
        "dataId": "628",
        "name": "Chatras",
        "civ": "Vietnamese",
        "age": 'Castle',
    },
    {
        "dataId": "28",
        "name": "Bimaristan",
        "civ": "Saracens",
        "age": 'Castle',
    },
    {
        "dataId": "577",
        "name": "Farimba",
        "civ": "Malians",
        "age": 'Imperial',
    },
    {
        "dataId": "627",
        "name": "ManipurCavalry",
        "civ": "Burmese",
        "age": 'Castle',
    },
    {
        "dataId": "685",
        "name": "Stirrups",
        "civ": "Bulgarians",
        "age": 'Castle',
    },
    {
        "dataId": "81",
        "name": "ScaleBardingArmor"
    },
    {
        "dataId": "82",
        "name": "ChainBardingArmor"
    },
    {
        "dataId": "80",
        "name": "PlateBardingArmor"
    },
    {
        "dataId": "493",
        "name": "Chivalry",
        "civ": "Franks",
        "age": 'Imperial',
    },
    {
        "dataId": "578",
        "name": "Kasbah",
        "civ": "Berbers",
        "age": 'Castle',
    },
    {
        "dataId": "579",
        "name": "MaghrebiCamels",
        "civ": "Berbers",
        "age": 'Imperial',
    },
    {
        "dataId": "52",
        "name": "Rocketry",
        "civ": "Chinese",
        "age": 'Imperial',
    },
    {
        "dataId": "435",
        "name": "Bloodlines"
    },
    {
        "dataId": "491",
        "name": "Sipahi",
        "civ": "Turks",
        "age": 'Castle',
    },
    {
        "dataId": "436",
        "name": "ParthianTactics"
    },
    {
        "dataId": "515",
        "name": "RecurveBow",
        "civ": "Magyars",
        "age": 'Imperial',
    },
    {
        "dataId": "687",
        "name": "SilkArmor",
        "civ": "Tatars",
        "age": 'Castle',
    },
    {
        "dataId": "39",
        "name": "Husbandry"
    },
    {
        "dataId": "689",
        "name": "SteppeHusbandry",
        "civ": "Cumans",
        "age": 'Castle',
    },
    {
        "dataId": "460",
        "name": "Atlatl",
        "civ": "Aztecs",
        "age": 'Castle',
    },
    {
        "dataId": "692",
        "name": "TowerShields",
        "civ": "Lithuanians",
        "age": 'Imperial',
    },
    {
        "dataId": "485",
        "name": "HulcheJavelineers",
        "civ": "Mayans",
        "age": 'Castle',
    },
    {
        "dataId": "3",
        "name": "Yeomen",
        "civ": "Britons",
        "age": 'Castle',
    },
    {
        "dataId": "494",
        "name": "Pavise",
        "civ": "Italians",
        "age": 'Castle',
    },
    {
        "dataId": "488",
        "name": "Kamandaran",
        "civ": "Persians",
        "age": 'Castle',
    },
    {
        "dataId": "437",
        "name": "ThumbRing"
    },
    {
        "dataId": "93",
        "name": "Ballistics"
    },
    {
        "dataId": "516",
        "name": "AndeanSling",
        "civ": "Incas",
        "age": 'Castle',
    },
    {
        "dataId": "211",
        "name": "PaddedArcherArmor"
    },
    {
        "dataId": "212",
        "name": "LeatherArcherArmor"
    },
    {
        "dataId": "219",
        "name": "RingArcherArmor"
    },
    {
        "dataId": "199",
        "name": "Fletching"
    },
    {
        "dataId": "200",
        "name": "BodkinArrow"
    },
    {
        "dataId": "201",
        "name": "Bracer"
    },
    {
        "dataId": "47",
        "name": "Chemistry"
    },
    {
        "dataId": "67",
        "name": "Forging",
    },
    {
        "dataId": "68",
        "name": "IronCasting",
    },
    {
        "dataId": "75",
        "name": "BlastFurnace",
    },
    {
        "dataId": "602",
        "name": "Arson"
    },
    {
        "dataId": "74",
        "name": "ScaleMailArmor",
    },
    {
        "dataId": "76",
        "name": "ChainMailArmor",
    },
    {
        "dataId": "77",
        "name": "PlateMailArmor",
    },
    {
        "dataId": "517",
        "name": "FabricShields",
        "civ": "Incas",
        "age": "Imperial",
    },
    {
        "dataId": "215",
        "name": "Squires"
    },
    {
        "dataId": "90",
        "name": "Tracking"
    },
    {
        "dataId": "45",
        "name": "Faith",
    },
    {
        "dataId": "46",
        "name": "Devotion",
    },
    {
        "dataId": "439",
        "name": "Heresy",
    },
    {
        "dataId": "315",
        "name": "Conscription"
    }
];


let groups = [
    {
        name: 'Carry Capacity',
        prop: 'carryCapacity',
    },
    {
        name: 'Gathering Speed',
        prop: 'gatheringSpeed',
    },
    {
        name: 'Hit Points',
        prop: 'hitPoints',
    },
    {
        name: 'Attack',
        prop: 'attack',
    },
    {
        name: 'Range',
        prop: 'range',
    },
    {
        name: 'Firing Rate',
        prop: 'firingRate',
    },
    {
        name: 'Accuracy',
        prop: 'accuracy',
    },
    {
        name: 'Armor',
        prop: 'armor',
    },
    {
        name: 'Speed',
        prop: 'speed',
    },
    {
        name: 'Sight',
        prop: 'sight',
    },
    {
        name: 'Conversion Defense',
        prop: 'conversionDefense',
    },
    {
        name: 'Creation Speed',
        prop: 'creationSpeed',
    },
    {
        name: 'Capacity',
        prop: 'capacity',
    },
    {
        name: 'Other',
        prop: 'other',
    },
];

export const effectNames: TechEffectNameDict = {
    'carryCapacity': 'Carry Capacity',
    'gatheringSpeed': 'Gathering Speed',
    'hitPoints': 'Hit Points',
    'attack': 'Attack',
    'range': 'Range',
    'firingRate': 'Firing Rate',
    'accuracy': 'Accuracy',
    'armor': 'Armor',
    'speed': 'Speed',
    'sight': 'Sight',
    'conversionDefense': 'Conversion Defense',
    'creationSpeed': 'Creation Speed',
    'capacity': 'Capacity',
    'other': 'Other',
};

export function getEffectName(effect: Effect) {
    return effectNames[effect];
}

// const newTechList = techList.map(tech => {
//    const newTech: any = {
//        ...tech,
//    };
//    for (const key in techEffectDictInternal) {
//        if (techEffectDictInternal[key].tech === tech.name && techEffectDictInternal[key].civ) {
//            newTech.civ = techEffectDictInternal[key].civ;
//        }
//    }
//    return newTech;
// });
// console.log(newTechList);


// console.log(techList.filter(t => !t.civ).map(t => t.name));

export const techs: ITechDict = Object.assign({}, ...techList.map((x) => ({[x.name]: x})));

interface TechDict {
    [tech: string]: any;
}

type TechEffectNameDict = {
    [techEffect in Effect]: string;
};

const techIds = [
    'Ballistas',
    'Comitatenses',
    'Gambesons',
    'Counterweights',
    'Kshatriyas',
    'FrontierGuards',
    'MedicalCorps',
    'WootzSteel',
    'Paiks',
    'Mahayana',

    'BurgundianVineyards',
    'FlemishRevolution',
    'FirstCrusade',
    'Hauberk',
    'FeudalAge',
    'CastleAge',
    'ImperialAge',
    'BombardTower',
    'Keep',
    'GuardTower',
    'FortifiedWall',
    'Architecture',
    'ArrowSlits',
    'Banking',
    'Coinage',
    'Guilds',
    'HeatedShot',
    'Hoardings',
    'Masonry',
    'MurderHoles',
    'TownPatrol',
    'TownWatch',
    'SpiesTreason',
    'HorseCollar',
    'CropRotation',
    'Forging',
    'IronCasting',
    'BlastFurnace',
    'Arson',
    'ScaleMailArmor',
    'ChainMailArmor',
    'PlateMailArmor',
    'Squires',
    'Tracking',
    'Devotion',
    'Faith',
    'Heresy',
    'Conscription',
    'ThumbRing',
    'Ballistics',
    'PaddedArcherArmor',
    'LeatherArcherArmor',
    'RingArcherArmor',
    'Fletching',
    'BodkinArrow',
    'Bracer',
    'Chemistry',
    'Bloodlines',
    'ParthianTactics',
    'Husbandry',
    'ScaleBardingArmor',
    'ChainBardingArmor',
    'PlateBardingArmor',
    'Supplies',
    'SiegeEngineers',
    'Careening',
    'DryDock',
    'Shipwright',
    'Sanctity',
    'Redemption',
    'Atonement',
    'HerbalMedicine',
    'Fervor',
    'Illumination',
    'BlockPrinting',
    'Theocracy',
    'Caravan',
    'Gillnets',
    'Wheelbarrow',
    'HandCart',
    'HeavyPlow',
    'DoubleBitAxe',
    'BowSaw',
    'TwoManSaw',
    'StoneMining',
    'StoneShaftMining',
    'GoldMining',
    'GoldShaftMining',
    'Loom',
    'Sappers',
    'TreadmillCrane',

    'Atlatl',
    'Kasbah',
    'Yeomen',
    'Stirrups',
    'Howdah',
    'GreekFire',
    'Stronghold',
    'GreatWall',
    'SteppeHusbandry',
    'RoyalHeirs',
    'Chivalry',
    'Anarchy',
    'Marauders',
    'AndeanSling',
    'GrandTrunkRoad',
    'Pavise',
    'Yasama',
    'TuskSwords',
    'Eupseong',
    'HillForts',
    'CorvinianArmy',
    'Thalassocracy',
    'Tigui',
    'HulcheJavelineers',
    'Nomads',
    'Kamandaran',
    'Carrack',
    'Detinets',
    'Inquisition',
    'SilkArmor',
    'Ironclad',
    'Sipahi',
    'Chatras',
    'Chieftains',
    'WagenburgTactics',
    'SzlachtaPrivileges',
    'CilicianFleet',
    'SvanTowers',

    'Fereters',
    'AznauriCavalry',
    'LechiticLegacy',
    'HussiteReforms',
    'GarlandWars',
    'MaghrebiCamels',
    'Warwolf',
    'Bagains',
    'ManipurCavalry',
    'Logistica',
    'FurorCeltica',
    'Rocketry',
    'CumanMercenaries',
    'TorsionEngines',
    'BeardedAxe',
    'Perfusion',
    'Atheism',
    'FabricShields',
    'Shatagni',
    'SilkRoad',
    'Kataparuto',
    'DoubleCrossbow',
    'Shinkichon',
    'TowerShields',
    'RecurveBow',
    'ForcedLevy',
    'Farimba',
    'ElDorado',
    'Drill',
    'Citadels',
    'Arquebus',
    'Bimaristan',
    'Druzhina',
    'Supremacy',
    'TimuridSiegecraft',
    'Crenellations',
    'Artillery',
    'PaperMoney',
    'Bogsveigar',
] as const;

const TechUnion = unwrap(techIds);
export type Tech = typeof TechUnion;
export type TechEffect = keyof typeof techEffectDictInternal;

export interface ITechInfo {
    Cost: ICostDict;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    ResearchTime: number;
}

export function getTechData(tech: Tech) {
    const techEntry = techs[tech];
    if (techEntry == null) {
        throw Error(`getTechName ${tech} - no dataId`);
    }
    const dataId = techEntry.dataId;
    if (dataId == null) {
        throw Error(`getTechName ${tech} - no dataId`);
    }
    return aoeData.data.techs[dataId] as ITechInfo;
}

export function getTechName(tech: Tech) {
    const data = getTechData(tech);
    return getAoeString(data.LanguageNameId.toString());
}

export function getTechDescription(tech: Tech) {
    const data = getTechData(tech);
    let description = sanitizeGameDescription(getAoeString(data.LanguageHelpId.toString()));

    description = strRemoveTo(description, '\n');

    description = description.replace(/\n/g, ' ');
    description = description.trim();

    // console.log("new desc", JSON.stringify(description));

    return description;
}




export function hasUpgradeForBuildingLine(buildingLineId: BuildingLine, tech: Tech) {
    if (!buildingLines[buildingLineId]) {
        console.log(`hasUpgrade ${buildingLineId} - no buildingLine`);
    }
    return buildingLines[buildingLineId].upgrades.some(u => techEffectDict[u].tech == tech);
}

export function getUpgradesForBuildingLine(buildingLineId: BuildingLine, tech: Tech) {
    return buildingLines[buildingLineId].upgrades.filter(u => techEffectDict[u].tech == tech).map(u => techEffectDict[u]);
}

export function hasUpgradeForBuilding(buildingId: Building, tech: Tech) {
    return buildingLines[getBuildingLineIdForBuilding(buildingId)].upgrades.some(u => techEffectDict[u].tech == tech && (!techEffectDict[u].building || techEffectDict[u].building == buildingId));
}

export function getUpgradesForBuilding(buildingId: Building, tech: Tech) {
    return buildingLines[getBuildingLineIdForBuilding(buildingId)].upgrades.filter(u => techEffectDict[u].tech == tech && (!techEffectDict[u].building || techEffectDict[u].building == buildingId)).map(u => techEffectDict[u]);
}


export function hasUpgradeForUnitLine(unitLineId: UnitLine, tech: Tech) {
    if (!unitLines[unitLineId]) {
        console.log(`hasUpgrade ${unitLineId} - no unitLine`);
    }
    return unitLines[unitLineId].upgrades.some(u => techEffectDict[u].tech == tech);
}

export function getUpgradesForUnitLine(unitLineId: UnitLine, tech: Tech) {
    return unitLines[unitLineId].upgrades.filter(u => techEffectDict[u].tech == tech).map(u => techEffectDict[u]);
}

export function hasUpgradeForUnit(unitId: Unit, tech: Tech) {
    return unitLines[getUnitLineIdForUnit(unitId)].upgrades.some(u => techEffectDict[u].tech == tech && (!techEffectDict[u].unit || techEffectDict[u].unit == unitId));
}

export function getUpgradesForUnit(unitId: Unit, tech: Tech) {
    return unitLines[getUnitLineIdForUnit(unitId)].upgrades.filter(u => techEffectDict[u].tech == tech && (!techEffectDict[u].unit || techEffectDict[u].unit == unitId)).map(u => techEffectDict[u]);
}

interface IAffectedUnit {
    unitId: Unit;
    upgrades: ITechEffect[];
}

interface IAffectedUpgrades {
    upgrades: ITechEffect[];
}

export function getUpgradeList(tech: Tech, affectedUnitInfo: IAffectedUpgrades) {
    const techInfo = techs[tech];

    const getEffectText = (u: ITechEffect, effect: Effect) => {
        return u.effect[effect] + (u.civ && !techInfo.civ ? ' (only '+u.civ+')' : '');
    };

    return keysOf(effectNames).map(effect => ({
        name: getEffectName(effect),
        upgrades: affectedUnitInfo.upgrades.filter(u => effect in u.effect).map(u => getEffectText(u, effect)),
    })).filter(g => g.upgrades.length > 0);
}

export function getAffectedUnitInfos(tech: Tech) {
    const affectedUnitLines = sortedUnitLines.filter(unitLineId => hasUpgradeForUnitLine(unitLineId, tech));

    return flatMap(affectedUnitLines, unitLineId => {
        if (getUpgradesForUnitLine(unitLineId, tech).some(u => u.unit))
            return unitLines[unitLineId].units;
        return [unitLines[unitLineId].units[0]];
    })
        .filter(unitId => hasUpgradeForUnit(unitId, tech))
        .map(unitId => ({
            unitId,
            upgrades: getUpgradesForUnit(unitId, tech),
        }));
}

export function getAffectedBuildingInfos(tech: Tech) {
    const affectedBuildingLines = buildingLineIds.filter(buildingLineId => hasUpgradeForBuildingLine(buildingLineId, tech));

    return flatMap(affectedBuildingLines, buildingLineId => {
        if (getUpgradesForBuildingLine(buildingLineId, tech).some(u => u.unit))
            return buildingLines[buildingLineId].buildings;
        return [buildingLines[buildingLineId].buildings[0]];
    })
        .filter(buildingId => hasUpgradeForBuilding(buildingId, tech))
        .map(buildingId => ({
            buildingId,
            upgrades: getUpgradesForBuilding(buildingId, tech),
        }));
}

export const techsAffectingAllUnits: Tech[] = ['Devotion', 'Faith', 'Heresy', 'Conscription'];
