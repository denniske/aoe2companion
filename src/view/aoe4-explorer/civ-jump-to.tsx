import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { Aoe4UnifiedItem, useAoe4Buildings, useAoe4Technologies, useAoe4Units } from '@app/queries/aoe4-explorer';
import { Aoe4Explorer } from '@nex/data';
import { Link } from 'expo-router';
import { orderBy } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { ItemIcon, itemHref, unitGroup, unitGroups } from './shared';

const abbrByCiv = Object.fromEntries(Object.entries(Aoe4Explorer.aoe4CivByAbbr).map(([abbr, civ]) => [civ, abbr]));

/**
 * The civ page's "Jump to", as on aoe4world: the items the data marks `unique` for the civ (its own
 * units, landmarks/buildings and technologies, including civ-specific versions of shared units).
 */
export const Aoe4CivJumpTo: React.FC<{ civ: string }> = ({ civ: civEnum }) => {
    const civ = abbrByCiv[civEnum];
    const units = useAoe4Units().data;
    const buildings = useAoe4Buildings().data;
    const technologies = useAoe4Technologies().data;
    if (!civ) return null;

    const unique = (items: Aoe4UnifiedItem[] | undefined) => (items ?? []).filter((item) => item.unique && item.civs.includes(civ));
    const groups = [
        orderBy(unique(units as Aoe4UnifiedItem[]), [(u) => unitGroups.indexOf(unitGroup(u)), (u) => u.minAge, (u) => u.name]),
        orderBy(unique(buildings as Aoe4UnifiedItem[]), [(b) => b.minAge, (b) => b.name]),
        orderBy(unique(technologies as Aoe4UnifiedItem[]), [(t) => t.minAge, (t) => t.name]),
    ].filter((group) => group.length);
    if (!groups.length) return null;

    return (
        <View className="gap-3 mb-2">
            <Text variant="header-sm" color="subtle">
                Jump to
            </Text>
            {groups.map((items, i) => (
                <View key={i} className="flex-row flex-wrap gap-y-3">
                    {items.map((item) => (
                        <Link key={item.id} href={itemHref(item, civ) as any} asChild>
                            <PressableOpacity className="w-1/2 md:w-1/4 xl:w-1/5 flex-row items-center gap-2 pr-2">
                                <ItemIcon icon={item.icon} type={item.type} />
                                <Text variant="label-sm" className="flex-1">
                                    {item.name}
                                </Text>
                            </PressableOpacity>
                        </Link>
                    ))}
                </View>
            ))}
        </View>
    );
};
