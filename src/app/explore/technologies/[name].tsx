import React from 'react';
import { View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import {
    ageUpgrades,
    Building,
    buildings,
    getAffectedBuildingInfos,
    getAffectedUnitInfos,
    getAgeFromAgeTech,
    getAgeName,
    getTechData,
    getTechDescription,
    getTechName,
    getUpgradeFormatted,
    getUpgradeList,
    getWikiLinkForTech,
    keysOf,
    Other,
    sortResources,
    Tech,
    techs,
    techsAffectingAllUnits,
    Unit,
    units,
} from '@nex/data';
import Fandom from '../../../view/components/fandom';
import { MyText } from '../../../view/components/my-text';
import { capitalize } from 'lodash';
import CivAvailability from '../../../view/components/civ-availability';
import Space from '../../../view/components/space';
import { getOtherIcon } from '../../../helper/units';
import { UnitCompBig } from '../../../view/unit/unit-comp';
import { BuildingCompBig } from '../../../view/building/building-comp';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { HeaderTitle } from '@app/components/header-title';
import { getTechIcon } from '@app/helper/techs';
import { useTranslation } from '@app/helper/translate';
import { Text } from '@app/components/text';

function capitalizeFirstLetter(string: string | number) {
    return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
}

export default function TechDetails() {
    const getTranslation = useTranslation();
    const { name } = useLocalSearchParams<{ name: Tech }>();
    const tech = name!;
    const data = getTechData(tech);
    const techInfo = techs[tech];

    const affectedUnitInfos = getAffectedUnitInfos(tech);
    const affectedBuildingInfos = getAffectedBuildingInfos(tech);
    // console.log(affectedUnitInfos);

    let affectedUnits: any[] = [];
    let affectedBuildings: any[] = [];
    if (['FeudalAge', 'CastleAge', 'ImperialAge'].includes(tech)) {
        const age = getAgeFromAgeTech(tech)!;
        affectedUnits = Object.entries(ageUpgrades)
            .filter(([unit, ageUpgrade]) => units[unit] && ageUpgrade![age])
            .map(([unit, ageUpgrade]) => getUpgradeFormatted(unit as Unit, age));
        affectedBuildings = Object.entries(ageUpgrades)
            .filter(([unit, ageUpgrade]) => buildings[unit] && ageUpgrade![age])
            .map(([unit, ageUpgrade]) => getUpgradeFormatted(unit as Building, age));
    }

    return (
        <ScrollView>
            <View className="flex-1 min-h-full p-5">
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <HeaderTitle
                                icon={getTechIcon(tech)}
                                title={getTechName(tech)}
                                subtitle={techInfo.civ ? techInfo.civ + ' ' + getTranslation('explore.techs.uniquetech') + ' (' + getAgeName(techInfo.age) + ')' : undefined}
                            />
                        ),
                    }}
                />
                <View className="flex-row mb-2 items-center gap-2">
                    {sortResources(keysOf(data.Cost)).map((res) => (
                        <View key={res} className="flex-row items-center gap-1">
                            <Image className="w-[22px] h-[22px]" source={getOtherIcon(res as Other)} />
                            <Text>{data.Cost[res]}</Text>
                        </View>
                    ))}
                    <Text>
                        {getTranslation('unit.stats.heading.researchedin')} {data.ResearchTime}s
                    </Text>
                </View>

                <Text>{getTechDescription(tech)}</Text>
                <Space />

                <CivAvailability tech={tech} />

                {!techsAffectingAllUnits.includes(tech) && affectedUnitInfos.length > 0 && (
                    <View>
                        <Space />
                        <MyText>Affected Units</MyText>
                        <Space />
                        {affectedUnitInfos.map((affectedUnit) => (
                            <UnitCompBig
                                key={affectedUnit.unitId}
                                unit={affectedUnit.unitId}
                                subtitle={getUpgradeList(tech, affectedUnit)
                                    .map((g) => g.name + ': ' + capitalizeFirstLetter(g.upgrades.join(', ')))
                                    .join('\n')}
                            />
                        ))}
                    </View>
                )}

                {!techsAffectingAllUnits.includes(tech) && affectedBuildingInfos.length > 0 && (
                    <View>
                        <Space />
                        <MyText>Affected Buildings</MyText>
                        <Space />
                        {affectedBuildingInfos.map((affectedBuilding) => (
                            <BuildingCompBig
                                key={affectedBuilding.buildingId}
                                building={affectedBuilding.buildingId}
                                subtitle={getUpgradeList(tech, affectedBuilding)
                                    .map((g) => g.name + ': ' + capitalizeFirstLetter(g.upgrades.join(', ')))
                                    .join('\n')}
                            />
                        ))}
                    </View>
                )}

                {affectedUnits.length > 0 && (
                    <View>
                        <Space />
                        <MyText>Affected Units</MyText>
                        <Space />
                        {affectedUnits.map((affectedUnit) => (
                            <UnitCompBig
                                key={affectedUnit.unitId}
                                unit={affectedUnit.unitId}
                                subtitle={affectedUnit.props.map((g: any) => g.name + ': +' + capitalizeFirstLetter(g.effect)).join('\n')}
                            />
                        ))}
                    </View>
                )}

                {affectedBuildings.length > 0 && (
                    <View>
                        <Space />
                        <MyText>Affected Buildings</MyText>
                        <Space />
                        {affectedBuildings.map((affectedBuilding) => (
                            <BuildingCompBig
                                key={affectedBuilding.unitId}
                                building={affectedBuilding.unitId}
                                subtitle={affectedBuilding.props.map((g: any) => g.name + ': +' + capitalize(g.effect)).join('\n')}
                            />
                        ))}
                    </View>
                )}

                <View className="flex-1" />
                <Fandom articleName={getTechName(tech)} articleLink={getWikiLinkForTech(tech)} />
            </View>
        </ScrollView>
    );
}
