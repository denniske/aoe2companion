import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {
    getEliteUniqueResearchIcon, getUnitIcon, getUnitLineIcon, getUnitLineName, getUnitName, UnitLine, unitLines, units
} from "../helper/units";
import {getTechIcon, getTechName, ITechEffect, Tech, techEffectDict, techs} from "../helper/techs";
import {aoeCivKey} from "../data/data";
import {groupBy} from "lodash-es";
import {Civ, civs} from "../helper/civs";


export function UnitDetails({unit}: {unit: UnitLine}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = unitLines[unit];
    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]);

    const developments = unitLine.units.filter((u, i) => i > 0);//.map(u => units[u]);

    // const mergeUpgradesOfSameGroup = (effects: ITechEffect[]): ITechEffect[] => {
    //     const groupedEffects = groupBy(effects, e => e.tech);
    //     return Object.entries(groupedEffects).map((tech, effectsForTech) => ({
    //         tech: tech,
    //         civ: Civ,
    //         effect: IEffect,
    //     }));
    // };

    let groups = [
        {
            name: 'Carry Capacity',
            prop: 'carryCapacity',
            upgrades: unitLineUpgrades.filter(u => 'carryCapacity' in u.effect),
        },
        {
            name: 'Gathering Speed',
            prop: 'gatheringSpeed',
            upgrades: unitLineUpgrades.filter(u => 'gatheringSpeed' in u.effect),
        },
        {
            name: 'Hit Points',
            prop: 'hitPoints',
            upgrades: unitLineUpgrades.filter(u => 'hitPoints' in u.effect),
        },
        {
            name: 'Attack',
            prop: 'attack',
            upgrades: unitLineUpgrades.filter(u => 'attack' in u.effect),
        },
        {
            name: 'Range',
            prop: 'range',
            upgrades: unitLineUpgrades.filter(u => 'range' in u.effect),
        },
        {
            name: 'Firing Rate',
            prop: 'firingRate',
            upgrades: unitLineUpgrades.filter(u => 'firingRate' in u.effect),
        },
        {
            name: 'Accuracy',
            prop: 'accuracy',
            upgrades: unitLineUpgrades.filter(u => 'accuracy' in u.effect),
        },
        {
            name: 'Armor',
            prop: 'armor',
            upgrades: unitLineUpgrades.filter(u => 'armor' in u.effect),
        },
        {
            name: 'Speed',
            prop: 'speed',
            upgrades: unitLineUpgrades.filter(u => 'speed' in u.effect),
        },
        {
            name: 'Sight',
            prop: 'sight',
            upgrades: unitLineUpgrades.filter(u => 'sight' in u.effect),
        },
        {
            name: 'Conversion Defense',
            prop: 'conversionDefense',
            upgrades: unitLineUpgrades.filter(u => 'conversionDefense' in u.effect),
        },
        {
            name: 'Creation Speed',
            prop: 'creationSpeed',
            upgrades: unitLineUpgrades.filter(u => 'creationSpeed' in u.effect),
        },
        {
            name: 'Capacity',
            prop: 'capacity',
            upgrades: unitLineUpgrades.filter(u => 'capacity' in u.effect),
        },
        {
            name: 'Other',
            prop: 'other',
            upgrades: unitLineUpgrades.filter(u => 'other' in u.effect),
        },
    ];

    // groups = groups.forEach(g => g.upgrades = mergeUpgradesOfSameGroup(g.upgrades));
    groups = groups.filter(g => g.upgrades.length > 0);

    return (
        <View style={styles.detailsContainer}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <Text> {getUnitLineName(unit)}</Text>
            </View>
            <Text/>
            {
                groups.map(group =>
                    <View key={group.name}>
                        <View style={styles.row}>
                            <Text>{group.name}</Text>
                        </View>
                        {
                            group.upgrades.map(upgrade =>
                                <View style={styles.row} key={upgrade.name}>
                                    <Image style={styles.unitIcon} source={getTechIcon(upgrade.tech)}/>
                                    <Text>
                                        {getTechName(upgrade.tech)}
                                        {upgrade.effect[group.prop] ? ' (' + upgrade.effect[group.prop] : ''}

                                        {
                                            upgrade.civ &&
                                            <>
                                                <Text>, only </Text>
                                                <Text style={styles.link} onPress={() => navigation.push('Civ', {civ: upgrade.civ!})}>{upgrade.civ}</Text>
                                            </>
                                        }

                                        {upgrade.effect[group.prop] ? ')' : ''}
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                )
            }
            {
                developments.length > 0 &&
                    <View>
                        <Text/>
                        <View style={styles.row}>
                            <Text>Upgrades</Text>
                        </View>
                        {
                            developments.map(unit =>
                                <View key={unit} style={styles.row}>
                                    <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(unit)}/>
                                    <Text> {getUnitName(unit)}</Text>
                                </View>
                            )
                        }
                    </View>
            }
        </View>
    );
}

export default function UnitPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Unit'>>();
    const unit = route.params?.unit as aoeCivKey;

    return <ScrollView><UnitDetails unit={unit} /></ScrollView>;
}

const styles = StyleSheet.create({
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        // marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
        textAlign: 'left',
        lineHeight: 20,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },

    icon: {
      width: 30,
      height: 30,
    },
    name: {
        textAlign: 'center',
        marginLeft: 15,
    },
    civBlock: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        marginHorizontal: 0,
        marginVertical: 5,
    },
    civContainer: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },

    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // width: 100,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    link: {
        color: '#397AF9',
    },
});
