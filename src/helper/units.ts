import {Tech, TechEffect} from "./techs";
import {ImageSourcePropType} from "react-native";
import {aoeData, aoeStringKey, aoeUnitDataId} from "../data/data";


interface IUnitLine {
    unique?: boolean;
    units: Unit[];
    upgrades: TechEffect[];
}

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLines: IUnitLineDict = {
    'Keshik': {
        units: ['Keshik', 'EliteKeshik'],
        unique: true,
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
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'Rocketry',
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
            'Couriers',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
    'Kamayuk': {
        units: ['Kamayuk', 'EliteKamayuk'],
        unique: true,
        upgrades: [
            'Forging',
            'IronCasting',
            'BlastFurnace',
            'Arson',
            'ScaleMailArmor',
            'ChainMailArmor',
            'PlateMailArmor',
            'Couriers',
            'Squires',
            'Tracking',
            'Faith',
            'Heresy',
            'Conscription',
        ],
    },
};

const unitsInternal = {
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
        dataId: '448', // Todo: Change
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
};


export type Unit = keyof typeof unitsInternal;
export type UnitLine = keyof typeof unitLines;

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitIcon(unit);
}

export function getUnitLineName(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitName(unit);
}

export function getEliteUniqueResearchIcon() {
    return require('../../assets/units/EliteUniqueResearch.jpg');
}

export function getUnitIcon(unit: Unit) {
    return unitIcons[unit];
}

export function getUnitName(unit: Unit) {
    const unitEntry = units[unit];
    if (unitEntry == null)
        throw Error(`getUnitLineName ${unit} - no dataId`);
    const dataId = units[unit].dataId;
    const data = aoeData.data.units[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}