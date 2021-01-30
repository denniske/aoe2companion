import {getService, SERVICE_NAME} from "./di";


export interface ITranslationService {
    getUiTranslation(str: string): string;
    getAoeString(str: string): string;
}

export function getUiTranslation(str: string) {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    return aoeDataService.getUiTranslation(str);
}

export function getAoeString(str: string) {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    return aoeDataService.getAoeString(str);
}
