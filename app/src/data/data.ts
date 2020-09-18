import { aoeDataInternal } from './aoe-data';
import {merge} from "lodash-es";

export type aoeStringKey = keyof typeof aoeData.strings;
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
        }
    }
});
