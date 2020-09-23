import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    getUnitLineIcon, getUnitLineIdForUnit, getUnitLineName, sortUnitCounter, Unit, UnitLine, unitLines
} from "../../../../data/src/helper/units";
import {MyText} from "../components/my-text";
import {iconSmallHeight, iconSmallWidth} from "../../../../data/src/lib/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";


function CounterUnit({unitLineId}: { unitLineId: UnitLine }) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    const gotoUnit = (unit: Unit) => navigation.push('Unit', {unit: unit});
    return (
        <TouchableOpacity onPress={() => gotoUnit(unitLineId)}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unitLineId)}/>
                <MyText style={styles.unitDesc}>
                    {getUnitLineName(unitLineId)}
                </MyText>
            </View>
        </TouchableOpacity>
    );
}

export default function UnitRelated({unitId}: { unitId: Unit }) {
    const styles = useTheme(variants);
    const unitLineId = getUnitLineIdForUnit(unitId);
    const unitLine = unitLines[unitLineId];

    if (!unitLine.related) {
        return <View/>;
    }

    const sortedUnitCounters = sortUnitCounter(unitLine.related);

    return (
        <View>
            <View>
                <View style={styles.row}>
                    <MyText style={styles.header2}>Related</MyText>
                </View>
                {
                    sortedUnitCounters.map(counterUnit => <CounterUnit key={counterUnit} unitLineId={counterUnit}/>)
                }
            </View>
        </View>
    );
}

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
            marginTop: 10,
            fontSize: 18,
            fontWeight: '500',
        },
        header2: {
            fontSize: 15,
            marginVertical: 5,
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
