import {TechEffect} from "./techs";
import {sortBy} from 'lodash';
import {Civ} from "./civs";
import {getAllMatches, strRemoveFrom, strRemoveTo, unwrap, ValueOf} from "../lib/util";
import {aoeData, aoeUnitDataId} from "../data/data";
import {getAoeString, getUiTranslation} from '../lib/aoe-data';
import {slotTypes} from '../api/api.types';
import {shallowEqual} from 'react-redux';
import {unitLineIdsData} from "../../../dataset2/src/data/unit.data";


export interface IUnitLine {
    civ?: Civ;
    unique?: boolean;
    units: Unit[];
    related?: UnitLine[];
    counteredBy?: UnitLine[];
    upgrades: TechEffect[];
}

// type IUnitLineDict = {
//     [unit in UnitLine]: IUnitLine;
// };

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLineIds = unitLineIdsData;

export const unitLines: IUnitLineDict = {
    'Ghulam': {
        units: ['Ghulam', 'EliteGhulam'],
        unique: true,
        counteredBy: [
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Conscription',
            'Kasbah',
        ],
    },
    'ShrivamshaRider': {
        units: ['ShrivamshaRider', 'EliteShrivamshaRider'],
        unique: true,
        counteredBy: [
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Heresy',
            'Conscription',
            'Kshatriyas',
        ],
    },
    'ChakramThrower': {
        units: ['ChakramThrower', 'EliteChakramThrower'],
        unique: true,
        counteredBy: [
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Tracking',
            'Heresy',
            'Conscription',
            'Kasbah',
            'Kshatriyas',
        ],
    },
    'Thirisadai': {
        units: ['Thirisadai'],
        unique: true,
        counteredBy: [
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
            'Shipwright',
        ],
    },
    'UrumiSwordsman': {
        units: ['UrumiSwordsman', 'EliteUrumiSwordsman'],
        unique: true,
        counteredBy: [
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'WootzSteel',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Squires',
            'Tracking',
            'Faith',
            'Conscription',
            'Kasbah',
        ],
    },
    'ArmoredElephant': {
        units: ['ArmoredElephant', 'SiegeElephant'],
        counteredBy: [
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'WootzSteel',
            'Paiks',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy', // only gurjanas
            'Kshatriyas',
            'MedicalCorps',
        ],
    },
    'Ratha': {
        units: ['Ratha', 'EliteRatha'],
        unique: true,
        counteredBy: [
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'ParthianTactics-2',
            'Paiks',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'Husbandry',
            'Faith',
            'Conscription',
            'Kasbah',
        ],
    },

    'Obuch': {
        units: ['Obuch', 'EliteObuch'],
        unique: true,
        counteredBy: [
            'Samurai',
            'HandCannoneer',
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
    'HussiteWagon': {
        units: ['HussiteWagon', 'EliteHussiteWagon'],
        unique: true,
        counteredBy: [
            'Mangonel',
            'BombardCannon',
        ],
        upgrades: [
            'SiegeEngineers-20-1',
            'WagenburgTactics',
            'Faith',
            'Heresy',
        ],
    },
    'Coustillier': {
        units: ['Coustillier', 'EliteCoustillier'],
        unique: true,
        counteredBy: [
            'Spearman',
            'Boyar',
            'Kamayuk',
            'GenoeseCrossbowman',
            'Mameluke',
            'CamelRider',
            'WarElephant',
            'Knight',
        ],
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Conscription',
        ],
    },
    'Serjeant': {
        units: ['Serjeant', 'EliteSerjeant'],
        unique: true,
        counteredBy: [
            'HandCannoneer',
            'Scorpion',
            'Conquistador',
            'Janissary',
            'OrganGun',
            'TeutonicKnight',
            'Samurai',
            'Slinger',
            'Cataphract',
            'JaguarWarrior',
            'Leitis',
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
            'Faith',
            'Heresy',
            'Tracking',
            'Conscription',
        ],
    },
    'FlemishMilitia': {
        units: ['FlemishMilitia'],
        unique: true,
        counteredBy: [
            'HandCannoneer',
            'Scorpion',
            'Janissary',
            'OrganGun',
            'TeutonicKnight',
            'Samurai',
            'ChuKoNu',
            'PlumedArcher',
            'Slinger',
            'Cataphract',
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
            'Faith',
        ],
    },
    'TradeCart': {
        units: ['TradeCart'],
        upgrades: [
            'GrandTrunkRoad',
            'Caravan',
            'Faith',
            'Heresy',
            'SilkRoad',
        ],
    },
    'TradeCog': {
        units: ['TradeCog'],
        upgrades: [
            'GrandTrunkRoad',
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
            'GrandTrunkRoad-GatheringSpeed',
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
            'FlemishRevolution',
            'BurgundianVineyards',
            'Mahayana',
            'PaperMoney',
        ],
    },
    'Missionary': {
        units: ['Missionary'],
        unique: true,
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
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
            'Inquisition',
            'HussiteReforms',
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
            'DemolitionRaft',
            'TurtleShip',
            'BombardCannon',
            'Mangonel',
            'Scorpion',
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
            'WagenburgTactics',
        ],
    },
    'Arambai': {
        units: ['Arambai', 'EliteArambai'],
        unique: true,
        civ: 'Burmese',
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
            'Skirmisher',
            'CamelRider',
            'CavalryArcher',
            'Kamayuk',
            'Huskarl',
            'GenoeseCrossbowman',
            'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
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
            'Coustillier',
            'Mameluke',
            'Cataphract',
            'SteppeLancer',
            'Mangudai'
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
            'Coustillier',
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
            'FlemishMilitia',
            'Skirmisher',
            'CamelRider',
            'Mangonel',
            'Condottiero',
            'Huskarl',
            'Berserk',
            'Kamayuk',
            'EagleScout',
            'GenoeseCrossbowman',
            'Mameluke'
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
            'BombardCannon'
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
            'FlemishMilitia',
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
            'Coustillier',
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
        unique: true,
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
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
            'CavalryArcher',
            'Scorpion',
            'EagleScout',
            'MagyarHuszar',
            'Coustillier',
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
            'Coustillier',
            'Mameluke',
            'Cataphract',
            'SteppeLancer',
            'WarElephant',
            'BattleElephant'
        ],
        upgrades: [
            'Counterweights',
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
        units: ['BombardCannon', 'Houfnice'],
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
            'Coustillier',
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
            'WagenburgTactics',
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
            'Condottiero',
            'Huskarl',
            'EagleScout',
            'Longbowman',
            'Tarkan',
            'Cataphract',
            'MagyarHuszar',
            'Coustillier',
            'SteppeLancer',
            'Mangudai'
        ],
        upgrades: [
            'FurorCeltica',
            'Counterweights',
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
            'MagyarHuszar',
            'Coustillier',
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
            'Petard',
            'ShotelWarrior',
            'EagleScout',
            'Condottiero',
            'WoadRaider',
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
            'WagenburgTactics',
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
            'OrganGun',
            'Slinger',
            'WarElephant',
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
            'JaguarWarrior',
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
            'Pavise',
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
           'OrganGun',
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
            'OrganGun',
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
            'OrganGun',
            'Conquistador',
            'Leitis',
            'Obuch',
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
            'ThrowingAxeman',
            'Cataphract'
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
            'OrganGun',
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
            'Archer',
            'HandCannoneer',
            'TeutonicKnight',
            'Berserk',
            'Samurai',
            'JaguarWarrior',
            'Janissary',
            'OrganGun',
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
            'OrganGun',
            'Boyar',
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
            'FlemishMilitia',
            'Berserk',
            'WoadRaider',
            'ThrowingAxeman',
            'ChuKoNu',
            'Gbeto',
            'Janissary',
            'OrganGun',
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
            'OrganGun',
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
            'FlemishMilitia',
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
            'FlemishMilitia',
            'Monk',
            'CamelRider',
            'Kamayuk',
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
        related: ['KonnikDismounted'],
        units: ['Konnik', 'EliteKonnik'],
        unique: true,
        civ: 'Bulgarians',
        counteredBy: [
            'TeutonicKnight',
            'Kamayuk',
            'GenoeseCrossbowman',
            'Boyar',
            'WarElephant',
            'BattleElephant',
            'Mameluke'
        ],
        upgrades: [
            'Bloodlines',
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Stirrups',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'KonnikDismounted': {
        related: ['Konnik'],
        units: ['KonnikDismounted', 'EliteKonnikDismounted'],
        unique: true,
        civ: 'Bulgarians',
        counteredBy: [
            'TeutonicKnight',
            'Kamayuk',
            'GenoeseCrossbowman',
            'Boyar',
            'WarElephant',
            'BattleElephant',
            'Mameluke'
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
          'FlemishMilitia',
          'Archer',
          'Monk',
          'Missionary',
          'CamelRider',
          'Scorpion',
          'TeutonicKnight',
          'Berserk',
          'Kamayuk',
          'WarElephant',
          'Mameluke',
          'Leitis',
          'Obuch',
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
            'FlemishMilitia',
            'CamelRider',
            'EagleScout',
            'Berserk',
            'TeutonicKnight',
            'Kamayuk',
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
            'FlemishMilitia',
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
            'FlemishMilitia',
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
            'FlemishMilitia',
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
        unique: true,
        counteredBy: [
            'Militia',
            'Spearman',
            'FlemishMilitia',
            'Knight',
            'CamelRider',
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
            'FlemishMilitia',
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
            'WootzSteel',
            'Paiks',
            'TuskSwords',
            'ScaleBardingArmor',
            'ChainBardingArmor',
            'PlateBardingArmor',
            'Howdah',
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'MedicalCorps',
        ],
    },
    'CamelRider': {
        units: ['CamelScout', 'CamelRider', 'HeavyCamelRider', 'ImperialCamelRider'],
        counteredBy: [
            'Militia',
            'Spearman',
            'FlemishMilitia',
            'Serjeant',
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
            'Husbandry',
            'Faith',
            'Heresy',
            'Conscription',
            'FrontierGuards',
            'Kshatriyas',
            'MaghrebiCamels',
        ],
    },
    'Knight': {
        units: ['Knight', 'Cavalier', 'Paladin'],
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
            'CamelRider',
            'Monk',
            'Kamayuk',
            'Berserk',
            'TeutonicKnight',
            'GenoeseCrossbowman',
            'ThrowingAxeman',
            'Mameluke',
            'WarElephant',
            'Boyar',
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
            'SzlachtaPrivileges',
            'Hauberk',
        ],
    },
    'XolotlWarrior': {
        units: ['XolotlWarrior'],
        unique: true,
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
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
        units: ['ScoutCavalry', 'LightCavalry', 'Hussar', 'WingedHussar'],
        counteredBy: [
            'Militia',
            'Spearman',
            'FlemishMilitia',
            'Coustillier',
            'Skirmisher',
            'CamelRider',
            'Knight',
            'EagleScout',
            'WoadRaider',
            'Berserk',
            'Serjeant',
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
            // 'FeudalAge-ScoutCavalry',
            // 'CastleAge-ScoutCavalry',
            // 'ImperialAge-ScoutCavalry',
            // 'ImperialAge-LightCavalry',
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
            'LechiticLegacy',
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
            'Coustillier',
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
            'FlemishMilitia',
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
            'HulcheJavelineers',
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
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
            'Monk',
            'Skirmisher',
            'CamelRider',
            'Kamayuk',
            'Berserk',
            'Huskarl',
            'EagleScout',
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
            'Paiks',
            'Ballistics',
            'PaddedArcherArmor',
            'LeatherArcherArmor',
            'RingArcherArmor',
            'ParthianTactics-2',
            'Husbandry',
            'Faith',
            'Conscription',
            'FrontierGuards',
        ],
    },
    'WarWagon': {
        units: ['WarWagon', 'EliteWarWagon'],
        unique: true,
        civ: 'Koreans',
        counteredBy: [
            'Spearman',
            'FlemishMilitia',
            'Monk',
            'Skirmisher',
            'Knight',
            'Mangonel',
            'Kamayuk',
            'Huskarl',
            'EagleScout',
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
            'FlemishMilitia',
            'Skirmisher',
            'CamelRider',
            'Knight',
            'EagleScout',
            'Kamayuk',
            'Huskarl',
            'GenoeseCrossbowman',
            'Mameluke',
            'CamelArcher'
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
            'Huskarl',
            'Boyar',
            'Cataphract',
            'Genitour'
        ],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Yeomen',
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
            'FlemishMilitia',
            'Coustillier',
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
            'KonnikDismounted',
            'Serjeant',
            'FlemishMilitia',
            'Boyar',
            'MagyarHuszar',
            'Coustillier',
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
            'TowerShields',
            'Faith',
            'Heresy',
            'Conscription',
            'HulcheJavelineers',
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
        unique: true,
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
            'Coustillier',
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
            'OrganGun',
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
    'Ghulam': {
        dataId: '1747',
    },
    'EliteGhulam': {
        dataId: '1749',
    },
    'CamelScout': {
        dataId: '1755',
    },
    'ShrivamshaRider': {
        dataId: '1751',
    },
    'EliteShrivamshaRider': {
        dataId: '1753',
    },
    'ChakramThrower': {
        dataId: '1741',
    },
    'EliteChakramThrower': {
        dataId: '1743',
    },
    'Thirisadai': {
        dataId: '1750',
    },
    'UrumiSwordsman': {
        dataId: '1735',
    },
    'EliteUrumiSwordsman': {
        dataId: '1737',
    },
    'ArmoredElephant': {
        dataId: '1744',
    },
    'SiegeElephant': {
        dataId: '1746',
    },
    'Ratha': {
        dataId: '1759',
    },
    'EliteRatha': {
        dataId: '1761',
    },

    'WingedHussar': {
        dataId: '1707',
    },
    'Houfnice': {
        dataId: '1709',
    },
    'Obuch': {
        dataId: '1701',
    },
    'EliteObuch': {
        dataId: '1703',
    },
    'HussiteWagon': {
        dataId: '1704',
    },
    'EliteHussiteWagon': {
        dataId: '1706',
    },
    'Coustillier': {
        dataId: '1655',
    },
    'EliteCoustillier': {
        dataId: '1657',
    },
    'Serjeant': {
        dataId: '1658',
    },
    'EliteSerjeant': {
        dataId: '1659',
    },
    'FlemishMilitia': {
        dataId: '1699',
    },
    'Sheep': {
        dataId: '128', // Placeholder data id. Sheep does not exist in data.
    },
    'Boar': {
        dataId: '128', // Placeholder data id. Boar does not exist in data.
    },
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
        dataId: '331',
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
        dataId: '1258',
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
    'KonnikDismounted': {
        dataId: '1252',
    },
    'EliteKonnikDismounted': {
        dataId: '1253',
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

export const unitUpgradeCosts = {
    "HussiteWagon":{
        "Wood":800,
        "Gold":600
    },
    "Obuch":{
        "Food":800,
        "Gold":600
    },
    "BombardCannon":{
        "Food":950,
        "Gold":750
    },
    "Coustillier":{
        "Food":1000,
        "Gold":800
    },
    "Serjeant":{
        "Food":1100,
        "Gold":800
    },
    "CannonGalleon":{
        "Wood":525,
        "Gold":500
    },
    "DemolitionRaft":{
        "Food":230,
        "Gold":100
    },
    "DemolitionShip":{
        "Wood":200,
        "Gold":300
    },
    "FireGalley":{
        "Food":230,
        "Gold":100
    },
    "FireShip":{
        "Wood":280,
        "Gold":250
    },
    "Galley":{
        "Food":230,
        "Gold":100
    },
    "WarGalley":{
        "Food":400,
        "Wood":315
    },
    "Arambai":{
        "Food":1100,
        "Gold":675
    },
    "OrganGun":{
        "Food":1200,
        "Gold":500
    },
    "Caravel":{
        "Food":750,
        "Gold":475
    },
    "Conquistador":{
        "Food":1200,
        "Gold":600
    },
    "TurtleShip":{
        "Food":1000,
        "Gold":800
    },
    "Longboat":{
        "Food":750,
        "Gold":475
    },
    "Janissary":{
        "Food":850,
        "Gold":750
    },
    "BallistaElephant":{
        "Food":1000,
        "Gold":500
    },
    "Mangonel":{
        "Food":800,
        "Gold":500
    },
    "Onager":{
        "Food":1450,
        "Gold":1000
    },
    "BatteringRam":{
        "Food":300
    },
    "CappedRam":{
        "Food":1000
    },
    "Scorpion":{
        "Food":1000,
        "Wood":1100
    },
    "KarambitWarrior":{
        "Food":900,
        "Gold":600
    },
    "Gbeto":{
        "Food":900,
        "Gold":600
    },
    "ShotelWarrior":{
        "Food":1200,
        "Gold":550
    },
    "JaguarWarrior":{
        "Food":1000,
        "Gold":500
    },
    "Berserk":{
        "Food":1300,
        "Gold":550
    },
    "TeutonicKnight":{
        "Food":1200,
        "Gold":600
    },
    "Samurai":{
        "Food":950,
        "Gold":875
    },
    "Huskarl":{
        "Food":1200,
        "Gold":550
    },
    "ThrowingAxeman":{
        "Food":1000,
        "Gold":750
    },
    "WoadRaider":{
        "Food":1000,
        "Gold":800
    },
    "EagleScout":{
        "Food":200,
        "Gold":200
    },
    "EagleWarrior":{
        "Food":800,
        "Gold":500
    },
    "Spearman":{
        "Food":215,
        "Gold":90
    },
    "Pikeman":{
        "Food":300,
        "Gold":600
    },
    "Militia":{
        "Food":100,
        "Gold":40
    },
    "ManAtArms":{
        "Food":150,
        "Gold":65
    },
    "LongSwordsman":{
        "Food":300,
        "Gold":100
    },
    "TwoHandedSwordsman":{
        "Food":750,
        "Gold":350
    },
    "Keshik":{
        "Food":700,
        "Gold":900
    },
    "Leitis":{
        "Food":750,
        "Gold":750
    },
    "Konnik":{
        "Food":1000,
        "Gold":750
    },
    "KonnikDismounted":{
        "Food":1000,
        "Gold":750
    },
    "Boyar":{
        "Food":1000,
        "Gold":600
    },
    "MagyarHuszar":{
        "Food":800,
        "Gold":600
    },
    "Tarkan":{
        "Food":1000,
        "Gold":500
    },
    "Mameluke":{
        "Food":600,
        "Gold":500
    },
    "WarElephant":{
        "Food":1600,
        "Gold":1200
    },
    "Cataphract":{
        "Food":1200,
        "Gold":800
    },
    "SteppeLancer":{
        "Food":900,
        "Gold":550
    },
    "BattleElephant":{
        "Food":1200,
        "Gold":900
    },
    "CamelRider":{
        "Food":325,
        "Gold":360
    },
    "HeavyCamelRider":{
        "Food":1200,
        "Gold":600
    },
    "Knight":{
        "Food":300,
        "Gold":300
    },
    "Cavalier":{
        "Food":1300,
        "Gold":750
    },
    "ScoutCavalry":{
        "Food":150,
        "Gold":50
    },
    "LightCavalry-Hussar":{
        "Food":500,
        "Gold":600
    },
    "LightCavalry-WingedHussar":{
        "Food":600,
        "Gold":800
    },
    "Kipchak":{
        "Food":1100,
        "Wood":1000
    },
    "RattanArcher":{
        "Food":1000,
        "Gold":750
    },
    "Genitour":{
        "Food":500,
        "Wood":450
    },
    "CamelArcher":{
        "Wood":1000,
        "Gold":500
    },
    "GenoeseCrossbowman":{
        "Food":1000,
        "Gold":800
    },
    "ElephantArcher":{
        "Food":1000,
        "Gold":800
    },
    "WarWagon":{
        "Wood":1000,
        "Gold":800
    },
    "Mangudai":{
        "Food":1100,
        "Gold":675
    },
    "ChuKoNu":{
        "Food":760,
        "Gold":760
    },
    "Longbowman":{
        "Food":850,
        "Gold":850
    },
    "CavalryArcher":{
        "Food":900,
        "Gold":500
    },
    "Skirmisher":{
        "Wood":230,
        "Gold":130
    },
    "EliteSkirmisher":{
        "Wood":300,
        "Gold":450
    },
    "Archer":{
        "Food":125,
        "Gold":75
    },
    "Crossbowman":{
        "Food":350,
        "Gold":300
    },
    "PlumedArcher":{
        "Food":700,
        "Wood":1000
    },
    "Kamayuk":{
        "Food":900,
        "Gold":500
    }
};

const UnitLineUnion = unwrap(unitLineIds);
export type UnitLine = typeof UnitLineUnion;

export const units = unitsInternal as UnitDict;

interface IUnit {
    dataId: aoeUnitDataId;
}

interface UnitDict {
    [unit: string]: IUnit;
}

export interface IUnitClassPair {
    Amount: number;
    Class: UnitClassNumber,
}

export type ICostDict = {
    [key in Other]?: number;
};

export interface IUnitInfo {
    AccuracyPercent: number;
    Attack: number;
    Attacks: ReadonlyArray<IUnitClassPair>;
    Cost: ICostDict;
    FrameDelay: number;
    GarrisonCapacity: number;
    HP: number;
    ID: number;
    ChargeEvent: number;
    ChargeType: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    LineOfSight: number;
    MaxCharge: number;
    MeleeArmor: number;
    MinRange: number;
    PierceArmor: number;
    Armours: ReadonlyArray<IUnitClassPair>;
    Range: number;
    RechargeDuration: number;
    RechargeRate: number;
    ReloadTime: number;
    Speed: number;
    TrainTime: number;
}

const unitClasses = {
    0: "unused",
    1: "infantry",
    2: "turtleships",
    3: "pierce",
    4: "melee",
    5: "warelephants",
    6: "unused",
    7: "unused",
    8: "cavalry",
    9: "unused",
    10: "unused",
    11: "allbuildings", // except Port
    12: "unused",
    13: "stonedefense",
    14: "fepredatoranimals",
    15: "archers",
    16: "shipsandcamelsandsaboteurs",
    17: "rams",
    18: "trees",
    19: "uniqueunits", // except Turtle Ship
    20: "siegeweapons",
    21: "standardbuildings",
    22: "wallsandgates",
    23: "gunpowderunits",
    24: "boars",
    25: "monks",
    26: "castle",
    27: "spearmen",
    28: "cavalryarchers",
    29: "eaglewarriors",
    30: "camels",
    31: "antileitis",
    32: "condottieros",
    33: "organgundamage",
    34: "fishingships",
    35: "mamelukes",
    36: "heroesandkings",
    37: "hussitewagon",
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

export function getUnitClassName(unitClassNumber: UnitClassNumber) {
    return getUiTranslation(`enum.unitclass.${unitClasses[unitClassNumber]}`);
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
    'BerryBush',
] as const;

const OtherUnion = unwrap(otherNames);
export type Other = typeof OtherUnion;

export function sortResources(resources: Other[]) {
    return sortBy(resources, res => otherNames.indexOf(res));
}

export type Unit = keyof typeof unitsInternal;

export function getUnitLineName(unitLine: UnitLine) {
    if (!unitLines[unitLine]) throw new Error(`Unit line ${unitLine} does not exist.`);
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitName(unit);
}

export function getUnitName(unit: Unit) {
    const data = getUnitData(unit);
    return getAoeString(data.LanguageNameId.toString()).replace(' (Male)', '');
}

export function getUnitData(unit: Unit) {
    const unitEntry = units[unit];
    if (unitEntry == null) {
        throw Error(`getUnitData ${unit} - no dataId`);
    }
    const dataId = units[unit].dataId;
    if (aoeData.data.units[dataId] == null) {
        throw Error(`getUnitData ${unit} - no data`);
    }
    return aoeData.data.units[dataId] as IUnitInfo;
}

export function getUnitDescription(unit: Unit) {
    const data = getUnitData(unit);
    let description = getAoeString(data.LanguageHelpId.toString()) as string;

    // console.log('description', description);

    description = strRemoveTo(description, '<br>\n');
    description = strRemoveFrom(description, '<i>'); // <i>Upgrades:

    description = description.trim();

    return description;
}

export function getUnitUpgradeCost(unitFrom: Unit, unitTo: Unit): ICostDict | null {
    if (unitTo === 'EliteKonnikDismounted') unitTo = 'EliteKonnik';
    const data = getUnitData(unitTo as any);
    const upgradeInfo = aoeData.data.unit_upgrades[data.ID];
    return upgradeInfo?.Cost;
}

// const old = unitUpgradeCosts[unitFrom as keyof typeof unitUpgradeCosts] ?? unitUpgradeCosts[`${unitFrom}-${unitTo}`];
// const new2 = newData?.Cost;
// console.log(old, new2);
// if (!shallowEqual(old, new2)) {
//     console.log('DIFFERENT', old, new2);
// }
// if (!newData) {
//     console.log('NOT FOUND');
// }

// console.log(shallowEqual(old, new2));

// for (const key of Object.keys(unitUpgradeCosts)) {
//     console.log(key, unitUpgradeCosts[key]);
//     const data = getUnitData(key as any);
//     console.log('=>', data.ID, aoeData.data.unit_upgrades[data.ID]);
// }

// export function getUnitDescriptionRaw(unit: Unit) {
//     const data = getUnitData(unit);
//     return getAoeString(data.LanguageHelpId.toString()) as string;
// }
//
// type ResourceAbbr = 'W' | 'F' | 'G' | 'S';

// export function parseUnitUpgradeCostFromEnAoeData(unit: Unit): ICostDict | null {
//     const description = getUnitDescriptionRaw(unit);
//
//     const regex = /to ([^\d]+) ([^()]+) \(([^)]+)\);/gm;
//     const upgradedTo = regex.exec(description);
//
//     // console.log(upgradedTo);
//     if (upgradedTo == null) return null;
//
//     const [_, unitName, costStr, buildingName] = upgradedTo;
//
//     const resourceAbbrDict = {
//         'W': 'Wood' as Other,
//         'F': 'Food' as Other,
//         'G': 'Gold' as Other,
//         'S': 'Stone' as Other,
//     };
//
//     const dict = {} as ICostDict;
//
//     const regex2 = /([\d]+)([WFGS])/gm;
//     getAllMatches(regex2, costStr).map(([_, amount, resource]) => dict[resourceAbbrDict[resource as ResourceAbbr]] = parseInt(amount));
//     // console.log(costList);
//     // console.log(dict);
//
//     if (dict['Wood'] == null && dict['Food'] == null && dict['Gold'] == null && dict['Stone'] == null) return null;
//
//     return dict;
// }

// const unitUpgradeCosts = merge({}, ...keysOf(units).filter(unit => getUnitUpgradeCost(unit as Unit) != null).map(unit => ({
//     [unit]: getUnitUpgradeCost(unit as Unit),
// })));
//
// console.log('unitUpgradeCosts', JSON.stringify(unitUpgradeCosts));

export const unitList = unitLineIds.map(ul => ({
    name: ul,
    ...unitLines[ul],
}))

export function getRelatedUnitLines(unitLineId: UnitLine): UnitLine[] {
    return unitLines[unitLineId].related || [];
}

export function getUnitLineForUnit(unit: Unit): IUnitLine | undefined {
    return unitList.find(ul => ul.units.includes(unit));
}

export function hasUnitLine(unit: Unit) {
    const unitInfo = unitList.find(ul => ul.units.includes(unit));
    return unitInfo != null;
}

export function getUnitLineIdForUnit(unit: Unit) {
    const unitInfo = unitList.find(ul => ul.units.includes(unit));
    if (unitInfo == null) {
        throw new Error(`Unit ${unit} has no unit line.`)
    }
    return unitInfo.name;
}

export function getUnitLineNameForUnit(unit: Unit) {
    const unitInfo = unitList.find(ul => ul.units.includes(unit));
    if (unitInfo == null) {
        return getUnitName(unit);
    }
    return getUnitName(unitInfo.units[0]);
}

export function getInferiorUnitLines(unitLineId: UnitLine) {
    const inferiorUnitLines: UnitLine[] = [];
    for (const otherUnitLineId of unitLineIds) {
        const otherUnitLine = unitLines[otherUnitLineId];
        if ((otherUnitLine.counteredBy || []).includes(unitLineId)) {
            inferiorUnitLines.push(otherUnitLineId);
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
export const sortedUnitLines: UnitLine[] = [
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
    'Coustillier',
    'ElephantArcher',
    'FlemishMilitia',
    'Gbeto',
    'Genitour',
    'GenoeseCrossbowman',
    'HussiteWagon',
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
    'Obuch',
    'OrganGun',
    'PlumedArcher',
    'RattanArcher',
    'Samurai',
    'Serjeant',
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
    return sortBy(unitLines, ul => sortedUnitLines.indexOf(ul));
}

export function filterUnits(unitLineIds: UnitLine[], filter: { unique?: boolean }) {
    return unitLineIds.filter(unitlineId => {
        const unitLine = unitLines[unitlineId];
        if (filter.unique === false) {
            return unitLine.unique == null || !unitLine.unique;
        }
        if (filter.unique === true) {
            return unitLine.unique;
        }
        return true;
    });
}

// const diffUnits = Object.values(unitsInternal).filter(unit => {
//     const data = aoeData.data.units[unit.dataId];
//     const armoursMelee = data.Armours.find(a => a.Class === 4)?.Amount;
//     const armoursPierce = data.Armours.find(a => a.Class === 3)?.Amount;
//     console.log(unit.dataId, armoursMelee, data.MeleeArmor, armoursPierce, data.PierceArmor);
//     return armoursMelee != data.MeleeArmor || armoursPierce != data.PierceArmor;
// });
// console.log(diffUnits);

// for (const unitId of Object.keys(units)) {
//     console.log(unitId);
//     const unitLine = getUnitLineForUnit(unitId as Unit);
//     if (!unitLine) continue;
//     const unitIndex = unitLine.units.indexOf(unitId as Unit);
//     let upgradedToList = unitIndex < unitLine.units.length-1 ? [unitLine.units[unitIndex+1]] : [];
//     for (const upgradedTo of upgradedToList) {
//         console.log('->', upgradedTo);
//         getUnitUpgradeCost(unitId as Unit, upgradedTo);
//     }
// }
