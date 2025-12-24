import { HeaderTitle } from '@app/components/header-title';
import { ScrollView } from '@app/components/scroll-view';
import { getBuildingIcon } from '@app/helper/buildings';
import { Building, getBuildingDescription, getBuildingLineIdForBuilding, getBuildingName, getWikiLinkForBuilding, hasBuildingLine } from '@nex/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { BuildingStats } from '../../../view/building/building-stats';
import { BuildingUpgrades } from '../../../view/building/building-upgrades';
import CivAvailability from '../../../view/components/civ-availability';
import Fandom from '../../../view/components/fandom';
import Space from '../../../view/components/space';
import { Text } from '@app/components/text';
import NotFound from '@app/app/+not-found';
import { Card } from '@app/components/card';

export default function BuildingDetails() {
    const { name: building } = useLocalSearchParams<{ name: Building }>();
    if (!hasBuildingLine(building)) {
        return <NotFound />;
    }
    const buildingLineId = getBuildingLineIdForBuilding(building);
    return (
        <ScrollView>
            <View className="flex-1 min-h-full p-5">
                <Stack.Screen
                    options={{
                        title: getBuildingName(building),
                        headerTitle: () => <HeaderTitle icon={getBuildingIcon(building)} title={getBuildingName(building)} />,
                    }}
                />

                <View className="lg:flex-row lg:gap-6 lg:items-start">
                    <View className="lg:flex-1">
                        <Text>{getBuildingDescription(building)}</Text>

                        <Space />

                        <BuildingStats buildingId={building} />

                        <BuildingUpgrades buildingLineId={buildingLineId} buildingId={building} />
                    </View>

                    <Card direction="vertical" className="w-sm hidden lg:flex pt-2!">
                        <CivAvailability building={building} />
                    </Card>
                </View>

                <View className="flex lg:hidden">
                    <CivAvailability building={building} />
                </View>

                <View className="flex-1" />
                <Fandom articleName={getBuildingName(building)} articleLink={getWikiLinkForBuilding(building)} />
            </View>
        </ScrollView>
    );
}
