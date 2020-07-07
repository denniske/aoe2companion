import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getUnitLineIcon, getUnitLineName, getUnitName, IUnitLine, Unit, unitLines} from "../../helper/units";
import {sortBy} from "lodash-es";


function getUnitLineTitle(unitLine: IUnitLine) {
    // if (unitLine.unique) {
    //     return getUnitName(unitLine.units[0]);// + ' + Elite';
    // }
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function UnitComp({unit}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <View style={styles.unitIconTitle}>
                    <Text>{getUnitLineName(unit)}</Text>
                    {
                        unitLines[unit].units.length > 1 && !unitLines[unit].unique &&
                        <Text numberOfLines={1} style={styles.small}>{getUnitLineTitle(unitLines[unit])}</Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitCompBig({unit}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitLineIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <Text>{getUnitLineName(unit)}</Text>
                    {
                        unitLines[unit].units.length > 1 && !unitLines[unit].unique &&
                        <Text numberOfLines={1} style={styles.small}>{getUnitLineTitle(unitLines[unit])}</Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function UnitList() {
    return (
        <View style={styles.container}>
            {
                sortBy(Object.keys(unitLines)).map(ul =>
                    <UnitCompBig key={ul} unit={ul}/>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'yellow',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    unitIconTitle: {
        flex: 1,
        // backgroundColor: 'red',
    },

    rowBig: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // backgroundColor: 'blue',
    },
    unitIconBig: {
        width: 30,
        height: 30,
        // borderWidth: 1,
        // borderColor: '#555',
    },
    unitIconBigTitle: {
        flex: 1,
        paddingLeft: 8,
        // backgroundColor: 'red',
    },
    small: {
        fontSize: 12,
        color: '#333',
    },
});
