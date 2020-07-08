import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    getEliteUniqueResearchIcon, getInferiorUnitLines, getUnitDescription, getUnitIcon, getUnitLineIcon, getUnitLineName,
    getUnitName, sortUnitCounter, Unit,
    UnitLine, unitLines
} from "../../helper/units";
import {getTechIcon, getTechName, Tech, techEffectDict} from "../../helper/techs";
import {Civ} from "../../helper/civs";
import {appStyles, linkColor} from "../styles";
import Fandom from "../components/fandom";


export default function UnitDetails({unitLineName}: {unitLineName: UnitLine}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = unitLines[unitLineName];
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

    const gotoCiv = (civ: Civ) => navigation.push('Civ', {civ: civ});
    const gotoUnit = (unit: Unit) => navigation.push('Unit', {unit: unit});
    const gotoTech = (tech: Tech) => navigation.push('Tech', {tech: tech});

    return (
        <View style={styles.container}>
            <Text style={styles.description}>{getUnitDescription(unitLines[unitLineName].units[0])}</Text>
            <Text/>

            {
                unitLine.counteredBy && (
                    <>
                        <View style={styles.row}>
                            <Text>Weak vs.</Text>
                        </View>
                        {
                            sortUnitCounter(unitLine.counteredBy).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <Text style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }

                        <Text/>
                        <View style={styles.row}>
                            <Text>Strong vs.</Text>
                        </View>
                        {
                            sortUnitCounter(getInferiorUnitLines(unitLineName)).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <Text style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </>
                )
            }

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
                                        <Text style={appStyles.link} onPress={() => gotoTech(upgrade.tech!)}>{getTechName(upgrade.tech)}</Text>

                                        {upgrade.effect[group.prop] ? ' (' + upgrade.effect[group.prop] : ''}

                                        {
                                            upgrade.civ &&
                                            <>
                                                <Text>, only </Text>
                                                <Text style={appStyles.link} onPress={() => gotoCiv(upgrade.civ!)}>{upgrade.civ}</Text>
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
            <Fandom articleName={getUnitLineName(unitLineName)}/>
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
});
