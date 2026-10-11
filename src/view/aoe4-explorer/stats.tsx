import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { useAoe4Technologies, useAoe4Units } from '@app/queries/aoe4-explorer';
import Picker from '@app/view/components/picker';
import { Aoe4Explorer } from '@nex/data';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBullseyeArrow, faFire, faHeart, faMeteor, faShield, faSwords, faBowArrow, faArrowUpRight, faXmark } from '@fortawesome/sharp-solid-svg-icons';
import cn from 'classnames';
import { router, useLocalSearchParams } from 'expo-router';
import { orderBy, uniq } from 'lodash';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ageNumerals, Aoe4Costs, CivChips, civNameForAbbr, InlineItems, ItemIcon, itemsAffecting, modifierSelects, Stat, unitGroup, unitGroups } from './shared';

type Physical = Aoe4Explorer.Unit | Aoe4Explorer.Building;
type PhysicalItem = Aoe4Explorer.UnifiedItem<Physical>;
type Technology = Aoe4Explorer.UnifiedItem<Aoe4Explorer.Technology>;

// Same palette and scale as aoe4world's explorer (tailwind `bar` colours, StatBar max values in
// routes/units/[id].tsx), so a bar means the same length on both sites. The compared unit gets
// its own base colour so the two rows read apart.
const barColors = { base: '#A9A9A9', compare: '#6B8CAE', technology: '#32806B', bonus: '#5B5B5B' };
const weaponStat: Record<Aoe4Explorer.Weapon['type'], { property: Aoe4Explorer.ModifyableProperty; label: string; icon: IconDefinition; max: number }> = {
    melee: { property: 'meleeAttack', label: 'Melee Attack', icon: faSwords, max: 50 },
    charge: { property: 'meleeAttack', label: 'Charge Attack', icon: faSwords, max: 50 },
    ranged: { property: 'rangedAttack', label: 'Ranged Attack', icon: faBowArrow, max: 50 },
    siege: { property: 'siegeAttack', label: 'Siege Attack', icon: faMeteor, max: 500 },
    fire: { property: 'fireAttack', label: 'Torch Attack', icon: faFire, max: 50 },
};

const round = (n: number) => Math.round(n * 100) / 100;
const sum = (bonuses: Bonus[]) => bonuses.reduce((s, b) => s + b.value, 0);

interface Bonus {
    name: string;
    value: number;
}

interface BarStat {
    key: string;
    label: string;
    icon: IconDefinition;
    max: number;
    base: number;
    technologies: Bonus[];
    bonus?: number;
    always?: boolean;
}

interface NumberStat {
    key: string;
    label: string;
    value?: number;
    upgraded?: number;
    unit?: string;
    extra?: string;
}

interface Stats {
    variation: Physical;
    bars: BarStat[];
    numbers: NumberStat[];
}

/** What the technologies researched by `age` add to a stat, one entry per technology. */
function technologyBonuses(technologies: Technology[], item: PhysicalItem, civ: string, age: number, property: Aoe4Explorer.ModifyableProperty, base: number): Bonus[] {
    return technologies.flatMap((tech) => {
        const variation = tech.variations.find((v) => v.civs.includes(civ) && v.age <= age);
        const value = (variation?.effects ?? [])
            .filter((e) => e.property === property && e.type !== 'ability' && modifierSelects(e, item as any))
            .reduce((total, e) => total + (e.effect === 'multiply' ? base * (e.value - 1) : e.value), 0);
        return value ? [{ name: tech.name, value: round(value) }] : [];
    });
}

