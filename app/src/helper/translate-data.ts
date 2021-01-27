import {Asset} from 'expo-asset';
import {readAsStringAsync} from 'expo-file-system';
import {getlanguage} from '../redux/statecache';

export const stringsSource: Record<string, string> = {
    'ms': require('../../assets/data/ms/strings.json.lazy'),
    'fr': require('../../assets/data/fr/strings.json.lazy'),
    'es-mx': require('../../assets/data/es-mx/strings.json.lazy'),
    'it': require('../../assets/data/it/strings.json.lazy'),
    'pt': require('../../assets/data/pt/strings.json.lazy'),
    'ru': require('../../assets/data/ru/strings.json.lazy'),
    'vi': require('../../assets/data/vi/strings.json.lazy'),
    'tr': require('../../assets/data/tr/strings.json.lazy'),
    'de': require('../../assets/data/de/strings.json.lazy'),
    'en': require('../../assets/data/en/strings.json.lazy'),
    'es': require('../../assets/data/es/strings.json.lazy'),
    'hi': require('../../assets/data/hi/strings.json.lazy'),
    'ja': require('../../assets/data/ja/strings.json.lazy'),
    'ko': require('../../assets/data/ko/strings.json.lazy'),
    'zh-hans': require('../../assets/data/zh-hans/strings.json.lazy'),
    'zh-hant': require('../../assets/data/zh-hant/strings.json.lazy'),
};

let strings: IStringCollection = {
    // 'en': aoeLocalesEnStrings,
};

interface IStringCollection {
    [key: string]: Record<string, string>;
}

export function addAoeStrings(language: string, data: Record<string, string>) {
    strings[language] = data;
}

export async function loadAoeStringsAsync(language: string) {
    try {
        const [{localUri}] = await Asset.loadAsync(stringsSource[language]);
        let json = await readAsStringAsync(localUri!);
        let parsed = JSON.parse(json);
        addAoeStrings(language, parsed);
    } catch (e) {
        console.log('ERRORED', e.toString());
    }
}

export function getAoeString(str: string) {
    // if (str === '120172') {
    //     console.log('strings', getlanguage(), strings[getlanguage()]);
    // }
    if (strings[getlanguage()] && str in strings[getlanguage()]) {
        return strings[getlanguage()][str];
    }
    if (strings['en'] && str in strings['en']) {
        return strings['en'][str];
    }
    return '???';
}
