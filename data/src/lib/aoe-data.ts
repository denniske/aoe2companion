import {getService, SERVICE_NAME} from "./di";


export interface IAoeDataService {
    getAoeString(str: string): string;
}

export function getAoeString(str: string) {
    const aoeDataService = getService(SERVICE_NAME.AOE_DATA_SERVICE) as IAoeDataService;
    return aoeDataService.getAoeString(str);
}
