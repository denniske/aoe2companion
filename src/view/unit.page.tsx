import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {
    getEliteUniqueResearchIcon, getUnitDescription, getUnitIcon, getUnitLineIcon, getUnitLineName, getUnitName,
    IUnitLine, Unit, UnitLine, unitLines
} from "../helper/units";
import {getTechIcon, getTechName, Tech, techEffectDict} from "../helper/techs";
import {aoeCivKey} from "../data/data";
import {sortBy} from "lodash-es";
import {Civ} from "../helper/civs";


export function UnitDetails({unit}: {unit: UnitLine}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = unitLines[unit];
    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]);

    const developments = unitLine.units.filter((u, i) => i > 0);//.map(u => units[u]);

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

    groups = groups.filter(g => g.upgrades.length > 0);

    return (
        <View style={styles.detailsContainer}>
            {/*<View style={styles.row}>*/}
            {/*    <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>*/}
            {/*    <Text> {getUnitLineName(unit)}</Text>*/}
            {/*</View>*/}
            <Text style={styles.description}> {getUnitDescription(unitLines[unit].units[0])}</Text>
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

                                        {/*{getTechName(upgrade.tech)}*/}
                                        <Text style={styles.link} onPress={() => navigation.push('Tech', {tech: upgrade.tech!})}>{getTechName(upgrade.tech)}</Text>

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

            <View style={styles.expanded}/>
            <Text/>
            <Text/>
            <Text style={styles.copy}>
                <Text style={styles.copyText}>This article uses material from the "{getUnitLineName(unit)}" article on the </Text>
                <Text style={styles.copyLink} onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>Age of Empires II Wiki</Text>
                <Text style={styles.copyText}> at </Text>
                <Text style={styles.copyLink} onPress={() => Linking.openURL('https://www.fandom.com/')}>Fandom</Text>
                <Text style={styles.copyText}> and is licensed under the </Text>
                <Text style={styles.copyLink} onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/3.0/')}>Creative Commons Attribution-Share Alike License</Text>
                <Text style={styles.copyText}>.</Text>
            </Text>
        </View>
    );
}

export function UnitComp({unit}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <Text> {getUnitLineName(unit)}</Text>
            </View>
        </TouchableOpacity>
    );
}

function getUnitLineTitle(unitLine: IUnitLine) {
    // if (unitLine.unique) {
    //     return getUnitName(unitLine.units[0]);// + ' + Elite';
    // }
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function UnitCompBig({unit}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitLineIcon(unit)}/>
                <View style={styles.unitIconTitle}>
                    <Text> {getUnitLineName(unit)}</Text>
                    {
                        unitLines[unit].units.length > 1 && !unitLines[unit].unique &&
                        <Text numberOfLines={1} style={styles.small}> {getUnitLineTitle(unitLines[unit])}</Text>
                    }
                </View>
                {/*<Text> {getUnitLineName(unit)}</Text>*/}
            </View>
        </TouchableOpacity>
    );
}

export function UnitList() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civContainer}>
                {
                    sortBy(Object.keys(unitLines)).map(ul =>
                        <UnitCompBig key={ul} unit={ul}/>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function UnitPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Unit'>>();
    const unit = route.params?.unit as aoeCivKey;

    if (unit) {
        return <ScrollView><UnitDetails unit={unit} /></ScrollView>;
    }

    return <UnitList/>
}

const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
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
        minHeight: '100%',
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
        // flex: 1,
        // backgroundColor: 'yellow',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        padding: 20,
    },
    rowBig: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // width: 100,
        // backgroundColor: 'blue',
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
    unitIconBig: {
        width: 30,
        height: 30,
        // flex: 1,
        // marginRight: 5,
    },
    unitIconTitle: {
        // width: '100%',
        flex: 1,
        // marginLeft: 5,
        paddingLeft: 5,
        // backgroundColor: 'red',
    },
    link: {
        color: '#397AF9',
    },
    small: {
        fontSize: 12,
    },
    expanded: {
        flex: 1,
    },
    copy: {
        lineHeight: 16,
    },
    copyLink: {
        fontSize: 12,
        color: '#397AF9',
    },
    copyText: {
        fontSize: 12,
        marginBottom: 5,
    },
});
