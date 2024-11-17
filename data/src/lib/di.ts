import {ITranslationService} from './aoe-data';

export enum SERVICE_NAME {
    HOST_SERVICE = 'HOST_SERVICE',
    HTTP_SERVICE = 'HTTP_SERVICE',
    TRANSLATION_SERVICE = 'TRANSLATION_SERVICE',
    CIV_SERVICE = 'CIV_SERVICE',
}

interface IServiceDict {
    [key: string]: any;
}

const services: IServiceDict = {

};

export function getService(name: SERVICE_NAME) {
    // console.log('getService services', services);
    if (!(name in services)) throw Error('Service ' + name + ' not found.');
    return services[name];
}

export function registerService(name: SERVICE_NAME, service: any, overwrite: boolean = false) {
    if (name in services && !overwrite) throw Error('Service ' + name + ' already registered.');
    services[name] = service;
}


class DummyTranslationService implements ITranslationService {
    getUiTranslation(str: string): string {
        console.log('DUMMY getUiTranslation', str);
        return '???';
    }
    getAoeString(str: string): string {
        // console.trace('DUMMY getAoeString', str);
        return '???';
    }
    getLanguage(): string {
        return 'en';
    }
}

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new DummyTranslationService(), true);
