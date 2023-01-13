import {Civ} from "@nex/data";

export function getCivStrategies(aoe4CivInfo, civ: Civ) {
    return aoe4CivInfo[civ].classes;
}
