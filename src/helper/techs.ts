import {aoeData, aoeStringKey, aoeTechDataId} from "../data/data";
import {Civ} from "./civs";
import {sanitizeGameDescription, strRemoveTo} from "./util";


interface IEffect {
    carryCapacity?: string;
    gatheringSpeed?: string;
    hitPoints?: string;
    accuracy?: string;
    attack?: string;
    armor?: string;
    speed?: string;
    sight?: string;
    conversionDefense?: string;
    creationSpeed?: string;
    capacity?: string;
    other?: string;
    [key: string]: string | undefined;
}

interface ITech {
    dataId: aoeTechDataId;
    name: Tech;
    effect?: IEffect;
}

export interface ITechEffect {
    name?: string;
    tech: Tech;
    civ?: Civ;
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

// : ITechEffectDict2
const techEffectDictInternal = {
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
    'Sultans-GatheringSpeed': {
        tech: 'Sultans',
        civ: 'Indians',
        effect: {
            gatheringSpeed: 'gold +10%',
        },
    },
    'Sultans': {
        tech: 'Sultans',
        civ: 'Indians',
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
    'Orthodoxy': {
        tech: 'Orthodoxy',
        civ: 'Slavs',
        effect: {
            armor: '+3/+3',
        },
    },
    'Inquisition': {
        tech: 'Inquisition',
        civ: 'Spanish',
        effect: {
            other: 'monks convert faster',
        },
    },
    'Madrasah': {
        tech: 'Madrasah',
        civ: 'Saracens',
        effect: {
            other: 'monks return gold when they die',
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
    'Panokseon': {
        tech: 'Panokseon',
        civ: 'Koreans',
        effect: {
            speed: '+15%',
        },
    },
    'Shipwright': {
        tech: 'Shipwright',
        effect: {
            creationSpeed: '+54%',
            other: 'wood cost -20%',
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
        civ: 'Malay',
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
        civ: 'Indians',
        effect: {
            range: '+1',
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
            creationSpeed: '+100%',
        },
    },
    'Berserkergang': {
        tech: 'Berserkergang',
        civ: 'Vikings',
        effect: {
            other: 'increases regeneration speed',
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
        civ: 'Khmer',
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
        },
    },
    'Perfusion': {
        tech: 'Perfusion',
        civ: 'Goths',
        effect: {
            creationSpeed: '+100%',
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
    'Mahouts': {
        tech: 'Mahouts',
        civ: 'Persians',
        effect: {
            speed: '+30%',
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
            hitPoints: '+50',
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
    'Zealotry': {
        tech: 'Zealotry',
        civ: 'Saracens',
        effect: {
            hitPoints: '+30',
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
            attack: '+3 attack against buildings and standard buildings',
        },
    },
    'Stirrups': {
        tech: 'Stirrups',
        civ: 'Khmer',
        effect: {
            firingRate: '+25% attack speed',
        },
    },
    'Stirrups-Mounted': {
        tech: 'Stirrups',
        civ: 'Khmer',
        effect: {
            firingRate: '+25% attack speed, Mounted',
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
    'ParthianTactics-2': {
        tech: 'ParthianTactics',
        effect: {
            attack: '+2 attack against Spearmen',
            armor: '+1/+2',
        },
    },
    'ParthianTactics-4': {
        tech: 'ParthianTactics',
        effect: {
            attack: '+4 attack against Spearmen',
            armor: '+1/+2',
        },
    },
    'RecurveBow': {
        tech: 'RecurveBow',
        civ: 'Indians',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    'SilkArmor': {
        tech: 'SilkArmor',
        civ: 'Malay',
        effect: {
            armor: '+1 pierce armor',
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
        civ: 'Burmese',
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
        civ: 'Vietnamese',
        effect: {
            armor: '+2 pierce armor',
        },
    },
    'ObsidianArrows': {
        tech: 'ObsidianArrows',
        civ: 'Mayans',
        effect: {
            attack: 'gives +6 attack against standard buildings and fortifications',
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
    'Arson-Dismounted': {
        tech: 'Arson',
        effect: {
            attack: '+2 attack against standard buildings, Dismounted',
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
    'ScaleMailArmor-Dismounted': {
        tech: 'ScaleMailArmor',
        effect: {
            armor: '+1/+1, Dismounted',
        },
    },
    'ChainMailArmor-Dismounted': {
        tech: 'ChainMailArmor',
        effect: {
            armor: '+1/+1, Dismounted',
        },
    },
    'PlateMailArmor-Dismounted': {
        tech: 'PlateMailArmor',
        effect: {
            armor: '+1/+2, Dismounted',
        },
    },
    'FabricShields': {
        tech: 'FabricShields',
        civ: 'Indians',
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
    'Squires-Dismounted': {
        tech: 'Squires',
        effect: {
            speed: '+10%, Dismounted',
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

// export const techEffectDict = techEffectDictInternal as ITechEffectDict;
export const techEffectDict = addNameToTechEffectDict(techEffectDictInternal as any) as ITechEffectDict;

// var d = techEffectDictInternal['Artillery'].
// var d = techEffectDict['Artillery']

export const techList: ITech[] = [
    {
        dataId: '629',
        name: 'PaperMoney',
    },
    {
        dataId: '11',
        name: 'Crenellations',
    },
    {
        dataId: '487',
        name: 'Nomads',
    },
    {
        dataId: '576',
        name: 'Tigui',
    },
    {
        dataId: '624',
        name: 'Thalassocracy',
    },
    {
        dataId: '691',
        name: 'HillForts',
    },
    {
        dataId: '484',
        name: 'Yasama',
    },
    {
        dataId: '21',
        name: 'Atheism',
    },
    {
        dataId: '690',
        name: 'CumanMercenaries',
    },
    {
        dataId: '462',
        name: 'GreatWall',
    },
    {
        dataId: '482',
        name: 'Stronghold',
    },
    {
        dataId: '213',
        name: 'Wheelbarrow',
    },
    {
        dataId: '249',
        name: 'HandCart',
    },
    {
        dataId: '13',
        name: 'HeavyPlow',
    },
    {
        dataId: '202',
        name: 'DoubleBitAxe',
    },
    {
        dataId: '203',
        name: 'BowSaw',
    },
    {
        dataId: '221',
        name: 'TwoManSaw',
    },
    {
        dataId: '55',
        name: 'StoneMining',
    },
    {
        dataId: '279',
        name: 'StoneShaftMining',
    },
    {
        dataId: '55',
        name: 'GoldMining',
    },
    {
        dataId: '182',
        name: 'GoldShaftMining',
    },
    {
        dataId: '22',
        name: 'Loom',
    },
    {
        dataId: '321',
        name: 'Sappers',
    },
    {
        dataId: '54',
        name: 'TreadmillCrane',
    },
    {
        dataId: '440',
        name: 'Supremacy',
    },
    {
        dataId: '65',
        name: 'Gillnets',
    },
    {
        dataId: '48',
        name: 'Caravan',
    },
    {
        dataId: '499',
        name: 'SilkRoad',
    },
    {
        dataId: '506',
        name: 'Sultans',
    },
    {
        dataId: '231',
        name: 'Sanctity',
    },
    {
        dataId: '316',
        name: 'Redemption',
    },
    {
        dataId: '319',
        name: 'Atonement',
    },
    {
        dataId: '441',
        name: 'HerbalMedicine',
    },
    {
        dataId: '252',
        name: 'Fervor',
    },
    {
        dataId: '233',
        name: 'Illumination',
    },
    {
        dataId: '230',
        name: 'BlockPrinting',
    },
    {
        dataId: '438',
        name: 'Theocracy',
    },
    {
        dataId: '512',
        name: 'Orthodoxy',
    },
    {
        dataId: '492',
        name: 'Inquisition',
    },
    {
        dataId: '490',
        name: 'Madrasah',
    },

    {
        dataId: '464',
        name: 'GreekFire',
    },
    {
        dataId: '572',
        name: 'Carrack',
    },
    {
        dataId: '486',
        name: 'Panokseon',
    },
    {
        dataId: '373',
        name: 'Shipwright',
    },
    {
        dataId: '374',
        name: 'Careening',
    },
    {
        dataId: '375',
        name: 'DryDock',
    },
    {
        dataId: '461',
        name: 'Warwolf',
    },
    {
        dataId: '688',
        name: 'TimuridSiegecraft',
    },
    {
        dataId: '59',
        name: 'Kataparuto',
    },
    {
        dataId: '10',
        name: 'Artillery',
    },
    {
        dataId: '445',
        name: 'Shinkichon',
    },
    {
        dataId: '5',
        name: 'FurorCeltica',
    },
    {
        dataId: '377',
        name: 'SiegeEngineers',
    },
    {
        dataId: '575',
        name: 'TorsionEngines',
    },
    {
        dataId: '623',
        name: 'DoubleCrossbow',
    },
    {
        dataId: '489',
        name: 'Ironclad',
    },
    {
        dataId: '6',
        name: 'Drill',
    },
    {
        dataId: '507',
        name: 'Shatagni',
    },
    {
        dataId: '573',
        name: 'Arquebus',
    },
    {
        dataId: '574',
        name: 'RoyalHeirs',
    },
    {
        dataId: '49',
        name: 'Berserkergang',
    },
    {
        dataId: '16',
        name: 'Anarchy',
    },
    {
        dataId: '83',
        name: 'BeardedAxe',
    },
    {
        dataId: '4',
        name: 'ElDorado',
    },
    {
        dataId: '686',
        name: 'Bagains',
    },
    {
        dataId: '625',
        name: 'ForcedLevy',
    },
    {
        dataId: '24',
        name: 'GarlandWars',
    },
    {
        dataId: '513',
        name: 'Druzhina',
    },
    {
        dataId: '463',
        name: 'Chieftains',
    },
    {
        dataId: '457',
        name: 'Perfusion',
    },
    {
        dataId: '716',
        name: 'Supplies',
    },
    {
        dataId: '514',
        name: 'CorvinianArmy',
    },
    {
        dataId: '483',
        name: 'Marauders',
    },
    {
        dataId: '7',
        name: 'Mahouts',
    },
    {
        dataId: '61',
        name: 'Logistica',
    },
    {
        dataId: '626',
        name: 'Howdah',
    },
    {
        dataId: '622',
        name: 'TuskSwords',
    },
    {
        dataId: '628',
        name: 'Chatras',
    },
    {
        dataId: '9',
        name: 'Zealotry',
    },
    {
        dataId: '577',
        name: 'Farimba',
    },
    {
        dataId: '627',
        name: 'ManipurCavalry',
    },
    {
        dataId: '685',
        name: 'Stirrups',
    },
    {
        dataId: '81',
        name: 'ScaleBardingArmor',
    },
    {
        dataId: '82',
        name: 'ChainBardingArmor',
    },
    {
        dataId: '80',
        name: 'PlateBardingArmor',
    },
    {
        dataId: '493',
        name: 'Chivalry',
    },

    {
        dataId: '578',
        name: 'Kasbah',
    },
    {
        dataId: '579',
        name: 'MaghrebiCamels',
    },
    {
        dataId: '52',
        name: 'Rocketry',
    },
    {
        dataId: '435',
        name: 'Bloodlines',
    },
    {
        dataId: '491',
        name: 'Sipahi',
    },
    {
        dataId: '436',
        name: 'ParthianTactics',
    },
    {
        dataId: '515',
        name: 'RecurveBow',
    },
    {
        dataId: '687',
        name: 'SilkArmor',
    },
    {
        dataId: '39',
        name: 'Husbandry',
    },
    {
        dataId: '689',
        name: 'SteppeHusbandry',
    },

    {
        dataId: '460',
        name: 'Atlatl',
    },
    {
        dataId: '692',
        name: 'TowerShields',
    },
    {
        dataId: '485',
        name: 'ObsidianArrows',
    },
    {
        dataId: '3',
        name: 'Yeomen',
    },
    {
        dataId: '494',
        name: 'Pavise',
    },
    {
        dataId: '488',
        name: 'Kamandaran',
    },

    {
        dataId: '437',
        name: 'ThumbRing',
    },
    {
        dataId: '93',
        name: 'Ballistics',
    },
    {
        dataId: '516',
        name: 'AndeanSling',
    },

    {
        dataId: '211',
        name: 'PaddedArcherArmor',
    },
    {
        dataId: '212',
        name: 'LeatherArcherArmor',
    },
    {
        dataId: '219',
        name: 'RingArcherArmor',
    },

    {
        dataId: '199',
        name: 'Fletching',
    },
    {
        dataId: '200',
        name: 'BodkinArrow',
    },
    {
        dataId: '201',
        name: 'Bracer',
    },

    {
        dataId: '47',
        name: 'Chemistry',
    },

    {
        dataId: '67',
        name: 'Forging',
    },
    {
        dataId: '68',
        name: 'IronCasting',
    },
    {
        dataId: '75',
        name: 'BlastFurnace',
    },
    {
        dataId: '602',
        name: 'Arson',
    },
    {
        dataId: '74',
        name: 'ScaleMailArmor',
    },
    {
        dataId: '76',
        name: 'ChainMailArmor',
    },
    {
        dataId: '77',
        name: 'PlateMailArmor',
    },
    {
        dataId: '517',
        name: 'FabricShields',
    },
    {
        dataId: '215',
        name: 'Squires',
    },
    {
        dataId: '90',
        name: 'Tracking',
    },
    {
        dataId: '45',
        name: 'Faith',
    },
    {
        dataId: '439',
        name: 'Heresy',
    },
    {
        dataId: '315',
        name: 'Conscription',
    },
];

export const techs: ITechDict = Object.assign({}, ...techList.map((x) => ({[x.name]: x})));

interface TechDict {
    [tech: string]: any;
}

const techIcons = {
    'Forging': require('../../assets/techs/Forging.png'),
    'IronCasting': require('../../assets/techs/IronCasting.png'),
    'BlastFurnace': require('../../assets/techs/BlastFurnace.png'),
    'Arson': require('../../assets/techs/Arson.png'),
    'ScaleMailArmor': require('../../assets/techs/ScaleMailArmor.png'),
    'ChainMailArmor': require('../../assets/techs/ChainMailArmor.png'),
    'PlateMailArmor': require('../../assets/techs/PlateMailArmor.png'),
    'Squires': require('../../assets/techs/Squires.png'),
    'Tracking': require('../../assets/techs/Tracking.png'),
    'Faith': require('../../assets/techs/Faith.png'),
    'Heresy': require('../../assets/techs/Heresy.png'),
    'Conscription': require('../../assets/techs/Conscription.png'),
    'ThumbRing': require('../../assets/techs/ThumbRing.png'),
    'Ballistics': require('../../assets/techs/Ballistics.png'),
    'PaddedArcherArmor': require('../../assets/techs/PaddedArcherArmor.png'),
    'LeatherArcherArmor': require('../../assets/techs/LeatherArcherArmor.png'),
    'RingArcherArmor': require('../../assets/techs/RingArcherArmor.png'),
    'Fletching': require('../../assets/techs/Fletching.png'),
    'BodkinArrow': require('../../assets/techs/BodkinArrow.png'),
    'Bracer': require('../../assets/techs/Bracer.png'),
    'Chemistry': require('../../assets/techs/Chemistry.png'),
    'Bloodlines': require('../../assets/techs/Bloodlines.png'),
    'ParthianTactics': require('../../assets/techs/ParthianTactics.png'),
    'Husbandry': require('../../assets/techs/Husbandry.png'),
    'ScaleBardingArmor': require('../../assets/techs/ScaleBardingArmor.png'),
    'ChainBardingArmor': require('../../assets/techs/ChainBardingArmor.png'),
    'PlateBardingArmor': require('../../assets/techs/PlateBardingArmor.png'),
    'Supplies': require('../../assets/techs/Supplies.png'),
    'SiegeEngineers': require('../../assets/techs/SiegeEngineers.png'),
    'Careening': require('../../assets/techs/Careening.png'),
    'DryDock': require('../../assets/techs/DryDock.png'),
    'Shipwright': require('../../assets/techs/Shipwright.png'),
    'Sanctity': require('../../assets/techs/Sanctity.png'),
    'Redemption': require('../../assets/techs/Redemption.png'),
    'Atonement': require('../../assets/techs/Atonement.png'),
    'HerbalMedicine': require('../../assets/techs/HerbalMedicine.png'),
    'Fervor': require('../../assets/techs/Fervor.png'),
    'Illumination': require('../../assets/techs/Illumination.png'),
    'BlockPrinting': require('../../assets/techs/BlockPrinting.png'),
    'Theocracy': require('../../assets/techs/Theocracy.png'),
    'Caravan': require('../../assets/techs/Caravan.png'),
    'Gillnets': require('../../assets/techs/Gillnets.png'),
    'Wheelbarrow': require('../../assets/techs/Wheelbarrow.png'),
    'HandCart': require('../../assets/techs/HandCart.png'),
    'HeavyPlow': require('../../assets/techs/HeavyPlow.png'),
    'DoubleBitAxe': require('../../assets/techs/DoubleBitAxe.png'),
    'BowSaw': require('../../assets/techs/BowSaw.png'),
    'TwoManSaw': require('../../assets/techs/TwoManSaw.png'),
    'StoneMining': require('../../assets/techs/StoneMining.png'),
    'StoneShaftMining': require('../../assets/techs/StoneShaftMining.png'),
    'GoldMining': require('../../assets/techs/GoldMining.png'),
    'GoldShaftMining': require('../../assets/techs/GoldShaftMining.png'),
    'Loom': require('../../assets/techs/Loom.png'),
    'Sappers': require('../../assets/techs/Sappers.png'),
    'TreadmillCrane': require('../../assets/techs/TreadmillCrane.png'),

    'Atlatl': require('../../assets/techs/UniqueTechCastle.png'),
    'Kasbah': require('../../assets/techs/UniqueTechCastle.png'),
    'Yeomen': require('../../assets/techs/UniqueTechCastle.png'),
    'Stirrups': require('../../assets/techs/UniqueTechCastle.png'),
    'Howdah': require('../../assets/techs/UniqueTechCastle.png'),
    'GreekFire': require('../../assets/techs/UniqueTechCastle.png'),
    'Stronghold': require('../../assets/techs/UniqueTechCastle.png'),
    'GreatWall': require('../../assets/techs/UniqueTechCastle.png'),
    'SteppeHusbandry': require('../../assets/techs/UniqueTechCastle.png'),
    'RoyalHeirs': require('../../assets/techs/UniqueTechCastle.png'),
    'Chivalry': require('../../assets/techs/UniqueTechCastle.png'),
    'Anarchy': require('../../assets/techs/UniqueTechCastle.png'),
    'Marauders': require('../../assets/techs/UniqueTechCastle.png'),
    'AndeanSling': require('../../assets/techs/UniqueTechCastle.png'),
    'Sultans': require('../../assets/techs/UniqueTechCastle.png'),
    'Pavise': require('../../assets/techs/UniqueTechCastle.png'),
    'Yasama': require('../../assets/techs/UniqueTechCastle.png'),
    'TuskSwords': require('../../assets/techs/UniqueTechCastle.png'),
    'Panokseon': require('../../assets/techs/UniqueTechCastle.png'),
    'HillForts': require('../../assets/techs/UniqueTechCastle.png'),
    'CorvinianArmy': require('../../assets/techs/UniqueTechCastle.png'),
    'Thalassocracy': require('../../assets/techs/UniqueTechCastle.png'),
    'Tigui': require('../../assets/techs/UniqueTechCastle.png'),
    'ObsidianArrows': require('../../assets/techs/UniqueTechCastle.png'),
    'Nomads': require('../../assets/techs/UniqueTechCastle.png'),
    'Kamandaran': require('../../assets/techs/UniqueTechCastle.png'),
    'Carrack': require('../../assets/techs/UniqueTechCastle.png'),
    'Madrasah': require('../../assets/techs/UniqueTechCastle.png'),
    'Orthodoxy': require('../../assets/techs/UniqueTechCastle.png'),
    'Inquisition': require('../../assets/techs/UniqueTechCastle.png'),
    'SilkArmor': require('../../assets/techs/UniqueTechCastle.png'),
    'Ironclad': require('../../assets/techs/UniqueTechCastle.png'),
    'Sipahi': require('../../assets/techs/UniqueTechCastle.png'),
    'Chatras': require('../../assets/techs/UniqueTechCastle.png'),
    'Chieftains': require('../../assets/techs/UniqueTechCastle.png'),

    'GarlandWars': require('../../assets/techs/UniqueTechImperial.jpg'),
    'MaghrebiCamels': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Warwolf': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Bagains': require('../../assets/techs/UniqueTechImperial.jpg'),
    'ManipurCavalry': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Logistica': require('../../assets/techs/UniqueTechImperial.jpg'),
    'FurorCeltica': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Rocketry': require('../../assets/techs/UniqueTechImperial.jpg'),
    'CumanMercenaries': require('../../assets/techs/UniqueTechImperial.jpg'),
    'TorsionEngines': require('../../assets/techs/UniqueTechImperial.jpg'),
    'BeardedAxe': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Perfusion': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Atheism': require('../../assets/techs/UniqueTechImperial.jpg'),
    'FabricShields': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Shatagni': require('../../assets/techs/UniqueTechImperial.jpg'),
    'SilkRoad': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Kataparuto': require('../../assets/techs/UniqueTechImperial.jpg'),
    'DoubleCrossbow': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Shinkichon': require('../../assets/techs/UniqueTechImperial.jpg'),
    'TowerShields': require('../../assets/techs/UniqueTechImperial.jpg'),
    'RecurveBow': require('../../assets/techs/UniqueTechImperial.jpg'),
    'ForcedLevy': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Farimba': require('../../assets/techs/UniqueTechImperial.jpg'),
    'ElDorado': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Drill': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Mahouts': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Arquebus': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Zealotry': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Druzhina': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Supremacy': require('../../assets/techs/UniqueTechImperial.jpg'),
    'TimuridSiegecraft': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Crenellations': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Artillery': require('../../assets/techs/UniqueTechImperial.jpg'),
    'PaperMoney': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Berserkergang': require('../../assets/techs/UniqueTechImperial.jpg'),
};

export type Tech = keyof typeof techIcons;
export type TechEffect = keyof typeof techEffectDictInternal;

export function getTechIcon(tech: Tech) {
    return techIcons[tech];
}

export function getTechName(tech: Tech) {
    const techEntry = techs[tech];
    if (techEntry == null) {
        throw Error(`getTechName ${tech} - no dataId`);
    }
    const dataId = techEntry.dataId;
    const data = aoeData.data.techs[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}

export function getTechDescription(tech: Tech) {
    const techEntry = techs[tech];
    if (techEntry == null) {
        throw Error(`getTechName ${tech} - no dataId`);
    }
    const dataId = techEntry.dataId;
    const data = aoeData.data.techs[dataId];
    let description = sanitizeGameDescription(aoeData.strings[data.LanguageHelpId.toString() as aoeStringKey]);

    description = strRemoveTo(description, '\n');

    description = description.replace(/\n/g, ' ');
    description = description.trim();

    // console.log("new desc", JSON.stringify(description));

    return description;
}
