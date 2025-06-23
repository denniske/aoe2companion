import * as local001 from '../../assets/translations/en.json';
import { getLanguage } from '@nex/data';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@app/service/query-client';
import { QUERY_KEY_ACCOUNT, useLanguage } from '@app/queries/all';
import { MMKV, useMMKV } from 'react-native-mmkv';
import { useEffect } from 'react';

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

export function setTranslations(language: string, newTranslations: Record<string, string>) {
    queryClient.setQueryData(['translations', language], newTranslations);
}

export function getInternalLanguage() {
    const account = queryClient.getQueryData<Record<string, string>>(QUERY_KEY_ACCOUNT());
    // console.log('getlanguage', account?.language || 'en');
    return account?.language || 'en';
}

export function getTranslationInternal(key: keyof typeof local001, params?: Record<string, any>) {
    const language = getLanguage();

    // console.log('getTranslation', language, key);

    if (!language) return '\u00A0';

    const translations = queryClient.getQueryData<Record<string, string>>(['translations', language]);
    const translationsEn = queryClient.getQueryData<Record<string, string>>(['translations', 'en']);

    let translated = (translations && key in translations) ? translations[key] : translationsEn?.[key];
    if (translated && params) {
        for (const key in params) {
            translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
        }
    }
    return translated;
}

const defaultInstance = new MMKV();
const mmkvLanguage = defaultInstance.getString('language');
console.log('mmkvLanguage', mmkvLanguage);

if (mmkvLanguage) {
    const translations = defaultInstance.getString('translations');
    if (translations) {
        try {
            setTranslations(mmkvLanguage, JSON.parse(translations));
        }
        catch (error) {
            console.error('Failed to parse cached translations for language', mmkvLanguage, error);
        }
    }
}

export function useTranslation() {
    const language = useLanguage() || mmkvLanguage;
    const { data: translations } = useTranslations(language);
    const { data: translationsEn } = useTranslations('en');

    // console.log('useTranslation', language, translations, translationsEn);

    return (key: keyof typeof local001, params?: Record<string, string | number>) => {
        let translated = translations && key in translations ? translations[key] : translationsEn?.[key];
        if (translated && params) {
            for (const key in params) {
                translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
            }
        }
        console.log('getTranslation', language, key, translated);
        return translated;
    };
}

export function useTranslations(language?: string) {
    return useQuery({
        queryKey: ['translations', language],
        queryFn: () => loadTranslatonStringsAsync(language!),
        enabled: !!language,
        staleTime: 10 * 1000, // 10s
    });
}

export async function loadTranslatonStringsAsync(language: string) {
    if (Platform.OS === 'web' && window.self !== window.parent) {
        console.log('Skipping translation strings loading in iframe');
    }
    else if (language === 'en') {
        console.log('Skipping translation strings loading for EN');
    } else {
        console.log('Loading translation strings for', language);
        let response = await fetch(
            `https://i18n.cdn.aoe2companion.com/translations/${language}.json`
        );
        return await response.json();
    }
}


export function useMMKWTranslationCache() {
    const language = useLanguage();
    const { data: translations } = useTranslations(language);

    const mmkv = useMMKV();
    const setCachedLanguage = (value: string) => mmkv.set('language', value);
    const setCachedTranslations = (value: string) => mmkv.set('translations', value);

    useEffect(() => {
        if (!language || !translations) {
            console.log('No language or translations available, skipping cache update');
            return;
        }
        setCachedLanguage(language);
        setCachedTranslations(JSON.stringify(translations));
    }, [language, translations]);
}

setTranslations('en', require('../../assets/translations/en.json'));
