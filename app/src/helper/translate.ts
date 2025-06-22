import * as local001 from '../../assets/translations/en.json';
import { getLanguage } from '@nex/data';
import { useMMKVString, MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@app/api/helper/api';
import { queryClient } from '@app/service/query-client';

interface IStringCollection {
    [key: string]: Record<string, string>;
}

const strings: IStringCollection = {
    // 'ms': require('../../assets/translations/ms.json'),
    // 'fr': require('../../assets/translations/fr.json'),
    // 'es-mx': require('../../assets/translations/es-mx.json'),
    // 'it': require('../../assets/translations/it.json'),
    // 'pt': require('../../assets/translations/pt.json'),
    // 'ru': require('../../assets/translations/ru.json'),
    // 'vi': require('../../assets/translations/vi.json'),
    // 'tr': require('../../assets/translations/tr.json'),
    // 'de': require('../../assets/translations/de.json'),
    en: require('../../assets/translations/en.json'),
    // 'es': require('../../assets/translations/es.json'),
    // 'hi': require('../../assets/translations/hi.json'),
    // 'ja': require('../../assets/translations/ja.json'),
    // 'ko': require('../../assets/translations/ko.json'),
    // 'zh-hans': require('../../assets/translations/zh-hans.json'),
    // 'zh-hant': require('../../assets/translations/zh-hant.json'),
};


export const supportedMainLocales = ['ms', 'fr', 'es', 'it', 'pt', 'ru', 'vi', 'tr', 'de', 'en', 'es', 'hi', 'ja', 'ko'];

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
    return getLanguageFromSystemLocale(locale);
}

export function useSetTranslationStrings() {
    const [version, setVersion] = useMMKVString('translationVersion');

    return (language: string, data: Record<string, string>) => {
        console.log('setTranslationStrings', language, data);
        strings[language] = data;
        setVersion(new Date().toISOString());
    };
}

// export const useTranslationQuery = (profileId: number) =>
//     useQuery({
//         queryKey: ['profile', profileId],
//         queryFn: () => loadTranslatonStringsAsync({ profileId }),
//         enabled: !!profileId,
//     });

// const [version, setVersion] = useMMKVString('translationVersion');
// const isInIframe = Platform.OS === 'web' && window.self !== window.parent;
// enabled: !!language, // && !isInIframe,

queryClient.setQueryData(['translations', 'en'], require('../../assets/translations/en.json'));


const start = Date.now();


const defaultInstance = new MMKV();

console.log('mmkv language', defaultInstance.getString('language'));
// console.log('mmkv language', defaultInstance.getString('language'));


const end = Date.now();
console.log('MMKV language loading time:', end - start, 'ms');


export function getTranslationInternal(str: keyof typeof local001, params?: Record<string, any>) {
    const language = getLanguage();

    console.log('getTranslation', language, str);

    if (!language) return '\u00A0';

    const translations = queryClient.getQueryData<Record<string, string>>(['translations', language]);

    // const translations = strings[language];

    let translated = translations && str in translations ? translations[str] : strings['en'][str];

    // return translated ? '###' : '#?.' + str;

    if (translated && params) {
        for (const key in params) {
            translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
        }
    }

    return translated;
}

export function useTranslation() {
    const [version, setVersion] = useMMKVString('translationVersion');
    const [mode, setMode] = useMMKVString('translationMode');

    console.log('useTranslation', version, mode);

    if (mode === 'key') {
        return (key: keyof typeof local001, params?: Record<string, any>) => {
            return key;
        };
    }

    return (key: keyof typeof local001, params?: Record<string, any>) => {
        return getTranslationInternal(key, params);
    };
}

export function useTranslations(language?: string) {
    return useQuery({
        queryKey: ['language', language],
        queryFn: () => loadTranslatonStringsAsync(language),
        enabled: !!language,
        staleTime: 10 * 1000, // 10s
    });
}

export function loadTranslatonStringsAsync(language: string) {
    if (Platform.OS === 'web' && window.self !== window.parent) {
        console.log('Skipping translation strings loading in iframe');
    }

    console.log('Loading translation strings for', language);
    // let response = await fetch(
    //     `https://raw.githubusercontent.com/denniske/aoe2companion/refs/heads/main/app/assets/translations/${language}.json`
    // );
    let response = await fetch(
        `https://i18n.cdn.aoe2companion.com/translations/${language}.json`
    );
    let parsed = await response.json();
    strings[language] = parsed;
    console.log('Loaded translation strings for', language);
}
