import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';
import { Aoe4Explorer } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { ICivilization } from '@app/api/helper/api.types';
import { useLanguage } from '@app/queries/all';

// aoe4 explorer data: aoe4world's parser run on the game files by poc_collector (watch-data),
// published to S3 under explorer/aoe4/<lang>/. meta.json is written last on each publish, so
// keying the item queries on its commit + build id means a new publish is picked up as soon as
// meta.json changes, and an unchanged one is served from the query cache.
const EXPLORER_BASE = 'https://backend.cdn.aoe2companion.com/explorer/aoe4';

// DEV FALLBACK: until watch-data has published (the CDN 404s), read aoe4world's own copy of the
// same files. Same shape, icons point at data.aoe4world.com instead of our CDN. Remove once
// explorer/aoe4/en/meta.json is live.
const DEV_FALLBACK_BASE = 'https://data.aoe4world.com';

// DEV ONLY: locally generated variants of the data (scripts/serve-aoe4-explorer-variants.mjs), picked
// with the switcher on the explore page. undefined is the normal CDN path.
const DEV_VARIANTS_BASE = 'http://localhost:8787';
const DEV_VARIANT_STORAGE_KEY = 'aoe4-explorer-dev-variant';
let devVariant: string | undefined = (() => {
    try {
        return (__DEV__ && globalThis.localStorage?.getItem(DEV_VARIANT_STORAGE_KEY)) || undefined;
    } catch {
        return undefined;
    }
})();
const devVariantListeners = new Set<() => void>();

export const setAoe4ExplorerDevVariant = (variant: string | undefined) => {
    devVariant = variant;
    try {
        if (variant) globalThis.localStorage?.setItem(DEV_VARIANT_STORAGE_KEY, variant);
        else globalThis.localStorage?.removeItem(DEV_VARIANT_STORAGE_KEY);
    } catch {}
    devVariantListeners.forEach((l) => l());
};

export const useAoe4ExplorerDevVariant = () =>
    useSyncExternalStore(
        (l) => (devVariantListeners.add(l), () => devVariantListeners.delete(l)),
        () => devVariant
    );

// DEV ONLY: shows what the pages leave out to match aoe4world, like a building's full weapon list
// and its influence lines, for comparing the data variants.
const DEV_SHOW_RAW_STORAGE_KEY = 'aoe4-explorer-dev-show-raw';
let devShowRaw: boolean = (() => {
    try {
        return __DEV__ && globalThis.localStorage?.getItem(DEV_SHOW_RAW_STORAGE_KEY) === '1';
    } catch {
        return false;
    }
})();

export const setAoe4ExplorerDevShowRaw = (show: boolean) => {
    devShowRaw = show;
    try {
        if (show) globalThis.localStorage?.setItem(DEV_SHOW_RAW_STORAGE_KEY, '1');
        else globalThis.localStorage?.removeItem(DEV_SHOW_RAW_STORAGE_KEY);
    } catch {}
    devVariantListeners.forEach((l) => l());
};

export const useAoe4ExplorerDevShowRaw = () =>
    useSyncExternalStore(
        (l) => (devVariantListeners.add(l), () => devVariantListeners.delete(l)),
        () => devShowRaw
    );

/** The variants the local server has, or none when it is not running. */
export const useAoe4ExplorerDevVariants = () =>
    useQuery({
        queryKey: ['aoe4-explorer', 'dev-variants'],
        queryFn: () => fetchJson<string[]>(`${DEV_VARIANTS_BASE}/`).catch(() => undefined),
        enabled: __DEV__ && appConfig.game === 'aoe4',
        retry: false,
    });

// Only English is published for now. Any other language falls back to it.
const EXPLORER_LANGUAGES = ['en'];

export type Aoe4ExplorerType = 'units' | 'buildings' | 'technologies' | 'upgrades' | 'abilities';

