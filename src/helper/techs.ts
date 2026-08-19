import {Tech, techs } from "@nex/data";
import {ImageSourcePropType} from "react-native";
import { techIconImageDict } from '@/assets/techs';


export function getTechIcon(tech: Tech): ImageSourcePropType {
    const techEntry = techs[tech];

    if (techEntry?.age === 'CastleAge') {
        return require('../../assets/techs/UniqueTechCastle.png');
    }
    if (techEntry?.age === 'ImperialAge') {
        return require('../../assets/techs/UniqueTechImperial.png');
    }

    return techIconImageDict[tech];
}

// Upgrade groups on unit/building/tech pages are keyed by their effect prop.
// `effectNames` in @nex/data only carries the English label, so the app maps the
// prop to a translation key instead of rendering that label directly.
export const effectTranslationKeys = {
    carryCapacity: 'unit.effect.carrycapacity',
    gatheringSpeed: 'unit.effect.gatheringspeed',
    hitPoints: 'unit.effect.hitpoints',
    attack: 'unit.effect.attack',
    range: 'unit.effect.range',
    firingRate: 'unit.effect.firingrate',
    accuracy: 'unit.effect.accuracy',
    armor: 'unit.effect.armor',
    speed: 'unit.effect.speed',
    sight: 'unit.effect.sight',
    conversionDefense: 'unit.effect.conversiondefense',
    creationSpeed: 'unit.effect.creationspeed',
    capacity: 'unit.effect.capacity',
    other: 'unit.effect.other',
} as const;
