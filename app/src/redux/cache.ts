import {get, set} from 'lodash';

let cache = {

};




export function setCacheEntry(path: string[], value: any) {
    set(cache, path, value);
}

export function getCacheEntry(path: string[]) {
    return get(cache, path);
}

export function clearCache() {
    cache = {};
}