export interface IAoe4ExplorerMeta {
    aoe4worldDataCommit: string;
    steamBuildId: string;
    generatedAt: string;
    language: string;
    items: Partial<Record<Aoe4ExplorerType, number>>;
    /** Set when the data comes from DEV_FALLBACK_BASE rather than our CDN. */
    devFallback?: boolean;
    /** Set when the data comes from a local variant (DEV_VARIANTS_BASE). */
    devVariant?: string;
}

interface Aoe4ExplorerItemTypes {
    units: Aoe4Explorer.Unit;
    buildings: Aoe4Explorer.Building;
    technologies: Aoe4Explorer.Technology;
    upgrades: Aoe4Explorer.Upgrade;
    abilities: Aoe4Explorer.Ability;
}

function explorerLanguage(language: string | undefined) {
    return language && EXPLORER_LANGUAGES.includes(language) ? language : 'en';
}

async function fetchJson<T>(url: string): Promise<T | undefined> {
    const response = await fetch(url);
    if (response.status === 404 || response.status === 403) return undefined;
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return await response.json();
}

async function fetchExplorerMeta(language: string, variant: string | undefined): Promise<IAoe4ExplorerMeta> {
    if (variant) return { aoe4worldDataCommit: variant, steamBuildId: variant, generatedAt: '', language, items: {}, devVariant: variant };
    // A network error counts as unpublished too: the CDN may not send CORS headers on a 404.
    const meta = await fetchJson<IAoe4ExplorerMeta>(`${EXPLORER_BASE}/${language}/meta.json`).catch(() => undefined);
    if (meta) return meta;
    return { aoe4worldDataCommit: 'aoe4world', steamBuildId: 'aoe4world', generatedAt: '', language, items: {}, devFallback: true };
}

async function fetchExplorerItems<K extends Aoe4ExplorerType>(meta: IAoe4ExplorerMeta, type: K) {
    const url = meta.devVariant
        ? `${DEV_VARIANTS_BASE}/${meta.devVariant}/${type}/all-optimized.json`
        : meta.devFallback
          ? `${DEV_FALLBACK_BASE}/${type}/all-optimized.json`
          : `${EXPLORER_BASE}/${meta.language}/${type}.json`;
    const file = await fetchJson<Aoe4Explorer.ExplorerFile<Aoe4ExplorerItemTypes[K]>>(url);
    if (!file) throw new Error(`${url}: not found`);
    return Aoe4Explorer.optimizedToUnified(file.data);
}

export const useAoe4ExplorerMeta = () => {
    const language = explorerLanguage(useLanguage());
    const variant = useAoe4ExplorerDevVariant();
    return useQuery({
        queryKey: ['aoe4-explorer', 'meta', language, variant],
        queryFn: () => fetchExplorerMeta(language, variant),
        enabled: appConfig.game === 'aoe4',
        staleTime: 10 * 60 * 1000,
    });
};

export const useAoe4ExplorerItems = <K extends Aoe4ExplorerType>(type: K) => {
    const { data: meta, error: metaError, isLoading: metaLoading } = useAoe4ExplorerMeta();
    const query = useQuery({
        queryKey: ['aoe4-explorer', type, meta?.language, meta?.aoe4worldDataCommit, meta?.steamBuildId],
        queryFn: () => fetchExplorerItems(meta!, type),
        enabled: !!meta,
        // The key changes with each publish, so the data itself never goes stale.
        staleTime: Infinity,
    });
    return { ...query, error: query.error ?? metaError, isLoading: query.isLoading || metaLoading, meta };
};

export type Aoe4Item = Aoe4ExplorerItemTypes[Aoe4ExplorerType];
export type Aoe4UnifiedItem<T extends Aoe4Item = Aoe4Item> = Aoe4Explorer.UnifiedItem<T>;

export const useAoe4Units = () => useAoe4ExplorerItems('units');
export const useAoe4Buildings = () => useAoe4ExplorerItems('buildings');
export const useAoe4Technologies = () => useAoe4ExplorerItems('technologies');
export const useAoe4Abilities = () => useAoe4ExplorerItems('abilities');
export const useAoe4Upgrades = () => useAoe4ExplorerItems('upgrades');

