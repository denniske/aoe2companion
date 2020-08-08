import {StyleSheet, Text, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    attackClasses, getUnitClassName, getUnitData, hiddenArmourClasses, IUnitInfo, Unit, UnitClassNumber, UnitLine,
    unitLines
} from "../../helper/units";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {iconSmallHeight, iconSmallWidth} from "../../helper/theme";

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

export function UnitStats({ unitId, unitLineId }: Props) {
    const styles = useTheme(variants);

    const baseData = getUnitData(unitId);

    const unitLine = unitLines[unitLineId];
    const eliteUnit = unitLine.unique ? unitLine.units[1] : null;
    const eliteData = eliteUnit ? getUnitData(eliteUnit) : undefined;

    const getValueByPath = (path: (x: IUnitInfo) => any, formatter: (x: number) => string = x => x.toString()) => {
        if (eliteData && path(eliteData) !== path(baseData)) {
            return (
                <>
                    <MyText>{formatter(path(baseData))}, {formatter(path(eliteData))} </MyText>
                    <MyText style={styles.small}>(elite)</MyText>
                </>
            );
        } else {
            return (
                <>
                    <MyText>{formatter(path(baseData))}</MyText>
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

    const attacks = baseData.Attacks.filter(a => attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
    const attackBonuses = baseData.Attacks.filter(a => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
    const armourClasses = baseData.Armours.filter(a => !hiddenArmourClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));

    return (
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
                            <MyText
                                key={a.Class}>{getAttackValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
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
                            <MyText
                                key={a.Class}>{getAttackBonusValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
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
                baseData.MinRange > 0 &&
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
                            <MyText
                                key={a.Class}>{getArmourValue(a.Class as UnitClassNumber)} ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
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
                baseData.GarrisonCapacity > 0 &&
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>Garrison Capacity</MyText>
                    <MyText style={styles.cellValue}>{getValue('GarrisonCapacity')}</MyText>
                </View>
            }
            <MyText/>
        </View>
    );
}

const padding = 2;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        statsContainer: {
            marginTop: 5,
            marginHorizontal: -padding,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        cellName: {
            padding: padding,
            flex: 4,
            fontWeight: 'bold',
        },
        cellValue: {
            padding: padding,
            flex: 8,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

const variants = makeVariants(getStyles);
