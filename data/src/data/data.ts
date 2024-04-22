import {aoeDataInternal} from './aoe-data';
import {merge} from 'lodash';

export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeBuildingDataId = keyof typeof aoeData.data.buildings;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

export const aoeData = merge(aoeDataInternal, {
    "data": {
        "units": {
            // Fix line of sight for light cavalry and hussar and winged hussar
            "546": {
                "LineOfSight": 8,
            },
            "441": {
                "LineOfSight": 10,
            },
            "1707": {
                "LineOfSight": 10,
            },
            // Implicit Tracking upgrade
            // Ghulam
            "1747": {
                "LineOfSight": 8,
            },
            "1749": {
                "LineOfSight": 8,
            },
            // ChakramThrower
            "1741": {
                "LineOfSight": 9,
            },
            "1743": {
                "LineOfSight": 10,
            },
            // UrumiSwordsman
            "1735": {
                "LineOfSight": 5,
            },
            "1737": {
                "LineOfSight": 5,
            },
            // Obuch
            "1701": {
                "LineOfSight": 5,
            },
            "1703": {
                "LineOfSight": 5,
            },
            // Serjeant
            "1658": {
                "LineOfSight": 5,
            },
            "1659": {
                "LineOfSight": 7,
            },
            // KarambitWarrior
            "1123": {
                "LineOfSight": 5,
            },
            "1125": {
                "LineOfSight": 5,
            },
            // Gbeto
            "1013": {
                "LineOfSight": 8,
            },
            "1015": {
                "LineOfSight": 9,
            },
            // ShotelWarrior
            "1016": {
                "LineOfSight": 5,
            },
            "1018": {
                "LineOfSight": 5,
            },
            // Condottiero
            "882": {
                "LineOfSight": 8,
            },
            // JaguarWarrior
            "725": {
                "LineOfSight": 5,
            },
            "726": {
                "LineOfSight": 7,
            },
            // Berserk
            "692": {
                "LineOfSight": 5,
            },
            "694": {
                "LineOfSight": 7,
            },
            // TeutonicKnight
            "25": {
                "LineOfSight": 5,
            },
            "554": {
                "LineOfSight": 7,
            },
            // Samurai
            "291": {
                "LineOfSight": 6,
            },
            "560": {
                "LineOfSight": 7,
            },
            // Huskarl
            "41": {
                "LineOfSight": 5,
            },
            "555": {
                "LineOfSight": 7,
            },
            // ThrowingAxeman
            "281": {
                "LineOfSight": 7,
            },
            "531": {
                "LineOfSight": 8,
            },
            // WoadRaider
            "232": {
                "LineOfSight": 5,
            },
            "534": {
                "LineOfSight": 7,
            },
            // EagleScout (First one through tech of ages)
            "753": {
                "LineOfSight": 8,
            },
            "752": {
                "LineOfSight": 8,
            },
            // Militia (First one through tech of ages)
            "75": {
                "LineOfSight": 6,
            },
            "77": {
                "LineOfSight": 6,
            },
            "473": {
                "LineOfSight": 7,
            },
            "567": {
                "LineOfSight": 7,
            },
            // Legionary
            "1793": {
                "LineOfSight": 7,
            },
            // Spearman
            "358": {
                "LineOfSight": 6,
            },
            "359": {
                "LineOfSight": 6,
            },
            // Kamayuk
            "879": {
                "LineOfSight": 6,
            },
            "881": {
                "LineOfSight": 7,
            },
            // WarriorPriest
            "1811": {
                "LineOfSight": 7,
            },
            // Fix cost for dismounted konnik
            "1252": {
                "Cost": {
                    "Food": 60,
                    "Gold": 70
                },
            },
            "1253": {
                "Cost": {
                    "Food": 60,
                    "Gold": 70
                },
            },
            // Add melee attack to ranged ratha
            "1759": {
                "Attacks": [
                    {
                        "Amount": 10,
                        "Class": 4
                    },
                    {
                        "Amount": 5,
                        "Class": 3
                    },
                ]
            },
            "1761": {
                "Attacks": [
                    {
                        "Amount": 12,
                        "Class": 4
                    },
                    {
                        "Amount": 6,
                        "Class": 3
                    },
                ]
            },
        }
    }
});
