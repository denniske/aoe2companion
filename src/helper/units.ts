import {Tech, TechEffect} from "./techs";
import {ImageSourcePropType} from "react-native";
import {aoeData, aoeStringKey, aoeUnitDataId} from "../data/data";
import {keysOf, strRemoveFrom, strRemoveTo, unwrap, ValueOf} from "./util";
import {sortBy, uniq} from "lodash-es";
import {Civ} from "./civs";


export interface IUnitLine {
    civ?: Civ;
    unique?: boolean;
    units: Unit[];
    counteredBy?: UnitLine[];
    upgrades: TechEffect[];
}

// type IUnitLineDict = {
//     [unit in UnitLine]: IUnitLine;
// };

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLineNames = [
    'TradeCart',
    'TradeCog',
    'FishingShip',
    'TransportShip',
    'Villager',
    'Missionary',
    'Monk',
    'DemolitionRaft',
    'FireGalley',
    'Galley',
    'CannonGalleon',
    'Arambai',
    'OrganGun',
    'Caravel',
    'SiegeTower',
    'Conquistador',
    'TurtleShip',
    'Longboat',
    'Janissary',
    'BallistaElephant',
    'FlamingCamel',
    'Petard',
    'Trebuchet',
    'BombardCannon',
    'Mangonel',
    'BatteringRam',
    'Scorpion',
    'HandCannoneer',
    'KarambitWarrior',
    'Gbeto',
    'ShotelWarrior',
    'Condottiero',
    'JaguarWarrior',
    'Berserk',
    'TeutonicKnight',
    'Samurai',
    'Huskarl',
    'ThrowingAxeman',
    'WoadRaider',
    'EagleScout',
    'Spearman',
    'Militia',
    'Keshik',
    'Leitis',
    'Konnik',
    'Boyar',
    'MagyarHuszar',
    'Tarkan',
    'Mameluke',
    'WarElephant',
    'Cataphract',
    'SteppeLancer',
    'BattleElephant',
    'CamelRider',
    'Knight',
    'XolotlWarrior',
    'ScoutCavalry',
    'Kipchak',
    'RattanArcher',
    'Genitour',
    'CamelArcher',
    'GenoeseCrossbowman',
    'ElephantArcher',
    'WarWagon',
    'Mangudai',
    'ChuKoNu',
    'Longbowman',
    'CavalryArcher',
    'Skirmisher',
    'Archer',
    'PlumedArcher',
    'Slinger',
    'Kamayuk',
] as const;

