import {getLanguage, IStringCollection, IStringItem, IStrings} from '@nex/data';
import {Asset} from 'expo-asset';
import {Platform} from 'react-native';
import {readAsStringAsync} from 'expo-file-system';
import {getInternalStrings} from '../redux/statecache';
import {stringsSourceData} from "@nex/dataset";


export function getInternalString(category: keyof IStrings, id: number): string | undefined {
    // console.log('get string', strings[getLanguage()], category, id);
    return strings[getLanguage()]?.[category]?.find(i => i.id === id)?.string;
}

export function getAllInternalStrings(category: keyof IStrings): IStringItem[] {
    return strings[getLanguage()]?.[category];
}

export function getStringId(category: keyof IStrings, str: string) {
    return strings[getLanguage()][category].find(i => i.string === str)?.id;
}

const stringsSource = stringsSourceData;

let strings: IStringCollection = getInternalStrings();

export function addStrings(language: string, data: IStrings) {
    strings[language] = data;
}

export async function loadStringsAsync(language: string) {
    try {
        const [{localUri}] = await Asset.loadAsync(stringsSource[language]);

        if (Platform.OS === 'web') {
            let response = await fetch(localUri!);
            let parsed = await response.json();
            addStrings(language, parsed);
        } else {
            let json = await readAsStringAsync(localUri!);
            let parsed = JSON.parse(json);
            addStrings(language, parsed);
        }
    } catch (e: any) {
        console.log('ERRORED', e.toString());
    }
}
