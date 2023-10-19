import {Civ} from "@nex/data";

export function getCivStrategies(aoe4CivInfo: any, civ: Civ) {
    return aoe4CivInfo[civ].classes;
}
