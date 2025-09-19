import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { getBuildingIcon } from '@app/helper/buildings';
import { Building, getBuildingData, getBuildingDescription, getBuildingLineIdForBuilding, getBuildingName, getWikiLinkForBuilding } from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { appVariants } from '../../../styles';
import { useTheme } from '../../../theming';
import { BuildingStats } from '../../../view/building/building-stats';
import { BuildingUpgrades } from '../../../view/building/building-upgrades';
import CivAvailability from '../../../view/components/civ-availability';
import Fandom from '../../../view/components/fandom';
import { MyText } from '../../../view/components/my-text';
import Space from '../../../view/components/space';

export default function BuildingDetails() {
    const { name } = useLocalSearchParams<{ name: Building }>();
    const building = name!;
    const appStyles = useTheme(appVariants);
    const data = getBuildingData(building);
    const buildingLineId = getBuildingLineIdForBuilding(building);
    return (
        <ScrollView>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        headerTitle: () => <HeaderTitle icon={getBuildingIcon(building)} title={getBuildingName(building)} />,
                    }}
                />
                {/*<View style={styles.costsRow}>*/}
                {/*    {*/}
                {/*        sortResources(keysOf(data.Cost)).map(res =>*/}
                {/*            <View key={res} style={styles.resRow}>*/}
                {/*                <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>*/}
                {/*                <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>*/}
                {/*            </View>*/}
                {/*        )*/}
                {/*    }*/}
                {/*    <MyText style={styles.description}>{getTranslation('unit.stats.heading.builtin')} {data.TrainTime}s</MyText>*/}
                {/*</View>*/}

                <MyText style={styles.description}>{getBuildingDescription(building)}</MyText>
                <Space />

                <BuildingStats buildingId={building} />

                <BuildingUpgrades buildingLineId={buildingLineId} buildingId={building} />

                <CivAvailability building={building} />

                <View style={appStyles.expanded} />
                <Fandom articleName={getBuildingName(building)} articleLink={getWikiLinkForBuilding(building)} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    resRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    resIcon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
    resDescription: {
        marginRight: 10,
    },

    costsRow: {
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },

    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        padding: 20,
    },
});
