import {Tech} from "./techs";

interface IUpgrade {
    tech: Tech;
    attack?: string;
    armor?: string;
    speed?: string;
    sight?: string;
    conversionDefense?: string;
    creationSpeed?: string;
    [key: string]: string | undefined;
}

interface IUnitLine {
    units: string[];
    upgrades: IUpgrade[];
}

interface IUnitLineDict {
    [unit: string]: IUnitLine;
}

export const unitLines: IUnitLineDict = {
    'Kamayuk': {
        units: ['Kamayuk', 'EliteKamayuk'],
        upgrades: [
            {
                tech: 'Forging',
                attack: '+1',
            },
            {
                tech: 'IronCasting',
                attack: '+1',
            },
            {
                tech: 'BlastFurnace',
                attack: '+2',
            },
            {
                tech: 'Arson',
                attack: '+2 attack against standard buildings',
            },
            {
                tech: 'ScaleMailArmor',
                armor: '+1/+1',
            },
            {
                tech: 'ChainMailArmor',
                armor: '+1/+1',
            },
            {
                tech: 'PlateMailArmor',
                armor: '+1/+2',
            },
            {
                tech: 'Couriers',
                armor: '+1/+2',
                speed: '+10%', // Todo: Remove
            },
            {
                tech: 'Squires',
                speed: '+10%',
            },
            {
                tech: 'Tracking',
                sight: '+2',
            },
            {
                tech: 'Faith',
                conversionDefense: '',
            },
            {
                tech: 'Heresy',
                conversionDefense: '',
            },
            {
                tech: 'Conscription',
                creationSpeed: '+33%',
            },
        ],
    }
};

export const units = {
    'Kamayuk': {
        dataId: 879,
        line: 'Kamayuk',
    },
    'EliteKamayuk': {
        dataId: 881,
        line: 'Kamayuk',
    },
};

interface UnitDict {
    [unit: string]: any;
}

const unitIcons: UnitDict = {
    'Kamayuk': require('../../assets/units/Kamayuk.png'),
};

export type Unit = keyof typeof units;
export type UnitLine = keyof typeof unitLines;

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return unitIcons[unit];
}

export function getUnitLineName(unitLine: string) {
    return 'Kamayuk Line';
}