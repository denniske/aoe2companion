import React, {useState} from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    attackClasses,
    getEliteUniqueResearchIcon, getInferiorUnitLines, getOtherIcon, getUnitClassName, getUnitData, getUnitDescription,
    getUnitIcon,
    getUnitLineIcon,
    getUnitLineName,
    getUnitName, IUnitInfo, Other, sortResources, sortUnitCounter, Unit, UnitClassNumber,
    UnitLine, unitLines
} from "../../helper/units";
import {getTechIcon, getTechName, Tech, techEffectDict} from "../../helper/techs";
import {Civ} from "../../helper/civs";
import {appStyles, linkColor} from "../styles";
import Fandom from "../components/fandom";
import {Button} from "react-native-paper";
import {keysOf} from "../../helper/util";


export default function UnitDetails({unitLineName}: {unitLineName: UnitLine}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = unitLines[unitLineName];
    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]);

    const developments = unitLine.units.filter((u, i) => i > 0);//.map(u => units[u]);

    const [statsVisible, setStatsVisible] = useState(true);

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

    const baseUnit = unitLines[unitLineName].units[0];
    const eliteUnit = unitLine.unique ? unitLines[unitLineName].units[1] : null;
    const data = getUnitData(baseUnit);
    const eliteData = eliteUnit ? getUnitData(eliteUnit) : null;

    // const getValue = (key: keyof IUnitInfo) => {
    //     if (eliteData && eliteData[key] > 0) {
    //         return (
    //             <>
    //                 <Text>{data[key]}, {eliteData[key]} (elite)</Text>
    //             </>
    //         );
    //     } else {
    //         return (
    //             <>
    //                 <Text>{data[key]}</Text>
    //             </>
    //         );
    //     }
    // };

    const getValueByPath = (path: (x: IUnitInfo) => any, formatter: (x: number) => string = x => x.toString()) => {
        console.log("bypath", path(data));
        if (eliteData && path(eliteData) !== path(data)) {
            return (
                <>
                    <Text>{formatter(path(data))}, {formatter(path(eliteData))} </Text>
                    <Text style={styles.small}>(elite)</Text>
                </>
            );
        } else {
            return (
                <>
                    <Text>{formatter(path(data))}</Text>
                </>
            );
        }
    };

    const getValue = (key: keyof IUnitInfo) => {
        return getValueByPath((x: IUnitInfo) => x[key]);
    };

    const getAttackValue = (unitClassNumber: UnitClassNumber) => {
        return getValueByPath((x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount);
    };

    const getAttackBonusValue = (unitClassNumber: UnitClassNumber) => {
        return getValueByPath((x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount, x => '+'+x);
    };

    const getArmourValue = (unitClassNumber: UnitClassNumber) => {
        return getValueByPath((x: IUnitInfo) => x.Armours.find(a => a.Class === unitClassNumber)?.Amount, x => '+'+x);
    };

    return (
        <View style={styles.container}>
            <View style={styles.statsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <View style={styles.resRow}>
                            <Image style={styles.unitIcon} source={getOtherIcon(res as Other)}/>
                            <Text style={styles.resDescription}>{data.Cost[res]}</Text>
                        </View>
                    )
                }
                <Text style={styles.description}>Trained in {data.TrainTime}s</Text>
            </View>

            <Text style={styles.description}>{getUnitDescription(baseUnit)}</Text>
            <Text/>

            {/*<View style={styles.statsRow}>*/}
            {/*    <Button*/}
            {/*        labelStyle={{fontSize: 13, marginVertical: 0}}*/}
            {/*        contentStyle={{height: 22}}*/}
            {/*        onPress={() => setStatsVisible(true)}*/}
            {/*        mode="contained"*/}
            {/*        compact*/}
            {/*        uppercase={false}*/}
            {/*        dark={true}*/}
            {/*    >*/}
            {/*        Show more*/}
            {/*    </Button>*/}
            {/*</View>*/}

            {
                statsVisible &&
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Hit Points</Text>
                        <Text style={styles.cellValue}>{getValue('HP')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Attack</Text>
                        <Text style={styles.cellValue}>
                            {
                                data.Attacks
                                    .filter(a => attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)))
                                    .map(a =>
                                        <Text>{getAttackValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</Text>
                                    )
                            }
                        </Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Attack Bonuses</Text>
                        <View style={styles.cellValue}>
                            {
                                data.Attacks
                                    .filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)))
                                    .map(a =>
                                        <Text>{getAttackBonusValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</Text>
                                    )
                            }
                        </View>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Rate of Fire</Text>
                        <Text style={styles.cellValue}>{getValue('ReloadTime')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Frame Delay</Text>
                        <Text style={styles.cellValue}>{getValue('FrameDelay')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Range</Text>
                        <Text style={styles.cellValue}>{getValue('Range')}</Text>
                    </View>
                    {
                        data.MinRange > 0 &&
                        <View style={styles.statsRow2}>
                            <Text style={styles.cellName}>Minimum Range</Text>
                            <Text style={styles.cellValue}>{getValue('MinRange')}</Text>
                        </View>
                    }
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Accuracy</Text>
                        <Text style={styles.cellValue}>{getValue('AccuracyPercent')}%</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Melee Armour</Text>
                        <Text style={styles.cellValue}>{getValue('MeleeArmor')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Pierce Armour</Text>
                        <Text style={styles.cellValue}>{getValue('PierceArmor')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Armor Classes</Text>
                        <View style={styles.cellValue}>
                            {
                                data.Armours
                                    .filter(a => (a.Amount > 0 || a.Class === 19) && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)))
                                    .map(a =>
                                        <Text>{getArmourValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</Text>
                                    )
                            }
                        </View>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Speed</Text>
                        <Text style={styles.cellValue}>{getValue('Speed')}</Text>
                    </View>
                    <View style={styles.statsRow2}>
                        <Text style={styles.cellName}>Line Of Sight</Text>
                        <Text style={styles.cellValue}>{getValue('LineOfSight')}</Text>
                    </View>
                    {
                        data.GarrisonCapacity > 0 &&
                        <View style={styles.statsRow2}>
                            <Text style={styles.cellName}>Garrison Capacity</Text>
                            <Text style={styles.cellValue}>{getValue('GarrisonCapacity')}</Text>
                        </View>
                    }
                    <Text/>
                </View>
            }

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
                        <Text/>
                    </>
                )
            }

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

const padding = 2;

const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
    resDescription: {
        marginRight: 20,
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

    resRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },

    statsRow: {
        flexDirection: 'row',
        // justifyContent: 'center',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    statsContainer: {
        marginTop: 5,
        marginHorizontal: -padding,
        // alignItems: 'center',
    },
    statsRow2: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: 5,
        // width: 250,
        // backgroundColor: 'blue',
    },
    cellName: {
        padding: padding,
        flex: 4,
    },
    cellValue: {
        padding: padding,
        flex: 8,
    },
    small: {
        fontSize: 12,
        color: '#333',
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
