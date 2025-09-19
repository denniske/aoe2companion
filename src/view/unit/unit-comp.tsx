import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image';
import {
    getUnitLineForUnit, getUnitLineName, getUnitName, iconHeight, iconWidth, IUnitLine, Unit, UnitLine, unitLines
} from "@nex/data";
import {MyText} from "../components/my-text";
import {getUnitIcon, getUnitLineIcon} from "../../helper/units";
import {createStylesheet} from '../../theming-new';
import { router } from 'expo-router';


function getUnitLineTitle(unitLine: IUnitLine) {
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function UnitCompBig({unit, subtitle}: {unit: Unit, subtitle?: string}) {
    const styles = useStyles();
    return (
        <TouchableOpacity onPress={() => router.navigate(`/explore/units/${unit}`)}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
                    {
                        subtitle != null &&
                        <MyText style={styles.base.small}>{subtitle}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitCompBigWithCiv({unit}: {unit: Unit}) {
    const styles = useStyles();
    const unitLine = getUnitLineForUnit(unit);
    return (
        <TouchableOpacity onPress={() => router.navigate(`/explore/units/${unit}`)}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
                    {/*{*/}
                    {/*    unitLine?.unique && false &&*/}
                    {/*    <MyText numberOfLines={1} style={styles.small}>{unitLine.civ} unique unit</MyText>*/}
                    {/*}*/}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitLineCompBig({unitLine}: {unitLine: UnitLine}) {
    const styles = useStyles();
    return (
        <TouchableOpacity onPress={() => router.navigate(`/explore/units/${unitLine}`)}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitLineIcon(unitLine)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitLineName(unitLine)}</MyText>
                    {
                        unitLines[unitLine].units.length > 1 && !unitLines[unitLine].unique &&
                        <MyText numberOfLines={1} style={styles.base.small}>{getUnitLineTitle(unitLines[unitLine])}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}


const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
    rowBig: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // TODO ROLLBACK
        // backgroundColor: 'blue',
    },
    unitIconBig: {
        width: iconWidth,
        height: iconHeight,
        // borderWidth: 1,
        // borderColor: '#555',
    },
    unitIconBigTitle: {
        flex: 1,
        paddingLeft: 8,
        // backgroundColor: 'red',
    },
} as const));
