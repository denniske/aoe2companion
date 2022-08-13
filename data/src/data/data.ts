import {aoeDataInternal} from './aoe-data';
import {merge} from 'lodash';

export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeBuildingDataId = keyof typeof aoeData.data.buildings;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

export const aoeData = merge(aoeDataInternal, {
    "data": {
        "units": {
            // Fix line of sight for light cavalry and hussar
            "546": {
                "LineOfSight": 8,
            },
            "441": {
                "LineOfSight": 10,
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
