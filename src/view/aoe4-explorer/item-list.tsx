import { Card } from '@app/components/card';
import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { Aoe4UnifiedItem, useAoe4ExplorerItems, useAoe4Units } from '@app/queries/aoe4-explorer';
import { containerClassName } from '@app/styles';
import cn from 'classnames';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { orderBy, uniq } from 'lodash';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ageNumerals, Chip, CivChips, civNameForAbbr, ItemIcon, itemHref, upgradeTargetId, unitGroup, unitGroups } from './shared';

type ListType = 'units' | 'buildings' | 'technologies' | 'upgrades';

// Groups as on aoe4world's explorer (src/query/utils.ts splitBuildingsIntoGroups); units in shared.tsx.
function buildingGroup(building: Aoe4UnifiedItem) {
    const has = (c: string) => building.classes.includes(c);
    if (has('landmark')) return 'Landmarks';
    if (has('wonder')) return 'Wonders';
    if (has('defensive')) return 'Defensive';
    if (has('technology')) return 'Technology';
    if (has('religious')) return 'Religious';
    if (has('military') || building.displayClasses.some((c) => /^Military/.test(c))) return 'Military';
    return 'Economy';
}

const config: Record<ListType, { titleKey: 'unit.title' | 'explore.buildings' | 'explore.technologies' | 'unit.heading.upgrades'; group: (item: Aoe4UnifiedItem) => string; groups: string[] }> = {
    units: {
        titleKey: 'unit.title',
        group: unitGroup,
        groups: unitGroups,
    },
    buildings: {
        titleKey: 'explore.buildings',
        group: buildingGroup,
        groups: ['Landmarks', 'Economy', 'Military', 'Defensive', 'Religious', 'Technology', 'Wonders'],
    },
    technologies: {
        titleKey: 'explore.technologies',
        group: (tech) => `Age ${ageNumerals[tech.minAge] ?? tech.minAge}`,
        groups: [1, 2, 3, 4].map((a) => `Age ${ageNumerals[a]}`),
    },
    upgrades: {
        titleKey: 'unit.heading.upgrades',
        group: (upgrade) => `Age ${ageNumerals[upgrade.minAge] ?? upgrade.minAge}`,
        groups: [1, 2, 3, 4].map((a) => `Age ${ageNumerals[a]}`),
    },
};

type Row = { header: string } | { item: Aoe4UnifiedItem };

export default function Aoe4ItemList({ type }: { type: ListType }) {
    const getTranslation = useTranslation();
    const { civ, age } = useLocalSearchParams<{ civ?: string; age?: string }>();
    const [text, setText] = useState('');
    const { data: items, isLoading, error } = useAoe4ExplorerItems(type);
    const selectedAge = age ? Number(age) : undefined;
    const { titleKey, group, groups } = config[type];
    // Upgrades are mostly named "Upgrade to Veteran"; the unit they apply to tells them apart.
    const units = useAoe4Units().data;
    const unitNames = useMemo(() => new Map((units ?? []).map((u) => [u.id, u.name])), [units]);
    const subtitle = (item: Aoe4UnifiedItem) => {
        if (type === 'upgrades') {
            const target = upgradeTargetId(item.id, new Set(unitNames.keys()));
            if (target) return unitNames.get(target);
        }
        return item.displayClasses.join(', ') || item.description;
    };

    const allCivs = useMemo(() => orderBy(uniq(items?.flatMap((u) => u.civs) ?? []), civNameForAbbr), [items]);

    const { rows, first } = useMemo(() => {
        const search = text.toLowerCase();
        const filtered = orderBy(
            ((items ?? []) as Aoe4UnifiedItem[]).filter(
                (item) =>
                    (!civ || item.civs.includes(civ)) &&
                    // Available by that age, so "III" lists everything you have in castle age.
                    (!selectedAge || item.minAge <= selectedAge) &&
                    (!search || item.name.toLowerCase().includes(search))
            ),
            [(u) => u.minAge, (u) => u.name]
        );
        const rows: Row[] = [];
        for (const g of groups) {
            const inGroup = filtered.filter((item) => group(item) === g);
            if (!inGroup.length) continue;
            rows.push({ header: g }, ...inGroup.map((item) => ({ item })));
        }
        return { rows, first: rows.find((r): r is { item: Aoe4UnifiedItem } => 'item' in r)?.item };
    }, [items, civ, selectedAge, text, groups, group]);

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <Stack.Screen options={{ title: getTranslation(titleKey) }} />

                <View className={cn('pt-4 gap-3', containerClassName)}>
                    <Field
                        type="search"
                        placeholder={getTranslation('unit.search.placeholder')}
                        onChangeText={setText}
                        value={text}
                        onSubmitEditing={() => first && router.navigate(itemHref(first, civ) as any)}
                    />
                </View>
                <View className="gap-2 pt-3">
                    <CivChips
                        civs={allCivs}
                        value={civ}
                        allLabel={getTranslation('unit.availability.allcivs')}
                        onChange={(abbr) => router.setParams({ civ: abbr })}
                    />
                    <View className="flex-row gap-2 px-4">
                        {[1, 2, 3, 4].map((a) => (
                            <Chip key={a} active={selectedAge === a} onPress={() => router.setParams({ age: selectedAge === a ? undefined : String(a) })}>
                                <Text variant="label-sm">{ageNumerals[a]}</Text>
                            </Chip>
                        ))}
                    </View>
                </View>

                {isLoading ? (
                    <ActivityIndicator className="mt-8" />
                ) : error ? (
                    <Text className="p-4">{String(error)}</Text>
                ) : (
                    <FlatList
                        data={rows}
                        keyboardShouldPersistTaps="always"
                        contentContainerClassName="p-4 gap-1"
                        keyExtractor={(row) => ('header' in row ? `h-${row.header}` : row.item.id)}
                        renderItem={({ item: row }) =>
                            'header' in row ? (
                                <View className="h-10 justify-end">
                                    <Text variant="header-sm" color="brand">
                                        {row.header}
                                    </Text>
                                </View>
                            ) : (
                                <Card href={itemHref(row.item, civ) as any} flat>
                                    <ItemIcon icon={row.item.icon} type={row.item.type} />
                                    <View className="flex-1">
                                        <Text variant="label">{row.item.name}</Text>
                                        <Text variant="body-sm" color="subtle" numberOfLines={1}>
                                            {row.item.civs.length <= 2 ? row.item.civs.map(civNameForAbbr).join(', ') + ' · ' : ''}
                                            {subtitle(row.item)}
                                        </Text>
                                    </View>
                                    <Text variant="label-sm" color="subtle">
                                        {ageNumerals[row.item.minAge]}
                                    </Text>
                                </Card>
                            )
                        }
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
