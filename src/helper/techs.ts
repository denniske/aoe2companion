import {aoeData, aoeStringKey, aoeTechDataId} from "../data/data";


interface IEffect {
    accuracy?: string;
    attack?: string;
    armor?: string;
    speed?: string;
    sight?: string;
    conversionDefense?: string;
    creationSpeed?: string;
    [key: string]: string | undefined;
}

interface ITech {
    dataId: aoeTechDataId;
    name: string;
    effect: IEffect;
}

interface ITechDict {
    [tech: string]: ITech;
}

export const techList: ITech[] = [
    {
        dataId: '437',
        name: 'ThumbRing',
        effect: {
            accuracy: 'increases accuracy to 100%',
        },
    },
    {
        dataId: '93',
        name: 'Ballistics',
        effect: {
            accuracy: 'hit moving targets',
        },
    },
    {
        dataId: '516',
        name: 'AndeanSling',
        effect: {
            range: 'eliminates the minimum range',
        },
    },

    {
        dataId: '211',
        name: 'PaddedArcherArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    {
        dataId: '212',
        name: 'LeatherArcherArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    {
        dataId: '219',
        name: 'RingArcherArmor',
        effect: {
            armor: '+1/+2',
        },
    },

    {
        dataId: '199',
        name: 'Fletching',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    {
        dataId: '200',
        name: 'BodkinArrow',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },
    {
        dataId: '201',
        name: 'Bracer',
        effect: {
            attack: '+1',
            range: '+1',
        },
    },

    {
        dataId: '47',
        name: 'Chemistry',
        effect: {
            attack: '+1',
        },
    },

    {
        dataId: '67',
        name: 'Forging',
        effect: {
            attack: '+1',
        },
    },
    {
        dataId: '68',
        name: 'IronCasting',
        effect: {
            attack: '+1',
        },
    },
    {
        dataId: '75',
        name: 'BlastFurnace',
        effect: {
            attack: '+2',
        },
    },
    {
        dataId: '602',
        name: 'Arson',
        effect: {
            attack: '+2 attack against standard buildings',
        },
    },
    {
        dataId: '74',
        name: 'ScaleMailArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    {
        dataId: '76',
        name: 'ChainMailArmor',
        effect: {
            armor: '+1/+1',
        },
    },
    {
        dataId: '77',
        name: 'PlateMailArmor',
        effect: {
            armor: '+1/+2',
        },
    },
    {
        dataId: '517',
        name: 'Couriers',
        effect: {
            armor: '+1/+2',
        },
    },
    {
        dataId: '215',
        name: 'Squires',
        effect: {
            speed: '+10%',
        },
    },
    {
        dataId: '90',
        name: 'Tracking',
        effect: {
            sight: '+10%',
        },
    },
    {
        dataId: '45',
        name: 'Faith',
        effect: {
            conversionDefense: '',
        },
    },
    {
        dataId: '439',
        name: 'Heresy',
        effect: {
            conversionDefense: '',
        },
    },
    {
        dataId: '315',
        name: 'Conscription',
        effect: {
            creationSpeed: '+33%',
        },
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
    'Couriers': require('../../assets/techs/UniqueTechImperial.jpg'),
    'Squires': require('../../assets/techs/Squires.png'),
    'Tracking': require('../../assets/techs/Tracking.png'),
    'Faith': require('../../assets/techs/Faith.png'),
    'Heresy': require('../../assets/techs/Heresy.png'),
    'Conscription': require('../../assets/techs/Conscription.png'),
    'ThumbRing': require('../../assets/techs/ThumbRing.png'),
    'Ballistics': require('../../assets/techs/Ballistics.png'),
    'AndeanSling': require('../../assets/techs/UniqueTechCastle.png'),
    'PaddedArcherArmor': require('../../assets/techs/PaddedArcherArmor.png'),
    'LeatherArcherArmor': require('../../assets/techs/LeatherArcherArmor.png'),
    'RingArcherArmor': require('../../assets/techs/RingArcherArmor.png'),
    'Fletching': require('../../assets/techs/Fletching.png'),
    'BodkinArrow': require('../../assets/techs/BodkinArrow.png'),
    'Bracer': require('../../assets/techs/Bracer.png'),
    'Chemistry': require('../../assets/techs/Chemistry.png'),
};

export type Tech = keyof typeof techIcons;

export function getTechIcon(tech: Tech) {
    return techIcons[tech];
}

export function getTechName(tech: Tech) {
    const dataId = techs[tech].dataId;
    const data = aoeData.data.techs[dataId];
    return aoeData.strings[data.LanguageNameId.toString() as aoeStringKey];
}