/** The strongest variation available by `age` for the civ (the latest one, as aoe4world does) and its stats. */
function computeStats(item: PhysicalItem, civ: string, age: number, allTechnologies: Technology[] | undefined, getTranslation: ReturnType<typeof useTranslation>): Stats | undefined {
    const variation = item.variations
        .filter((v) => v.civs.includes(civ) && v.age <= age)
        .sort((a, b) => b.age - a.age)[0];
    if (!variation) return undefined;

    const technologies = itemsAffecting(allTechnologies, item as any, civ) as Technology[];
    const techs = (property: Aoe4Explorer.ModifyableProperty, base: number) => technologyBonuses(technologies, item, civ, age, property, base);
    const armor = (type: string) => variation.armor?.find((a) => a.type === type)?.value ?? 0;
    const isUnit = variation.type === 'unit';
    const weaponBonus = (weapon: Aoe4Explorer.Weapon) => Math.max(0, ...(weapon.modifiers ?? []).filter((m) => m.effect === 'change').map((m) => m.value));

    const bars: BarStat[] = [
        { key: 'hitpoints', label: getTranslation('unit.stats.heading.hitpoints'), icon: faHeart, max: isUnit ? 1000 : 5000, base: variation.hitpoints, technologies: techs('hitpoints', variation.hitpoints) },
        ...(variation.weapons ?? []).map((weapon) => {
            const stat = weaponStat[weapon.type];
            return {
                key: weapon.type,
                label: stat.label,
                icon: stat.icon,
                max: stat.max,
                base: weapon.damage,
                technologies: techs(stat.property, weapon.damage),
                bonus: weaponBonus(weapon) || undefined,
            };
        }),
        { key: 'meleeArmor', label: 'Melee Armor', icon: faShield, max: 20, base: armor('melee'), technologies: techs('meleeArmor', armor('melee')), always: true },
        { key: 'rangedArmor', label: 'Ranged Armor', icon: faBullseyeArrow, max: 20, base: armor('ranged'), technologies: techs('rangedArmor', armor('ranged')), always: true },
    ];

    const primary = variation.weapons?.find((w) => w.type !== 'fire') ?? variation.weapons?.[0];
    const burst = primary?.burst?.count ?? 1;
    const speed = (variation as Aoe4Explorer.Unit).movement?.speed;
    // aoe4world: line of sight is sight.base / 4 tiles, sight.line / 4 the maximum on high ground.
    const sight = variation.sight?.base ? variation.sight.base / 4 : undefined;
    const maxSight = variation.sight?.line ? variation.sight.line / 4 : undefined;
    const numbers: NumberStat[] = [
        primary && primary.speed > 0
            ? {
                  key: 'dps',
                  label: 'Damage',
                  value: (primary.damage * burst) / primary.speed,
                  upgraded: ((primary.damage + sum(techs(weaponStat[primary.type].property, primary.damage))) * burst) / primary.speed,
                  unit: 'DPS',
                  extra: weaponBonus(primary) ? `+ ${round((weaponBonus(primary) * burst) / primary.speed)}` : undefined,
              }
            : { key: 'dps', label: 'Damage' },
        { key: 'speed', label: 'Move Speed', value: speed, upgraded: speed && speed + sum(techs('moveSpeed', speed)), unit: 'T/S' },
        { key: 'attackSpeed', label: 'Attack Speed', value: primary?.speed, unit: 'S' },
        {
            key: 'range',
            label: 'Range',
            value: primary?.range?.max,
            upgraded: primary?.range?.max && primary.range.max + sum(techs('maxRange', primary.range.max)),
            unit: 'TILES',
        },
        {
            key: 'sight',
            label: 'Line of Sight',
            value: sight,
            upgraded: sight && sight + sum(techs('lineOfSight', sight * 4)) / 4,
            unit: 'TILES',
            extra: maxSight && maxSight !== sight ? `⚡ ${round(maxSight)} max` : undefined,
        },
        { key: 'garrison', label: 'Garrison', value: variation.garrison?.capacity },
        { key: 'population', label: 'Population', value: isUnit ? undefined : (variation as Aoe4Explorer.Building).popcapIncrease },
    ];

    return { variation, bars, numbers };
}

const Bar: React.FC<{ stat?: BarStat; scale: number; color: string }> = ({ stat, scale, color }) => {
    const width = (value: number) => `${Math.max(0, (value / scale) * 100)}%` as const;
    return (
        <View className="h-5 flex-row gap-0.5 bg-gray-200 dark:bg-gray-800 overflow-hidden">
            {stat && (
                <>
                    <View style={{ width: width(stat.base), backgroundColor: color }} />
                    {stat.technologies.map((t) => (
                        <View key={t.name} style={{ width: width(t.value), backgroundColor: barColors.technology }} />
                    ))}
                    {!!stat.bonus && <View style={{ width: width(stat.bonus), backgroundColor: barColors.bonus }} />}
                </>
            )}
        </View>
    );
};

const BarValue: React.FC<{ stat?: BarStat }> = ({ stat }) => {
    if (!stat) return <Text color="subtle">–</Text>;
    const total = round(stat.base + sum(stat.technologies));
    return (
        <View className="flex-row items-center gap-1.5">
            <Text variant="label">{round(stat.base)}</Text>
            {total !== round(stat.base) && (
                <View className="flex-row items-center gap-0.5">
                    <Icon icon={faArrowUpRight} size={10} color="subtle" />
                    <Text color="subtle">{total}</Text>
                </View>
            )}
            {!!stat.bonus && <Text color="subtle">+{stat.bonus}</Text>}
        </View>
    );
};

