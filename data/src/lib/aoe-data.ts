import {getService, SERVICE_NAME} from "./di";


export interface ITranslationService {
    getUiTranslation(str: string): string;
    getAoeString(str: string): string;
    getLanguage(): string;
}

export function getUiTranslation(str: string) {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    return aoeDataService.getUiTranslation(str);
}

export function getAoeString(str: string) {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    return aoeDataService.getAoeString(str);
}

export function getLanguage() {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    // console.log('aoeDataService', aoeDataService);
    return aoeDataService.getLanguage();
}
