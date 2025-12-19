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
    getUnitName,
    getUnitUpgradeCost,
    iconSmallHeight,
    iconSmallWidth,
    keysOf,
    Tech,
    techEffectDict,
    Unit,
    UnitLine,
    unitLines,
} from '@nex/data';
import React from 'react';
import { useTheme } from '../../theming';
import { appVariants } from '../../styles';
import Space from '../components/space';
import { Costs } from './unit-costs';
import { getTechIcon } from '../../helper/techs';
import { getEliteUniqueResearchIcon, getUnitIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { Image } from '@/src/components/uniwind/image';
import { router } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { getAbilityIcon, getAbilityName, getAbilityNavCallback } from '@app/view/components/tech-tree';

interface Props {
    unitLineId: UnitLine;
    unitId: Unit;
}

export function UnitUpgrades({ unitLineId, unitId }: Props) {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const appStyles = useTheme(appVariants);

    const unitLine = unitLines[unitLineId];

    const unitLineUpgrades = unitLine.upgrades
        .map((u) => techEffectDict[u])
        .filter((u) => !u.onlyUnits || u.onlyUnits.includes(unitId));
        // Note: Centurion effect is sorted out by the filter (maybe change this)
        // .filter((u) => !u.unit || u.unit == unitId);

    const unitIndex = unitLine.units.indexOf(unitId);

    let upgradedFrom = unitIndex > 0 ? unitLine.units[unitIndex - 1] : null;
    if (unitId === 'Savar') {
        upgradedFrom = 'Cavalier' as Unit;
    }
    if (unitId === 'WingedHussar') {
        upgradedFrom = 'LightCavalry' as Unit;
    }
    if (unitId === 'Legionary') {
        upgradedFrom = 'LongSwordsman' as Unit;
    }

    let upgradedToList = unitIndex < unitLine.units.length - 1 ? [unitLine.units[unitIndex + 1]] : [];
    if (unitId === 'Cavalier') {
        upgradedToList = ['Paladin', 'Savar'];
    }
    if (unitId === 'Paladin') {
        upgradedToList = [];
    }
    if (unitId === 'LightCavalry') {
        upgradedToList = ['Hussar', 'WingedHussar'];
    }
    if (unitId === 'Hussar') {
        upgradedToList = [];
    }
    if (unitId === 'LongSwordsman') {
        upgradedToList = ['TwoHandedSwordsman', 'Legionary'];
    }

    let groups = keysOf(effectNames).map((effect) => ({
        name: getEffectName(effect),
        prop: effect,
        upgrades: unitLineUpgrades.filter((u) => effect in u.effect),
    }));

    groups = groups.filter((g) => g.upgrades.length > 0);

    const gotoCiv = (civ: Civ) => router.push(`/explore/civilizations/${civ}`);
    const gotoUnit = (unit: Unit) => router.push(`/explore/units/${unit}`);
    const gotoTech = (tech: Tech) => router.push(`/explore/technologies/${tech}`);

    // const { match, player } = useSelector(state => state.ingame ?? {});

    // console.log('player', player);

    const hasTech = (tech: Tech) => {
        return true;
        // if (!player) return true;
        // console.log('hasTech', tech, civsAoeNet[player.civ], getCivHasTech(civsAoeNet[player.civ], tech));
        // return getCivHasTech(civsAoeNet[player.civ], tech);
    };

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
                            <Image style={styles.unitIcon} source={getAbilityIcon(upgrade)} />

                            <MyText style={styles.unitDesc}>
                                <MyText style={appStyles.link} className="hover:underline" onPress={getAbilityNavCallback(upgrade)}>
                                    {getAbilityName(upgrade)}
                                </MyText>

                                {(upgrade.effect[group.prop] || upgrade.civ) && (
                                    <MyText size="footnote">
                                        {' ('}
                                        {upgrade.effect[group.prop] ? upgrade.effect[group.prop] : ''}
                                        {upgrade.effect[group.prop] && upgrade.civ ? ', ' : ''}
                                        {upgrade.civ && (
                                            <>
                                                <MyText size="footnote">only </MyText>
                                                <MyText
                                                    size="footnote"
                                                    style={appStyles.link}
                                                    className="hover:underline"
                                                    onPress={() => gotoCiv(upgrade.civ!)}
                                                >
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
                    <TouchableOpacity onPress={() => gotoUnit(upgradedFrom!)}>
                        <View style={styles.row}>
                            <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedFrom)} />
                            <MyText style={styles.unitDesc}>{getUnitName(upgradedFrom)}</MyText>
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
                        <TouchableOpacity key={upgradedTo} disabled={unitLine.unique} onPress={() => gotoUnit(upgradedTo)}>
                            <View style={styles.row}>
                                <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedTo)} />
                                <MyText style={styles.unitDesc}>{getUnitName(upgradedTo)}</MyText>
                                {getUnitUpgradeCost(upgradedTo) && <Costs costDict={getUnitUpgradeCost(upgradedTo)!} />}
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
        unitIcon: {
            width: iconSmallWidth,
            height: iconSmallHeight,
            marginRight: 5,
        },
        unitDesc: {
            lineHeight: 20,
            flex: 1,
        },
    } as const)
);
