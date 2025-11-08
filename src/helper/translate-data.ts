import { getLanguage } from '@nex/data';
import { getInternalAoeStrings } from '../redux/statecache';
import { translateStringsSourceData } from '@nex/dataset';

const stringsSource = translateStringsSourceData;

let strings: IStringCollection = getInternalAoeStrings();

interface IStringCollection {
    [key: string]: Record<string, string>;
}

export function addAoeStrings(language: string, data: Record<string, string>) {
    strings[language] = data;
}

for (const key in stringsSource) {
    strings[key as any] = stringsSource[key];
}

export function getInternalAoeString(str: string) {
    // return '###';
    if (strings[getLanguage()] && str in strings[getLanguage()]) {
        return strings[getLanguage()][str];
    }
    if (strings['en'] && str in strings['en']) {
        return strings['en'][str];
    }
    return '???';
}
