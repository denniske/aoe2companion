import React, {useState} from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    attackClasses,
    getEliteUniqueResearchIcon, getInferiorUnitLines, getOtherIcon, getUnitClassName, getUnitData, getUnitDescription,
    getUnitIcon, getUnitLineForUnit,
    getUnitLineIcon,
    getUnitLineName, getUnitLineNameForUnit,
    getUnitName, hiddenArmourClasses, IUnitInfo, Other, sortResources, sortUnitCounter, Unit, UnitClassNumber,
    UnitLine, unitLines, units, IUnitLine
} from "../../helper/units";
import {getTechIcon, getTechName, Tech, techEffectDict, techList} from "../../helper/techs";
import {Civ, civs} from "../../helper/civs";
import Fandom from "../components/fandom";
import {Button, Checkbox} from "react-native-paper";
import {escapeRegExpFn, keysOf} from "../../helper/util";
import {MyText} from "../components/my-text";
import {iconHeight, iconSmallHeight, iconSmallWidth, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {appVariants} from "../../styles";
import { useMutate } from '../../redux/reducer';


// function highlightUnitAndCivs(str: string) {
//     const appStyles = useTheme(appVariants);
//     const navigation = useNavigation<RootStackProp>();
//
//     const civReplaceList = civs.map(civ => ({ name: civ, text: civ}));
//     const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineNameForUnit(t as Unit), text: getUnitName(t as Unit)}));
//     const reverseCivMap = Object.assign({}, ...civReplaceList.map((x) => ({[x.text]: x})));
//     const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));
//
//     const allReplaceList = [...civReplaceList, ...unitReplaceList];
//
//     const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');
//
//     const parts = str.split(regex);
//     // console.log('parts', parts);
//     // console.log('map', map);
//
//     const texts = [];
//     for (let i = 0; i < parts.length; i++) {
//         if (i % 2 == 0) {
//             texts.push(<MyText key={i}>{parts[i]}</MyText>);
//         } else {
//             // console.log('part', parts[i]);
//             const matchingTech = reverseCivMap[parts[i]]?.name;
//             if (matchingTech) {
//                 texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</MyText>);
//             }
//             const matchingUnit = reverseUnitMap[parts[i]]?.name;
//             if (matchingUnit) {
//                 texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</MyText>);
//             }
//         }
//     }
//     return texts;
// }

export default function UnitDetails({unitName}: {unitName: Unit}) {
    const appStyles = useTheme(appVariants);
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    const unitLineName = getUnitLineNameForUnit(unitName);
    const unitLine = unitLines[unitLineName];
    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]);
    const [checked, setChecked] = useState(false);

    const unitIndex = unitLine.units.indexOf(unitName);
    const upgradedFrom = unitIndex > 0 ? unitLine.units[unitIndex-1] : null;
    const upgradedTo = unitIndex < unitLine.units.length-1 ? unitLine.units[unitIndex+1] : null;
    const getNonUniqueUnitCounters = (x: IUnitLine[])=>{
        let nonUUArray: UnitLine[] = [];
        sortUnitCounter(x.counteredBy).forEach((counterUnit)=>{
            let counterUnitObj = unitLines[getUnitLineNameForUnit(counterUnit)];
            if(!counterUnitObj.unique){
                nonUUArray.push(counterUnit);
            }
        });
        return nonUUArray.map(counterUnit =>
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
    const getNonUniqueInferiorUnitLines = () => {
        let nonUUArray: UnitLine[] = []
        sortUnitCounter(getInferiorUnitLines(unitLineName)).forEach((counterUnit)=>{
            let counterUnitObj = unitLines[getUnitLineNameForUnit(counterUnit)];
            if(!counterUnitObj.unique){
                nonUUArray.push(counterUnit);
            }
        });
        return nonUUArray.map(counterUnit => 
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

    const developments = unitLine.units;//.filter((u, i) => i > 0);//.map(u => units[u]);

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

    const baseUnit = unitName;
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
    const armourClasses = data.Armours.filter(a => !hiddenArmourClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));

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
                        <MyText style={styles.header1}>
                            Counters
                        </MyText>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.checkboxCell}>
                        <Checkbox.Android
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(!checked);
                            }
                        }     
                        />
                        </View>
                        <View style={styles.checkboxDesc}>
                            <MyText style={styles.small}>Display Unique Units</MyText>
                        </View>
                     </View>
                <View>
                    <View style={styles.row}>
                            <MyText style={styles.header2}>Weak vs.</MyText>
                    </View>
                    
                        {checked ? sortUnitCounter(unitLine.counteredBy).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <MyText style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </MyText>
                                    </View>
                                </TouchableOpacity>) : getNonUniqueUnitCounters(unitLine)
                        }

                        <View style={styles.row}>
                            <MyText  style={styles.header2}>Strong vs.</MyText>
                        </View>
                        {checked ? 
                            sortUnitCounter(getInferiorUnitLines(unitLineName)).map(counterUnit =>
                                <TouchableOpacity key={counterUnit} onPress={() => gotoUnit(counterUnit)}>
                                    <View style={styles.row}>
                                        <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitLineIcon(counterUnit)}/>
                                        <MyText style={styles.unitDesc}>
                                            {getUnitLineName(counterUnit)}
                                        </MyText>
                                    </View>
                                </TouchableOpacity>
                            ) : getNonUniqueInferiorUnitLines()
                        }
                </View>
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
                upgradedFrom &&
                    <View>
                        <MyText/>
                        <View style={styles.row}>
                            <MyText size="headline">Upgraded From</MyText>
                        </View>
                        <TouchableOpacity onPress={() => gotoUnit(upgradedFrom)}>
                            <View style={styles.row}>
                                <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedFrom)}/>
                                <MyText style={styles.unitDesc}>{getUnitName(upgradedFrom)}</MyText>
                            </View>
                        </TouchableOpacity>
                    </View>
            }
            {
                upgradedTo &&
                <View>
                        <MyText/>
                        <View style={styles.row}>
                            <MyText size="headline">Upgraded To</MyText>
                        </View>
                        <TouchableOpacity disabled={unitLine.unique} onPress={() => gotoUnit(upgradedTo)}>
                            <View style={styles.row}>
                                <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedTo)}/>
                                <MyText style={styles.unitDesc}>{getUnitName(upgradedTo)}</MyText>
                            </View>
                        </TouchableOpacity>
                    </View>
            }

            {/*{*/}
            {/*    developments.length > 0 &&*/}
            {/*        <View>*/}
            {/*            <MyText/>*/}
            {/*            <View style={styles.row}>*/}
            {/*                <MyText size="headline">Unit line</MyText>*/}
            {/*            </View>*/}
            {/*            {*/}
            {/*                developments.map(unit =>*/}
            {/*                    <TouchableOpacity key={unit} onPress={() => gotoUnit(unit)}>*/}
            {/*                        <View style={styles.row}>*/}
            {/*                            <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(unit)}/>*/}
            {/*                            <MyText style={styles.unitDesc}>{getUnitName(unit)}</MyText>*/}
            {/*                        </View>*/}
            {/*                    </TouchableOpacity>*/}
            {/*                )*/}
            {/*            }*/}
            {/*        </View>*/}
            {/*}*/}

            <View style={appStyles.expanded}/>
            <Fandom articleName={getUnitName(unitName)}/>
        </View>
    );
}

const padding = 2;


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
        checkboxCell: {
            flex: 1,
            marginLeft: -6
        },
        checkboxDesc: {
            flex: 11,
            marginLeft: 4
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
        header1: {
            fontSize: 18,
            fontWeight: '500'
        },
        header2: {
            fontSize: 16,
            fontWeight: '300'
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
    });
};

const variants = makeVariants(getStyles);

