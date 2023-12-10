import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Image} from 'expo-image';
import {
    getAffectedUnitInfos, getTechData, getTechDescription, getTechName, getUpgradeList, getUpgradeFormatted, keysOf,
    Other,
    sortResources,
    Tech, techsAffectingAllUnits, Unit, units, getAgeFromAgeTech, buildings, Building, getAffectedBuildingInfos
} from "@nex/data";
import Fandom from "../components/fandom";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {appVariants} from "../../styles";
import {capitalize} from 'lodash';
import CivAvailability from "../components/civ-availability";
import Space from "../components/space";
import {getOtherIcon} from "../../helper/units";
import {useTheme} from '../../theming';
import {UnitCompBig} from '../unit/unit-comp';
import {getTranslation} from '../../helper/translate';
import {ageUpgrades} from '@nex/data';
import {BuildingCompBig} from '../building/building-comp';

function capitalizeFirstLetter(string: string | number) {
    return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
}

export default function TechDetails({tech}: {tech: Tech}) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const data = getTechData(tech);

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
        <View style={styles.container}>
            <View style={styles.costsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <View key={res} style={styles.resRow}>
                            <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                            <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>
                        </View>
                    )
                }
                <MyText style={styles.description}>{getTranslation('unit.stats.heading.researchedin')} {data.ResearchTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getTechDescription(tech)}</MyText>
            <Space/>

            <CivAvailability tech={tech}/>

            {
                !techsAffectingAllUnits.includes(tech) && affectedUnitInfos.length > 0 &&
                <View>
                    <Space/>
                    <MyText>Affected Units</MyText>
                    <Space/>
                    {
                        affectedUnitInfos.map(affectedUnit =>
                            <UnitCompBig key={affectedUnit.unitId} unit={affectedUnit.unitId} subtitle={
                                getUpgradeList(tech, affectedUnit).map(g => g.name + ': ' + capitalizeFirstLetter(g.upgrades.join(', '))).join('\n')
                            }/>
                        )
                    }
                </View>
            }

            {
                !techsAffectingAllUnits.includes(tech) && affectedBuildingInfos.length > 0 &&
                <View>
                    <Space/>
                    <MyText>Affected Buildings</MyText>
                    <Space/>
                    {
                        affectedBuildingInfos.map(affectedBuilding =>
                            <BuildingCompBig key={affectedBuilding.buildingId} building={affectedBuilding.buildingId} subtitle={
                                getUpgradeList(tech, affectedBuilding).map(g => g.name + ': ' + capitalizeFirstLetter(g.upgrades.join(', '))).join('\n')
                            }/>
                        )
                    }
                </View>
            }

            {
                affectedUnits.length > 0 &&
                <View>
                    <Space/>
                    <MyText>Affected Units</MyText>
                    <Space/>
                    {
                        affectedUnits.map(affectedUnit =>
                            <UnitCompBig key={affectedUnit.unitId} unit={affectedUnit.unitId} subtitle={
                                affectedUnit.props.map((g: any) => g.name + ': +' + capitalizeFirstLetter(g.effect)).join('\n')
                            }/>
                        )
                    }
                </View>
            }

            {
                affectedBuildings.length > 0 &&
                <View>
                    <Space/>
                    <MyText>Affected Buildings</MyText>
                    <Space/>
                    {
                        affectedBuildings.map(affectedBuilding =>
                            <BuildingCompBig key={affectedBuilding.unitId} building={affectedBuilding.unitId} subtitle={
                                affectedBuilding.props.map((g: any) => g.name + ': +' + capitalize(g.effect)).join('\n')
                            }/>
                        )
                    }
                </View>
            }

            <View style={appStyles.expanded}/>
            <Fandom articleName={getTechName(tech)}/>
        </View>
    );
}


const useStyles = createStylesheet((theme) => StyleSheet.create({
    resRow: {
        flexDirection: 'row',
        // marginBottom: 5,
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
        marginBottom: 10,
        alignItems: 'center',
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
}));
