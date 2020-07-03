import * as aoeDataInternal from "../data/data.json"
import {merge} from "lodash-es";

export type aoeStringKey = keyof typeof aoeData.strings;
export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

const additionalData = {
    data: {
        units: {
            "10000": {
                "LanguageHelpId": 50000,
                "LanguageNameId": 50000,
            }
        },
    },
    strings: {
        "50000": "Xolotl Warrior",
    },
};

export const aoeData = merge(aoeDataInternal, additionalData);
