import {Image, StyleSheet, Text, TextStyle, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    allUnitSections,
    attackClasses, getUnitClassName, getUnitData, getUnitLineIdForUnit, getUnitName,
    hiddenArmourClasses, IUnitInfo, Other, sortResources, Unit, UnitClassNumber, UnitLine, unitLines
} from "@nex/data";
import React, {useState} from "react";
import {makeVariants, useTheme} from "../../theming";
import {keysOf} from "@nex/data";
import Picker from "../components/picker";
import Space from "../components/space";
import {Building, getBuildingData, IBuildingInfo} from "@nex/data";
import {getOtherIcon, getUnitIcon} from "../../helper/units";
import {createStylesheet} from '../../theming-new';
import {uniq} from 'lodash';
import {getTranslation} from '../../helper/translate';

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
    unitId?: Unit;
    buildingId?: Building;
    path: (x: IUnitInfo) => any;
    formatter?: IFormatter;
}

interface GetDataParams {
    unitId?: Unit;
    buildingId?: Building;
}

export function getData(params: GetDataParams) {
    const { unitId, buildingId } = params;
    if (unitId) {
        return getUnitData(unitId);
    }
    if (buildingId) {
        return getBuildingData(buildingId);
    }
    throw new Error('getData - no unitId or buildingId given');
}

export function GetValueByPath(props: PathProps) {
    const { style, unitId, buildingId, path, formatter = x => (x || 0).toString() } = props;
    const styles = useStyles();
    const baseData = getData({ unitId, buildingId }) as IUnitInfo;
    const eliteData = unitId ? getEliteData(getUnitLineIdForUnit(unitId)) : null;

    if (eliteData && path(eliteData) !== path(baseData)) {
        return (
            <MyText style={style}>
                <MyText>{formatter(path(baseData))}, {formatter(path(eliteData))} </MyText>
                <MyText style={styles.small}>({getTranslation('unit.stats.elite')})</MyText>
            </MyText>
        );
    } else {
        return (
            <MyText style={style}>{formatter(path(baseData))}</MyText>
        );
    }
}

interface PathProps2 {
    style?: TextStyle;
    unitId?: Unit;
    buildingId?: Building;
    prop: keyof IUnitInfo;
    formatter?: IFormatter;
}

export function GetUnitValue(props: PathProps2) {
    const { style, unitId, buildingId, prop, formatter = (x: any) => x } = props;
    return <GetValueByPath style={style} unitId={unitId} buildingId={buildingId} path={ (x: IUnitInfo) => x[prop]} formatter={formatter}/>;
}

interface PathProps3 {
    style?: TextStyle;
    unitId?: Unit;
    buildingId?: Building;
    unitClassNumber: UnitClassNumber;
}

function signed(num: number) {
    if (num == null) {
        return '';
    }
    return num > 0 ? '+' + num.toString() : num.toString();
}

export function GetAttackValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} buildingId={buildingId} path={(x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount}/>;
}

export function GetAttackBonusValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} buildingId={buildingId} path={(x: IUnitInfo) => x.Attacks.find(a => a.Class === unitClassNumber)?.Amount} formatter={x => signed(x || 0)}/>
}

export function GetArmourValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return <GetValueByPath style={style} unitId={unitId} buildingId={buildingId} path={(x: IUnitInfo) => x.Armours.find(a => a.Class === unitClassNumber)?.Amount} formatter={x => signed(x || 0)}/>
}

export function getAttackBonuses(params: GetDataParams) {
    const data = getData(params);
    const eliteData = params.unitId ? getEliteData(getUnitLineIdForUnit(params.unitId)) : null;

    const attackBonuses = data.Attacks.filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber))).map(a => a.Class);
    const attackBonusesElite = eliteData?.Attacks.filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber))).map(a => a.Class) ?? [];

    return uniq([...attackBonuses, ...attackBonusesElite]);
}

export function getArmourClasses(params: GetDataParams) {
    const data = getData(params);
    return data.Armours.filter(a => !hiddenArmourClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
}

export function UnitStats({ unitId, unitLineId }: Props) {
    const styles = useStyles();

    const [comparisonUnit, setComparisonUnit] = useState<Unit>();

    const baseData = getUnitData(unitId);
    const baseData2 = comparisonUnit ? getUnitData(comparisonUnit) : null;

    const unitNone = null;

    const formaUnit = (x: (string | null), inList?: boolean) => {
        if (x == unitNone) {
            return getTranslation('unit.stats.action.compare');
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
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.costs')}</MyText>
                    <View style={[styles.cellValue, {flexDirection: 'row'}]}>
                        {
                            sortResources(keysOf(baseData.Cost)).map(res =>
                                <View key={res} style={styles.resRow}>
                                    <Image fadeDuration={0} style={styles.resIcon} source={getOtherIcon(res as Other)}/>
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
                                        <Image fadeDuration={0} style={styles.resIcon} source={getOtherIcon(res as Other)}/>
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
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.trainedin')}</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="TrainTime" formatter={x => x + 's'}/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.hitpoints')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="HP"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.attack')}</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.melee')}</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={4}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.pierce')}</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={3}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.bonus')}</MyText>
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getAttackBonuses({ unitId: u }).length > 0 && getAttackBonuses({ unitId: u }).map(bonusClass =>
                                    <MyText key={bonusClass}>
                                        <GetAttackBonusValue unitId={u} unitClassNumber={bonusClass}/>
                                        <MyText style={styles.small}> ({getUnitClassName(bonusClass as UnitClassNumber).toLowerCase()})</MyText>
                                    </MyText>
                                )
                                || <Text>-</Text>
                            }
                        </View>
                    )
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.rateoffire')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="ReloadTime"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.framedelay')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="FrameDelay"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.range')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="Range"/>)
                }
            </View>
            {
                baseData.MinRange > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.minimumrange')}</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="MinRange"/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.accuracy')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="AccuracyPercent" formatter={x => x+' %'}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.armour')}</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.melee')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="MeleeArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.pierce')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="PierceArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.bonus')}</MyText>
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getArmourClasses({ unitId: u }).length > 0 && getArmourClasses({ unitId: u }).map(a =>
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
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.speed')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="Speed"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.lineofsight')}</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="LineOfSight"/>)
                }
            </View>
            {
                baseData.GarrisonCapacity > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.garrisoncapacity')}</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="GarrisonCapacity"/>)
                    }
                </View>
            }
            <Space/>
        </View>
    );
}

const padding = 2;

const useStyles = createStylesheet(theme => StyleSheet.create({
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
}));
