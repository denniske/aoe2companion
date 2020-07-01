import * as aoeData from "../data/data.json"

type aoeTechDataId = keyof typeof aoeData.data.techs;
type aoeStringKey = keyof typeof aoeData.strings;

interface ITech {
    dataId: aoeTechDataId;
}

interface ITechDict {
    [tech: string]: ITech;
}

export const techs: ITechDict = {
    'Forging': {
        dataId: '67',
    },
    'IronCasting': {
        dataId: '68',
    },
    'BlastFurnace': {
        dataId: '75',
    },
    'Arson': {
        dataId: '602',
    },
    'ScaleMailArmor': {
        dataId: '74',
    },
    'ChainMailArmor': {
        dataId: '76',
    },
    'PlateMailArmor': {
        dataId: '77',
    },
    'Couriers': {
        dataId: '517',
    },
    'Squires': {
        dataId: '215',
    },
    'Tracking': {
        dataId: '90',
    },
    'Faith': {
        dataId: '45',
    },
    'Heresy': {
        dataId: '439',
    },
    'Conscription': {
        dataId: '315',
    },
};

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
};

export type Tech = keyof typeof techs;

export function getTechIcon(tech: Tech) {
    return techIcons[tech];
}

export function getTechName(tech: Tech) {
    const dataId = techs[tech].dataId;
    const techData = aoeData.data.techs[dataId];
    return aoeData.strings[techData.LanguageNameId.toString() as aoeStringKey];
}
