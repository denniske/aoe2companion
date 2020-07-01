import {Tech, TechEffect} from "./techs";
import {ImageSourcePropType} from "react-native";
import {aoeData, aoeStringKey, aoeUnitDataId} from "../data/data";


interface IUnitLine {
    units: string[];
    upgrades: TechEffect[];
}

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLines: IUnitLineDict = {
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

export const units: UnitDict = {
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
    'Skirmisher': require('../../assets/units/Skirmisher.png'),
};

export type Unit = keyof typeof units;
export type UnitLine = keyof typeof unitLines;

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return unitIcons[unit];
}

export function getUnitLineName(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    const unitEntry = units[unit];
    if (unitEntry == null)
        throw Error(`getUnitLineName ${unitLine} - no dataId`);
    const dataId = units[unit].dataId;
    const data = aoeData.data.units[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}