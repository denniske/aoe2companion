import React from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    getEliteUniqueResearchIcon, getUnitDescription, getUnitIcon, getUnitLineName, getUnitName, UnitLine, unitLines
} from "../../helper/units";
import {getTechIcon, getTechName, Tech, techEffectDict} from "../../helper/techs";
import {Civ} from "../../helper/civs";
import {appStyles, linkColor} from "../styles";


export default function UnitDetails({unit}: {unit: UnitLine}) {
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
        <View style={styles.container}>
            {/*<View style={styles.row}>*/}
            {/*    <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>*/}
            {/*    <Text> {getUnitLineName(unit)}</Text>*/}
            {/*</View>*/}
            <Text style={styles.description}>{getUnitDescription(unitLines[unit].units[0])}</Text>
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
                                    <Text style={styles.unitDesc}>

                                        {/*{getTechName(upgrade.tech)}*/}
                                        <Text style={appStyles.link} onPress={() => navigation.push('Tech', {tech: upgrade.tech!})}>{getTechName(upgrade.tech)}</Text>

                                        {upgrade.effect[group.prop] ? ' (' + upgrade.effect[group.prop] : ''}

                                        {
                                            upgrade.civ &&
                                            <>
                                                <Text>, only </Text>
                                                <Text style={appStyles.link} onPress={() => navigation.push('Civ', {civ: upgrade.civ!})}>{upgrade.civ}</Text>
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

            <View style={appStyles.expanded}/>
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

const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: 'white',
        padding: 20,
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    unitDesc: {
        lineHeight: 20,
    },
    copy: {
        lineHeight: 16,
    },
    copyLink: {
        fontSize: 12,
        color: linkColor,
    },
    copyText: {
        fontSize: 12,
        marginBottom: 5,
    },
});
