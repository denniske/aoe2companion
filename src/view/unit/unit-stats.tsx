import {Image, StyleSheet, Text, TextStyle, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    attackClasses, getOtherIcon, getUnitClassName, getUnitData, getUnitIcon, getUnitLineIdForUnit, getUnitName,
    hiddenArmourClasses, IUnitInfo, Other, sortResources, Unit, UnitClassNumber, UnitLine, unitLines
} from "../../helper/units";
import React, {useState} from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {keysOf} from "../../helper/util";
import Picker from "../components/picker";
import {allUnitSections} from "./unit-list";

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

type IFormatter = (x: number) => string;

function getEliteData(unitLineId: UnitLine) {
    const unitLine = unitLines[unitLineId];
    const eliteUnit = unitLine.unique ? unitLine.units[1] : null;
    return eliteUnit ? getUnitData(eliteUnit) : undefined;
}

interface PathProps {
    style?: TextStyle;
    unitId: Unit;
    path: (x: IUnitInfo) => any;
    formatter?: IFormatter;
}

function GetValueByPath(props: PathProps) {
    const { style, unitId, path, formatter = x => (x || 0).toString() } = props;
    const styles = useTheme(variants);
    const baseData = getUnitData(unitId);
    const eliteData = getEliteData(getUnitLineIdForUnit(unitId));

    if (eliteData && path(eliteData) !== path(baseData)) {
        return (
            <MyText style={style}>
                <MyText>{formatter(path(baseData))}, {formatter(path(eliteData))} </MyText>
                <MyText style={styles.small}>(elite)</MyText>
            </MyText>
        );
    } else {
        return (
            <MyText  style={style}>{formatter(path(baseData))}</MyText>
        );
    }
}

interface PathProps2 {
    style?: TextStyle;
    unitId: Unit;
    prop: keyof IUnitInfo;
    formatter?: IFormatter;
}

function GetValue(props: PathProps2) {
    const { style, unitId, prop, formatter = (x: any) => x } = props;
    return <GetValueByPath style={style} unitId={unitId} path={ (x: IUnitInfo) => x[prop]} formatter={formatter}/>;
}

interface PathProps3 {
    style?: TextStyle;
    unitId: Unit;
    unitClassNumber: UnitClassNumber;
}

