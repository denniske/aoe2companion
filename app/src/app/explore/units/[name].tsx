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
    Unit,
    unitLines,
} from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { appVariants } from '../../../styles';
import { useTheme } from '../../../theming';
import { createStylesheet } from '../../../theming-new';
import CivAvailability from '../../../view/components/civ-availability';
import Fandom from '../../../view/components/fandom';
import { MyText } from '../../../view/components/my-text';
import Space from '../../../view/components/space';
import { Costs } from '../../../view/unit/unit-costs';
import UnitCounters from '../../../view/unit/unit-counters';
import UnitRelated from '../../../view/unit/unit-related';
import { UnitStats } from '../../../view/unit/unit-stats';
import { UnitUpgrades } from '../../../view/unit/unit-upgrades';
import { ScrollView } from '@app/components/scroll-view';
import { getTranslation } from '@app/helper/translate';

export default function UnitDetails() {
    const { name } = useLocalSearchParams<{ name: Unit }>();
    const unitName = name!;
    const appStyles = useTheme(appVariants);
    const styles = useStyles();
    const unitLineId = getUnitLineIdForUnit(unitName);
    const unitLineName = getUnitLineNameForUnit(unitName);
    const unitLine = unitLines[unitLineId];

    console.log('unitLine', unitLine);
    console.log('unitLineId', unitLineId);
    console.log('unitLineName', unitLineName);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <HeaderTitle
                                icon={getUnitIcon(unitName)}
                                title={getUnitName(unitName)}
                                subtitle={unitLine.civ ? unitLine.civ + ' unique unit' : undefined}
                            />
                        ),
                    }}
                />
                {getUnitUpgradeCost(unitName) && (
                    <View style={styles.costsRow}>
                        <MyText style={styles.description}>Upgrade cost </MyText>
                        <Costs costDict={getUnitUpgradeCost(unitName)!} />
                        <MyText style={styles.description}>
                            {getTranslation('unit.stats.heading.researchedin')} {getUnitUpgradeTime(unitName)}s
                        </MyText>
                    </View>
                )}

                <MyText style={styles.description}>{getUnitDescription(unitName)}</MyText>

                <Space />

                <UnitRelated unitId={unitName} />

                <UnitStats unitLineId={unitLineId} unitId={unitName} />

                <UnitCounters unitId={unitName} />

                <UnitUpgrades unitLineId={unitLineId} unitId={unitName} />

                {!getAbilityEnabledForAllCivs({ unit: unitName }) && <CivAvailability unit={unitName} />}

                <View style={appStyles.expanded} />
                <Fandom articleName={getUnitName(unitName)} />
            </View>
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },
        costsRow: {
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },

        description: {
            lineHeight: 20,
        },
        container: {
            // backgroundColor: 'yellow',
            flex: 1,
            minHeight: '100%',
            padding: 20,
        },
    })
);
