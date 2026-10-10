import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { getCivIconLocal } from '@app/helper/civs';
import { Aoe4Item, Aoe4UnifiedItem, useAoe4ItemLookup } from '@app/queries/aoe4-explorer';
import { Aoe4Explorer, getCivNameById } from '@nex/data';
import { Image } from '@/src/components/uniwind/image';
import cn from 'classnames';
import { Link } from 'expo-router';
import { orderBy } from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';

export const ageNumerals = ['', 'I', 'II', 'III', 'IV'];

export function civEnumForAbbr(abbr: string) {
    return Aoe4Explorer.aoe4CivByAbbr[abbr];
}

export function civNameForAbbr(abbr: string) {
    const civ = civEnumForAbbr(abbr);
    return civ ? getCivNameById(civ as any) : abbr;
}

/** Fallback label for an id that is not in any of the loaded files. */
export function prettifyItemId(id: string) {
    return id.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const pathByType: Partial<Record<Aoe4Item['type'], string>> = { unit: 'units', building: 'buildings', technology: 'technologies' };

/** App route for an item, keeping the civ the user is looking at. Abilities and upgrades have no page. */
export function itemHref(item: Pick<Aoe4UnifiedItem, 'id' | 'type'>, civ?: string) {
    const path = pathByType[item.type];
    if (!path) return undefined;
    return civ ? `/explore/${path}/${item.id}?civ=${civ}` : `/explore/${path}/${item.id}`;
}

/** The variations of an item for one civ (all when no civ), oldest age first. */
export function variationsForCiv<T extends Aoe4Item>(item: Aoe4Explorer.UnifiedItem<T>, civ?: string) {
    return orderBy(
        item.variations.filter((v) => !civ || v.civs.includes(civ)),
        (v) => v.age
    );
}

/** Whether a modifier's `select` targets the item, by id or by a full class group. aoe4world sdk's where({affects}). */
export function modifierSelects(modifier: Aoe4Explorer.Modifier, item: Aoe4UnifiedItem) {
    const first = item.variations[0];
    const matchesId = modifier.select?.id?.some((id) => id === item.id || id === first?.id || id === first?.baseId);
    const classes = first?.classes ?? item.classes;
    const matchesClass = modifier.select?.class?.some((group) => group?.every((c) => classes.includes(c)));
    return !!(matchesId || matchesClass);
}

/** Items of a type with effects (abilities, technologies) that affect `item`, limited to the civ. */
export function itemsAffecting<T extends Aoe4Explorer.Ability | Aoe4Explorer.Technology>(
    candidates: Aoe4Explorer.UnifiedItem<T>[] | undefined,
    item: Aoe4UnifiedItem,
    civ?: string
) {
    return orderBy(
        (candidates ?? []).flatMap((candidate) => {
            const variations = candidate.variations.filter(
                (v) => (!civ || v.civs.includes(civ)) && (v.effects ?? []).some((e) => modifierSelects(e, item))
            );
            return variations.length ? [{ ...candidate, variations }] : [];
        }),
        [(c) => c.minAge, (c) => -c.civs.length]
    );
}

export const Chip: React.FC<{ active: boolean; onPress: () => void; children: React.ReactNode }> = ({ active, onPress, children }) => (
    <PressableOpacity
        onPress={onPress}
        className={cn(
            'flex-row items-center gap-1.5 rounded-full border px-3 py-1',
            active ? 'bg-gold-100 border-gold-500 dark:bg-blue-800 dark:border-gold-500' : 'border-gray-200 dark:border-gray-800'
        )}
    >
        {children}
    </PressableOpacity>
);

export const CivChips: React.FC<{ civs: string[]; value?: string; onChange: (abbr?: string) => void; allLabel?: string }> = ({
    civs,
    value,
    onChange,
    allLabel,
}) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4" keyboardShouldPersistTaps="always">
        {allLabel && (
            <Chip active={!value} onPress={() => onChange(undefined)}>
                <Text variant="label-sm">{allLabel}</Text>
            </Chip>
        )}
        {civs.map((abbr) => (
            <Chip key={abbr} active={value === abbr} onPress={() => onChange(value === abbr && allLabel ? undefined : abbr)}>
                <Image className="w-7 h-4" contentFit="contain" source={getCivIconLocal(civEnumForAbbr(abbr))} />
                <Text variant="label-sm">{civNameForAbbr(abbr)}</Text>
            </Chip>
        ))}
    </ScrollView>
);

const resourceIcons = {
    food: require('../../../assets4/resources/food.png'),
    wood: require('../../../assets4/resources/wood.png'),
    gold: require('../../../assets4/resources/gold.png'),
    stone: require('../../../assets4/resources/stone.png'),
    oliveoil: require('../../../assets4/resources/oliveoil.png'),
    silver: require('../../../assets4/resources/silver.png'),
    vizier: require('../../../assets4/resources/vizierpoints.png'),
    time: require('../../../assets4/resources/time.png'),
    popcap: require('../../../assets4/resources/popcap.png'),
};

const costKeys = ['food', 'wood', 'gold', 'stone', 'oliveoil', 'silver', 'vizier', 'time', 'popcap'] as const;

export const Aoe4Costs: React.FC<{ costs?: Aoe4Explorer.Item['costs'] }> = ({ costs }) => {
    if (!costs) return null;
    return (
        <View className="flex-row flex-wrap items-center gap-3">
            {costKeys
                .filter((key) => costs[key])
                .map((key) => (
                    <View key={key} className="flex-row items-center gap-1">
                        <Image className="w-6 h-5" contentFit="contain" source={resourceIcons[key]} />
                        <Text>{key === 'time' ? `${costs[key]}s` : costs[key]}</Text>
                    </View>
                ))}
        </View>
    );
};

