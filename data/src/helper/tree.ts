import {Building, buildings} from "./buildings";
import {Unit, units} from "./units";
import { Age, Tech, techs} from "./techs";
import {Civ, civDict, civs} from "./civs";
import {aoeData} from '../data/data';
import { aoeTreeInternal } from '@/data/src/data/aoe-trees';


export interface AbilityProps2 {
    civ: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
    dependsOn?: any;
}

export interface AbilityHelperProps {
    civ?: Civ;
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

export function getAbilityAge({civ, tech, unit, building, dependsOn}: AbilityProps2) {
    if (tech) {
        return getCivTechAge(civ, tech);
    }
    if (unit) {
        return getCivUnitAge(civ, unit);
    }
    if (building) {
        return getCivBuildingAge(civ, building);
    }
    return '';
}

export function getAbilityEnabledForAllCivs(props: AbilityHelperProps) {
    return civs.filter(c => c != 'Indians').every(civ => getAbilityEnabled({civ, ...props}));
}

export function getCivHasTech(civ: Civ, tech: Tech) {
    const entry = techs[tech];

    if (!entry) {
        console.log(`Tech ${tech} not in the units list`);
    }

    const civTechTree = aoeData.civs[civ as any as keyof typeof aoeData.civs];
    return civTechTree.Tech.includes(parseInt(entry.dataId) as any);
    // return civTechTree.techs.some(t => t.id === parseInt(entry.dataId))
    //     || civTechTree.unique.castleAgeUniqueTech === parseInt(entry.dataId) as any
    //     || civTechTree.unique.imperialAgeUniqueTech === parseInt(entry.dataId) as any;
}

export function getCivHasBuilding(civ: Civ, building: Building) {
    const entry = buildings[building];

    if (!entry) {
        console.log(`Building ${building} not in the units list`);
    }

    const civTechTree = aoeData.civs[civ as any as keyof typeof aoeData.civs];
    return civTechTree.Building.includes(parseInt(entry.dataId) as any);
    // return civTechTree.buildings.some(b => b.id === parseInt(entry.dataId));
}

export function getCivHasUnit(civ: Civ, unit: Unit) {
    const entry = units[unit];

    if (!entry) {
        console.log(`Unit ${unit} not in the units list`);
    }

    const civTechTree = aoeData.civs[civ as any as keyof typeof aoeData.civs];
    return civTechTree.Unit.includes(parseInt(entry.dataId) as any);
        // || civTechTree.unique.castleAgeUniqueUnit === parseInt(entry.dataId) as any
        // || civTechTree.unique.imperialAgeUniqueUnit === parseInt(entry.dataId) as any;
}

const ageIdToEnumMapping: Record<number, Age> = {
    1: 'DarkAge',
    2: 'FeudalAge',
    3: 'CastleAge',
    4: 'ImperialAge',
}

export function getCivBuildingAge(civ: Civ, building: Building) {
    const entry = buildings[building];

    const civTechTree = aoeTreeInternal[civ as any as keyof typeof aoeTreeInternal];
    const info = civTechTree.civ_techs_buildings.find(u => u['Building ID'] === parseInt(entry.dataId));

    if (!info?.['Age ID']) {
        return undefined;
    }

    return ageIdToEnumMapping[info['Age ID']];
}

export function getCivUnitAge(civ: Civ, unit: Unit) {
    const entry = units[unit];

    const civTechTree = aoeTreeInternal[civ as any as keyof typeof aoeTreeInternal];
    const info = civTechTree.civ_techs_units.find(u => u['Building ID'] === parseInt(entry.dataId));

    if (!info?.['Age ID']) {
        return undefined;
    }

    return ageIdToEnumMapping[info['Age ID']];
}

export function getCivTechAge(civ: Civ, tech: Tech) {
    const entry = techs[tech];

    const civTechTree = aoeTreeInternal[civ as any as keyof typeof aoeTreeInternal];
    const info = civTechTree.civ_techs_units.find(u =>
            u['Node Type'] === 'Research' &&
            u['Node ID'] === parseInt(entry.dataId)
    );

    // console.log(civTechTree)
    // console.log('getCivTechAge', civ, tech, parseInt(entry.dataId), info);

    if (!info?.['Age ID']) {
        return undefined;
    }

    return ageIdToEnumMapping[info['Age ID']];

    // const civTechTree = aoeTreeInternal[civ as any as keyof typeof aoeTreeInternal];
    // return undefined;

    // const info = civTechTree.techs.find(u => u.id === parseInt(entry.dataId));
    //
    // if (!info?.age) {
    //     return undefined;
    // }
    //
    // return ageIdToEnumMapping[info.age];
}

export function getCivMonkType(civ: Civ) {
    return 'Generic';

    // const civTechTree = aoeData.civs[civ as any as keyof typeof aoeData.civs];
    // return civTechTree.Unit.includes(parseInt(entry.dataId) as any);

    // const civTechTree = aoeData.techtrees[civ as any as TechTreeKey];
    //
    // const mapping = {
    //     '_33': 'Generic',
    //     '_122': 'African',
    //     '_293': 'Tengri',
    //     '_218': 'Buddhist',
    //     '_291': 'Catholic',
    //     '_290': 'Hindu',
    //     '_169': 'Muslim',
    //     '_131': 'Native',
    //     '_292': 'Orthodox',
    // } as const;
    //
    // return mapping[civTechTree.monkSuffix];
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
