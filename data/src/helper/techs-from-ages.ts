import { Age } from './techs';
import {Building} from './buildings';
import {IUnitInfo, Unit} from './units';


type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>;

// Defines increase of attribute per unit at a specific age
export const ageUpgrades: PartialRecord<Unit | Building, PartialRecord<Age, Partial<IUnitInfo>>> = {
    'Serjeant': {
        'FeudalAge': {
            "TrainTime": 4,
            "HP": 0,
            "Attacks": [
                {
                    "Amount": 0,
                    "Class": 4
                },
            ],
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'CastleAge': {
            "TrainTime": -4,
            "HP": 20,
            "Attacks": [
                {
                    "Amount": 3,
                    "Class": 4
                },
            ],
            "MeleeArmor": 2,
            "PierceArmor": 1,
        },
    },
    'EagleScout': {
        'DarkAge': {
            "LineOfSight": 0,
        },
        'FeudalAge': {
            "TrainTime": 0,
            "Attacks": [
                {
                    "Amount": 0,
                    "Class": 4
                },
            ],
            "LineOfSight": 3, // Implicit Tracking
        },
        'CastleAge': {
            "TrainTime": -25,
            "Attacks": [
                {
                    "Amount": 3,
                    "Class": 4
                },
                {
                    "Amount": 2,
                    "Class": 8
                },
                {
                    "Amount": 1,
                    "Class": 16
                },
                {
                    "Amount": 1,
                    "Class": 30
                },
                {
                    "Amount": 1,
                    "Class": 34
                },
            ],
        },
    },
    'Militia': {
        'DarkAge': {
            "LineOfSight": 0,
        },
        'FeudalAge': {
            "LineOfSight": 2, // Implicit Tracking
        },
    },
    'Spearman': {
        'DarkAge': {
            "LineOfSight": 0,
        },
        'FeudalAge': {
            "LineOfSight": 2, // Implicit Tracking
        },
    },
    'ScoutCavalry': {
        'DarkAge': {
            "LineOfSight": 0,
            "Attacks": [
                {
                    "Amount": 0,
                    "Class": 4
                },
            ],
            "Speed": 0,
        },
        'FeudalAge': {
            "LineOfSight": 2,
            "Attacks": [
                {
                    "Amount": 2,
                    "Class": 4
                },
            ],
            "Speed": 0.35,
        },
        'CastleAge': {
            "LineOfSight": 2,
        },
        'ImperialAge': {
            "LineOfSight": 2,
        },
    },
    'LightCavalry': {
        'CastleAge': {
            "LineOfSight": 0,
        },
        'ImperialAge': {
            "LineOfSight": 2,
        },
    },
    'Outpost': {
        'DarkAge': {
            "LineOfSight": 0,
        },
        'FeudalAge': {
            "LineOfSight": 2,
        },
        'CastleAge': {
            "LineOfSight": 2,
        },
        'ImperialAge': {
            "LineOfSight": 2,
        },
    },
    'House': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 150,
            "MeleeArmor": 2,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 2,
            "PierceArmor": 1,
        },
    },
    'Blacksmith': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Mill': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Folwark': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'LumberCamp': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'MiningCamp': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 200,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Barracks': {
        'DarkAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'ArcheryRange': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Stable': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Market': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Monastery': {
        'CastleAge': {
            "MeleeArmor": 2,
            "PierceArmor": 2,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'FortifiedChurch': {
        'CastleAge': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Dock': {
        'DarkAge': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'PalisadeWall': {
        'DarkAge': {
            "HP": 0,
        },
        'FeudalAge': {
            "HP": 100,
        },
    },
    'PalisadeGate': {
        'DarkAge': {
            "HP": 0,
        },
        'FeudalAge': {
            "HP": 160,
        },
    },
    'WatchTower': {
        'FeudalAge': {
            "HP": 0,
        },
        'CastleAge': {
            "HP": 170,
        },
    },
    'Gate': {
        'FeudalAge': {
            "HP": 0,
        },
        'CastleAge': {
            "HP": 1100,
        },
    },
    'StoneWall': {
        'FeudalAge': {
            "HP": 0,
        },
        'CastleAge': {
            "HP": 720,
        },
    },
    'Donjon': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
            // "Attacks": [
            //     {
            //         "Amount": 0,
            //         "Class": 3
            //     },
            // ],
        },
        'CastleAge': {
            "HP": 250,
            "MeleeArmor": 1,
            "PierceArmor": 1,
            // "Attacks": [
            //     {
            //         "Amount": "5 (x2)",
            //         "Class": 3
            //     },
            // ],
        },
        'ImperialAge': {
            "HP": 750,
            "MeleeArmor": 1,
            "PierceArmor": 1,
            // "Attacks": [
            //     {
            //         "Amount": "5 (x3)",
            //         "Class": 3
            //     },
            // ],
        },
    },
    'SiegeWorkshop': {
        'FeudalAge': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'CastleAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "HP": 300,
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'University': {
        'CastleAge': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'TownCenter': {
        'DarkAge': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'FeudalAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'CastleAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
        'ImperialAge': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
};

export function getUpgrade(unit: Unit | Building, age: Age) {
    return ageUpgrades[unit]?.[age];
}

export function getUpgradeFormatted(unitId: Unit | Building, age: Age) {
    const upgrade = getUpgrade(unitId, age);
    const props = [];
    if (upgrade?.HP) {
        props.push({ name: 'Hit Points', effect: upgrade.HP});
    }
    if (upgrade?.MeleeArmor) {
        props.push({ name: 'Melee Armor', effect: upgrade.MeleeArmor});
    }
    if (upgrade?.PierceArmor) {
        props.push({ name: 'Pierce Armor', effect: upgrade.PierceArmor});
    }
    if (upgrade?.Speed) {
        props.push({ name: 'Speed', effect: upgrade.Speed});
    }
    if (upgrade?.LineOfSight) {
        props.push({ name: 'Line Of Sight', effect: upgrade.LineOfSight});
    }
    if (upgrade?.Attacks?.find(a => a.Class === 4)) {
        props.push({ name: 'Attack', effect: upgrade?.Attacks?.find(a => a.Class === 4)?.Amount});
    }
    return {
        unitId,
        props,
    };
}
