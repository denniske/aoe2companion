import { Card } from '@app/components/card';
import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import {
    Aoe4Item,
    Aoe4UnifiedItem,
    useAoe4Abilities,
    useAoe4Item,
    useAoe4Technologies,
    useAoe4Units,
    useAoe4Upgrades,
} from '@app/queries/aoe4-explorer';
import { Aoe4StatsPanel } from './stats';
import NotFound from '@app/app/(main)/+not-found';
import { Aoe4Explorer } from '@nex/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { orderBy } from 'lodash';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
    AbilitiesSection,
    Aoe4Costs,
    ageNumerals,
    CivChips,
    civNameForAbbr,
    formatModifier,
    InlineItems,
    itemColors,
    ItemIcon,
    PatchHistory,
    upgradeTargetId,
    ItemRows,
    itemsAffecting,
    prettifyItemId,
    Stat,
    variationsForCiv,
} from './shared';

type Physical = Aoe4Explorer.Unit | Aoe4Explorer.Building;

const WeaponStats: React.FC<{ weapon: Aoe4Explorer.Weapon }> = ({ weapon }) => {
    const getTranslation = useTranslation();
    const bonuses = (weapon.modifiers ?? []).filter((m) => m.effect === 'change' && m.value);
    return (
        <View className="gap-1">
            <Text variant="label">
                {weapon.name ?? prettifyItemId(weapon.type)} <Text color="subtle">({weapon.type})</Text>
            </Text>
            <Stat label={getTranslation('unit.stats.heading.attack')}>
                {weapon.damage}
                {weapon.burst?.count ? ` × ${weapon.burst.count}` : ''}
            </Stat>
            {bonuses.map((bonus, i) => (
                <Stat key={i} label={`+ ${getTranslation('unit.stats.heading.bonus')}`}>
                    {`+${bonus.value} vs ${[...(bonus.target?.class?.map((g) => g.join(' ')) ?? []), ...(bonus.target?.id?.map(prettifyItemId) ?? [])].join(', ')}`}
                </Stat>
            ))}
            {!!weapon.speed && <Stat label={getTranslation('unit.stats.heading.rateoffire')}>{`${weapon.speed}s`}</Stat>}
            {!!weapon.range?.max && (
                <Stat label={getTranslation('unit.stats.heading.range')}>
                    {weapon.range.min ? `${weapon.range.min}–${weapon.range.max}` : weapon.range.max}
                </Stat>
            )}
        </View>
    );
};

const VariationHeader: React.FC<{ variation: Aoe4Item }> = ({ variation }) => (
    <View className="flex-row items-center gap-3">
        <ItemIcon icon={variation.icon} type={variation.type} className="w-12 h-12" />
        <View className="flex-1">
            <Text variant="header-sm">{variation.name}</Text>
            <Text color="subtle">Age {ageNumerals[variation.age]}</Text>
        </View>
    </View>
);

/** What the bars leave out: per-weapon bonuses and ranges, and a building's influence. */
const WeaponDetails: React.FC<{ item: Aoe4Explorer.UnifiedItem<Physical>; civ: string }> = ({ item, civ }) => {
    const variation = variationsForCiv(item, civ).at(-1);
    const weapons = variation?.weapons ?? [];
    const influences = variation?.type === 'building' ? variation.influences ?? [] : [];
    if (!weapons.length && !influences.length) return null;
    return (
        <View className="px-5">
            <Card direction="vertical" className="gap-3 lg:flex-row lg:flex-wrap lg:gap-8 lg:items-start">
                {weapons.map((weapon, i) => (
                    <WeaponStats key={i} weapon={weapon} />
                ))}
                {influences.length > 0 && (
                    <Stat label="Influence">
                        {influences.map((influence, i) => (
                            <Text key={i}>{influence}</Text>
                        ))}
                    </Stat>
                )}
            </Card>
        </View>
    );
};

