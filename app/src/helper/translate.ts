import * as local001 from '../../assets/translations/en.json';
import { getLanguage } from '@nex/data';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@app/service/query-client';
import { QUERY_KEY_ACCOUNT, useAccountData, useLanguage } from '@app/queries/all';
import { MMKV, useMMKV, useMMKVString } from 'react-native-mmkv';
import { useEffect } from 'react';
import { appConfig } from '@nex/dataset';

export type IGetTranslation = (key: keyof typeof local001, params?: Record<string, string | number>) => string;

export function setTranslations(language: string, newTranslations: Record<string, string>) {
    queryClient.setQueryData(['translations', language], newTranslations);
}

export function getTranslationInternal(key: keyof typeof local001, params?: Record<string, any>) {
    const language = getLanguage();

    // console.log('getTranslation', language, key);

    const mode = mmkvDefaultInstance.getString('translationMode')
    if (mode === 'key') {
        return key;
    }

    if (!language) return '\u00A0';

    const translations = queryClient.getQueryData<Record<string, string>>(['translations', language]);
    const translationsEn = queryClient.getQueryData<Record<string, string>>(['translations', 'en']);

    let translated = (translations && key in translations) ? translations[key] : translationsEn?.[key];
    if (translated && params) {
        for (const key in params) {
            translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
        }
    }
    return translated || '';
}

export const mmkvDefaultInstance = new MMKV();
const mmkvLanguage = mmkvDefaultInstance.getString('language');
// console.log('mmkvLanguage', mmkvLanguage);

if (mmkvLanguage) {
    const translations = mmkvDefaultInstance.getString('translations');
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

    const [mode] = useMMKVString('translationMode');
    if (mode === 'key') {
        return (key: keyof typeof local001, params?: Record<string, any>) => {
            return key;
        };
    }

    return (key: keyof typeof local001, params?: Record<string, string | number | undefined>) => {
        let translated = translations && key in translations ? translations[key] : translationsEn?.[key];
        if (translated && params) {
            for (const key in params) {
                translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
            }
        }
        // console.log('getTranslation', language, key, translated);
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

export async function loadTranslatonStringsAsync(language: string): Promise<any> {
    if (Platform.OS === 'web' && window.self !== window.parent) {
        console.log('Skipping translation strings loading in iframe');
    }
    else if (language === 'en') {
        // Translations for 'en' are already loaded at the end of this file from en.json
        console.log('Skipping translation strings loading for EN');
        return require('../../assets/translations/en.json');
    } else {
        console.log('Loading translation strings for', language);
        if (appConfig.game === 'aoe2') {
            if (language === 'es') {
                let response = await fetch(
                    `https://i18n.cdn.aoe2companion.com/translations/${language}.json`
                );
                return await response.json();
            }
        }
    }
}


export function useMMKWTranslationCache() {
    const mmkv = useMMKV();
    const setCachedLanguage = (value: string) => mmkv.set('language', value);
    const setCachedTranslations = (value: string) => mmkv.set('translations', value);

    const language = useLanguage();
    const { data: translations } = useTranslations(language);

    useEffect(() => {
        if (!language || !translations) {
            // console.log('No language or translations available, skipping cache update');
            return;
        }
        setCachedLanguage(language);
        setCachedTranslations(JSON.stringify(translations));
    }, [language, translations]);
}

setTranslations('en', require('../../assets/translations/en.json'));
