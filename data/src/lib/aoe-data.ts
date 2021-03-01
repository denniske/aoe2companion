import {getService, SERVICE_NAME} from "./di";


export interface ITranslationService {
    getUiTranslation(str: string): string;
    getAoeString(str: string): string;
    getString(category: keyof IStrings, id: number): string | undefined;
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

export function getString(category: keyof IStrings, id: number) {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    return aoeDataService.getString(category, id);
}

export function getLanguage() {
    const aoeDataService = getService(SERVICE_NAME.TRANSLATION_SERVICE) as ITranslationService;
    // console.log('aoeDataService', aoeDataService);
    return aoeDataService.getLanguage();
}


export interface IStringItem {
    id: number;
    string: string;
}

export interface IStrings {
    age: IStringItem[];
    civ: IStringItem[];
    game_type: IStringItem[];
    leaderboard: IStringItem[];
    map_size: IStringItem[];
    map_type: IStringItem[];
    rating_type: IStringItem[];
    resources: IStringItem[];
    speed: IStringItem[];
    victory: IStringItem[];
    visibility: IStringItem[];
}

export interface IStringCollection {
    [key: string]: IStrings;
}