const TechnologyVariationCard: React.FC<{ variation: Aoe4Explorer.Technology; civ?: string }> = ({ variation, civ }) => {
    const getTranslation = useTranslation();
    return (
        <Card direction="vertical" className="gap-3">
            <VariationHeader variation={variation} />
            <Stat label={getTranslation('unit.stats.heading.costs')}>
                <Aoe4Costs costs={variation.costs} />
            </Stat>
            {variation.producedBy?.length > 0 && (
                <Stat label={getTranslation('unit.stats.heading.researchedin')}>
                    <InlineItems ids={variation.producedBy} civ={civ} />
                </Stat>
            )}
            {!!variation.effects?.length && (
                <Stat label="Effects">
                    {variation.effects.map((effect, i) => (
                        <Text key={i}>{formatModifier(effect)}</Text>
                    ))}
                </Stat>
            )}
        </Card>
    );
};

/** Header, description, civ picker and per-age variation cards; type specific sections go in children. */
function ItemDetailsLayout<T extends Aoe4Item>({
    item,
    civ,
    renderVariation,
    children,
}: {
    item: Aoe4Explorer.UnifiedItem<T>;
    civ: string;
    /** Per-variation cards, for items without the stats panel (technologies, upgrades). */
    renderVariation?: (variation: T) => React.ReactNode;
    children?: React.ReactNode;
}) {
    const getTranslation = useTranslation();
    const unique = item.unique || item.civs.length <= 2;
    return (
        <ScrollView>
            <View className="flex-1 min-h-full py-5 gap-4">
                <Stack.Screen
                    options={{
                        title: item.name,
                        headerTitle: () => (
                            <HeaderTitle
                                icon={item.icon ? { uri: item.icon } : undefined}
                                iconStyle={{ backgroundColor: itemColors[item.type], borderRadius: 4 }}
                                title={item.name}
                                subtitle={
                                    unique && item.type === 'unit'
                                        ? item.civs.map(civNameForAbbr).join(', ') + ' ' + getTranslation('explore.units.uniqueunit')
                                        : unique
                                        ? item.civs.map(civNameForAbbr).join(', ')
                                        : item.displayClasses.join(', ')
                                }
                            />
                        ),
                    }}
                />

                {!!item.description && <Text className="px-5">{item.description}</Text>}

                {item.civs.length > 1 && <CivChips civs={item.civs} value={civ} onChange={(abbr) => router.setParams({ civ: abbr })} />}

                {renderVariation && (
                <View className="px-5 gap-3 lg:flex-row lg:flex-wrap">
                    {/* Several variations can share an age for one civ (e.g. a landmark-trained version); keep them all. */}
                    {variationsForCiv(item, civ).map((variation, i) => (
                        <View key={`${variation.pbgid ?? variation.id}-${i}`} className="lg:w-[48%]">
                            {renderVariation(variation)}
                        </View>
                    ))}
                </View>
                )}

                {children}
                <PatchHistory item={item as Aoe4UnifiedItem} civ={civ} />
            </View>
        </ScrollView>
    );
}

function useDetailParams<K extends 'units' | 'buildings' | 'technologies' | 'upgrades'>(type: K) {
    const { name, civ } = useLocalSearchParams<{ name: string; civ?: string }>();
    const { data: item, isLoading } = useAoe4Item(type, name);
    const selectedCiv = item && (civ && item.civs.includes(civ) ? civ : item.civs[0]);
    return { item, isLoading, civ: selectedCiv! };
}

