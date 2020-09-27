import {Building, buildings} from "./buildings";
import {
    civsConfig, defaultDisabledBuildings, defaultDisabledUnits, horseDisabledBuildings, horseDisabledTechs,
    horseDisabledUnits
} from "../data/civs";
import {Unit, units} from "./units";
import {Tech, techs} from "./techs";
import {Civ, civs} from "./civs";


export interface AbilityProps2 {
    civ: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export interface AbilityHelperProps {
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export function getAbilityEnabled({civ, tech, unit, building}: AbilityProps2) {
    if (tech) {
        return getCivHasTech(civ, tech);
    }
    if (unit) {
        return getCivHasUnit(civ, unit);
    }
    if (building) {
        return getCivHasBuilding(civ, building);
    }
    return false;
}

export function getAbilityEnabledForAllCivs(props: AbilityHelperProps) {
    return civs.every(civ => getAbilityEnabled({civ, ...props}));
}

export function getCivHasTech(civ: Civ, tech: Tech) {
    const entry = techs[tech];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).disableHorses && horseDisabledTechs.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !civConfig.disabled.techs.includes(parseInt(entry.dataId));
}

export function getCivHasBuilding(civ: Civ, building: Building) {
    const entry = buildings[building];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).enabled?.buildings?.includes(parseInt(entry.dataId))) {
        return true;
    }

    if (defaultDisabledBuildings.includes(parseInt(entry.dataId))) {
        return false;
    }

    if ((civConfig as any).disableHorses && horseDisabledBuildings.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !((civConfig.disabled as any).buildings || []).includes(parseInt(entry.dataId));
}

export function getCivHasUnit(civ: Civ, unit: Unit) {
    const entry = units[unit];
    const civConfig = civsConfig[civ];

    if ((civConfig as any).enabled?.units?.includes(parseInt(entry.dataId))) {
        return true;
    }

    if (defaultDisabledUnits.includes(parseInt(entry.dataId))) {
        return false;
    }

    if ((civConfig as any).disableHorses && horseDisabledUnits.includes(parseInt(entry.dataId))) {
        return false;
    }

    return !civConfig.disabled.units.includes(parseInt(entry.dataId));
}
