import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import {civs, getCivIcon} from "../helper/civs";
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import * as aoeData from "../data/data.json"
import {getString} from "../helper/strings";
import {getUnitLineIcon, getUnitLineName, UnitLine, unitLines} from "../helper/units";
import {getTechIcon, getTechName} from "../helper/techs";

type aoeStringKey = keyof typeof aoeData.strings;
type aoeCivKey = keyof typeof aoeData.civ_helptexts;

export function UnitDetails({unit}: {unit: UnitLine}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = unitLines[unit];

    const groups = [
        {
            name: 'Attack',
            prop: 'attack',
            upgrades: unitLine.upgrades.filter(u => 'attack' in u),
        },
        {
            name: 'Armor',
            prop: 'armor',
            upgrades: unitLine.upgrades.filter(u => 'armor' in u),
        },
        {
            name: 'Speed',
            prop: 'speed',
            upgrades: unitLine.upgrades.filter(u => 'speed' in u),
        },
        {
            name: 'Sight',
            prop: 'sight',
            upgrades: unitLine.upgrades.filter(u => 'sight' in u),
        },
        {
            name: 'Conversion Defense',
            prop: 'conversionDefense',
            upgrades: unitLine.upgrades.filter(u => 'conversionDefense' in u),
        },
        {
            name: 'Creation Speed',
            prop: 'creationSpeed',
            upgrades: unitLine.upgrades.filter(u => 'creationSpeed' in u),
        },
    ];

    // @ts-ignore
    return (
        <View style={styles.detailsContainer}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <Text> {getUnitLineName(unit)}</Text>
            </View>

            {
                groups.map(group =>
                    <View key={group.name}>
                        <View style={styles.row}>
                            <Text>{group.name}</Text>
                        </View>
                        {
                            group.upgrades.map(upgrade =>
                                <View style={styles.row} key={upgrade.tech}>
                                    <Image style={styles.unitIcon} source={getTechIcon(upgrade.tech)}/>
                                    <Text>
                                        {getTechName(upgrade.tech)}
                                        {upgrade[group.prop] ? ' (' + upgrade[group.prop] + ')' : ''}
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                )
            }

        </View>
    );
}

export default function UnitPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Unit'>>();
    const unit = route.params?.unit as aoeCivKey;

    return <UnitDetails unit={unit} />;
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
});
