import {Tech} from "./techs";
import {ImageSourcePropType} from "react-native";
import {aoeData, aoeStringKey, aoeUnitDataId} from "../data/data";


interface IUnitLine {
    units: string[];
    upgrades: Tech[];
}

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLines: IUnitLineDict = {
    'Slinger': {
        units: ['Slinger'],
        upgrades: [
            'Fletching',
            'BodkinArrow',
            'Bracer',
            'Chemistry',
            'AndeanSling',
            'ThumbRing',
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
    'Slinger': {
        dataId: '185',
        line: 'Slinger',
    },
    'Kamayuk': {
        dataId: '879',
        line: 'Kamayuk',
    },
    'EliteKamayuk': {
        dataId: '881',
        line: 'Kamayuk',
    },
};

interface IUnit {
    dataId: aoeUnitDataId;
    line: string;
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
};

export type Unit = keyof typeof units;
export type UnitLine = keyof typeof unitLines;

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return unitIcons[unit];
}

export function getUnitLineName(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    const dataId = units[unit].dataId;
    const data = aoeData.data.units[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}