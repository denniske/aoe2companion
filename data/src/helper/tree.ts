import {Building, buildings} from "./buildings";
import {Unit, units} from "./units";
import {Tech, techs} from "./techs";
import {Civ, civDict, civs} from "./civs";
import {aoeData} from '../data/data';


export interface AbilityProps2 {
    civ: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
    dependsOn?: any;
}

export interface AbilityHelperProps {
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export function getAbilityEnabled({civ, tech, unit, building, dependsOn}: AbilityProps2) {
    if (dependsOn && !getAbilityEnabled({...dependsOn, civ})) {
        return false;
    }
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
    return civs.filter(c => c != 'Indians').every(civ => getAbilityEnabled({civ, ...props}));
}

type TechTreeKey = keyof typeof aoeData.techtrees;

export function getCivHasTech(civ: Civ, tech: Tech) {
    const entry = techs[tech];

    const civTechTree = aoeData.techtrees[civ as any as TechTreeKey];

    const newVal = civTechTree.techs.some(t => t.id === parseInt(entry.dataId))
        || civTechTree.unique.castleAgeUniqueTech === parseInt(entry.dataId) as any
        || civTechTree.unique.imperialAgeUniqueTech === parseInt(entry.dataId) as any;

    // const legacyVal = getCivHasTechLegacy(civ, tech);
    // if (legacyVal !== newVal) {
    //     console.log(`AVAILABILITY CHANGE FOR TECH ${tech} FROM ${legacyVal} to ${newVal}`);
    // }

    return newVal;
}

// function getCivHasTechLegacy(civ: Civ, tech: Tech) {
//     const entry = techs[tech];
//     const civConfig = civsConfig[civ];
//
//     if ((civConfig as any).enabled?.techs?.includes(parseInt(entry.dataId))) {
//         return true;
//     }
//
//     if ((civConfig as any).disabled?.techs?.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if (civDict[civ].uniqueTechs.includes(tech)) {
//         return true;
//     }
//
//     if ((civConfig as any).disableHorses && horseDisabledTechs.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if (techs[tech].civ != null) {
//         return techs[tech].civ === civ;
//     }
//
//     return true;
// }

export function getCivHasBuilding(civ: Civ, building: Building) {
    const entry = buildings[building];

    const civTechTree = aoeData.techtrees[civ as any as TechTreeKey];
    const newVal = civTechTree.buildings.some(b => b.id === parseInt(entry.dataId));

    // const legacyVal = getCivHasBuildingLegacy(civ, building);
    // if (legacyVal !== newVal) {
    //     console.log(`AVAILABILITY CHANGE FOR BUILDING ${building} FROM ${legacyVal} to ${newVal}`);
    // }

    return newVal;
}

// function getCivHasBuildingLegacy(civ: Civ, building: Building) {
//     const entry = buildings[building];
//     const civConfig = civsConfig[civ];
//
//     if ((civConfig as any).enabled?.buildings?.includes(parseInt(entry.dataId))) {
//         return true;
//     }
//
//     if ((civConfig as any).disabled?.buildings?.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if (defaultDisabledBuildings.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if ((civConfig as any).disableHorses && horseDisabledBuildings.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     return true;
// }

export function getCivHasUnit(civ: Civ, unit: Unit) {
    const entry = units[unit];

    const civTechTree = aoeData.techtrees[civ as any as TechTreeKey];
    const newVal = civTechTree.units.some(u => u.id === parseInt(entry.dataId))
        || civTechTree.unique.castleAgeUniqueUnit === parseInt(entry.dataId) as any
        || civTechTree.unique.imperialAgeUniqueUnit === parseInt(entry.dataId) as any;

    // const legacyVal = getCivHasUnitLegacy(civ, unit);
    // if (legacyVal !== newVal) {
    //     console.log(`AVAILABILITY CHANGE FOR UNIT ${unit} FROM ${legacyVal} to ${newVal}`);
    // }

    return newVal;
}

// function getCivHasUnitLegacy(civ: Civ, unit: Unit) {
//     const entry = units[unit];
//     const civConfig = civsConfig[civ];
//
//     if ((civConfig as any).enabled?.units?.includes(parseInt(entry.dataId))) {
//         return true;
//     }
//
//     if ((civConfig as any).disabled?.units?.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if (civDict[civ].uniqueUnits.includes(unit)) {
//         return true;
//     }
//
//     if (defaultDisabledUnits.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     if ((civConfig as any).disableHorses && horseDisabledUnits.includes(parseInt(entry.dataId))) {
//         return false;
//     }
//
//     return true;
// }