export const unitLines: IUnitLineDict = {
    'TradeCart': {
        units: ['TradeCart'],
        upgrades: [
            'Sultans',
            'Caravan',
            'Faith',
            'Heresy',
            'SilkRoad',
        ],
    },
    'TradeCog': {
        units: ['TradeCog'],
        upgrades: [
            'Sultans',
            'Careening',
            'Carrack',
            'DryDock',
            'Caravan',
            'Faith',
            'Heresy',
            'Shipwright',
            'SilkRoad',
        ],
    },
    'FishingShip': {
        units: ['FishingShip'],
        upgrades: [
            'Gillnets',
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'TransportShip': {
        units: ['TransportShip'],
        upgrades: [
            'Careening-5',
            'Carrack',
            'DryDock-10',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'Villager': {
        units: ['Villager'],
        upgrades: [
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
            'Sultans-GatheringSpeed',
            'Loom',
            'Sappers',
            'Forging-Villager',
            'IronCasting-Villager',
            'BlastFurnace-Villager',
            'ScaleMailArmor-Villager',
            'ChainMailArmor-Villager',
            'PlateMailArmor-Villager',
            'Supremacy',
            'Faith',
            'Heresy',
            'TreadmillCrane',
        ],
    },
    'Missionary': {
        units: ['Missionary'],
        counteredBy: [
            'Spearman',
            'Archer',
            'Monk', 
            'CamelRider', 
            'ScoutCavalry', 
            'ShotelWarrior',
            'GenoeseCrossbowman',
            'Arambai'
        ],
        upgrades: [
            'Sanctity',
            'Bloodlines',
            'BlockPrinting',
            'Fervor',
            'Husbandry',
            'Redemption',
            'Atonement',
            'Illumination',
            'Theocracy',
            'Inquisition',
            'Faith',
            'Heresy',
        ],
    },
    'Monk': {
        units: ['Monk'],
        counteredBy: [
            'Monk',
            'ScoutCavalry',
            'ShotelWarrior',
            'EagleScout',
            'MagyarHuszar',
            'Arambai'
        ],
        upgrades: [
            'Sanctity',
            'Sanctity-5',
            'Redemption',
            'Redemption-5',
            'Atonement',
            'Atonement-5',
            'HerbalMedicine-5',
            'Heresy',
            'Heresy-5',
            'Fervor',
            'Fervor-5',
            'Faith',
            'Faith-5',
            'Illumination',
            'Illumination-5',
            'BlockPrinting',
            'BlockPrinting-5',
            'Theocracy',
            'Theocracy-5',
            'Orthodoxy',
            'Inquisition',
            'Madrasah',
        ],
    },
    'DemolitionRaft': {
        units: ['DemolitionRaft', 'DemolitionShip', 'HeavyDemolitionShip'],
        counteredBy: [
            'Archer',
            'Mangonel'
        ],
        upgrades: [
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'FireGalley': {
        units: ['FireGalley', 'FireShip', 'FastFireShip'],
        counteredBy: [
            'Galley',
            'DemolitionRaft',
            'Longboat',
            'TurtleShip',
            'BombardCannon',
            'Mangonel',
            'BallistaElephant'
        ],
        upgrades: [
            'GreekFire',
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'Galley': {
        units: ['Galley', 'WarGalley', 'Galleon'],
        counteredBy: [
            'FireGalley',
            'Longboat',
            'TurtleShip',
            'Petard',
            'Mangonel',
            'BombardCannon',
            'BallistaElephant'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Ballistics',
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'CannonGalleon': {
        units: ['CannonGalleon', 'EliteCannonGalleon'],
        counteredBy: [
          'Galley',
          'FireGalley',
          'DemolitionRaft',
          'Longboat',
          'Caravel',
          'Monk',  
          'BombardCannon'
        ],
        upgrades: [
            'Artillery',
            'Arquebus',
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
            'Shipwright',
        ],
    },
    'Arambai': {
        units: ['Arambai', 'EliteArambai'],
        unique: true,
        civ: 'Burmese',
        counteredBy: [
            'Spearman',
            'Skirmisher',
            'CamelRider',
            'CavalryArcher',
            'Samurai',
            'Kamayuk',
            'Huskarl',
            'GenoeseCrossbowman',
            'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
            'ManipurCavalry',
            'Ballistics',
            'PaddedArcherArmor',
            'Husbandry',
            'Faith',
            'Conscription',
        ],
    },
    'OrganGun': {
        units: ['OrganGun', 'EliteOrganGun'],
        unique: true,
        civ: 'Portuguese',
        counteredBy: [
            'Knight',
            'CamelRider',
            'ScoutCavalry',
            'Mangonel',
            'BombardCannon',
            'Condottiero',
            'Huskarl',
            'Longbowman',
            'Tarkan',
            'Konnik',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ],
        upgrades: [
            'SiegeEngineers-20-1',
            'Arquebus',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Caravel': {
        units: ['Caravel', 'EliteCaravel'],
        unique: true,
        civ: 'Portuguese',
        counteredBy: [
            'FireGalley',
            'Longboat',
            'TurtleShip',
            'Mangonel',
            'BombardCannon'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Ballistics',
            'Careening',
            'Carrack',
            'DryDock',
            'Faith',
            'Heresy',
        ],
    },
    'SiegeTower': {
        units: ['SiegeTower'],
        counteredBy: [
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'SteppeLancer',
            'EagleScout',
            'ShotelWarrior',
            'Condottiero',
            'Tarkan',
            'Konnik',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ],
        upgrades: [
            'FurorCeltica',
            'Ironclad',
            'Drill',
            'Faith',
            'Heresy',
        ],
    },
    'Conquistador': {
        units: ['Conquistador', 'EliteConquistador'],
        unique: true,
        civ: 'Spanish',
        counteredBy: [
            'Spearman',
            'Skirmisher',
            'CamelRider',
            'Mangonel',
            'Condottiero',
            'Huskarl',
            'Berserk',
            'Kamayuk',
            'Samurai',
            'EagleScout',
            'GenoeseCrossbowman'
        ],
        upgrades: [
            'Bloodlines',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'TurtleShip': {
        units: ['TurtleShip', 'EliteTurtleShip'],
        unique: true,
        civ: 'Koreans',
        counteredBy: [
            'Monk',
            'BombardCannon',
            'Trebuchet',
            'Missionary'
        ],
        upgrades: [
            'Careening',
            'DryDock',
            'Panokseon',
            'Faith',
            'Shipwright',
        ],
    },
    'Longboat': {
        units: ['Longboat', 'EliteLongboat'],
        unique: true,
        civ: 'Vikings',
        counteredBy: [
            'FireGalley',
            "TurtleShip",
            'Mangonel',
            'BombardCannon',
            'Samurai'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Ballistics',
            'Careening',
            'DryDock',
            'Faith',
            'Heresy',
        ],
    },
    'Janissary': {
        units: ['Janissary', 'EliteJanissary'],
        unique: true,
        civ: 'Turks',
        counteredBy: [
            'Archer',
            'Skirmisher',
            'Mangonel',
            'BombardCannon',
            'Scorpion',
            'Samurai',
            'Condottiero',
            'Huskarl',
                ],
        upgrades: [
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'BallistaElephant': {
        units: ['BallistaElephant', 'EliteBallistaElephant'],
        unique: true,
        civ: 'Khmer',
        counteredBy: [
            'Spearman', 
            'CamelRider',
            'Mangonel',
            'BombardCannon',
            'BatteringRam',
            'Scorpion',
            'Samurai',
            'EagleScout',
            'Kamayuk',
            'Huskarl',
            'Mameluke',
            'MagyarHuszar',
            'Mangudai'
        ],
        upgrades: [
            'Bloodlines',
            'SiegeEngineers-20-1',
            'Chemistry',
            'DoubleCrossbow',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Conscription',
        ],
    },
    'FlamingCamel': {
        units: ['FlamingCamel'],
        counteredBy: [
            'Spearman',
            'Archer',
            'Monk',
            'Scorpion'
        ],
        upgrades: [
            'SiegeEngineers-20',
            'Conscription',
            'Bloodlines',
            'Husbandry',
        ],
    },
    'Petard': {
        units: ['Petard'],
        counteredBy: [
            'Archer',
            'Knight',
            'ScoutCavalry',
            'CavalryArcher',
            'Scorpion',
            'EagleScout',
            'MagyarHuszar',
            'Mangudai'
        ],
        upgrades: [
            'SiegeEngineers-40',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Trebuchet': {
        units: ['Trebuchet'],
        counteredBy: [
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'Mangonel',
            'BombardCannon',
            'Trebuchet',
            'Petard',
            'BatteringRam',
            'EagleScout',
            'WoadRaider',
            'ThrowingAxeman',
            'Tarkan',
            'Konnik',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer',
            'WarElephant',
            'BattleElephant'
        ],
        upgrades: [
            'SiegeEngineers-20-1',
            'Chemistry',
            'Warwolf',
            'TimuridSiegecraft',
            'Kataparuto',
            'Ironclad',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'BombardCannon': {
        units: ['BombardCannon'],
        counteredBy: [
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'BombardCannon',
            'Petard',
            'EagleScout',
            'Huskarl',
            'Cataphract',
            'WoadRaider',
            'ShotelWarrior',
            'Tarkan',
            'Konnik',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ],
        upgrades: [
            'SiegeEngineers-20-1',
            'TorsionEngines',
            'Artillery',
            'Arquebus',
            'Ironclad',
            'Faith',
            'Heresy',
        ],
    },
    'Mangonel': {
        units: ['Mangonel', 'Onager', 'SiegeOnager'],
        counteredBy: [
            'Monk',
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'Mangonel',
            'BombardCannon',
            'Petard',
            'ShotelWarrior',
            'WoadRaider',
            'Huskarl',
            'EagleScout',
            'Longbowman',
            'Tarkan',
            'Cataphract',
            'MagyarHuszar',
            'SteppeLancer',
            'Mangudai'
        ],
        upgrades: [
            'FurorCeltica',
            'SiegeEngineers-20-1',
            'Chemistry',
            'TorsionEngines',
            'Shinkichon',
            'Ironclad',
            'Drill',
            'Faith',
            'Heresy',
        ],
    },
    'BatteringRam': {
        units: ['BatteringRam', 'CappedRam', 'SiegeRam'],
        counteredBy: [
            'Militia',
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'Mangonel',
            'BombardCannon',
            'Petard',
            'KarambitWarrior',
            'Gbeto',
            'ShotelWarrior',
            'Condottiero',
            'EagleScout',
            'Conquistador',
            'WoadRaider',
            'ThrowingAxeman',
            'ChuKoNu',
            'Tarkan',
            'Mangudai',
            'Cataphract',
            'MagyarHuszar'
        ],
        upgrades: [
            'FurorCeltica',
            'SiegeEngineers-20',
            'Ironclad',
            'Drill',
            'Faith',
            'Heresy',
        ],
    },
    'Scorpion': {
        units: ['Scorpion', 'HeavyScorpion'],
        counteredBy: [
            'ScoutCavalry',
            'Knight',
            'CamelRider',
            'Mangonel',
            'BombardCannon',
            'ShotelWarrior',
            'EagleScout',
            'Condottiero',
            'WoadRaider',
            'Petard',
            'Tarkan'
        ],
        upgrades: [
            'FurorCeltica',
            'SiegeEngineers-20-1',
            'Chemistry',
            'Rocketry-4',
            'TorsionEngines',
            'DoubleCrossbow',
            'Ironclad',
            'Drill',
            'Faith',
            'Heresy',
        ],
    },
    'HandCannoneer': {
        units: ['HandCannoneer'],
        counteredBy: [
            'Archer',
            'Skirmisher',
            'CavalryArcher',
            'Mangonel',
            'Scorpion',
            'Condottiero',
            'RattanArcher',
            'PlumedArcher',
        ],
        upgrades: [
            'Shatagni',
            'Arquebus',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'KarambitWarrior': {
        units: ['KarambitWarrior', 'EliteKarambitWarrior'],
        unique: true,
        civ: 'Malay',
        counteredBy: [
            'Militia',
            'HandCannoneer',
            'Archer',
            'Knight',
            'JaguarWarrior',
            'TeutonicKnight',
            'Berserk',
            'Samurai',
            'Janissary',
            'Slinger',
            'Cataphract',
            'Boyar',
            'Conquistador'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Gbeto': {
        units: ['Gbeto', 'EliteGbeto'],
        unique: true,
        civ: 'Malians',
        counteredBy: [
            'HandCannoneer',
            'Archer',
            'Monk',
            'Missionary',
            'Knight',
            'Mangonel',
            'Scorpion',
            'Samurai',
            'PlumedArcher',
            'Slinger',
            'Janissary'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'ShotelWarrior': {
        units: ['ShotelWarrior', 'EliteShotelWarrior'],
        unique: true,
        civ: 'Ethiopians',
        counteredBy: [
            'Militia',
            'HandCannoneer',
            'Knight',
            'CavalryArcher',
            'Mangonel',
            'Huskarl',
            'TeutonicKnight',
            'Janissary'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
            'RoyalHeirs',
        ],
    },
    'Condottiero': {
        units: ['Condottiero'],
        unique: true,
        counteredBy: [
            'Archer',
            'Scorpion',
            'Samurai',
            'TeutonicKnight',
            'Cataphract',
            'Boyar'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'GarlandWars',
            'Druzhina',
            'Chieftains',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
            'Perfusion',
        ],
    },
    'JaguarWarrior': {
        units: ['JaguarWarrior', 'EliteJaguarWarrior'],
        unique: true,
        civ: 'Aztecs',
        counteredBy: [
           'HandCannoneer',
           'Archer',
           'Knight',
           'Mangonel',
           'Scorpion',
           'Gbeto',
           'Slinger',
           'Janissary',
           'Cataphract',
           'Boyar',
           'Conquistador',
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'GarlandWars',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Berserk': {
        units: ['Berserk', 'EliteBerserk'],
        unique: true,
        civ: 'Vikings',
        counteredBy: [
            'HandCannoneer',
            'JaguarWarrior',
            'TeutonicKnight',
            'PlumedArcher',
            'Slinger',
            'Janissary',
            'Boyar',
            'Conquistador',
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'Chieftains',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
            'Berserkergang',
        ],
    },
    'TeutonicKnight': {
        units: ['TeutonicKnight', 'EliteTeutonicKnight'],
        unique: true,
        civ: 'Teutons',
        counteredBy: [
            'HandCannoneer',
            'Archer',
            'Monk',
            'Missionary',
            'Mangonel',
            'Scorpion',
            'Samurai',
            'Slinger',
            'ChuKoNu',
            'RattanArcher',
            'Janissary',
            'Conquistador'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Samurai': {
        units: ['Samurai', 'EliteSamurai'],
        unique: true,
        civ: 'Japanese',
        counteredBy: [
            'HandCannoneer',
            'Archer',
            'Knight'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Conscription',
        ],
    },
    'Huskarl': {
        units: ['Huskarl', 'EliteHuskarl'],
        unique: true,
        civ: 'Goths',
        counteredBy: [
            'Mangonel',
            'WoadRaider',
            'Militia',
            'Samurai',
            'TeutonicKnight',
            'ThrowingAxeman'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleMailArmor',
            'ChainMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Conscription',
            'Perfusion',
            'Anarchy',
        ],
    },
    'ThrowingAxeman': {
        units: ['ThrowingAxeman', 'EliteThrowingAxeman'],
        unique: true,
        civ: 'Franks',
        counteredBy: [
            'HandCannoneer',
            'Archer',
            'JaguarWarrior',
            'TeutonicKnight',
            'Berserk',
            'Samurai',
            'Slinger',
            'Janissary',
            'Conquistador',
            'Cataphract',
            'Boyar'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'BeardedAxe',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'WoadRaider': {
        units: ['WoadRaider', 'EliteWoadRaider'],
        unique: true,
        civ: 'Celts',
        counteredBy: [
              'HandCannoneer',
              'TeutonicKnight',
              'Berserk',
              'Samurai',
              'JaguarWarrior',
              'Janissary',
              'Slinger',
              'Boyar',
              'Conquistador'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'EagleScout': {
        units: ['EagleScout', 'EagleWarrior', 'EliteEagleWarrior'],
        counteredBy: [
            'Militia',
            'HandCannoneer',
            'KarambitWarrior',
            'Berserk',
            'Samurai',
            'Huskarl',
            'WoadRaider',
            'ThrowingAxeman',
            'Slinger',
            'Janissary',
            'Cataphract'
        ],
        upgrades: [
            'ElDorado',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'GarlandWars',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'FabricShields',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Spearman': {
        units: ['Spearman', 'Pikeman', 'Halberdier'],
        counteredBy: [
            'Militia',
            'Archer',
            'HandCannoneer',
            'Skirmisher',
            'Scorpion',
            'KarambitWarrior',
            'ShotelWarrior',
            'Kamayuk',
            'Berserk',
            'WoadRaider',
            'ThrowingAxeman',
            'ChuKoNu',
            'Gbeto',
            'Janissary',
            'Slinger',
            'Mameluke'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'GarlandWars',
            'Druzhina',
            'Chieftains',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'TowerShields',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
            'Perfusion',
        ],
    },
    'Militia': {
        units: ['Militia', 'ManAtArms', 'LongSwordsman', 'TwoHandedSwordsman', 'Champion'],
        counteredBy: [
            'Archer',
            'HandCannoneer',
            'CavalryArcher',
            'Scorpion',
            'TeutonicKnight',
            'JaguarWarrior',
            'Slinger',
            'ChuKoNu',
            'Janissary',
            'Cataphract',
            'Boyar',
            'Conquistador',
            'WarWagon',
            'BallistaElephant',
            'Genitour',
            'Kipchak',
            'Mangudai'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'GarlandWars',
            'Druzhina',
            'Chieftains',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Bagains',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
            'Perfusion',
            'Supplies',
            'ForcedLevy',
        ],
    },
    'Keshik': {
        units: ['Keshik', 'EliteKeshik'],
        unique: true,
        civ: 'Tatars',
        counteredBy: [
            'Spearman',
            'Monk',
            'Knight',
            'Kamayuk',
            'Berserk',
            'TeutonicKnight',
            'GenoeseCrossbowman',
            'Mameluke',
            'CamelRider',
            'WarElephant',
            'Boyar'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Conscription',
        ],
    },
    'Leitis': {
        units: ['Leitis', 'EliteLeitis'],
        unique: true,
        civ: 'Lithuanians',
        counteredBy: [
            'Spearman',
            'Monk',
            'CamelRider',
            'Kamayuk',
            'Samurai',
            'GenoeseCrossbowman',
            'Mameluke',
            'WarElephant'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Konnik': {
        units: ['Konnik', 'EliteKonnik'],
        unique: true,
        civ: 'Bulgarians',
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson-Dismounted',
            'Stirrups-Mounted',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'ScaleMailArmor-Dismounted',
            'ChainMailArmor-Dismounted',
            'PlateMailArmor-Dismounted',
            'Husbandry',
            'Squires-Dismounted',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Boyar': {
        units: ['Boyar', 'EliteBoyar'],
        unique: true,
        civ: 'Slavs',
        counteredBy: [
          'Spearman',
          'Archer',
          'Monk',
          'Missionary',
          'CamelRider',
          'Scorpion',
          'TeutonicKnight',
          'Berserk',
          'Kamayuk',
          'Samurai',
          'WarElephant',
          'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Conscription',
        ],
    },
    'MagyarHuszar': {
        units: ['MagyarHuszar', 'EliteMagyarHuszar'],
        unique: true,
        civ: 'Magyars',
        counteredBy: [
            'Spearman',
            'CamelRider',
            'EagleScout',
            'Berserk',
            'TeutonicKnight',
            'Kamayuk',
            'Samurai',
            'GenoeseCrossbowman',
            'Mameluke',
            'Boyar'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Heresy',
            'Conscription',
            'CorvinianArmy',
        ],
    },
    'Tarkan': {
        units: ['Tarkan', 'EliteTarkan'],
        unique: true,
        civ: 'Huns',
        counteredBy: [
            'Militia',
            'Spearman',
            'CamelRider',
            'Knight',
            'GenoeseCrossbowman',
            'Mameluke',
            'Konnik',
            'Boyar'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'Marauders',
        ],
    },
    'Mameluke': {
        units: ['Mameluke', 'EliteMameluke'],
        unique: true,
        civ: 'Saracens',
        counteredBy: [
            'Spearman',
            'GenoeseCrossbowman',
            'Kamayuk'
        ],
        upgrades: [
            'Bloodlines',
            'Zealotry',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'WarElephant': {
        units: ['WarElephant', 'EliteWarElephant'],
        unique: true,
        civ: 'Persians',
        counteredBy: [
            'Spearman',
            'Monk',
            'Missionary',
            'CamelRider',
            'Samurai',
            'Kamayuk',
            'ChuKoNu',
            'GenoeseCrossbowman',
            'Mameluke',
            'CamelArcher'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Mahouts',
            'Faith',
            'Conscription',
        ],
    },
    'Cataphract': {
        units: ['Cataphract', 'EliteCataphract'],
        unique: true,
        civ: 'Byzantines',
        counteredBy: [
            'Knight',
            'WarElephant',
            'Boyar'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'Logistica',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'SteppeLancer': {
        units: ['SteppeLancer', 'EliteSteppeLancer'],
        counteredBy: [
            'Militia',
            'Spearman',
            'CamelRider',
            'Knight',
            'Boyar',
            'Konnik',
            'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'SilkArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'SteppeHusbandry',
        ],
    },
    'BattleElephant': {
        units: ['BattleElephant', 'EliteBattleElephant'],
        counteredBy: [
            'Spearman',
            'Monk',
            'CamelRider',
            'CavalryArcher', // Maybe (EDIT BY FifthSense: https://ageofempires.fandom.com/wiki/Battle_Elephant states they do)
            'Scorpion',
            'Kamayuk',
            'GenoeseCrossbowman',
            'Mameluke',
            'WarElephant'
        ],
        upgrades: [
            'Bloodlines',
            'Chatras',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ManipurCavalry',
            'TuskSwords',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Howdah',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'CamelRider': {
        units: ['CamelRider', 'HeavyCamelRider', 'ImperialCamelRider'],
        counteredBy: [
            'Militia',
            'Spearman',
            'Berserk',
            'TeutonicKnight',
            'GenoeseCrossbowman',
            'Cataphract'
        ],
        upgrades: [
            'Bloodlines',
            'Zealotry',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Farimba',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'MaghrebiCamels',
        ],
    },
    'Knight': {
        units: ['Knight', 'Cavalier', 'Paladin'],
        counteredBy: [
            'Spearman',
            'CamelRider',
            'Monk',
            'Kamayuk',
            'Berserk',
            'TeutonicKnight',
            'GenoeseCrossbowman',
            'ThrowingAxeman',
            'Mameluke',
            'WarElephant',
            'Boyar'

        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Farimba',
            'ManipurCavalry',
            'Stirrups',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'Chivalry',
        ],
    },
    'XolotlWarrior': {
        units: ['XolotlWarrior'],
        counteredBy: [
            'Spearman',
            'Monk',
            'CamelRider',
            'Kamayuk',
            'Berserk',
            'TeutonicKnight',
            'GenoeseCrossbowman',
            'Boyar',
            'Mameluke',
            'WarElephant'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Faith',
            'Heresy',
        ],
    },
    'ScoutCavalry': {
        units: ['ScoutCavalry', 'LightCavalry', 'Hussar'],
        counteredBy: [
            'Militia',
            'Spearman',
            'Skirmisher',
            'CamelRider',
            'Knight',
            'EagleScout',
            'WoadRaider',
            'Berserk',
            'ShotelWarrior',
            'Kamayuk',
            'Huskarl',
            'GenoeseCrossbowman',
            'ThrowingAxeman',
            'Tarkan',
            'Mameluke',
            'SteppeLancer',
            'Cataphract'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Farimba',
            'ManipurCavalry',
            'Stirrups',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'SilkArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'Chivalry',
            'SteppeHusbandry',
        ],
    },
    'Kipchak': {
        units: ['Kipchak', 'EliteKipchak'],
        unique: true,
        civ: 'Cumans',
        counteredBy: [
            'Skirmisher',
            'CamelRider',
            'Mangonel',
            'Scorpion',
            'Kamayuk',
            'Huskarl',
            'EagleScout',
            'RattanArcher',
            'GenoeseCrossbowman',
            'Genitour'
        ],
        upgrades: [
            'Bloodlines',
            'Sipahi',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-11',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'ParthianTactics-2',
            'RecurveBow',
            'SilkArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'Kasbah',
        ],
    },
    'RattanArcher': {
        units: ['RattanArcher', 'EliteRattanArcher'],
        unique: true,
        civ: 'Vietnamese',
        counteredBy: [
            'ScoutCavalry',
            'CamelRider',
            'Knight',
            'Mangonel',
            'Scorpion',
            'Huskarl',
            'EagleScout',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ], 
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Conscription',
        ],
    },
    'Genitour': {
        units: ['Genitour', 'EliteGenitour'],
        unique: true,
        counteredBy: [
            'Spearman',
            'CamelRider',
            'Mangonel',
            'Scorpion',
            'Huskarl',
            'EagleScout',
            'GenoeseCrossbowman'
        ],
        upgrades: [
            'Bloodlines',
            'Sipahi',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Atlatl',
            'AndeanSling',
            'ThumbRing-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'SilkArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'CamelArcher': {
        units: ['CamelArcher', 'EliteCamelArcher'],
        unique: true,
        civ: 'Berbers',
        counteredBy: [
            'Skirmisher',
            'CamelRider',
            'Mangonel',
            'EagleScout',
            'Huskarl'
        ],
        upgrades: [
            'Bloodlines',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'Kasbah',
            'MaghrebiCamels',
        ],
    },
    'GenoeseCrossbowman': {
        units: ['GenoeseCrossbowman', 'EliteGenoeseCrossbowman'],
        unique: true,
        civ: 'Italians',
        counteredBy: [
            'Archer',
            'Skirmisher',
            'Mangonel',
            'Scorpion',
            'Samurai',
            'EagleScout',
            'Huskarl',
            'PlumedArcher',
            'ChuKoNu',
            'RattanArcher'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Pavise',
            'Faith',
            'Conscription',
        ],
    },
    'ElephantArcher': {
        units: ['ElephantArcher', 'EliteElephantArcher'],
        unique: true,
        civ: 'Indians',
        counteredBy: [
            'Spearman',
            'Monk',
            'Skirmisher',
            'CamelRider',
            'Kamayuk',
            'Berserk',
            'Huskarl',
            'EagleScout',
            'Samurai',
            'GenoeseCrossbowman',
            'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'ParthianTactics-2',
            'Husbandry',
            'Faith',
            'Conscription',
        ],
    },
    'WarWagon': {
        units: ['WarWagon', 'EliteWarWagon'],
        unique: true,
        civ: 'Koreans',
        counteredBy: [
            'Spearman',
            'Monk',
            'Skirmisher',
            'Knight',
            'Mangonel',
            'Kamayuk',
            'Huskarl',
            'EagleScout',
            'Samurai',
            'GenoeseCrossbowman',
            'Mameluke'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-11-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Husbandry',
            'Faith',
            'Conscription',
        ],
    },
    'Mangudai': {
        units: ['Mangudai', 'EliteMangudai'],
        unique: true,
        civ: 'Mongols',
        counteredBy: [
            'Spearman',
            'Skirmisher',
            'CamelRider',
            'Knight',
            'EagleScout',
            'Kamayuk',
            'Huskarl',
            'Samurai',
            'GenoeseCrossbowman',
            'Mameluke',
            'CamelArcher'
        ]
        upgrades: [
            'Bloodlines',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'ParthianTactics-2',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'ChuKoNu': {
        units: ['ChuKoNu', 'EliteChuKoNu'],
        unique: true,
        civ: 'Chinese',
        counteredBy: [
            'Skirmisher',
            'Knight',
            'Mangonel',
            'Scorpion',
            'EagleScout',
            'Huskarl',
            'Boyar',
            'Cataphract',
            'Genitour'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Rocketry-2',
            'ThumbRing-25',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Conscription',
        ],
    },
    'Longbowman': {
        units: ['Longbowman', 'EliteLongbowman'],
        unique: true,
        civ: 'Britons',
        counteredBy: [
            'Skirmisher',
            'Knight',
            'Scorpion', 
            'EagleScout',
            'Samurai',
            'Huskarl',
            'Boyar',
            'Cataphract',
            'Genitour'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Conscription',
        ],
    },
    'CavalryArcher': {
        units: ['CavalryArcher', 'HeavyCavalryArcher'],
        counteredBy: [
            //'Spearman',  Maybe 'FS-EDIT: neither the wiki nor the spreadsheet considers them to be a counter'
            'Skirmisher',
            'Knight',
            'CamelRider',
            'Mangonel',
            'BatteringRam',
            'EagleScout',
            'Kamayuk',
            'Huskarl',
            'RattanArcher',
            'GenoeseCrossbowman',
            'CamelArcher'
        ],
        upgrades: [
            'Bloodlines',
            'Sipahi',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ParthianTactics-4',
            'RecurveBow',
            'ThumbRing-11',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'SilkArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'SteppeHusbandry',
        ],
    },
    'Skirmisher': {
        units: ['Skirmisher', 'EliteSkirmisher', 'ImperialSkirmisher'],
        counteredBy: [
            'Militia',
            'Knight',
            'ScoutCavalry',
            'CamelRider',
            'Mangonel',
            'Scorpion',
            'BatteringRam',
            'EagleScout',
            'BattleElephant',
            'WarElephant',
            'Tarkan',
            'Konnik',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Atlatl',
            'Yeomen',
            'AndeanSling',
            'ThumbRing-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Pavise',
            'TowerShields',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Archer': {
        units: ['Archer', 'Crossbowman', 'Arbalester'],
        counteredBy: [
          'Skirmisher',
          'Knight',
          'ScoutCavalry',
          'Scorpion',
          'Mangonel',
          'BombardCannon',
          'BatteringRam',
          'EagleScout'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ObsidianArrows',
            'Yeomen',
            'ThumbRing-18',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Pavise',
            'Faith',
            'Heresy',
            'Kamandaran',
            'Conscription',
        ],
    },
    'PlumedArcher': {
        units: ['PlumedArcher', 'ElitePlumedArcher'],
        unique: true,
        civ: 'Mayans',
        counteredBy: [
            'Skirmisher',
            'Knight',
            'ScoutCavalry',
            'Mangonel',
            'Scorpion',
            'Huskarl',
            'EagleScout',
            'RattanArcher',
            'Genitour'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ThumbRing-18',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Slinger': {
        units: ['Slinger'],
        counteredBy: [
            'Skirmisher',
            'Knight',
            'ScoutCavalry',
            'Mangonel',
            'Scorpion',
            'Huskarl',
            'RattanArcher',
            'Genitour',
            'Tarkan',
            'Boyar',
            'MagyarHuszar',
            'Mameluke',
            'Cataphract',
            'SteppeLancer'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'AndeanSling',
            'ThumbRing-No',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'FabricShields',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Kamayuk': {
        units: ['Kamayuk', 'EliteKamayuk'],
        unique: true,
        civ: 'Incas',
        counteredBy: [
            'HandCannoneer',
            'Monk',
            'Mangonel',
            'Scorpion',
            'TeutonicKnight',
            'Slinger',
            'Janissary',
            'PlumedArcher',
            'Cataphract'
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'FabricShields',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
};

const unitsInternal = {
    'TradeCart': {
        dataId: '128',
    },
    'TradeCog': {
        dataId: '17',
    },
    'FishingShip': {
        dataId: '13',
    },
    'TransportShip': {
        dataId: '545',
    },
    'Villager': {
        dataId: '83',
    },
    'Monk': {
        dataId: '125',
    },
    'Missionary': {
        dataId: '775',
    },
    'CannonGalleon': {
        dataId: '420',
    },
    'EliteCannonGalleon': {
        dataId: '691',
    },
    'DemolitionRaft': {
        dataId: '1104',
    },
    'DemolitionShip': {
        dataId: '527',
    },
    'HeavyDemolitionShip': {
        dataId: '528',
    },
    'FireGalley': {
        dataId: '1103',
    },
    'FireShip': {
        dataId: '529',
    },
    'FastFireShip': {
        dataId: '532',
    },
    'Galley': {
        dataId: '539',
    },
    'WarGalley': {
        dataId: '21',
    },
    'Galleon': {
        dataId: '442',
    },
    'Arambai': {
        dataId: '1126',
    },
    'EliteArambai': {
        dataId: '1128',
    },
    'OrganGun': {
        dataId: '1001',
    },
    'EliteOrganGun': {
        dataId: '1003',
    },
    'Caravel': {
        dataId: '1004',
    },
    'EliteCaravel': {
        dataId: '1006',
    },
    'SiegeTower': {
        dataId: '1105',
    },
    'Conquistador': {
        dataId: '771',
    },
    'EliteConquistador': {
        dataId: '773',
    },
    'TurtleShip': {
        dataId: '831',
    },
    'EliteTurtleShip': {
        dataId: '832',
    },
    'Longboat': {
        dataId: '250',
    },
    'EliteLongboat': {
        dataId: '533',
    },
    'Janissary': {
        dataId: '46',
    },
    'EliteJanissary': {
        dataId: '557',
    },
    'BallistaElephant': {
        dataId: '1120',
    },
    'EliteBallistaElephant': {
        dataId: '1122',
    },
    'FlamingCamel': {
        dataId: '1263',
    },
    'Petard': {
        dataId: '440',
    },
    'Trebuchet': {
        dataId: '42',
    },
    'BombardCannon': {
        dataId: '36',
    },
    'Mangonel': {
        dataId: '280',
    },
    'Onager': {
        dataId: '550',
    },
    'SiegeOnager': {
        dataId: '588',
    },
    'BatteringRam': {
        dataId: '35',
    },
    'CappedRam': {
        dataId: '422',
    },
    'SiegeRam': {
        dataId: '548',
    },
    'Scorpion': {
        dataId: '279',
    },
    'HeavyScorpion': {
        dataId: '542',
    },
    'HandCannoneer': {
        dataId: '5',
    },
    'KarambitWarrior': {
        dataId: '1123',
    },
    'EliteKarambitWarrior': {
        dataId: '1125',
    },
    'Gbeto': {
        dataId: '1013',
    },
    'EliteGbeto': {
        dataId: '1015',
    },
    'ShotelWarrior': {
        dataId: '1016',
    },
    'EliteShotelWarrior': {
        dataId: '1018',
    },
    'Condottiero': {
        dataId: '882',
    },
    'JaguarWarrior': {
        dataId: '725',
    },
    'EliteJaguarWarrior': {
        dataId: '726',
    },
    'Berserk': {
        dataId: '692',
    },
    'EliteBerserk': {
        dataId: '694',
    },
    'TeutonicKnight': {
        dataId: '25',
    },
    'EliteTeutonicKnight': {
        dataId: '554',
    },
    'Samurai': {
        dataId: '291',
    },
    'EliteSamurai': {
        dataId: '560',
    },
    'Huskarl': {
        dataId: '41',
    },
    'EliteHuskarl': {
        dataId: '555',
    },
    'ThrowingAxeman': {
        dataId: '281',
    },
    'EliteThrowingAxeman': {
        dataId: '531',
    },
    'WoadRaider': {
        dataId: '232',
    },
    'EliteWoadRaider': {
        dataId: '534',
    },
    'EagleScout': {
        dataId: '751',
    },
    'EagleWarrior': {
        dataId: '753',
    },
    'EliteEagleWarrior': {
        dataId: '752',
    },
    'Spearman': {
        dataId: '93',
    },
    'Pikeman': {
        dataId: '358',
    },
    'Halberdier': {
        dataId: '359',
    },
    'Militia': {
        dataId: '74',
    },
    'ManAtArms': {
        dataId: '75',
    },
    'LongSwordsman': {
        dataId: '77',
    },
    'TwoHandedSwordsman': {
        dataId: '473',
    },
    'Champion': {
        dataId: '567',
    },
    'Keshik': {
        dataId: '1228',
    },
    'EliteKeshik': {
        dataId: '1230',
    },
    'Leitis': {
        dataId: '1234',
    },
    'EliteLeitis': {
        dataId: '1236',
    },
    'Konnik': {
        dataId: '1254',
    },
    'EliteKonnik': {
        dataId: '1255',
    },
    'Boyar': {
        dataId: '876',
    },
    'EliteBoyar': {
        dataId: '878',
    },
    'MagyarHuszar': {
        dataId: '869',
    },
    'EliteMagyarHuszar': {
        dataId: '871',
    },
    'Tarkan': {
        dataId: '755',
    },
    'EliteTarkan': {
        dataId: '757',
    },
    'Mameluke': {
        dataId: '282',
    },
    'EliteMameluke': {
        dataId: '556',
    },
    'WarElephant': {
        dataId: '239',
    },
    'EliteWarElephant': {
        dataId: '558',
    },
    'Cataphract': {
        dataId: '40',
    },
    'EliteCataphract': {
        dataId: '553',
    },
    'SteppeLancer': {
        dataId: '1370',
    },
    'EliteSteppeLancer': {
        dataId: '1372',
    },
    'BattleElephant': {
        dataId: '1132',
    },
    'EliteBattleElephant': {
        dataId: '1134',
    },
    'CamelRider': {
        dataId: '329',
    },
    'HeavyCamelRider': {
        dataId: '330',
    },
    'ImperialCamelRider': {
        dataId: '207',
    },
    'Knight': {
        dataId: '38',
    },
    'Cavalier': {
        dataId: '283',
    },
    'Paladin': {
        dataId: '569',
    },
    'XolotlWarrior': {
        dataId: '1570',
    },
    'ScoutCavalry': {
        dataId: '448',
    },
    'LightCavalry': {
        dataId: '546',
    },
    'Hussar': {
        dataId: '441',
    },
    'Kipchak': {
        dataId: '1231',
    },
    'EliteKipchak': {
        dataId: '1233',
    },
    'RattanArcher': {
        dataId: '1129',
    },
    'EliteRattanArcher': {
        dataId: '1131',
    },
    'Genitour': {
        dataId: '1010',
    },
    'EliteGenitour': {
        dataId: '1012',
    },
    'CamelArcher': {
        dataId: '1007',
    },
    'EliteCamelArcher': {
        dataId: '1009',
    },
    'GenoeseCrossbowman': {
        dataId: '866',
    },
    'EliteGenoeseCrossbowman': {
        dataId: '868',
    },
    'ElephantArcher': {
        dataId: '873',
    },
    'EliteElephantArcher': {
        dataId: '875',
    },
    'WarWagon': {
        dataId: '827',
    },
    'EliteWarWagon': {
        dataId: '829',
    },
    'Mangudai': {
        dataId: '11',
    },
    'EliteMangudai': {
        dataId: '561',
    },
    'ChuKoNu': {
        dataId: '73',
    },
    'EliteChuKoNu': {
        dataId: '559',
    },
    'Longbowman': {
        dataId: '8',
    },
    'EliteLongbowman': {
        dataId: '530',
    },
    'CavalryArcher': {
        dataId: '39',
    },
    'HeavyCavalryArcher': {
        dataId: '474',
    },
    'Skirmisher': {
        dataId: '7',
    },
    'EliteSkirmisher': {
        dataId: '6',
    },
    'ImperialSkirmisher': {
        dataId: '1155',
    },
    'Archer': {
        dataId: '4',
    },
    'Crossbowman': {
        dataId: '24',
    },
    'Arbalester': {
        dataId: '492',
    },
    'PlumedArcher': {
        dataId: '763',
    },
    'ElitePlumedArcher': {
        dataId: '765',
    },
    'Slinger': {
        dataId: '185',
    },
    'Kamayuk': {
        dataId: '879',
    },
    'EliteKamayuk': {
        dataId: '881',
    },
};

const UnitLineUnion = unwrap(unitLineNames);
export type UnitLine = typeof UnitLineUnion;

export const units = unitsInternal as UnitDict;

interface IUnit {
    dataId: aoeUnitDataId;
}

interface UnitDict {
    [unit: string]: IUnit;
}

interface UnitIconDict {
    [unit: string]: ImageSourcePropType;
}

interface IUnitClassPair {
    Amount: number;
    Class: UnitClassNumber,
}

export type ICostDict = {
    [key in Other]?: number;
};

export interface IUnitInfo {
    AccuracyPercent: number;
    Attack: number;
    Attacks: IUnitClassPair[];
    Cost: ICostDict;
    FrameDelay: number;
    GarrisonCapacity: number;
    HP: number;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    LineOfSight: number;
    MeleeArmor: number;
    MinRange: number;
    PierceArmor: number;
    Armours: IUnitClassPair[];
    Range: number;
    ReloadTime: number;
    Speed: number;
    TrainTime: number;
}

const unitClasses = {
    0: "Unused",
    1: "Infantry",
    2: "Turtle Ships",
    3: "Pierce",
    4: "Melee",
    5: "War Elephants",
    6: "Unused",
    7: "Unused",
    8: "Cavalry",
    9: "Unused",
    10: "Unused",
    11: "All Buildings", // except Port
    12: "Unused",
    13: "Stone Defense",
    14: "FE Predator Animals",
    15: "Archers",
    16: "Ships & Camels & Saboteurs",
    17: "Rams",
    18: "Trees",
    19: "Unique Units", // except Turtle Ship
    20: "Siege Weapons",
    21: "Standard Buildings",
    22: "Walls & Gates",
    23: "FE Gunpowder Units",
    24: "Boars",
    25: "Monks",
    26: "Castle",
    27: "Spearmen",
    28: "Cavalry Archers",
    29: "Eagle Warriors",
    30: "HD Camels",
    31: "Anti-Leitis",
    32: "Condottieros",
    33: "Organ Gun Damage",
    34: "Fishing Ships",
    35: "Mamelukes",
    36: "Heroes and Kings",
} as const;

export const attackClasses = [
    'Melee',
    'Pierce',
];

export const hiddenArmourClasses = [
    'Melee',
    'Pierce',
    'FE Predator Animals',
    'Trees',
    'Boars',
    'Anti-Leitis',
    'Organ Gun Damage',
    'Heroes and Kings',
];

export type UnitClassNumber = keyof typeof unitClasses;
export type UnitClass = ValueOf<typeof unitClasses>;

export function getUnitClassName(unitClassNumber: UnitClassNumber): UnitClass {
    return unitClasses[unitClassNumber];
}


export const otherNames = [
    'DarkAge',
    'FeudalAge',
    'CastleAge',
    'ImperialAge',
    'Wood',
    'Food',
    'Gold',
    'Stone',
] as const;

const otherIcons = {
    'DarkAge': require('../../assets/other/DarkAge.png'),
    'FeudalAge': require('../../assets/other/FeudalAgeFull.png'),
    'CastleAge': require('../../assets/other/CastleAge.png'),
    'ImperialAge': require('../../assets/other/ImperialAge.png'),
    'Wood': require('../../assets/other/Wood.png'),
    'Food': require('../../assets/other/Food.png'),
    'Gold': require('../../assets/other/Gold.png'),
    'Stone': require('../../assets/other/Stone.png'),
};

const OtherUnion = unwrap(otherNames);
export type Other = typeof OtherUnion;

export function getOtherIcon(other: Other) {
    return otherIcons[other];
}

export function sortResources(resources: Other[]) {
    return sortBy(resources, res => otherNames.indexOf(res));
}

const unitIcons: UnitIconDict = {
    'Kamayuk': require('../../assets/units/Kamayuk.png'),
    'Slinger': require('../../assets/units/Slinger.png'),
    'PlumedArcher': require('../../assets/units/PlumedArcher.png'),
    'Archer': require('../../assets/units/Archer.png'),
    'Crossbowman': require('../../assets/units/Crossbowman.png'),
    'Arbalester': require('../../assets/units/Arbalester.png'),
    'Skirmisher': require('../../assets/units/Skirmisher.png'),
    'EliteSkirmisher': require('../../assets/units/EliteSkirmisher.png'),
    'ImperialSkirmisher': require('../../assets/units/ImperialSkirmisher.png'),
    'CavalryArcher': require('../../assets/units/CavalryArcher.png'),
    'HeavyCavalryArcher': require('../../assets/units/HeavyCavalryArcher.png'),
    'Longbowman': require('../../assets/units/Longbowman.png'),
    'ChuKoNu': require('../../assets/units/ChuKoNu.png'),
    'Mangudai': require('../../assets/units/Mangudai.png'),
    'WarWagon': require('../../assets/units/WarWagon.png'),
    'ElephantArcher': require('../../assets/units/ElephantArcher.png'),
    'GenoeseCrossbowman': require('../../assets/units/GenoeseCrossbowman.png'),
    'CamelArcher': require('../../assets/units/CamelArcher.png'),
    'Genitour': require('../../assets/units/Genitour.png'),
    'RattanArcher': require('../../assets/units/RattanArcher.png'),
    'Kipchak': require('../../assets/units/Kipchak.png'),
    'ScoutCavalry': require('../../assets/units/ScoutCavalry.png'),
    'LightCavalry': require('../../assets/units/LightCavalry.png'),
    'Hussar': require('../../assets/units/Hussar.png'),
    'XolotlWarrior': require('../../assets/units/XolotlWarrior.png'),
    'Knight': require('../../assets/units/Knight.png'),
    'Cavalier': require('../../assets/units/Cavalier.png'),
    'Paladin': require('../../assets/units/Paladin.png'),
    'CamelRider': require('../../assets/units/CamelRider.png'),
    'HeavyCamelRider': require('../../assets/units/HeavyCamelRider.png'),
    'ImperialCamelRider': require('../../assets/units/ImperialCamelRider.png'),
    'BattleElephant': require('../../assets/units/BattleElephant.png'),
    'EliteBattleElephant': require('../../assets/units/EliteBattleElephant.png'),
    'SteppeLancer': require('../../assets/units/SteppeLancer.png'),
    'EliteSteppeLancer': require('../../assets/units/EliteSteppeLancer.png'),
    'Cataphract': require('../../assets/units/Cataphract.png'),
    'WarElephant': require('../../assets/units/WarElephant.png'),
    'Mameluke': require('../../assets/units/Mameluke.png'),
    'Tarkan': require('../../assets/units/Tarkan.png'),
    'MagyarHuszar': require('../../assets/units/MagyarHuszar.png'),
    'Boyar': require('../../assets/units/Boyar.png'),
    'Konnik': require('../../assets/units/Konnik.png'),
    'Leitis': require('../../assets/units/Leitis.png'),
    'Keshik': require('../../assets/units/Keshik.png'),
    'Militia': require('../../assets/units/Militia.png'),
    'ManAtArms': require('../../assets/units/ManAtArms.png'),
    'LongSwordsman': require('../../assets/units/LongSwordsman.png'),
    'TwoHandedSwordsman': require('../../assets/units/TwoHandedSwordsman.png'),
    'Champion': require('../../assets/units/Champion.png'),
    'Spearman': require('../../assets/units/Spearman.png'),
    'Pikeman': require('../../assets/units/Pikeman.png'),
    'Halberdier': require('../../assets/units/Halberdier.png'),
    'EagleScout': require('../../assets/units/EagleScout.png'),
    'EagleWarrior': require('../../assets/units/EagleWarrior.png'),
    'EliteEagleWarrior': require('../../assets/units/EliteEagleWarrior.png'),
    'WoadRaider': require('../../assets/units/WoadRaider.png'),
    'ThrowingAxeman': require('../../assets/units/ThrowingAxeman.png'),
    'Huskarl': require('../../assets/units/Huskarl.png'),
    'Samurai': require('../../assets/units/Samurai.png'),
    'TeutonicKnight': require('../../assets/units/TeutonicKnight.png'),
    'Berserk': require('../../assets/units/Berserk.png'),
    'JaguarWarrior': require('../../assets/units/JaguarWarrior.png'),
    'Condottiero': require('../../assets/units/Condottiero.png'),
    'ShotelWarrior': require('../../assets/units/ShotelWarrior.png'),
    'Gbeto': require('../../assets/units/Gbeto.png'),
    'KarambitWarrior': require('../../assets/units/KarambitWarrior.png'),
    'HandCannoneer': require('../../assets/units/HandCannoneer.png'),
    'Scorpion': require('../../assets/units/Scorpion.png'),
    'HeavyScorpion': require('../../assets/units/HeavyScorpion.png'),
    'BatteringRam': require('../../assets/units/BatteringRam.png'),
    'CappedRam': require('../../assets/units/CappedRam.png'),
    'SiegeRam': require('../../assets/units/SiegeRam.png'),
    'Mangonel': require('../../assets/units/Mangonel.png'),
    'Onager': require('../../assets/units/Onager.png'),
    'SiegeOnager': require('../../assets/units/SiegeOnager.png'),
    'BombardCannon': require('../../assets/units/BombardCannon.png'),
    'Trebuchet': require('../../assets/units/Trebuchet.png'),
    'Petard': require('../../assets/units/Petard.png'),
    'FlamingCamel': require('../../assets/units/FlamingCamel.png'),
    'BallistaElephant': require('../../assets/units/BallistaElephant.png'),
    'Janissary': require('../../assets/units/Janissary.png'),
    'Longboat': require('../../assets/units/Longboat.png'),
    'TurtleShip': require('../../assets/units/TurtleShip.png'),
    'Conquistador': require('../../assets/units/Conquistador.png'),
    'SiegeTower': require('../../assets/units/SiegeTower.png'),
    'Caravel': require('../../assets/units/Caravel.png'),
    'OrganGun': require('../../assets/units/OrganGun.png'),
    'Arambai': require('../../assets/units/Arambai.png'),
    'Galley': require('../../assets/units/Galley.png'),
    'WarGalley': require('../../assets/units/WarGalley.png'),
    'Galleon': require('../../assets/units/Galleon.png'),
    'FireGalley': require('../../assets/units/FireGalley.png'),
    'FireShip': require('../../assets/units/FireShip.png'),
    'FastFireShip': require('../../assets/units/FastFireShip.png'),
    'DemolitionRaft': require('../../assets/units/DemolitionRaft.png'),
    'DemolitionShip': require('../../assets/units/DemolitionShip.png'),
    'HeavyDemolitionShip': require('../../assets/units/HeavyDemolitionShip.png'),
    'CannonGalleon': require('../../assets/units/CannonGalleon.png'),
    'EliteCannonGalleon': require('../../assets/units/EliteCannonGalleon.png'),
    'Monk': require('../../assets/units/Monk.png'),
    'Missionary': require('../../assets/units/Missionary.png'),
    'TradeCart': require('../../assets/units/TradeCart.png'),
    'TradeCog': require('../../assets/units/TradeCog.png'),
    'FishingShip': require('../../assets/units/FishingShip.png'),
    'TransportShip': require('../../assets/units/TransportShip.png'),
    'Villager': require('../../assets/units/Villager.png'),
};


export type Unit = keyof typeof unitsInternal;

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitIcon(unit);
}

export function getUnitLineName(unitLine: UnitLine) {
    if (!unitLines[unitLine]) throw new Error(`Unit line ${unitLine} does not exist.`);
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitName(unit);
}

export function getEliteUniqueResearchIcon() {
    return require('../../assets/units/EliteUniqueResearch.png');
}

export function getUnitIcon(unit: Unit) {
    if (unitIcons[unit] == null) return require('../../assets/units/EliteUniqueResearch.png');
    return unitIcons[unit];
}

export function getUnitName(unit: Unit) {
    const data = getUnitData(unit);
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey].replace(' (Male)', '');
}

export function getUnitData(unit: Unit) {
    const unitEntry = units[unit];
    if (unitEntry == null) {
        throw Error(`getUnitLineName ${unit} - no dataId`);
    }
    const dataId = units[unit].dataId;
    return aoeData.data.units[dataId] as IUnitInfo;
}

export function getUnitDescription(unit: Unit) {
    const data = getUnitData(unit);
    let description = aoeData.strings[data.LanguageHelpId.toString() as aoeStringKey];

    description = strRemoveTo(description, '<br>\n');
    description = strRemoveFrom(description, '<i> Upgrades:');

    description = description.trim();

    return description;
}

export const unitList = unitLineNames.map(ul => ({
    name: ul,
    ...unitLines[ul],
}))

export function getUnitLineForUnit(unit: Unit) {
    return unitList.find(ul => ul.units.includes(unit));
}

export function getUnitLineNameForUnit(unit: Unit) {
    return unitList.find(ul => ul.units.includes(unit))!.name;
}

export function getInferiorUnitLines(unitLineName: UnitLine) {
    const inferiorUnitLines: UnitLine[] = [];
    for (const otherUnitLineName of unitLineNames) {
        const otherUnitLine = unitLines[otherUnitLineName];
        if ((otherUnitLine.counteredBy || []).includes(unitLineName)) {
            inferiorUnitLines.push(otherUnitLineName);
        }
    }
    return inferiorUnitLines;
}

// const inferiorUnitLines: UnitLine[] = [];
// for (const otherUnitLineName of unitLineNames) {
//     if (!unitLines[otherUnitLineName].unique) {
//         inferiorUnitLines.push(otherUnitLineName);
//     }
// }
// console.log('inf', sortBy(inferiorUnitLines));

// For sorting in counter unit list
export const unitLineOrder = [
    'TradeCart',
    'Villager',

    'Militia',
    'Spearman',
    'EagleScout',

    'Archer',
    'Skirmisher',
    'CavalryArcher',
    'Slinger',
    'HandCannoneer',

    'ScoutCavalry',
    'Knight',
    'CamelRider',
    'SteppeLancer',
    'BattleElephant',

    'Missionary',
    'Monk',

    'FishingShip',
    'TradeCog',
    'TransportShip',
    'Galley',
    'FireGalley',
    'DemolitionRaft',
    'CannonGalleon',

    'BatteringRam',
    'Mangonel',
    'Scorpion',
    'BombardCannon',
    'Trebuchet',
    'Petard',
    'FlamingCamel',
    'SiegeTower',

    'XolotlWarrior',

    'Arambai',
    'BallistaElephant',
    'Berserk',
    'Boyar',
    'CamelArcher',
    'Caravel',
    'Cataphract',
    'ChuKoNu',
    'Condottiero',
    'Conquistador',
    'ElephantArcher',
    'Gbeto',
    'Genitour',
    'GenoeseCrossbowman',
    'Huskarl',
    'JaguarWarrior',
    'Janissary',
    'Kamayuk',
    'KarambitWarrior',
    'Keshik',
    'Kipchak',
    'Konnik',
    'Leitis',
    'Longboat',
    'Longbowman',
    'MagyarHuszar',
    'Mameluke',
    'Mangudai',
    'OrganGun',
    'PlumedArcher',
    'RattanArcher',
    'Samurai',
    'ShotelWarrior',
    'Tarkan',
    'TeutonicKnight',
    'ThrowingAxeman',
    'TurtleShip',
    'WarElephant',
    'WarWagon',
    'WoadRaider',
];

export function sortUnitCounter(unitLines: UnitLine[]) {
    return sortBy(unitLines, ul => unitLineOrder.indexOf(ul));
}
