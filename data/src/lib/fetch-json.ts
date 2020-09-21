import {getService, SERVICE_NAME} from "./di";

export interface IHttpService {
    fetchJson(title: string, input: RequestInfo, init?: RequestInit): any;
}

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
    const httpService = getService(SERVICE_NAME.HTTP_SERVICE) as IHttpService;
    return httpService.fetchJson(title, input, init);
}