export const ItemIcon: React.FC<{ icon?: string; className?: string }> = ({ icon, className }) => (
    <Image className={cn('rounded bg-gray-100 dark:bg-blue-950', className ?? 'w-10 h-10')} contentFit="contain" source={icon ? { uri: icon } : undefined} />
);

/** Icon + name of a referenced item, linked to its page when it has one. */
export const InlineItem: React.FC<{ id: string; civ?: string }> = ({ id: reference, civ }) => {
    const lookup = useAoe4ItemLookup();
    // References are either a bare id ("archery-range") or type-prefixed ("units/dervish").
    const id = reference.replace(/^[a-z]+\//, '');
    const item = lookup.get(id);
    const label = (
        <View className="flex-row items-center gap-1">
            {item?.icon && <ItemIcon icon={item.icon} className="w-5 h-5" />}
            <Text variant="label">{item?.name ?? prettifyItemId(id)}</Text>
        </View>
    );
    const href = item && itemHref(item, civ);
    return href ? (
        <Link href={href as any} asChild>
            <PressableOpacity>{label}</PressableOpacity>
        </Link>
    ) : (
        label
    );
};

export const InlineItems: React.FC<{ ids: string[]; civ?: string }> = ({ ids, civ }) => (
    <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
        {ids.map((id) => (
            <InlineItem key={id} id={id} civ={civ} />
        ))}
    </View>
);

export const Stat: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <View className="flex-row gap-2">
        <Text className="w-36" color="subtle">
            {label}
        </Text>
        <View className="flex-1">{React.isValidElement(children) ? children : <Text>{children}</Text>}</View>
    </View>
);

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Text variant="header-sm" className="px-5 mt-2">
        {children}
    </Text>
);

export function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const rest = Math.round(seconds % 60);
    if (!minutes) return `${rest} secs`;
    return rest ? `${minutes} min ${rest} secs` : `${minutes} mins`;
}

/** "Abilities and influences", as on aoe4world's explorer: manual abilities first. */
export const AbilitiesSection: React.FC<{ abilities: Aoe4Explorer.UnifiedItem<Aoe4Explorer.Ability>[]; civ?: string }> = ({ abilities, civ }) => {
    if (!abilities.length) return null;
    const sorted = orderBy(
        abilities.map((a) => a.variations[0]),
        (a) => (a.active === 'manual' ? 0 : 1)
    );
    return (
        <View className="gap-3">
            <SectionTitle>Abilities and influences</SectionTitle>
            <View className="px-5 gap-4">
                {sorted.map((ability) => (
                    <View key={ability.id} className="flex-row gap-3 items-start">
                        <ItemIcon icon={ability.icon} className={cn('w-10 h-10', ability.active === 'manual' && 'bg-purple-900')} />
                        <View className="flex-1 gap-1">
                            <Text variant="label">{ability.name}</Text>
                            {!!ability.description && <Text color="subtle">{ability.description}</Text>}
                            {!!ability.activatedOn?.length && (
                                <View className="flex-row flex-wrap items-center gap-1">
                                    <Text color="subtle">
                                        {ability.active === 'toggle'
                                            ? 'Toggle on'
                                            : !ability.auraRange
                                            ? 'Activate on'
                                            : ability.auraRange >= 1
                                            ? `When in ${ability.auraRange} tiles range of`
                                            : 'When near'}
                                    </Text>
                                    <InlineItems ids={ability.activatedOn} civ={civ} />
                                </View>
                            )}
                            {!!ability.unlockedBy?.length && (
                                <View className="flex-row flex-wrap items-center gap-1">
                                    <Text color="subtle">Requires</Text>
                                    <InlineItems ids={ability.unlockedBy} civ={civ} />
                                </View>
                            )}
                            {!!ability.cooldown && <Text color="subtle">{formatSeconds(ability.cooldown)} cooldown</Text>}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

/** Compact rows linking to other items, e.g. units a building produces. */
export const ItemRows: React.FC<{ title: string; items: Aoe4UnifiedItem[]; civ?: string }> = ({ title, items, civ }) => {
    if (!items.length) return null;
    return (
        <View className="gap-2">
            <SectionTitle>{title}</SectionTitle>
            <View className="px-5 gap-2 lg:flex-row lg:flex-wrap">
                {items.map((item) => {
                    const href = itemHref(item, civ);
                    const variation = variationsForCiv(item, civ)[0] ?? item.variations[0];
                    const row = (
                        <View className="flex-row items-center gap-3 lg:w-80">
                            <ItemIcon icon={item.icon} />
                            <View className="flex-1">
                                <Text variant="label" numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Aoe4Costs costs={variation?.costs} />
                            </View>
                        </View>
                    );
                    return href ? (
                        <Link key={item.id} href={href as any} asChild>
                            <PressableOpacity>{row}</PressableOpacity>
                        </Link>
                    ) : (
                        <View key={item.id}>{row}</View>
                    );
                })}
            </View>
        </View>
    );
};

/** One line per technology / ability effect. */
export function formatModifier(modifier: Aoe4Explorer.Modifier) {
    const value =
        modifier.effect === 'multiply'
            ? `${modifier.value >= 1 ? '+' : ''}${Math.round((modifier.value - 1) * 100)}%`
            : `${modifier.value >= 0 ? '+' : ''}${modifier.value}`;
    const property = modifier.property.replace(/([A-Z])/g, ' $1').toLowerCase();
    const target = [
        ...(modifier.select?.class?.map((group) => group.join(' ').replace(/_/g, ' ')) ?? []),
        ...(modifier.select?.id?.map(prettifyItemId) ?? []),
    ].join(', ');
    return `${value} ${property}${target ? ` for ${target}` : ''}`;
}
