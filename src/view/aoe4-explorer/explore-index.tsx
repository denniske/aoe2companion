import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { getCivIconLocal } from '@app/helper/civs';
import { cdnImageUrl } from '@app/helper/maps';
import { useTranslation } from '@app/helper/translate';
import { useAoe4CivData, useMaps } from '@app/queries/all';
import cn from 'classnames';
import { Aoe4SectionButtons } from './section-buttons';
import { Aoe4UnifiedItem, useAoe4Buildings, useAoe4Technologies, useAoe4Units, useAoe4Upgrades } from '@app/queries/aoe4-explorer';
import { containerClassName } from '@app/styles';
import { Aoe4Explorer, Civ, civs, getCivNameById, orderCivs } from '@nex/data';
import { Image } from '@/src/components/uniwind/image';
import { Href, Link as ExpoLink, router, Stack } from 'expo-router';
import { compact, orderBy, uniqBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { ImageSourcePropType, Platform, View } from 'react-native';
import { civNameForAbbr, ItemIcon, itemHref, upgradeTargetId } from './shared';

// Web only: the list scrolls with the page, so an unbounded result set would render every match.
const maxSearchResults = Platform.OS === 'web' ? 20 : Infinity;

const abbrByCiv = Object.fromEntries(Object.entries(Aoe4Explorer.aoe4CivByAbbr).map(([abbr, civ]) => [civ, abbr]));

/**
 * A civ with its strengths (the game's own class line) and the unique units it brings, which is
 * what tells civs apart at a glance; the units link straight to their pages.
 */
const CivRow: React.FC<{ civ: Civ }> = ({ civ }) => {
    const info = useAoe4CivData()?.[civ];
    const units = useAoe4Units().data;
    const abbr = abbrByCiv[civ];
    const uniqueUnits = orderBy(
        (units ?? []).filter((u) => u.unique && u.civs.includes(abbr)),
        [(u) => u.minAge, (u) => u.name]
    );
    return (
        <View className="flex-row items-center gap-3 py-2.5">
            <ExpoLink asChild href={`/explore/civilizations/${civ}`}>
                <PressableOpacity className="flex-1 flex-row items-center gap-3">
                    <Image className="w-16 h-9" contentFit="contain" source={getCivIconLocal(civ)} />
                    <View className="flex-1">
                        <Text variant="label">{getCivNameById(civ)}</Text>
                        <Text variant="body-sm" color="subtle" numberOfLines={2}>
                            {info?.classes}
                        </Text>
                    </View>
                </PressableOpacity>
            </ExpoLink>
            <View className="hidden md:flex flex-row gap-1">
                {uniqueUnits.slice(0, 6).map((unit) => (
                    <ExpoLink key={unit.id} asChild href={itemHref(unit as Aoe4UnifiedItem, abbr) as Href}>
                        <PressableOpacity>
                            <ItemIcon icon={unit.icon} type="unit" className="w-8 h-8" />
                        </PressableOpacity>
                    </ExpoLink>
                ))}
            </View>
        </View>
    );
};

interface SearchResult {
    key: string;
    title: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    /** Extra text that matches the search, e.g. the unit an upgrade applies to. */
    alias?: string;
}

function itemResult(item: Aoe4UnifiedItem, label: string, alias?: string): SearchResult | undefined {
    const href = itemHref(item);
    if (!href) return undefined;
    const civsLabel = item.civs.length <= 2 ? item.civs.map(civNameForAbbr).join(', ') + ' ' : '';
    return {
        key: `${item.type}-${item.id}`,
        title: alias ? `${item.name} (${alias})` : item.name,
        label: civsLabel + label,
        href,
        icon: <ItemIcon icon={item.icon} type={item.type} className="w-8 h-8" />,
        alias,
    };
}

/** aoe4 explore landing: search over everything, then a row per section. */
export default function Aoe4Explore() {
    const getTranslation = useTranslation();
    const [search, setSearch] = useState('');
    const civList = orderCivs(civs);
    const { data: maps } = useMaps();
    const units = useAoe4Units().data;
    const buildings = useAoe4Buildings().data;
    const technologies = useAoe4Technologies().data;
    const upgrades = useAoe4Upgrades().data;

    const allResults = useMemo(() => {
        const unitIds = new Set((units ?? []).map((u) => u.id));
        const unitNames = new Map((units ?? []).map((u) => [u.id, u.name]));
        return compact([
            ...civList.map<SearchResult>((civ) => ({
                key: `civ-${civ}`,
                title: getCivNameById(civ),
                label: getTranslation('explore.civilizations'),
                href: `/explore/civilizations/${civ}`,
                icon: <Image className="w-8 h-8" contentFit="contain" source={getCivIconLocal(civ)} />,
            })),
            ...(units ?? []).map((u) => itemResult(u as Aoe4UnifiedItem, getTranslation('explore.units'))),
            ...(buildings ?? []).map((b) => itemResult(b as Aoe4UnifiedItem, getTranslation('explore.buildings'))),
            ...(technologies ?? []).map((t) => itemResult(t as Aoe4UnifiedItem, getTranslation('explore.technologies'))),
            ...(upgrades ?? []).map((u) => {
                const target = upgradeTargetId(u.id, unitIds);
                return itemResult(u as Aoe4UnifiedItem, getTranslation('unit.heading.upgrades'), target ? unitNames.get(target) : undefined);
            }),
            ...compact(maps).map<SearchResult>((map) => ({
                key: `map-${map.mapId}`,
                title: map.mapName,
                label: getTranslation('explore.maps'),
                href: `/explore/maps/${map.mapId}`,
                icon: <Image className="w-8 h-8 border border-gold-500 rounded" contentFit="contain" source={{ uri: cdnImageUrl(map.imageUrl, 'thumb') }} />,
            })),
        ]);
    }, [units, buildings, technologies, upgrades, maps, civList, getTranslation]);

    const results = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return [];
        // Name matches first, starting with those that begin with the query.
        const matches = allResults.filter((r) => r.title.toLowerCase().includes(query));
        return uniqBy(orderBy(matches, [(r) => !r.title.toLowerCase().startsWith(query), (r) => r.title.length]), 'key').slice(0, maxSearchResults);
    }, [allResults, search]);

    return (
        <KeyboardAvoidingView>
            <View className="flex-1 pt-4 gap-5">
                <Stack.Screen options={{ animation: 'none', title: getTranslation('explore.title') }} />

                <View className={cn('gap-3', containerClassName)}>
                    <Field
                        type="search"
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={() => results[0] && router.navigate(results[0].href as Href)}
                        placeholder={getTranslation('explore.search.placeholder')}
                    />
                    <Aoe4SectionButtons />
                </View>

                {search ? (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerClassName="px-4 pb-4"
                        data={results}
                        keyExtractor={(r) => r.key}
                        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 dark:bg-gray-800 w-full" />}
                        renderItem={({ item: result, index }) => (
                            <ExpoLink asChild href={result.href as Href}>
                                <PressableOpacity
                                    className={`flex-row items-center py-2.5 gap-2 -mx-4 px-4 -mb-px ${index === 0 ? 'bg-gold-100 dark:bg-blue-900 z-10' : ''}`}
                                >
                                    {result.icon}
                                    <View className="flex-1">
                                        <Text variant="label">{result.title}</Text>
                                    </View>
                                    <Text color="subtle" variant="body-sm">
                                        {result.label}
                                    </Text>
                                </PressableOpacity>
                            </ExpoLink>
                        )}
                    />
                ) : (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerClassName="px-4 pb-4"
                        data={civList}
                        keyExtractor={(civ) => civ}
                        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 dark:bg-gray-800 w-full" />}
                        renderItem={({ item: civ }) => <CivRow civ={civ} />}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
