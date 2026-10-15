import * as local001 from '../../assets/translations/en.json';
import { getLanguage } from '@nex/data';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@app/service/query-client';
import { QUERY_KEY_ACCOUNT, useAccountData, useLanguage } from '@app/queries/all';
import { MMKV, useMMKV, useMMKVString } from 'react-native-mmkv';
import { useEffect, useMemo } from 'react';
import { appConfig } from '@nex/dataset';

export type IGetTranslation = (key: keyof typeof local001, params?: Record<string, string | number>) => string;

export function setTranslations(language: string, newTranslations: Record<string, string>) {
    queryClient.setQueryData(['translations', language], newTranslations);
}

// Hermes has no Intl.PluralRules, so the CLDR rules for our languages are inlined.
export function pluralCategory(language: string, n: number): 'one' | 'few' | 'many' | 'other' {
    const lang = language.split('-')[0];
    const i = Math.abs(Math.trunc(n));
    if (i !== Math.abs(n)) return 'other';
    const mod10 = i % 10;
    const mod100 = i % 100;
    switch (lang) {
        case 'ja':
        case 'ko':
        case 'zh':
        case 'vi':
        case 'ms':
        case 'tr':
            return 'other';
        case 'fr':
        case 'hi':
            return i <= 1 ? 'one' : 'other';
        case 'pl':
            if (i === 1) return 'one';
            return mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'few' : 'many';
        case 'ru':
            if (mod10 === 1 && mod100 !== 11) return 'one';
            return mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'few' : 'many';
        default:
            return i === 1 ? 'one' : 'other';
    }
}

// With a numeric `count` param, `key_one` / `key_few` / `key_many` / `key_other` are tried before `key`.
function resolveKey(translations: Record<string, string> | undefined, language: string | undefined, key: string, params?: Record<string, any>) {
    const count = params?.count;
    if (!translations || typeof count !== 'number' || !language) return translations?.[key];
    return translations[`${key}_${pluralCategory(language, count)}`] ?? translations[`${key}_other`] ?? translations[key];
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

    let translated: any = resolveKey(translations, language, key, params) ?? resolveKey(translationsEn, 'en', key, params);
    if (translated && params) {
        for (const key in params) {
            translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
        }
    }
    return translated || '';
}

export const mmkvDefaultInstance = new MMKV();
const mmkvLanguage = typeof window !== "undefined" ? mmkvDefaultInstance.getString('language') : undefined;
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
        let translated: any = resolveKey(translations, language, key, params) ?? resolveKey(translationsEn, 'en', key, params);
        if (translated && params) {
            for (const key in params) {
                translated = translated.replace(new RegExp(`\{${key}\}`, 'gi'), params![key]);
            }
        }
        // console.log('getTranslation', language, key, translated);
        return translated;
    };
}

export type PluralForms = { language: string; one: string; few: string; many: string; other: string };

/**
 * Resolves every plural form of `key` once, with its other placeholders intact, for
 * hot paths like leaderboard rows that fill in the number themselves via `pickPlural`.
 */
export function usePluralForms(key: keyof typeof local001): PluralForms {
    const getTranslation = useTranslation();
    const language = useLanguage() || mmkvLanguage || 'en';
    // 1, 2, 5 and 1.5 land in one / few / many / other for every language we ship.
    const one = getTranslation(key, { count: 1 }) ?? '';
    const few = getTranslation(key, { count: 2 }) ?? '';
    const many = getTranslation(key, { count: 5 }) ?? '';
    const other = getTranslation(key, { count: 1.5 }) ?? '';
    return useMemo(() => ({ language, one, few, many, other }), [language, one, few, many, other]);
}

export function pickPlural(forms: PluralForms, count: number) {
    return forms[pluralCategory(forms.language, count)];
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
        // return require(`../../assets/translations/${language}.json`);
        // if (appConfig.game === 'aoe2') {
            let response = await fetch(
                `https://i18n.cdn.aoe2companion.com/translations/${language}.json`
            );
            return await response.json();
        // }
        // return {};
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
