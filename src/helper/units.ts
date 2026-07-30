import { Age, Building, Civ, getPictureName, Other, Tech, Unit, UnitLine, unitLines } from '@nex/data';
import {ImageSourcePropType} from "react-native";
import { getBuildingIcon } from './buildings';
import { getTechIcon } from './techs';
import { unitIconImageDict } from '@/assets/units';


const otherIcons = {
    'Wood': require('../../assets/other/Wood.png'),
    'Food': require('../../assets/other/Food.png'),
    'Gold': require('../../assets/other/Gold.png'),
    'Stone': require('../../assets/other/Stone.png'),
    'BerryBush': require('../../assets/other/BerryBush.png'),
    'Cross': require('../../assets/other/Cross.png'),
    'Build': require('../../assets/other/Build.png'),
};

export function getOtherIcon(other: Other) {
    return otherIcons[other];
}


const ageIcons = {
    'DarkAge': require('../../assets/other/DarkAge.png'),
    'FeudalAge': require('../../assets/other/FeudalAgeFull.png'),
    'CastleAge': require('../../assets/other/CastleAge.png'),
    'ImperialAge': require('../../assets/other/ImperialAge.png'),
};

export function getAgeIcon(age: Age) {
    return ageIcons[age];
}


export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitIcon(unit);
}

export function getEliteUniqueResearchIcon() {
    return require('../../assets/units/EliteUniqueResearch.png');
}

// Sheep and Boar have no data id, so they are missing from the auto-generated
// unitIconImageDict even though their icons exist. Without these the build order
// steps fall back to the elite unique research icon.
const extraUnitIcons: Record<string, ImageSourcePropType> = {
    'Sheep': require('../../assets/units/Sheep.png'),
    'Boar': require('../../assets/units/Boar.png'),
};

function getUnitIconImage(unit: string | undefined): ImageSourcePropType | undefined {
    if (!unit) return undefined;
    return unitIconImageDict[unit] ?? extraUnitIcons[unit];
}

// Use .webp for smaller files later
export function getUnitIcon(unit: Unit, civ?: Civ): ImageSourcePropType {
    if (['Monk', 'TradeCart'].includes(unit) && civ) {
        const pictureName = getPictureName(unit, civ);
        if (pictureName) {
            return unitIconImageDict[pictureName];
        }
    }
    return getUnitIconImage(unit) ?? require('../../assets/units/EliteUniqueResearch.png');
}

export function getIcon(icon: string) {
    return getUnitIconImage(icon) ?? getUnitIconImage(unitLines[icon]?.units?.[0]) ?? getBuildingIcon(icon as Building) ?? getTechIcon(icon as Tech) ?? getAgeIcon(icon as Age) ?? getOtherIcon(icon as Other);
}