const StatBarRow: React.FC<{ stat?: BarStat; compare?: BarStat; comparing: boolean }> = ({ stat, compare, comparing }) => {
    const any = stat ?? compare!;
    const empty = [stat, compare].every((s) => !s || (!s.base && !sum(s.technologies) && !s.bonus));
    if (empty && !any.always) return null;
    const total = (s?: BarStat) => (s ? s.base + sum(s.technologies) + (s.bonus ?? 0) : 0);
    const scale = Math.max(any.max, total(stat), total(compare));

    return (
        <View className={cn('gap-1.5', empty && 'opacity-40')}>
            <View className="flex-row items-center gap-2">
                <Icon icon={any.icon} size={14} />
                <BarValue stat={stat} />
                {comparing && (
                    <>
                        <Text color="subtle">vs</Text>
                        <BarValue stat={compare} />
                    </>
                )}
                <Text variant="label-sm" color="subtle" className="ml-auto uppercase tracking-widest">
                    {any.label}
                </Text>
            </View>
            <Bar stat={stat} scale={scale} color={barColors.base} />
            {comparing && <Bar stat={compare} scale={scale} color={barColors.compare} />}
        </View>
    );
};

const NumberValue: React.FC<{ stat?: NumberStat }> = ({ stat }) =>
    stat?.value ? (
        <View className="flex-row items-baseline gap-1 flex-wrap">
            <Text variant="header-sm">{round(stat.value)}</Text>
            {!!stat.upgraded && round(stat.upgraded) !== round(stat.value) && <Text color="subtle">↗ {round(stat.upgraded)}</Text>}
            {stat.unit && <Text color="subtle">{stat.unit}</Text>}
            {stat.extra && <Text color="subtle">{stat.extra}</Text>}
        </View>
    ) : (
        <Text color="subtle">–</Text>
    );

const NumberCell: React.FC<{ stat?: NumberStat; compare?: NumberStat; comparing: boolean }> = ({ stat, compare, comparing }) => {
    if (!stat?.value && !compare?.value) return null;
    return (
        <View className="gap-0.5 min-w-32">
            <Text variant="label-sm" color="subtle" className="uppercase tracking-widest">
                {(stat ?? compare)!.label}
            </Text>
            <NumberValue stat={stat} />
            {comparing && (
                <View className="border-l-2 pl-1.5" style={{ borderColor: barColors.compare }}>
                    <NumberValue stat={compare} />
                </View>
            )}
        </View>
    );
};

/** Picks the unit to compare with; grouped like the units list. Kept in the URL so a comparison can be shared. */
const ComparePicker: React.FC<{ value?: string; onSelect: (id: string) => void }> = ({ value, onSelect }) => {
    const units = useAoe4Units().data ?? [];
    const byId = new Map(units.map((u) => [u.id, u]));
    const sections = [
        { title: 'Compare', data: [''] },
        ...unitGroups
            .map((group) => ({ title: group, data: orderBy(units.filter((u) => unitGroup(u as any) === group), (u) => u.name).map((u) => u.id) }))
            .filter((s) => s.data.length),
    ];
    return (
        <Picker<string>
            popupAlign="right"
            itemHeight={40}
            textMinWidth={150}
            container="sectionlist"
            value={value ?? ''}
            sections={sections}
            formatter={(id) => (id ? byId.get(id)?.name ?? id : 'Compare')}
            icon={(id, inList) => (inList && id ? <ItemIcon icon={byId.get(id)?.icon} type="unit" className="w-6 h-6" /> : null)}
            onSelect={onSelect}
        />
    );
};

/**
 * aoe4world-style stats: a tab per age, bars for the core stats with each technology that improves
 * them as its own green segment, and the derived numbers (DPS, speeds, range, sight) below. Units can
 * be compared with another unit (and civ) at the same age, each with the technologies its civ has.
 */