export const useAoe4Item = <K extends Aoe4ExplorerType>(type: K, id: string | undefined) => {
    const query = useAoe4ExplorerItems(type);
    return { ...query, data: query.data?.find((item) => item.id === id) };
};

/**
 * Every item of every type by id, plus each variation by its own id ("archer-2") and baseId, for
 * the cross references in the data (producedBy, activatedOn, unlockedBy, effect selectors).
 */
export const useAoe4ItemLookup = () => {
    const units = useAoe4Units().data;
    const buildings = useAoe4Buildings().data;
    const technologies = useAoe4Technologies().data;
    const abilities = useAoe4Abilities().data;
    const upgrades = useAoe4Upgrades().data;

    return useMemo(() => {
        const lookup = new Map<string, Aoe4UnifiedItem>();
        // Later types do not overwrite earlier ones: a unit and its upgrade can share an id prefix.
        for (const items of [units, buildings, technologies, abilities, upgrades] as (Aoe4UnifiedItem[] | undefined)[]) {
            for (const item of items ?? []) {
                if (!lookup.has(item.id)) lookup.set(item.id, item);
                for (const v of item.variations) if (!lookup.has(v.id)) lookup.set(v.id, item);
            }
        }
        return lookup;
    }, [units, buildings, technologies, abilities, upgrades]);
};

// Patch history per item: aoe4world/explorer's hand-written patch notes (src/data/patches), converted
// and published by poc_collector's watch-data as <lang>/patches.json, with aoe4world's permission.
export type Aoe4PatchLine = ['nerf' | 'buff' | 'fix' | 'change', string, string[]?];

export interface IAoe4PatchChange {
    items: string[];
    civs: string[];
    diff: Aoe4PatchLine[];
    note?: string;
    uionly?: boolean;
}

export interface IAoe4Patch {
    id: string;
    name: string;
    buildId?: string;
    date: string;
    season: number;
    type: 'update' | 'patch';
    officialUrl?: string;
    changes: IAoe4PatchChange[];
}

export const useAoe4Patches = () => {
    const language = explorerLanguage(useLanguage());
    return useQuery({
        // Not keyed on meta.json: patch notes are published when aoe4world writes them up, not with the data.
        queryKey: ['aoe4-explorer', 'patches', language],
        queryFn: async () => {
            const published = await fetchJson<IAoe4Patch[]>(`${EXPLORER_BASE}/${language}/patches.json`).catch(() => undefined);
            // DEV FALLBACK: public/aoe4-patches.dev.json (gitignored), until patches.json is on the CDN.
            if (!published && __DEV__) return (await fetchJson<IAoe4Patch[]>('/aoe4-patches.dev.json').catch(() => undefined)) ?? [];
            return published ?? [];
        },
        enabled: appConfig.game === 'aoe4',
        staleTime: 60 * 60 * 1000,
    });
};

/**
 * The civ pages' text, keyed by civ enum, from the same publish as the items (civilizations.json,
 * written by watch-data from aoe4world/data's civilizations/*.json). undefined while it loads, and
 * when this language is not published: the caller then uses the copy bundled with the app.
 */
export const useAoe4ExplorerCivOverview = () => {
    const { data: meta } = useAoe4ExplorerMeta();
    const url = meta?.devVariant
        ? `${DEV_VARIANTS_BASE}/${meta.devVariant}/civilizations.json`
        : meta && !meta.devFallback
          ? `${EXPLORER_BASE}/${meta.language}/civilizations.json`
          : undefined;
    return useQuery({
        queryKey: ['aoe4-explorer', 'civilizations', url, meta?.aoe4worldDataCommit, meta?.steamBuildId],
        queryFn: () => fetchJson<Record<string, Omit<ICivilization, 'civ' | 'name'>>>(url!).catch(() => undefined),
        enabled: !!url,
        staleTime: Infinity,
    });
};
