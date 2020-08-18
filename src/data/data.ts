import { aoeDataInternal } from './aoe-data';
import {merge} from "lodash-es";

export type aoeStringKey = keyof typeof aoeData.strings;
export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeBuildingDataId = keyof typeof aoeData.data.buildings;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

// Fix cost for dismounted konnik
export const aoeData = merge(aoeDataInternal, {
    "data": {
        "units": {
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
