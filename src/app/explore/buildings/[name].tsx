import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { getBuildingIcon } from '@app/helper/buildings';
import {
    Building,
    getBuildingDescription,
    getBuildingLineIdForBuilding,
    getBuildingName,
    getWikiLinkForBuilding,
} from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { BuildingStats } from '../../../view/building/building-stats';
import { BuildingUpgrades } from '../../../view/building/building-upgrades';
import CivAvailability from '../../../view/components/civ-availability';
import Fandom from '../../../view/components/fandom';
import Space from '../../../view/components/space';
import { Text } from '@app/components/text';

export default function BuildingDetails() {
    const { name } = useLocalSearchParams<{ name: Building }>();
    const building = name!;
    const buildingLineId = getBuildingLineIdForBuilding(building);
    return (
        <ScrollView>
            <View className="flex-1 min-h-full p-5">
                <Stack.Screen
                    options={{
                        headerTitle: () => <HeaderTitle icon={getBuildingIcon(building)} title={getBuildingName(building)} />,
                    }}
                />

                <Text>{getBuildingDescription(building)}</Text>
                <Space />

                <BuildingStats buildingId={building} />

                <BuildingUpgrades buildingLineId={buildingLineId} buildingId={building} />

                <CivAvailability building={building} />

                <View className="flex-1" />
                <Fandom articleName={getBuildingName(building)} articleLink={getWikiLinkForBuilding(building)} />
            </View>
        </ScrollView>
    );
}
