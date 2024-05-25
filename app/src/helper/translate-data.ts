import {Asset} from 'expo-asset';
import {readAsStringAsync} from 'expo-file-system';
import {Platform} from 'react-native';
import {getLanguage} from '@nex/data';
import {getInternalAoeStrings} from '../redux/statecache';
import {translateStringsSourceData} from "@nex/dataset";

const stringsSource = translateStringsSourceData;

console.log(stringsSource['en']);

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

export async function loadAoeStringsAsync(language: string) {
    try {
        const [{localUri}] = await Asset.loadAsync(stringsSource[language]);

        if (Platform.OS === 'web') {
            let response = await fetch(localUri!);
            let parsed = await response.json();
            addAoeStrings(language, parsed);
        } else {
            let json = await readAsStringAsync(localUri!);
            let parsed = JSON.parse(json);
            addAoeStrings(language, parsed);
        }
    } catch (e: any) {
        console.log('ERRORED', e.toString());
    }
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
