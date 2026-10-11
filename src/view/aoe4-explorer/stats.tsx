import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { Aoe4Explorer } from '@nex/data';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBullseyeArrow, faFire, faHeart, faMeteor, faShield, faSwords, faBowArrow, faArrowUpRight } from '@fortawesome/sharp-solid-svg-icons';
import cn from 'classnames';
import { uniq } from 'lodash';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ageNumerals, Aoe4Costs, InlineItems, modifierSelects, Stat } from './shared';

type Physical = Aoe4Explorer.Unit | Aoe4Explorer.Building;
type Technology = Aoe4Explorer.UnifiedItem<Aoe4Explorer.Technology>;

// Same palette and scale as aoe4world's explorer (tailwind `bar` colours, StatBar max values in
// routes/units/[id].tsx), so a bar means the same length on both sites.
const barColors = { base: '#A9A9A9', technology: '#32806B', bonus: '#5B5B5B' };
const weaponStat: Record<Aoe4Explorer.Weapon['type'], { property: Aoe4Explorer.ModifyableProperty; label: string; icon: IconDefinition; max: number }> = {
    melee: { property: 'meleeAttack', label: 'Melee Attack', icon: faSwords, max: 50 },
    charge: { property: 'meleeAttack', label: 'Charge Attack', icon: faSwords, max: 50 },
    ranged: { property: 'rangedAttack', label: 'Ranged Attack', icon: faBowArrow, max: 50 },
    siege: { property: 'siegeAttack', label: 'Siege Attack', icon: faMeteor, max: 500 },
    fire: { property: 'fireAttack', label: 'Torch Attack', icon: faFire, max: 50 },
};

interface Bonus {
    name: string;
    value: number;
}

/** What the technologies researched by `age` add to a stat, one entry per technology. */
function technologyBonuses(
    technologies: Technology[],
    item: Aoe4Explorer.UnifiedItem<Physical>,
    civ: string,
    age: number,
    property: Aoe4Explorer.ModifyableProperty,
    base: number
): Bonus[] {
    return technologies.flatMap((tech) => {
        const variation = tech.variations.find((v) => v.civs.includes(civ) && v.age <= age);
        const value = (variation?.effects ?? [])
            .filter((e) => e.property === property && e.type !== 'ability' && modifierSelects(e, item as any))
            .reduce((sum, e) => sum + (e.effect === 'multiply' ? base * (e.value - 1) : e.value), 0);
        return value ? [{ name: tech.name, value: Math.round(value * 100) / 100 }] : [];
    });
}

const round = (n: number) => Math.round(n * 100) / 100;

const StatBar: React.FC<{ label: string; icon: IconDefinition; base: number; max: number; technologies?: Bonus[]; bonus?: number; always?: boolean }> = ({
    label,
    icon,
    base,
    max,
    technologies = [],
    bonus,
    always,
}) => {
    const total = round(base + technologies.reduce((sum, t) => sum + t.value, 0));
    const empty = !base && !total && !bonus;
    if (empty && !always) return null;
    const scale = Math.max(max, total + (bonus ?? 0));
    const width = (value: number) => `${Math.max(0, (value / scale) * 100)}%` as const;

    return (
        <View className={cn('gap-1.5', empty && 'opacity-40')}>
            <View className="flex-row items-center gap-2">
                <Icon icon={icon} size={14} />
                <Text variant="label">{round(base)}</Text>
                {total !== round(base) && (
                    <View className="flex-row items-center gap-0.5">
                        <Icon icon={faArrowUpRight} size={10} color="subtle" />
                        <Text color="subtle">{total}</Text>
                    </View>
                )}
                {!!bonus && <Text color="subtle">+{bonus}</Text>}
                <Text variant="label-sm" color="subtle" className="ml-auto uppercase tracking-widest">
                    {label}
                </Text>
            </View>
            <View className="h-6 flex-row gap-0.5 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <View style={{ width: width(base), backgroundColor: barColors.base }} />
                {technologies.map((t) => (
                    <View key={t.name} style={{ width: width(t.value), backgroundColor: barColors.technology }} />
                ))}
                {!!bonus && <View style={{ width: width(bonus), backgroundColor: barColors.bonus }} />}
            </View>
        </View>
    );
};

const Number: React.FC<{ label: string; value?: number; unit?: string; upgraded?: number; extra?: string }> = ({ label, value, unit, upgraded, extra }) => {
    if (!value) return null;
    return (
        <View className="gap-0.5 min-w-32">
            <Text variant="label-sm" color="subtle" className="uppercase tracking-widest">
                {label}
            </Text>
            <View className="flex-row items-baseline gap-1">
                <Text variant="header-sm">{round(value)}</Text>
                {!!upgraded && round(upgraded) !== round(value) && <Text color="subtle">↗ {round(upgraded)}</Text>}
                {unit && <Text color="subtle">{unit}</Text>}
                {extra && <Text color="subtle">{extra}</Text>}
            </View>
        </View>
    );
};

