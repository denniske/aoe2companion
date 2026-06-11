import {Tech, techs } from "@nex/data";
import {ImageSourcePropType} from "react-native";
import { techIconImageDict } from '@/assets/techs';


export function getTechIcon(tech: Tech): ImageSourcePropType {
    const techEntry = techs[tech];

    if (techEntry.age === 'CastleAge') {
        return require('../../assets/techs/UniqueTechCastle.png');
    }
    if (techEntry.age === 'ImperialAge') {
        return require('../../assets/techs/UniqueTechImperial.png');
    }

    return techIconImageDict[tech];
}
