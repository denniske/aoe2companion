import {getLanguage, IStringCollection, IStrings} from '@nex/data';
import {Asset} from 'expo-asset';
import {Platform} from 'react-native';
import {readAsStringAsync} from 'expo-file-system';


export function getInternalString(category: keyof IStrings, id: number): string | undefined {
    // return '###';
    // console.log('getString', getlanguage(), category);
    return strings[getLanguage()]?.[category]?.find(i => i.id === id)?.string;
}

export function getStringId(category: keyof IStrings, str: string) {
    return strings[getLanguage()][category].find(i => i.string === str)?.id;
}

const stringsSource: Record<string, string> = {
    'ms': require('../../assets/strings/ms.json.lazy'),
    'fr': require('../../assets/strings/fr.json.lazy'),
    'es-mx': require('../../assets/strings/es-mx.json.lazy'),
    'it': require('../../assets/strings/it.json.lazy'),
    'pt': require('../../assets/strings/pt.json.lazy'),
    'ru': require('../../assets/strings/ru.json.lazy'),
    'vi': require('../../assets/strings/vi.json.lazy'),
    'tr': require('../../assets/strings/tr.json.lazy'),
    'de': require('../../assets/strings/de.json.lazy'),
    'en': require('../../assets/strings/en.json.lazy'),
    'es': require('../../assets/strings/es.json.lazy'),
    'hi': require('../../assets/strings/hi.json.lazy'),
    'ja': require('../../assets/strings/ja.json.lazy'),
    'ko': require('../../assets/strings/ko.json.lazy'),
    'zh-hans': require('../../assets/strings/zh-hans.json.lazy'),
    'zh-hant': require('../../assets/strings/zh-hant.json.lazy'),
};

let strings: IStringCollection = {
    // 'en': require('../../assets/strings/en.json'),
};

// interface IStringCollection {
//     [key: string]: Record<string, string>;
// }

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
    } catch (e) {
        console.log('ERRORED', e.toString());
    }
}
