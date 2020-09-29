import React from 'react';
import {
    getUnitLineForUnit, getUnitLineName, getUnitName, iconHeight, iconWidth, IUnitLine, Unit, UnitLine, unitLines
} from "@nex/data";
import {MyText, TouchableOpacity, View, Image} from './compat';
import {getUnitIcon, getUnitLineIcon} from '../helper/units';
import {createStylesheet} from '../helper/styles';
import {useAppStyles} from './app-styles';


function getUnitLineTitle(unitLine: IUnitLine) {
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function UnitCompBig({unit, subtitle}: {unit: Unit, subtitle?: string}) {
    const styles = useStyles();
    const appClasses = useAppStyles();
    return (
        <TouchableOpacity href='/unit/[unitId]' as={`/unit/${unit}`} naked>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
                    {
                        subtitle != null &&
                        <MyText style={appClasses.small}>{subtitle}</MyText>
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
        <TouchableOpacity href='/unit/[unitId]' as={`/unit/${unit}`} naked>
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
    const appClasses = useAppStyles();
    return (
        <TouchableOpacity href='/unit/[unitId]' as={`/unit/${unitLine}`} naked>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitLineIcon(unitLine)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitLineName(unitLine)}</MyText>
                    {
                        unitLines[unitLine].units.length > 1 && !unitLines[unitLine].unique &&
                        <MyText numberOfLines={1} style={appClasses.small}>{getUnitLineTitle(unitLines[unitLine])}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}


const useStyles = createStylesheet(theme => ({
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
}));
