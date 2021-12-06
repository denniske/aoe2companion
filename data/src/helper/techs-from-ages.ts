import { Age } from './techs';
import {Building} from './buildings';
import {IUnitInfo, Unit} from './units';


type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>;

// Defines increase of attribute per unit at a specific age
export const ageUpgrades: PartialRecord<Unit | Building, PartialRecord<Age, Partial<IUnitInfo>>> = {
    'Serjeant': {
        'Castle': {
            "HP": 20,
            "Attacks": [
                {
                    "Amount": 3,
                    "Class": 4
                },
            ],
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'EagleScout': {
        'Castle': {
            "Attacks": [
                {
                    "Amount": 3,
                    "Class": 4
                },
            ],
        },
    },
    'ScoutCavalry': {
        'Feudal': {
            "LineOfSight": 2,
            "Attacks": [
                {
                    "Amount": 2,
                    "Class": 4
                },
            ],
            "Speed": 0.35,
        },
        'Castle': {
            "LineOfSight": 2,
        },
        'Imperial': {
            "LineOfSight": 2,
        },
    },
    'LightCavalry': {
        'Imperial': {
            "LineOfSight": 2,
        },
    },
    'Outpost': {
        'Feudal': {
            "LineOfSight": 2,
        },
        'Castle': {
            "LineOfSight": 2,
        },
        'Imperial': {
            "LineOfSight": 2,
        },
    },
    'House': {
        'Feudal': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 150,
            "MeleeArmor": 2,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 2,
            "PierceArmor": 1,
        },
    },
    'Blacksmith': {
        'Feudal': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Mill': {
        'Feudal': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Folwark': {
        'Feudal': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'LumberCamp': {
        'Feudal': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'MiningCamp': {
        'Feudal': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Barracks': {
        'Feudal': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'ArcheryRange': {
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Stable': {
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Market': {
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Monastery': {
        'Castle': {
            "MeleeArmor": 2,
            "PierceArmor": 2,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Dock': {
        'Feudal': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'PalisadeWall': {
        'Feudal': {
            "HP": 100,
        },
    },
    'PalisadeGate': {
        'Feudal': {
            "HP": 160,
        },
    },
    'WatchTower': {
        'Castle': {
            "HP": 320,
        },
    },
    'Gate': {
        'Castle': {
            "HP": 1375,
        },
    },
    'StoneWall': {
        'Castle': {
            "HP": 900,
        },
    },
    'Donjon': {
        'Castle': {
            "HP": 500,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "HP": 750,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'SiegeWorkshop': {
        'Castle': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'University': {
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'TownCenter': {
        'Feudal': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Castle': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
};

export function getUpgrade(unit: Unit | Building, age: Age) {
    return ageUpgrades[unit][age];
}

export function getUpgradeFormatted(unitId: Unit | Building, age: Age) {
    const upgrade = getUpgrade(unitId, age);
    const props = [];
    if (upgrade.HP) {
        props.push({ name: 'Hit Points', effect: upgrade.HP});
    }
    if (upgrade.MeleeArmor) {
        props.push({ name: 'Melee Armor', effect: upgrade.MeleeArmor});
    }
    if (upgrade.PierceArmor) {
        props.push({ name: 'Pierce Armor', effect: upgrade.PierceArmor});
    }
    if (upgrade.Speed) {
        props.push({ name: 'Speed', effect: upgrade.Speed});
    }
    if (upgrade.LineOfSight) {
        props.push({ name: 'Line Of Sight', effect: upgrade.LineOfSight});
    }
    if (upgrade.Attacks?.find(a => a.Class === 4)) {
        props.push({ name: 'Attack', effect: upgrade.Attacks.find(a => a.Class === 4).Amount});
    }
    return {
        unitId,
        props,
    };
}
