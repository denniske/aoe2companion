import { aoeDataInternal } from './aoe-data';
import { aoeLocalesEnStrings } from './locales/en/strings';
import {merge} from "lodash";

export type aoeStringKey = keyof typeof aoeLocalesEnStrings;
export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeBuildingDataId = keyof typeof aoeData.data.buildings;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

export const aoeData = merge(aoeDataInternal, { strings: aoeLocalesEnStrings }, {
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
        }
    }
});
