import {getLanguage, IStringCollection, IStrings} from '@nex/data';


export function getInternalString(category: keyof IStrings, id: number): string | undefined {
    // return '###';
    // console.log('getString', getlanguage(), category);
    return strings[getLanguage()][category].find(i => i.id === id)?.string;
}

export function getStringId(category: keyof IStrings, str: string) {
    return strings[getLanguage()][category].find(i => i.string === str)?.id;
}

const strings: IStringCollection = {
    'ms': require('../../assets/strings/ms.json'),
    'fr': require('../../assets/strings/fr.json'),
    'es-mx': require('../../assets/strings/es-mx.json'),
    'it': require('../../assets/strings/it.json'),
    'pt': require('../../assets/strings/pt.json'),
    'ru': require('../../assets/strings/ru.json'),
    'vi': require('../../assets/strings/vi.json'),
    'tr': require('../../assets/strings/tr.json'),
    'de': require('../../assets/strings/de.json'),
    'en': require('../../assets/strings/en.json'),
    'es': require('../../assets/strings/es.json'),
    'hi': require('../../assets/strings/hi.json'),
    'ja': require('../../assets/strings/ja.json'),
    'ko': require('../../assets/strings/ko.json'),
    'zh-hans': require('../../assets/strings/zh-hans.json'),
    'zh-hant': require('../../assets/strings/zh-hant.json'),
};
