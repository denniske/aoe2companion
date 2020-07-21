import { aoeDataInternal } from './aoe-data';

export type aoeStringKey = keyof typeof aoeData.strings;
export type aoeTechDataId = keyof typeof aoeData.data.techs;
export type aoeUnitDataId = keyof typeof aoeData.data.units;
export type aoeCivKey = keyof typeof aoeData.civ_helptexts;

export const aoeData = aoeDataInternal;
