import {
    filterUnits,
    getInferiorUnitLines,
    getUnitLineIdForUnit,
    getUnitLineName,
    iconSmallHeight,
    iconSmallWidth,
    sortUnitCounter,
    Unit,
    UnitLine,
    unitLines,
} from '@nex/data';
import { Image } from '@/src/components/uniwind/image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { getUnitLineIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';
import { Checkbox as CheckboxNew } from '@app/components/checkbox';

function CounterUnit({ unitLineId }: { unitLineId: UnitLine }) {
    const styles = useStyles();
    return (
        <Link asChild href={`/explore/units/${unitLineId}`}>
            <TouchableOpacity>
                <View style={styles.row}>
                    <Image style={styles.unitIcon} source={getUnitLineIcon(unitLineId)} />
                    <MyText style={styles.unitDesc}>{getUnitLineName(unitLineId)}</MyText>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

export default function UnitCounters({ unitId }: { unitId: Unit }) {
    const styles = useStyles();
    const unitLineId = getUnitLineIdForUnit(unitId);
    const unitLine = unitLines[unitLineId];
    const [showUniqueUnits, setShowUniqueUnits] = useState(false);

    const toggleUniqueUnits = () => setShowUniqueUnits(!showUniqueUnits);

    if (!unitLine.counteredBy) {
        return <View />;
    }

    const filter = showUniqueUnits ? {} : { unique: false };
    const sortedUnitCounters = sortUnitCounter(filterUnits(unitLine.counteredBy, filter));
    const sortedInferiorUnits = sortUnitCounter(filterUnits(getInferiorUnitLines(unitLineId), filter));

    return (
        <View>
            <View style={styles.row}>
                <MyText style={styles.header1}>Counters</MyText>
            </View>
            <View style={styles.row}>
                <View style={styles.checkboxCell}>
                    <CheckboxNew checked={showUniqueUnits} onPress={toggleUniqueUnits} text={'Display Unique Units'} />
                </View>
            </View>
            <View>
                <View style={styles.row}>
                    <MyText style={styles.header2}>Weak vs.</MyText>
                </View>
                {sortedUnitCounters.map((counterUnit) => (
                    <CounterUnit key={counterUnit} unitLineId={counterUnit} />
                ))}
                <View style={styles.row}>
                    <MyText style={styles.header2}>Strong vs.</MyText>
                </View>
                {sortedInferiorUnits.map((counterUnit) => (
                    <CounterUnit key={counterUnit} unitLineId={counterUnit} />
                ))}
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
            marginLeft: -8,
        },
        checkboxDesc: {
            flex: 11,
            marginLeft: 4,
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
    } as const)
);
