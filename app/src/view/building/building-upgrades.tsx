import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MyText } from '../components/my-text';
import {
    Civ,
    civs,
    civsAoeNet,
    effectNames,
    getCivHasTech,
    getEffectName,
    getTechName,
    getBuildingName,
    iconSmallHeight,
    iconSmallWidth,
    keysOf,
    Tech,
    techEffectDict,
    Building,
    BuildingLine,
    buildingLines,
} from '@nex/data';
import React from 'react';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import Space from '../components/space';
import { getTechIcon } from '../../helper/techs';
import { getEliteUniqueResearchIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { getTranslation } from '../../helper/translate';
import { Image } from 'expo-image';
import { getBuildingIcon } from '../../helper/buildings';
import { router } from 'expo-router';

interface Props {
    buildingLineId: BuildingLine;
    buildingId: Building;
}

export function BuildingUpgrades({ buildingLineId, buildingId }: Props) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);

    const buildingLine = buildingLines[buildingLineId];

    const buildingLineUpgrades = buildingLine.upgrades.map((u) => techEffectDict[u]).filter((u) => !u.building || u.building == buildingId);

    const buildingIndex = buildingLine.buildings.indexOf(buildingId);

    let upgradedFrom = buildingIndex > 0 ? buildingLine.buildings[buildingIndex - 1] : null;
    let upgradedToList = buildingIndex < buildingLine.buildings.length - 1 ? [buildingLine.buildings[buildingIndex + 1]] : [];

    let groups = keysOf(effectNames).map((effect) => ({
        name: getEffectName(effect),
        prop: effect,
        upgrades: buildingLineUpgrades.filter((u) => effect in u.effect),
    }));

    groups = groups.filter((g) => g.upgrades.length > 0);

    const gotoCiv = (civ: Civ) => router.push(`/explore/civilizations/${civ}`);
    const gotoBuilding = (building: Building) => router.push(`/explore/buildings/${building}`);
    const gotoTech = (tech: Tech) => router.push(`/explore/technologies/${tech}`);

    // const { match, player } = useSelector(state => state.ingame ?? {});

    // console.log('player', player);

    const hasTech = (tech: Tech) => {
        return true;
        // if (!player) return true;
        // console.log('hasTech', tech, civsAoeNet[player.civ], getCivHasTech(civsAoeNet[player.civ], tech));
        // return getCivHasTech(civsAoeNet[player.civ], tech);
    };

    const hasUpgrades = groups.some((g) => g.upgrades.length > 0);

    if (!hasUpgrades) return <View></View>;

    return (
        <View>
            <View style={styles.row}>
                <MyText style={styles.header1}>{getTranslation('unit.heading.upgrades')}</MyText>
            </View>

            {groups.map((group) => (
                <View key={group.name}>
                    <View style={styles.row}>
                        <MyText style={styles.header2}>{group.name}</MyText>
                    </View>
                    {group.upgrades.map((upgrade) => (
                        <View style={[styles.row, { opacity: hasTech(upgrade.tech!) ? 1 : 0.5 }]} key={upgrade.name}>
                            <Image style={styles.buildingIcon} source={getTechIcon(upgrade.tech!)} />
                            <MyText style={styles.buildingDesc}>
                                <MyText style={appStyles.link} onPress={() => gotoTech(upgrade.tech!)}>
                                    {getTechName(upgrade.tech!)}
                                </MyText>
                                {(upgrade.effect[group.prop] || upgrade.civ) && (
                                    <MyText size="footnote">
                                        {' ('}
                                        {upgrade.effect[group.prop] ? upgrade.effect[group.prop] : ''}
                                        {upgrade.effect[group.prop] && upgrade.civ ? ', ' : ''}
                                        {upgrade.civ && (
                                            <>
                                                <MyText size="footnote">only </MyText>
                                                <MyText size="footnote" style={appStyles.link} onPress={() => gotoCiv(upgrade.civ!)}>
                                                    {upgrade.civ}
                                                </MyText>
                                            </>
                                        )}
                                        {')'}
                                    </MyText>
                                )}
                            </MyText>
                        </View>
                    ))}
                </View>
            ))}
            {upgradedFrom && (
                <View>
                    <Space />
                    <View style={styles.row}>
                        <MyText style={styles.header2}>{getTranslation('unit.heading.upgradedfrom')}</MyText>
                    </View>
                    <TouchableOpacity onPress={() => gotoBuilding(upgradedFrom!)}>
                        <View style={styles.row}>
                            <Image
                                style={styles.buildingIcon}
                                source={buildingLine.unique ? getEliteUniqueResearchIcon() : getBuildingIcon(upgradedFrom)}
                            />
                            <MyText style={styles.buildingDesc}>{getBuildingName(upgradedFrom)}</MyText>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            {upgradedToList.length > 0 && (
                <View>
                    <Space />
                    <View style={styles.row}>
                        <MyText style={styles.header2}>{getTranslation('unit.heading.upgradedto')}</MyText>
                    </View>
                    {upgradedToList.map((upgradedTo) => (
                        <TouchableOpacity key={upgradedTo} disabled={buildingLine.unique} onPress={() => gotoBuilding(upgradedTo)}>
                            <View style={styles.row}>
                                <Image
                                    style={styles.buildingIcon}
                                    source={buildingLine.unique ? getEliteUniqueResearchIcon() : getBuildingIcon(upgradedTo)}
                                />
                                <MyText style={styles.buildingDesc}>{getBuildingName(upgradedTo)}</MyText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        description: {
            lineHeight: 20,
        },
        container: {
            flex: 1,
            minHeight: '100%',
            padding: 20,
        },
        row: {
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },

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
        },

        checkboxCell: {
            flex: 1,
            marginLeft: -6,
        },
        checkboxDesc: {
            flex: 11,
            marginLeft: 4,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
        header1: {
            marginTop: 10,
            fontSize: 18,
            fontWeight: '500',
        },
        header2: {
            fontSize: 15,
            marginVertical: 5,
        },
        buildingIcon: {
            width: iconSmallWidth,
            height: iconSmallHeight,
            marginRight: 5,
        },
        buildingDesc: {
            lineHeight: 20,
            flex: 1,
        },
    } as const)
);
