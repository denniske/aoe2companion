import {Image, StyleSheet, Text, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    getOtherIcon, getUnitClassName, getUnitIcon, IUnitInfo, Other, sortResources, UnitClassNumber
} from "../../../../data/src/helper/units";
import React, {useState} from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {keysOf} from "../../../../data/src/helper/util";
import Picker from "../components/picker";
import Space from "../components/space";
import {Building, getBuildingData, getBuildingIcon, getBuildingName} from "../../../../data/src/helper/buildings";
import {
    getArmourClasses, GetArmourValue, getAttackBonuses, GetAttackBonusValue, GetAttackValue, GetUnitValue
} from "../unit/unit-stats";
import {buildingSections} from "./building-list";

interface Props {
    buildingId: Building;
}

export function BuildingStats({ buildingId }: Props) {
    const styles = useTheme(variants);

    const [comparisonUnit, setComparisonUnit] = useState<Building>();

    const baseData = getBuildingData(buildingId) as IUnitInfo;
    const baseData2 = comparisonUnit ? getBuildingData(comparisonUnit) : null;

    const unitNone = null;

    const formaUnit = (x: (string | null), inList?: boolean) => {
        if (x == unitNone) {
            return 'Compare';
        }
        return getBuildingName(x as Building);
    };
    const icon = (x: any, inList?: boolean) => {
        if (!inList) return null;
        return <Image fadeDuration={0} style={styles.unitIcon} source={getBuildingIcon(x)}/>;
    };
    const onComparisonUnitSelected = (unit: Building) => {
        setComparisonUnit(unit);
    };

    const units = comparisonUnit ? [buildingId, comparisonUnit!] : [buildingId];

    return (
        <View style={styles.statsContainer}>

            <View style={[styles.statsRowHeader, {marginBottom: comparisonUnit ? 0 : 15}]}>
                {
                    comparisonUnit &&
                    <>
                        <MyText style={styles.cellName}/>
                        <MyText style={styles.cellValue}>{getBuildingName(buildingId)}</MyText>
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
                    <Picker itemHeight={40} textMinWidth={150} container="sectionlist" icon={icon} value={comparisonUnit} sections={buildingSections} formatter={formaUnit} onSelect={onComparisonUnitSelected}/>
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
                    <MyText style={styles.cellName}>Built in</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="TrainTime" formatter={x => x + 's'}/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Hit Points</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="HP"/>)
                }
            </View>

            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Attack</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>melee</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} buildingId={u} unitClassNumber={4}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>pierce</MyText>
                {
                    units.map(u => <GetAttackValue key={u} style={styles.cellValue} buildingId={u} unitClassNumber={3}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>bonus</MyText>
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getAttackBonuses({ buildingId: u }).length > 0 && getAttackBonuses({ buildingId: u }).map(a =>
                                    <MyText key={a.Class}>
                                        <GetAttackBonusValue buildingId={u} unitClassNumber={a.Class}/>
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
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="ReloadTime"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Range</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="Range"/>)
                }
            </View>
            {
                baseData.MinRange > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Minimum Range</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="MinRange"/>)
                    }
                </View>
            }
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Accuracy</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="AccuracyPercent" formatter={x => x+' %'}/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>Armour</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>melee</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="MeleeArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>pierce</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="PierceArmor"/>)
                }
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>bonus</MyText>
                {
                    units.map(u =>
                        <View key={u} style={styles.cellValue}>
                            {
                                getArmourClasses({ buildingId: u }).length > 0 && getArmourClasses({ buildingId: u }).map(a =>
                                    <MyText key={a.Class}>
                                        <GetArmourValue buildingId={u} unitClassNumber={a.Class}/>
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
                <MyText style={styles.cellName}>Line Of Sight</MyText>
                {
                    units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="LineOfSight"/>)
                }
            </View>
            {
                baseData.GarrisonCapacity > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Garrison Capacity</MyText>
                    {
                        units.map(u => <GetUnitValue key={u} style={styles.cellValue} buildingId={u} prop="GarrisonCapacity"/>)
                    }
                </View>
            }
            <Space/>
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
