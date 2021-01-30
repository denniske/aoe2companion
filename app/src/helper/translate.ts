import * as local001 from '../../assets/translations/en.json'
import {getlanguage} from '../redux/statecache';

interface IStringCollection {
    [key: string]: Record<string, string>;
}

export function getTranslation(str: keyof typeof local001, params?: Record<string, any>) {

    const translations = strings[getlanguage()];

    let translated = (translations && str in translations) ? translations[str] : strings['en'][str];

    return translated ? '###' : '#?.' + str;

    if (translated && params) {
        for (const key in params) {
            translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
        }
    }

    return translated;
}

const strings: IStringCollection = {
    'ms': require('../../assets/translations/ms.json'),
    'fr': require('../../assets/translations/fr.json'),
    'es-mx': require('../../assets/translations/es-mx.json'),
    'it': require('../../assets/translations/it.json'),
    'pt': require('../../assets/translations/pt.json'),
    'ru': require('../../assets/translations/ru.json'),
    'vi': require('../../assets/translations/vi.json'),
    'tr': require('../../assets/translations/tr.json'),
    'de': require('../../assets/translations/de.json'),
    'en': require('../../assets/translations/en.json'),
    'es': require('../../assets/translations/es.json'),
    'hi': require('../../assets/translations/hi.json'),
    'ja': require('../../assets/translations/ja.json'),
    'ko': require('../../assets/translations/ko.json'),
    'zh-hans': require('../../assets/translations/zh-hans.json'),
    'zh-hant': require('../../assets/translations/zh-hant.json'),
};

export const supportedMainLocales = [
    'ms',
    'fr',
    'es',
    'it',
    'pt',
    'ru',
    'vi',
    'tr',
    'de',
    'en',
    'es',
    'hi',
    'ja',
    'ko',
];

export function getLanguageFromSystemLocale(locale: string) {
    locale = locale.toLowerCase();

    if (locale.startsWith('es-mx')) {
        return 'es-MX';
    }
    if (locale.startsWith('zh-hant') || locale.startsWith('zh-tw')) {
        return 'zh-hant';
    }
    if (locale.startsWith('zh-hans')) {
        return 'zh-hans';
    }

    for (const supportedMainLocale of supportedMainLocales) {
        if (locale.startsWith(supportedMainLocale)) {
            return supportedMainLocale;
        }
    }

    return 'en';
}

export function getLanguageFromSystemLocale2(locale: string) {
    const result = getLanguageFromSystemLocale(locale);
    console.log('getLanguageFromSystemLocale', locale, result);
    return result;
}

