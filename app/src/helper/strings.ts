import {getlanguage} from '../redux/statecache';


interface IStringItem {
    id: number;
    string: string;
}

interface IStrings {
    age: IStringItem[];
    civ: IStringItem[];
    game_type: IStringItem[];
    leaderboard: IStringItem[];
    map_size: IStringItem[];
    map_type: IStringItem[];
    rating_type: IStringItem[];
    resources: IStringItem[];
    speed: IStringItem[];
    victory: IStringItem[];
    visibility: IStringItem[];
}

interface IStringCollection {
    [key: string]: IStrings;
}

export function getString(category: keyof IStrings, id: number) {
    // return '###';
    // console.log('getString', getlanguage(), category);
    return strings[getlanguage()][category].find(i => i.id === id)?.string;
}

export function getStringId(category: keyof IStrings, str: string) {
    return strings[getlanguage()][category].find(i => i.string === str)?.id;
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
