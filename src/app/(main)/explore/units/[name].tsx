import { HeaderTitle } from '@app/components/header-title';
import { getUnitIcon } from '@app/helper/units';
import {
    getAbilityEnabledForAllCivs,
    getUnitDescription,
    getUnitLineIdForUnit,
    getUnitName,
    getUnitUpgradeCost,
    getUnitUpgradeTime,
    getWikiLinkForUnit,
    hasUnitLine,
    Unit,
    unitLines,
} from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import CivAvailability from '../../../../view/components/civ-availability';
import Fandom from '../../../../view/components/fandom';
import Space from '../../../../view/components/space';
import { Costs } from '../../../../view/unit/unit-costs';
import UnitCounters from '../../../../view/unit/unit-counters';
import UnitRelated from '../../../../view/unit/unit-related';
import { UnitStats } from '../../../../view/unit/unit-stats';
import { UnitUpgrades } from '../../../../view/unit/unit-upgrades';
import { ScrollView } from '@app/components/scroll-view';
import { useTranslation } from '@app/helper/translate';
import { Text } from '@app/components/text';
import NotFound from '@app/app/(main)/+not-found';
import { Card } from '@app/components/card';

export default function UnitDetails() {
    const getTranslation = useTranslation();
    const { name: unitName } = useLocalSearchParams<{ name: Unit }>();

    if (!hasUnitLine(unitName)) {
        return <NotFound />;
    }

    const unitLineId = getUnitLineIdForUnit(unitName);
    const unitLine = unitLines[unitLineId];

    return (
        <ScrollView>
            <View className="flex-1 min-h-full p-5">
                <Stack.Screen
                    options={{
                        title: getUnitName(unitName),
                        headerTitle: () => (
                            <HeaderTitle
                                icon={getUnitIcon(unitName)}
                                title={getUnitName(unitName)}
                                subtitle={unitLine.civ ? unitLine.civ + ' ' + getTranslation('explore.units.uniqueunit') : undefined}
                            />
                        ),
                    }}
                />

                <View className="lg:flex-row lg:gap-6 lg:items-start">
                    <View className="lg:flex-1">
                        {getUnitUpgradeCost(unitName) && (
                            <View className="flex-row mb-2 items-center gap-2">
                                <Text>Upgrade cost </Text>
                                <Costs costDict={getUnitUpgradeCost(unitName)!} />
                                <Text>
                                    {getTranslation('unit.stats.heading.researchedin')} {getUnitUpgradeTime(unitName)}s
                                </Text>
                            </View>
                        )}

                        <Text>{getUnitDescription(unitName)}</Text>

                        <Space />

                        <UnitRelated unitId={unitName} />

                        <UnitStats unitLineId={unitLineId} unitId={unitName} />

                        <UnitCounters unitId={unitName} />

                        <UnitUpgrades unitLineId={unitLineId} unitId={unitName} />
                    </View>

                    <Card direction="vertical" className="w-sm hidden lg:flex pt-2!">
                        <CivAvailability unit={unitName} />
                    </Card>
                </View>

                <View className="flex lg:hidden">{!getAbilityEnabledForAllCivs({ unit: unitName }) && <CivAvailability unit={unitName} />}</View>

                <View className="flex-1" />
                <Fandom articleName={getUnitName(unitName)} articleLink={getWikiLinkForUnit(unitName)} />
            </View>
        </ScrollView>
    );
}
