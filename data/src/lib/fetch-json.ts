import {getService, SERVICE_NAME} from "./di";

export interface IHttpService {
    fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any): any;
}

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
    const httpService = getService(SERVICE_NAME.HTTP_SERVICE) as IHttpService;
    return httpService.fetchJson(title, input, init, reviver);
}
