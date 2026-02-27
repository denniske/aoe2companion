import {aoeDataInternal} from './aoe-data';
import {merge} from 'lodash';

export type aoeTechDataId = keyof typeof aoeData.data.Tech;
export type aoeUnitDataId = keyof typeof aoeData.data.Unit;
export type aoeBuildingDataId = keyof typeof aoeData.data.Building;
export type aoeCivKey = keyof typeof aoeData.civs;

export const aoeData = merge(aoeDataInternal, {
    "data": {
        "Building": {
            // Fix build time to 150s for town center
            "109": {
                "TrainTime": 150,
            },
        },
        "Unit": {
            // Add XolotlWarrior
            "1570": {
                "AccuracyPercent": 100,
                "Armours": [
                    {
                        "Amount": 2,
                        "Class": 4
                    },
                    {
                        "Amount": 0,
                        "Class": 8
                    },
                    {
                        "Amount": 2,
                        "Class": 3
                    },
                    {
                        "Amount": 0,
                        "Class": 31
                    }
                ],
                "Attack": 10,
                "AttackDelaySeconds": 0,
                "Attacks": [
                    {
                        "Amount": 10,
                        "Class": 4
                    },
                    {
                        "Amount": 0,
                        "Class": 15
                    },
                    {
                        "Amount": 0,
                        "Class": 11
                    },
                    {
                        "Amount": 0,
                        "Class": 21
                    },
                    {
                        "Amount": 0,
                        "Class": 38
                    },
                    {
                        "Amount": -3,
                        "Class": 39
                    },
                    {
                        "Amount": 0,
                        "Class": 20
                    },
                    {
                        "Amount": 0,
                        "Class": 31
                    }
                ],
                "BlastWidth": 0,
                "ChargeEvent": 0,
                "ChargeType": 0,
                "Cost": {
                    "Food": 60,
                    "Gold": 75
                },
                "FrameDelay": 0,
                "GarrisonCapacity": 0,
                "HP": 100,
                "ID": 1570,
                "LanguageHelpId": 26040,
                "LanguageNameId": 5040,
                "LineOfSight": 4,
                "MaxCharge": 0,
                "MeleeArmor": 2,
                "MinRange": 0,
                "PierceArmor": 2,
                "Range": 0,
                "RechargeRate": 0,
                "ReloadTime": 1.8,
                "Speed": 1.35,
                "TrainTime": 30,
                "Trait": 0,
                "TraitPiece": 0,
                "internal_name": "AZTRAIDER"
            },
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
}) as any;
