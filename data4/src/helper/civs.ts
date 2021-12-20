import {Civ, getAoeString} from "@nex/data";
import {civDescriptionData} from "../../../dataset4/src";

const civDescriptionDict = civDescriptionData;

export function getCivStrategies(civ: Civ) {
    return getAoeString(civDescriptionDict[civ][1]);
}

export function getCivInfo(civ: Civ): string[] {
    return civDescriptionDict[civ].map(key => getAoeString(key));
}
