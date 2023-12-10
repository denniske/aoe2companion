import { Age } from './techs';
import {Building} from './buildings';
import {IUnitInfo, Unit} from './units';


type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>;

// Defines increase of attribute per unit at a specific age
export const ageUpgrades: PartialRecord<Unit | Building, PartialRecord<Age, Partial<IUnitInfo>>> = {
    'Serjeant': {
        'Feudal': {
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
        'Castle': {
            "TrainTime": -4,
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
        'Dark': {
            "LineOfSight": 0,
        },
        'Feudal': {
            "TrainTime": 0,
            "Attacks": [
                {
                    "Amount": 0,
                    "Class": 4
                },
            ],
            "LineOfSight": 1,
        },
        'Castle': {
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
    'ScoutCavalry': {
        'Dark': {
            "LineOfSight": 0,
            "Attacks": [
                {
                    "Amount": 0,
                    "Class": 4
                },
            ],
            "Speed": 0,
        },
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
        'Castle': {
            "LineOfSight": 0,
        },
        'Imperial': {
            "LineOfSight": 2,
        },
    },
    'Outpost': {
        'Dark': {
            "LineOfSight": 0,
        },
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
            "HP": 0,
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Dark': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Feudal': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
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
    'Stable': {
        'Feudal': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
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
    'Market': {
        'Feudal': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
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
    'FortifiedChurch': {
        'Castle': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'Dock': {
        'Dark': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
        'Dark': {
            "HP": 0,
        },
        'Feudal': {
            "HP": 100,
        },
    },
    'PalisadeGate': {
        'Dark': {
            "HP": 0,
        },
        'Feudal': {
            "HP": 160,
        },
    },
    'WatchTower': {
        'Feudal': {
            "HP": 0,
        },
        'Castle': {
            "HP": 170,
        },
    },
    'Gate': {
        'Feudal': {
            "HP": 0,
        },
        'Castle': {
            "HP": 1100,
        },
    },
    'StoneWall': {
        'Feudal': {
            "HP": 0,
        },
        'Castle': {
            "HP": 720,
        },
    },
    'Donjon': {
        'Feudal': {
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
        'Castle': {
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
        'Imperial': {
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
        'Feudal': {
            "HP": 0,
            "MeleeArmor": 0,
            "PierceArmor": 0,
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
    'University': {
        'Castle': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
        'Imperial': {
            "MeleeArmor": 1,
            "PierceArmor": 1,
        },
    },
    'TownCenter': {
        'Dark': {
            "MeleeArmor": 0,
            "PierceArmor": 0,
        },
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