export function Aoe4UnitDetails() {
    const { item: unit, isLoading, civ } = useDetailParams('units');
    const abilities = useAoe4Abilities().data;
    const technologies = useAoe4Technologies().data;
    const upgrades = useAoe4Upgrades().data;
    const unitIds = useUnitIds();
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!unit) return <NotFound />;

    const unitTechnologies = itemsAffecting(technologies, unit as Aoe4UnifiedItem, civ);
    const unitUpgrades = (upgrades ?? []).filter(
        (u) => upgradeTargetId(u.id, unitIds) === unit.id && u.variations.some((v) => v.civs.includes(civ))
    ) as Aoe4UnifiedItem[];

    return (
        <ItemDetailsLayout item={unit} civ={civ}>
            <Aoe4StatsPanel item={unit} civ={civ} technologies={unitTechnologies} />
            <WeaponDetails item={unit} civ={civ} />
            <AbilitiesSection abilities={itemsAffecting(abilities, unit as Aoe4UnifiedItem, civ)} civ={civ} />
            <ItemRows title="Upgrades" items={unitUpgrades} civ={civ} />
            <ItemRows title="Technologies" items={unitTechnologies} civ={civ} />
        </ItemDetailsLayout>
    );
}

export function Aoe4BuildingDetails() {
    const { item: building, isLoading, civ } = useDetailParams('buildings');
    const abilities = useAoe4Abilities().data;
    const technologies = useAoe4Technologies().data;
    const units = useAoe4Units().data;
    const upgrades = useAoe4Upgrades().data;
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!building) return <NotFound />;

    const producedHere = <T extends Aoe4Item>(items: Aoe4Explorer.UnifiedItem<T>[] | undefined) =>
        orderBy(
            (items ?? []).filter((item) => item.variations.some((v) => v.civs.includes(civ) && v.producedBy.includes(building.id))),
            [(i) => i.minAge, (i) => i.name]
        ) as Aoe4UnifiedItem[];

    return (
        <ItemDetailsLayout item={building} civ={civ}>
            <Aoe4StatsPanel item={building} civ={civ} technologies={itemsAffecting(technologies, building as Aoe4UnifiedItem, civ)} />
            <WeaponDetails item={building} civ={civ} />
            <ItemRows title="Units" items={producedHere(units)} civ={civ} />
            <ItemRows title="Upgrades" items={producedHere(upgrades)} civ={civ} />
            <ItemRows title="Technologies" items={producedHere(technologies)} civ={civ} />
            <AbilitiesSection abilities={itemsAffecting(abilities, building as Aoe4UnifiedItem, civ)} civ={civ} />
        </ItemDetailsLayout>
    );
}

export function Aoe4TechnologyDetails() {
    const { item: technology, isLoading, civ } = useDetailParams('technologies');
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!technology) return <NotFound />;

    return <ItemDetailsLayout item={technology} civ={civ} renderVariation={(v) => <TechnologyVariationCard variation={v} civ={civ} />} />;
}

function useUnitIds() {
    const units = useAoe4Units().data;
    return React.useMemo(() => new Set((units ?? []).map((u) => u.id)), [units]);
}

const UpgradeVariationCard: React.FC<{ variation: Aoe4Explorer.Upgrade; target?: string; civ?: string }> = ({ variation, target, civ }) => {
    const getTranslation = useTranslation();
    return (
        <Card direction="vertical" className="gap-3">
            <VariationHeader variation={variation} />
            <Stat label={getTranslation('unit.stats.heading.costs')}>
                <Aoe4Costs costs={variation.costs} />
            </Stat>
            {variation.producedBy?.length > 0 && (
                <Stat label={getTranslation('unit.stats.heading.researchedin')}>
                    <InlineItems ids={variation.producedBy} civ={civ} />
                </Stat>
            )}
            {target && (
                <Stat label={getTranslation('unit.heading.upgradedto')}>
                    <InlineItems ids={[target]} civ={civ} />
                </Stat>
            )}
        </Card>
    );
};

export function Aoe4UpgradeDetails() {
    const { item: upgrade, isLoading, civ } = useDetailParams('upgrades');
    const unitIds = useUnitIds();
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!upgrade) return <NotFound />;
    const target = upgradeTargetId(upgrade.id, unitIds);

    return <ItemDetailsLayout item={upgrade} civ={civ} renderVariation={(v) => <UpgradeVariationCard variation={v} target={target} civ={civ} />} />;
}