/**
 * aoe4world-style stats: a tab per age, bars for the core stats with each technology that improves
 * them as its own green segment, and the derived numbers (DPS, speeds, range, sight) below.
 */
export const Aoe4StatsPanel: React.FC<{ item: Aoe4Explorer.UnifiedItem<Physical>; civ: string; technologies: Technology[] }> = ({ item, civ, technologies }) => {
    const getTranslation = useTranslation();
    const variations = item.variations.filter((v) => v.civs.includes(civ));
    const ages = uniq(variations.map((v) => v.age));
    const minAge = Math.min(...ages);
    const [selected, setSelected] = useState<number>();
    const age = selected ?? Math.max(...ages);
    // The strongest variation available by that age: the latest one, as aoe4world does.
    const variation = variations.filter((v) => v.age <= age).sort((a, b) => b.age - a.age)[0] ?? variations[0];
    if (!variation) return null;

    const techs = (property: Aoe4Explorer.ModifyableProperty, base: number) => technologyBonuses(technologies, item, civ, age, property, base);
    const sum = (bonuses: Bonus[]) => bonuses.reduce((s, b) => s + b.value, 0);
    const armor = (type: string) => variation.armor?.find((a) => a.type === type)?.value ?? 0;
    const isUnit = variation.type === 'unit';
    const primary = variation.weapons?.find((w) => w.type !== 'fire') ?? variation.weapons?.[0];
    const primaryTechs = primary ? sum(techs(weaponStat[primary.type].property, primary.damage)) : 0;
    const primaryBonus = Math.max(0, ...(primary?.modifiers ?? []).filter((m) => m.effect === 'change').map((m) => m.value));
    const burst = primary?.burst?.count ?? 1;
    const speed = (variation as Aoe4Explorer.Unit).movement?.speed;

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

            <View className="gap-3 lg:flex-row lg:items-start">
                <Card direction="vertical" className="gap-4 lg:flex-1">
                    <Text variant="header-sm">{variation.name}</Text>
                    <StatBar label={getTranslation('unit.stats.heading.hitpoints')} icon={faHeart} base={variation.hitpoints} max={isUnit ? 1000 : 5000} technologies={techs('hitpoints', variation.hitpoints)} />
                    {(variation.weapons ?? []).map((weapon, i) => {
                        const stat = weaponStat[weapon.type];
                        const bonus = Math.max(0, ...(weapon.modifiers ?? []).filter((m) => m.effect === 'change').map((m) => m.value));
                        return (
                            <StatBar
                                key={i}
                                label={weapon.name && weapon.type === 'fire' ? 'Torch Attack' : stat.label}
                                icon={stat.icon}
                                base={weapon.damage}
                                max={stat.max}
                                technologies={techs(stat.property, weapon.damage)}
                                bonus={bonus || undefined}
                            />
                        );
                    })}
                    <StatBar label="Melee Armor" icon={faShield} base={armor('melee')} max={20} technologies={techs('meleeArmor', armor('melee'))} always />
                    <StatBar label="Ranged Armor" icon={faBullseyeArrow} base={armor('ranged')} max={20} technologies={techs('rangedArmor', armor('ranged'))} always />
                </Card>

                <Card direction="vertical" className="gap-4 lg:flex-1">
                    <Stat label={getTranslation('unit.stats.heading.costs')}>
                        <Aoe4Costs costs={variation.costs} />
                    </Stat>
                    {variation.producedBy?.length > 0 && (
                        <Stat label={getTranslation(isUnit ? 'unit.stats.heading.trainedin' : 'unit.stats.heading.builtin')}>
                            <InlineItems ids={variation.producedBy} civ={civ} />
                        </Stat>
                    )}
                    <View className="flex-row flex-wrap gap-x-8 gap-y-4">
                        {primary && primary.speed > 0 && (
                            <Number
                                label="Damage"
                                value={(primary.damage * burst) / primary.speed}
                                upgraded={((primary.damage + primaryTechs) * burst) / primary.speed}
                                unit="DPS"
                                extra={primaryBonus ? `+ ${round((primaryBonus * burst) / primary.speed)}` : undefined}
                            />
                        )}
                        <Number label="Move Speed" value={speed} upgraded={speed && speed + sum(techs('moveSpeed', speed))} unit="T/S" />
                        <Number label="Attack Speed" value={primary?.speed} unit="S" />
                        <Number label="Range" value={primary?.range?.max} upgraded={primary?.range?.max && primary.range.max + sum(techs('maxRange', primary.range.max))} unit="TILES" />
                        <Number label="Line of Sight" value={variation.sight?.line} upgraded={variation.sight?.line && variation.sight.line + sum(techs('lineOfSight', variation.sight.line))} />
                        {!!variation.garrison?.capacity && <Number label="Garrison" value={variation.garrison.capacity} />}
                        {!isUnit && <Number label="Population" value={(variation as Aoe4Explorer.Building).popcapIncrease} />}
                    </View>
                </Card>
            </View>
        </View>
    );
};