function GetAttackValue(props: PathProps3) {
    const { style, unitId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} path={(x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount}/>;
}

function GetAttackBonusValue(props: PathProps3) {
    const { style, unitId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} path={(x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount} formatter={x => '+'+x}/>
}

function GetArmourValue(props: PathProps3) {
    const { style, unitId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} path={(x: IUnitInfo) => x.Armours.find(a => a.Class === unitClassNumber)?.Amount} formatter={x => '+'+x}/>
}

function getAttackBonuses(unitId: Unit) {
    const data = getUnitData(unitId);
    return data.Attacks.filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
}

function getArmourClasses(unitId: Unit) {
    const data = getUnitData(unitId);
    return data.Armours.filter(a => !hiddenArmourClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
}

export function UnitStats({ unitId, unitLineId }: Props) {
    const styles = useTheme(variants);

    const [comparisonUnit, setComparisonUnit] = useState<Unit>();

    const baseData = getUnitData(unitId);
    const baseData2 = comparisonUnit ? getUnitData(comparisonUnit) : null;

    const unitNone = null;

    const formaUnit = (x: (string | null), inList?: boolean) => {
        if (x == unitNone) {
            return 'Compare';
        }
        return getUnitName(x as Unit);
    };
    const icon = (x: any, inList?: boolean) => {
        if (!inList) return null;
        return <Image fadeDuration={0} style={styles.unitIcon} source={getUnitIcon(x)}/>;
    };
    const onComparisonUnitSelected = (unit: Unit) => {
        setComparisonUnit(unit);
    };

    const units = comparisonUnit ? [unitId, comparisonUnit!] : [unitId];

    return (
        <View style={styles.statsContainer}>

            <View style={[styles.statsRowHeader, {marginBottom: comparisonUnit ? 0 : 15}]}>
                {
                    comparisonUnit &&
                    <>
                        <MyText style={styles.cellName}/>
                        <MyText style={styles.cellValue}>{getUnitName(unitId)}</MyText>
                    </>
                }
                {
                    !comparisonUnit &&
                    <>
                        <MyText style={styles.cellName}/>
                        <MyText style={styles.cellValue}/>
                        <MyText style={styles.cellValue}/>
                    </>
                }
                <View style={styles.cellValue}>
                    <Picker itemHeight={40} textMinWidth={150} container="sectionlist" icon={icon} value={comparisonUnit} sections={allUnitSections} formatter={formaUnit} onSelect={onComparisonUnitSelected}/>
                </View>
            </View>

            {
                comparisonUnit &&
                <View style={styles.costsRow}>
                    <MyText style={styles.cellName}>Costs</MyText>
                    <View style={[styles.cellValue, {flexDirection: 'row'}]}>
                        {
                            sortResources(keysOf(baseData.Cost)).map(res =>
                                <View key={res} style={styles.resRow}>
                                    <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                                    <MyText style={styles.resDescription}>{baseData.Cost[res]}</MyText>
                                </View>
                            )
                        }
                    </View>
                    {
                        comparisonUnit &&
                        <View style={[styles.cellValue, {flexDirection: 'row'}]}>
                            {
                                sortResources(keysOf(baseData2!.Cost)).map(res =>
                                    <View key={res} style={styles.resRow}>
                                        <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                                        <MyText style={styles.resDescription}>{baseData2!.Cost[res]}</MyText>
                                    </View>
                                )
                            }
                        </View>
                    }
                </View>
            }
            {
                comparisonUnit &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Trained in</MyText>
                    {
                        units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="TrainTime" formatter={x => x + 's'}/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Hit Points</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="HP"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Attack</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>melee</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={4}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>pierce</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={3}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>bonus</MyText>
                {/*<MyText style={styles.cellName}></MyText>*/}
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getAttackBonuses(u).length > 0 && getAttackBonuses(u).map(a =>
                                    <MyText key={a.Class}>
                                        <GetAttackBonusValue unitId={u} unitClassNumber={a.Class}/>
                                        <MyText style={styles.small}> ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                    </MyText>
                                )
                                || <Text>-</Text>
                            }
                        </View>
                    )
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Rate of Fire</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="ReloadTime"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Frame Delay</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="FrameDelay"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Range</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="Range"/>)
                }
            </View>
            {
                baseData.MinRange > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Minimum Range</MyText>
                    {
                        units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="MinRange"/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Accuracy</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="AccuracyPercent" formatter={x => x+' %'}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Armour</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>melee</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="MeleeArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>pierce</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="PierceArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>bonus</MyText>
                {/*<MyText style={styles.cellName}></MyText>*/}
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getArmourClasses(u).length > 0 && getArmourClasses(u).map(a =>
                                    <MyText key={a.Class}>
                                        <GetArmourValue unitId={u} unitClassNumber={a.Class}/>
                                        <MyText style={styles.small}> ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                    </MyText>
                                )
                                || <Text>-</Text>
                            }
                        </View>
                    )
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Speed</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="Speed"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Line Of Sight</MyText>
                {
                    units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="LineOfSight"/>)
                }
            </View>
            {
                baseData.GarrisonCapacity > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Garrison Capacity</MyText>
                    {
                        units.map(u => <GetValue key={u} style={styles.cellValue} unitId={u} prop="GarrisonCapacity"/>)
                    }
                </View>
            }
            <MyText/>
        </View>
    );
}

const padding = 2;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        unitIcon: {
            width: 20,
            height: 20,
            marginRight: 5,
        },

        resRow: {
            flexDirection: 'row',
            // marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },
        resIcon: {
            width: 18,
            height: 18,
            marginRight: 5,
        },
        resDescription: {
            marginRight: 10,
        },

        costsRow: {
            flexDirection: 'row',
            // marginBottom: 5,
        },

        statsContainer: {
            marginTop: 5,
            marginHorizontal: -padding,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        statsRowHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
        },
        cellName: {
            padding: padding,
            flex: 3,
            fontWeight: 'bold',
        },
        cellValue: {
            padding: padding,
            flex: 4,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

const variants = makeVariants(getStyles);
