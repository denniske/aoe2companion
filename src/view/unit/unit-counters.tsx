import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    filterUnits,
    getInferiorUnitLines, getUnitLineIcon, getUnitLineIdForUnit, getUnitLineName, sortUnitCounter,
    Unit, UnitLine, unitLines
} from "../../helper/units";
import {Checkbox} from "react-native-paper";
import {MyText} from "../components/my-text";
import {iconSmallHeight, iconSmallWidth} from "../../helper/theme";
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

export default function UnitCounters({unitId}: { unitId: Unit }) {
    const styles = useTheme(variants);
    const unitLineId = getUnitLineIdForUnit(unitId);
    const unitLine = unitLines[unitLineId];
    const [showUniqueUnits, setShowUniqueUnits] = useState(false);

    const toggleUniqueUnits = () => setShowUniqueUnits(!showUniqueUnits);

    if (!unitLine.counteredBy) {
        return <View/>;
    }

    const filter = showUniqueUnits ? {} : {unique: false};
    const sortedUnitCounters = sortUnitCounter(filterUnits(unitLine.counteredBy, filter));
    const sortedInferiorUnits = sortUnitCounter(filterUnits(getInferiorUnitLines(unitLineId), filter));

    return (
        <View>
            <View style={styles.row}>
                <MyText style={styles.header1}>Counters</MyText>
            </View>
            <View style={styles.row}>
                <View style={styles.checkboxCell}>
                    <Checkbox.Android status={showUniqueUnits ? 'checked' : 'unchecked'} onPress={toggleUniqueUnits}/>
                </View>
                <TouchableOpacity style={styles.checkboxDesc} onPress={toggleUniqueUnits}>
                    <MyText style={styles.small}>Display Unique Units</MyText>
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.row}>
                    <MyText style={styles.header2}>Weak vs.</MyText>
                </View>
                {
                    sortedUnitCounters.map(counterUnit => <CounterUnit key={counterUnit} unitLineId={counterUnit}/>)
                }
                <View style={styles.row}>
                    <MyText style={styles.header2}>Strong vs.</MyText>
                </View>
                {
                    sortedInferiorUnits.map(counterUnit => <CounterUnit key={counterUnit} unitLineId={counterUnit}/>)
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
