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
import {MyText} from "../components/my-text";
import {iconHeight, iconSmallHeight, iconSmallWidth, iconWidth} from "../../helper/theme";


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

    const getValueByPath = (path: (x: IUnitInfo) => any, formatter: (x: number) => string = x => x.toString()) => {
        if (eliteData && path(eliteData) !== path(data)) {
            return (
                <>
                    <MyText>{formatter(path(data))}, {formatter(path(eliteData))} </MyText>
                    <MyText style={styles.small}>(elite)</MyText>
                </>
            );
        } else {
            return (
                <>
                    <MyText>{formatter(path(data))}</MyText>
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

    const attacks = data.Attacks.filter(a => attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
    const attackBonuses = data.Attacks.filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
    const armourClasses = data.Armours.filter(a => (a.Amount > 0 || a.Class === 19) && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));

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
                <MyText style={styles.description}>Trained in {data.TrainTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getUnitDescription(baseUnit)}</MyText>
            <MyText/>

            {
                statsVisible &&
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Hit Points</MyText>
                        <MyText style={styles.cellValue}>{getValue('HP')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Attack</MyText>
                        <MyText style={styles.cellValue}>
                            {
                                attacks.length > 0 && attacks.map(a =>
                                    <MyText key={a.Class}>{getAttackValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                )
                                || <Text>-</Text>
                            }
                        </MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Attack Bonuses</MyText>
                        <View style={styles.cellValue}>
                            {
                                attackBonuses.length > 0 && attackBonuses.map(a =>
                                    <MyText key={a.Class}>{getAttackBonusValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                )
                                || <Text>-</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Rate of Fire</MyText>
                        <MyText style={styles.cellValue}>{getValue('ReloadTime')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Frame Delay</MyText>
                        <MyText style={styles.cellValue}>{getValue('FrameDelay')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Range</MyText>
                        <MyText style={styles.cellValue}>{getValue('Range')}</MyText>
                    </View>
                    {
                        data.MinRange > 0 &&
                        <View style={styles.statsRow}>
                            <MyText style={styles.cellName}>Minimum Range</MyText>
                            <MyText style={styles.cellValue}>{getValue('MinRange')}</MyText>
                        </View>
                    }
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Accuracy</MyText>
                        <MyText style={styles.cellValue}>{getValue('AccuracyPercent')}%</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Melee Armour</MyText>
                        <MyText style={styles.cellValue}>{getValue('MeleeArmor')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Pierce Armour</MyText>
                        <MyText style={styles.cellValue}>{getValue('PierceArmor')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Armor Classes</MyText>
                        <View style={styles.cellValue}>
                            {
                                armourClasses.length > 0 && armourClasses.map(a =>
                                    <MyText key={a.Class}>{getArmourValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                )
                                || <Text>-</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Speed</MyText>
                        <MyText style={styles.cellValue}>{getValue('Speed')}</MyText>
                    </View>
                    <View style={styles.statsRow}>
                        <MyText style={styles.cellName}>Line Of Sight</MyText>
                        <MyText style={styles.cellValue}>{getValue('LineOfSight')}</MyText>
                    </View>
                    {
                        data.GarrisonCapacity > 0 &&
                        <View style={styles.statsRow}>
                            <MyText style={styles.cellName}>Garrison Capacity</MyText>
                            <MyText style={styles.cellValue}>{getValue('GarrisonCapacity')}</MyText>
                        </View>
                    }
                    <MyText/>
                </View>
            }

            {
                unitLine.counteredBy && (
                    <>
                        <View style={styles.row}>
                            <MyText size="headline">Weak vs.</MyText>
                        </View>
                        {
                            sortUnitCounter(unitLine.counteredBy).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <MyText style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </MyText>
                                    </View>
                                </TouchableOpacity>
                            )
                        }

                        <MyText/>
                        <View style={styles.row}>
                            <MyText size="headline">Strong vs.</MyText>
                        </View>
                        {
                            sortUnitCounter(getInferiorUnitLines(unitLineName)).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <MyText style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </MyText>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        <MyText/>
                    </>
                )
            }

            {
                groups.map(group =>
                    <View key={group.name}>
                        <View style={styles.row}>
                            <MyText size="headline">{group.name}</MyText>
                        </View>
                        {
                            group.upgrades.map(upgrade =>
                                <View style={styles.row} key={upgrade.name}>
                                    <Image style={styles.unitIcon} source={getTechIcon(upgrade.tech)}/>
                                    <MyText style={styles.unitDesc}>
                                        <MyText style={appStyles.link} onPress={() => gotoTech(upgrade.tech!)}>{getTechName(upgrade.tech)}</MyText>
                                        <MyText size="footnote">
                                            {upgrade.effect[group.prop] ? ' (' + upgrade.effect[group.prop] : ''}
                                            {
                                                upgrade.civ &&
                                                <>
                                                    <MyText size="footnote">, only </MyText>
                                                    <MyText size="footnote" style={appStyles.link} onPress={() => gotoCiv(upgrade.civ!)}>{upgrade.civ}</MyText>
                                                </>
                                            }
                                            {upgrade.effect[group.prop] ? ')' : ''}
                                        </MyText>
                                    </MyText>
                                </View>
                            )
                        }
                    </View>
                )
            }
            {
                developments.length > 0 &&
                    <View>
                        <MyText/>
                        <View style={styles.row}>
                            <MyText size="headline">Upgrades</MyText>
                        </View>
                        {
                            developments.map(unit =>
                                <View key={unit} style={styles.row}>
                                    <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(unit)}/>
                                    <MyText style={styles.unitDesc}>{getUnitName(unit)}</MyText>
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
    resIcon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
    resDescription: {
        marginRight: 20,
    },

    costsRow: {
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },

    statsContainer: {
        marginTop: 5,
        marginHorizontal: -padding,
        // alignItems: 'center',
    },
    statsRow: {
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
        width: iconSmallWidth,
        height: iconSmallHeight,
        marginRight: 5,
    },
    unitDesc: {
        lineHeight: 20,
    },
});
