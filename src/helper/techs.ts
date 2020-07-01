import {aoeData, aoeStringKey, aoeTechDataId} from "../data/data";


interface IEffect {
    accuracy?: string;
    attack?: string;
    armor?: string;
    speed?: string;
    sight?: string;
    conversionDefense?: string;
    creationSpeed?: string;
    other?: string;
    [key: string]: string | undefined;
}

interface ITech {
    dataId: aoeTechDataId;
    name: string;
    effect?: IEffect;
}

interface ITechEffect {
    tech: Tech;
    effect: IEffect;
}

interface ITechDict {
    [tech: string]: ITech;
}

interface ITechEffectDict {
    [tech: string]: ITechEffect;
}


const techEffectDictInternal = {
    'ObsidianArrows': {
        tech: 'ObsidianArrows',
        effect: {
            attack: 'gives +6 attack against standard buildings and fortifications',
        },
    },
    'Yeomen': {
        tech: 'Yeomen',
        effect: {
            range: '+1',
        },
    },
    'Pavise': {
        tech: 'Pavise',
        effect: {
            armor: '+1/+1',
        },
    },
    'Kamandaran': {
        tech: 'Kamandaran',
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
    'Arson': {
        tech: 'Arson',
        effect: {
            attack: '+2 attack against standard buildings',
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
    'Couriers': {
        tech: 'Couriers',
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
            sight: '+10%',
        },
    },
    'Faith': {
        tech: 'Faith',
        effect: {
            conversionDefense: '',
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

export const techEffectDict = techEffectDictInternal as ITechEffectDict;

export const techList: ITech[] = [
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
        name: 'Couriers',
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

const techIcons: TechDict = {
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

    'AndeanSling': require('../../assets/techs/UniqueTechCastle.png'),
    'ObsidianArrows': require('../../assets/techs/UniqueTechCastle.png'),
    'Yeomen': require('../../assets/techs/UniqueTechCastle.png'),
    'Pavise': require('../../assets/techs/UniqueTechCastle.png'),
    'Kamandaran': require('../../assets/techs/UniqueTechCastle.png'),

    'Couriers': require('../../assets/techs/UniqueTechImperial.jpg'),
};

export type Tech = keyof typeof techIcons;
export type TechEffect = keyof typeof techEffectDictInternal;

export function getTechIcon(tech: Tech) {
    return techIcons[tech];
}

export function getTechName(tech: Tech) {
    const dataId = techs[tech].dataId;
    const data = aoeData.data.techs[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}
