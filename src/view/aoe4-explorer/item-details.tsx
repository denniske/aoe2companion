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
} from '@app/queries/aoe4-explorer';
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
    ItemIcon,
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
        <ItemIcon icon={variation.icon} className="w-12 h-12" />
        <View className="flex-1">
            <Text variant="header-sm">{variation.name}</Text>
            <Text color="subtle">Age {ageNumerals[variation.age]}</Text>
        </View>
    </View>
);

const PhysicalVariationCard: React.FC<{ variation: Physical; civ?: string }> = ({ variation, civ }) => {
    const getTranslation = useTranslation();
    const isUnit = variation.type === 'unit';
    return (
        <Card direction="vertical" className="gap-3">
            <VariationHeader variation={variation} />
            <Stat label={getTranslation('unit.stats.heading.costs')}>
                <Aoe4Costs costs={variation.costs} />
            </Stat>
            <Stat label={getTranslation('unit.stats.heading.hitpoints')}>{variation.hitpoints}</Stat>
            <Stat label={getTranslation('unit.stats.heading.armour')}>
                {variation.armor?.length ? variation.armor.map((a) => `${a.value} ${a.type}`).join(', ') : '0'}
            </Stat>
            {isUnit && !!variation.movement?.speed && <Stat label={getTranslation('unit.stats.heading.speed')}>{variation.movement.speed}</Stat>}
            {!!variation.sight?.line && <Stat label={getTranslation('unit.stats.heading.lineofsight')}>{variation.sight.line}</Stat>}
            {!!variation.garrison?.capacity && (
                <Stat label={getTranslation('unit.stats.heading.garrisoncapacity')}>{variation.garrison.capacity}</Stat>
            )}
            {!isUnit && !!variation.popcapIncrease && <Stat label="Population">{`+${variation.popcapIncrease}`}</Stat>}
            {variation.producedBy?.length > 0 && (
                <Stat label={getTranslation(isUnit ? 'unit.stats.heading.trainedin' : 'unit.stats.heading.builtin')}>
                    <InlineItems ids={variation.producedBy} civ={civ} />
                </Stat>
            )}
            {!isUnit && !!variation.influences?.length && (
                <Stat label="Influence">
                    {variation.influences.map((influence, i) => (
                        <Text key={i}>{influence}</Text>
                    ))}
                </Stat>
            )}
            {variation.weapons?.map((weapon, i) => (
                <WeaponStats key={i} weapon={weapon} />
            ))}
        </Card>
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
    renderVariation: (variation: T) => React.ReactNode;
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

                <View className="px-5 gap-3 lg:flex-row lg:flex-wrap">
                    {/* Several variations can share an age for one civ (e.g. a landmark-trained version); keep them all. */}
                    {variationsForCiv(item, civ).map((variation, i) => (
                        <View key={`${variation.pbgid ?? variation.id}-${i}`} className="lg:w-[48%]">
                            {renderVariation(variation)}
                        </View>
                    ))}
                </View>

                {children}
            </View>
        </ScrollView>
    );
}

function useDetailParams<K extends 'units' | 'buildings' | 'technologies'>(type: K) {
    const { name, civ } = useLocalSearchParams<{ name: string; civ?: string }>();
    const { data: item, isLoading } = useAoe4Item(type, name);
    const selectedCiv = item && (civ && item.civs.includes(civ) ? civ : item.civs[0]);
    return { item, isLoading, civ: selectedCiv! };
}

export function Aoe4UnitDetails() {
    const { item: unit, isLoading, civ } = useDetailParams('units');
    const abilities = useAoe4Abilities().data;
    const technologies = useAoe4Technologies().data;
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!unit) return <NotFound />;

    return (
        <ItemDetailsLayout item={unit} civ={civ} renderVariation={(v) => <PhysicalVariationCard variation={v} civ={civ} />}>
            <AbilitiesSection abilities={itemsAffecting(abilities, unit as Aoe4UnifiedItem, civ)} civ={civ} />
            <ItemRows title="Technologies" items={itemsAffecting(technologies, unit as Aoe4UnifiedItem, civ)} civ={civ} />
        </ItemDetailsLayout>
    );
}

export function Aoe4BuildingDetails() {
    const { item: building, isLoading, civ } = useDetailParams('buildings');
    const abilities = useAoe4Abilities().data;
    const technologies = useAoe4Technologies().data;
    const units = useAoe4Units().data;
    if (isLoading) return <ActivityIndicator className="mt-8" />;
    if (!building) return <NotFound />;

    const producedHere = <T extends Aoe4Item>(items: Aoe4Explorer.UnifiedItem<T>[] | undefined) =>
        orderBy(
            (items ?? []).filter((item) => item.variations.some((v) => v.civs.includes(civ) && v.producedBy.includes(building.id))),
            [(i) => i.minAge, (i) => i.name]
        ) as Aoe4UnifiedItem[];

    return (
        <ItemDetailsLayout item={building} civ={civ} renderVariation={(v) => <PhysicalVariationCard variation={v} civ={civ} />}>
            <ItemRows title="Units" items={producedHere(units)} civ={civ} />
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
