import { HeaderTitle } from '@app/components/header-title';
import { getUnitIcon } from '@app/helper/units';
import {
    getAbilityEnabledForAllCivs,
    getUnitDescription,
    getUnitLineIdForUnit,
    getUnitLineNameForUnit,
    getUnitName,
    getUnitUpgradeCost,
    getUnitUpgradeTime,
    getWikiLinkForUnit,
    Unit,
    unitLines,
} from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import CivAvailability from '../../../view/components/civ-availability';
import Fandom from '../../../view/components/fandom';
import Space from '../../../view/components/space';
import { Costs } from '../../../view/unit/unit-costs';
import UnitCounters from '../../../view/unit/unit-counters';
import UnitRelated from '../../../view/unit/unit-related';
import { UnitStats } from '../../../view/unit/unit-stats';
import { UnitUpgrades } from '../../../view/unit/unit-upgrades';
import { ScrollView } from '@app/components/scroll-view';
import { useTranslation } from '@app/helper/translate';
import { Text } from '@app/components/text';

export default function UnitDetails() {
    const getTranslation = useTranslation();
    const { name } = useLocalSearchParams<{ name: Unit }>();
    const unitName = name!;
    const unitLineId = getUnitLineIdForUnit(unitName);
    const unitLineName = getUnitLineNameForUnit(unitName);
    const unitLine = unitLines[unitLineId];

    // console.log('unitLine', unitLine);
    // console.log('unitLineId', unitLineId);
    // console.log('unitLineName', unitLineName);

    return (
        <ScrollView>
            <View className="flex-1 min-h-full p-5">
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <HeaderTitle
                                icon={getUnitIcon(unitName)}
                                title={getUnitName(unitName)}
                                subtitle={unitLine.civ ? unitLine.civ + ' ' + getTranslation('explore.units.uniqueunit') : undefined}
                            />
                        ),
                    }}
                />
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

                {!getAbilityEnabledForAllCivs({ unit: unitName }) && <CivAvailability unit={unitName} />}

                <View className="flex-1" />
                <Fandom articleName={getUnitName(unitName)} articleLink={getWikiLinkForUnit(unitName)} />
            </View>
        </ScrollView>
    );
}