export const Aoe4StatsPanel: React.FC<{ item: PhysicalItem; civ: string }> = ({ item, civ }) => {
    const getTranslation = useTranslation();
    const technologies = useAoe4Technologies().data;
    const units = useAoe4Units().data;
    const params = useLocalSearchParams<{ compare?: string; compareCiv?: string }>();
    const isUnit = item.type === 'unit';
    const compareItem = isUnit && params.compare ? (units?.find((u) => u.id === params.compare) as PhysicalItem | undefined) : undefined;
    // Same civ as the main unit when it has the compared unit, otherwise the compared unit's first.
    const compareCiv = compareItem && (params.compareCiv && compareItem.civs.includes(params.compareCiv) ? params.compareCiv : compareItem.civs.includes(civ) ? civ : compareItem.civs[0]);

    const ages = uniq(item.variations.filter((v) => v.civs.includes(civ)).map((v) => v.age));
    const minAge = Math.min(...ages);
    const [selected, setSelected] = useState<number>();
    const age = selected ?? Math.max(...ages);

    const stats = computeStats(item, civ, age, technologies, getTranslation);
    const compare = compareItem && compareCiv ? computeStats(compareItem, compareCiv, age, technologies, getTranslation) : undefined;
    const comparing = !!compareItem;
    if (!stats) return null;
    const { variation } = stats;

    const barKeys = uniq([...stats.bars, ...(compare?.bars ?? [])].map((b) => b.key));
    const numberKeys = uniq([...stats.numbers, ...(compare?.numbers ?? [])].map((n) => n.key));
    const findBar = (s: Stats | undefined, key: string) => s?.bars.find((b) => b.key === key);
    const findNumber = (s: Stats | undefined, key: string) => s?.numbers.find((n) => n.key === key);

    return (
        <View className="px-5 gap-3">
            <View className="flex-row rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                {[1, 2, 3, 4].map((a) => (
                    <PressableOpacity
                        key={a}
                        disabled={a < minAge}
                        onPress={() => setSelected(a)}
                        className={cn('flex-1 items-center py-2', a === age ? 'bg-white dark:bg-blue-900' : 'bg-gray-100 dark:bg-blue-950', a < minAge && 'opacity-30')}
                    >
                        <Text variant="label">{ageNumerals[a]}</Text>
                    </PressableOpacity>
                ))}
            </View>

            {isUnit && (
                <View className="gap-2">
                    <View className="flex-row items-center gap-2 flex-wrap">
                        <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3" style={{ backgroundColor: barColors.base }} />
                            <Text variant="label">{variation.name}</Text>
                        </View>
                        {comparing && (
                            <View className="flex-row items-center gap-2">
                                <Text color="subtle">vs</Text>
                                <View className="w-3 h-3" style={{ backgroundColor: barColors.compare }} />
                                <Text variant="label">{compare?.variation.name ?? `${compareItem.name} (not in age ${ageNumerals[age]})`}</Text>
                                <PressableOpacity onPress={() => router.setParams({ compare: undefined, compareCiv: undefined })}>
                                    <Icon icon={faXmark} size={14} color="subtle" />
                                </PressableOpacity>
                            </View>
                        )}
                        <View className="ml-auto">
                            <ComparePicker value={params.compare} onSelect={(id) => router.setParams({ compare: id || undefined, compareCiv: undefined })} />
                        </View>
                    </View>
                    {comparing && compareItem.civs.length > 1 && (
                        <View className="-mx-5">
                            <CivChips civs={compareItem.civs} value={compareCiv} onChange={(abbr) => router.setParams({ compareCiv: abbr })} />
                        </View>
                    )}
                </View>
            )}

            <View className="gap-3 lg:flex-row lg:items-start">
                <Card direction="vertical" className="gap-4 lg:flex-1">
                    {!isUnit && <Text variant="header-sm">{variation.name}</Text>}
                    {barKeys.map((key) => (
                        <StatBarRow key={key} stat={findBar(stats, key)} compare={findBar(compare, key)} comparing={comparing} />
                    ))}
                </Card>

                <Card direction="vertical" className="gap-4 lg:flex-1">
                    <Stat label={getTranslation('unit.stats.heading.costs')}>
                        <View className="gap-1">
                            <Aoe4Costs costs={variation.costs} />
                            {comparing && compare && (
                                <View className="border-l-2 pl-1.5" style={{ borderColor: barColors.compare }}>
                                    <Aoe4Costs costs={compare.variation.costs} />
                                </View>
                            )}
                        </View>
                    </Stat>
                    {variation.producedBy?.length > 0 && (
                        <Stat label={getTranslation(isUnit ? 'unit.stats.heading.trainedin' : 'unit.stats.heading.builtin')}>
                            <InlineItems ids={variation.producedBy} civ={civ} />
                        </Stat>
                    )}
                    <View className="flex-row flex-wrap gap-x-8 gap-y-4">
                        {numberKeys.map((key) => (
                            <NumberCell key={key} stat={findNumber(stats, key)} compare={findNumber(compare, key)} comparing={comparing} />
                        ))}
                    </View>
                    {comparing && compareCiv && compareCiv !== civ && (
                        <Text variant="body-sm" color="subtle">
                            {compareItem.name}: {civNameForAbbr(compareCiv)}
                        </Text>
                    )}
                </Card>
            </View>
        </View>
    );
};
