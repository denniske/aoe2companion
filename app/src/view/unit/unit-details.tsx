import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    getAbilityEnabledForAllCivs,
    getUnitDescription, getUnitLineIdForUnit, getUnitLineNameForUnit, getUnitName, Unit, unitLines
} from "@nex/data";
import Fandom from "../components/fandom";
import {MyText} from "../components/my-text";
import {makeVariants, useTheme} from "../../theming";
import {appVariants} from "../../styles";
import {UnitStats} from "./unit-stats";
import {UnitUpgrades} from "./unit-upgrades";
import {UnitCosts} from "./unit-costs";
import UnitCounters from "./unit-counters";
import CivAvailability from "../components/civ-availability";
import UnitRelated from "./unit-related";
import Space from "../components/space";
import {createStylesheet} from '../../theming-new';


export default function UnitDetails({unitName}: {unitName: Unit}) {
    const appStyles = useTheme(appVariants);
    const styles = useStyles();
    const unitLineId = getUnitLineIdForUnit(unitName);
    const unitLineName = getUnitLineNameForUnit(unitName);
    const unitLine = unitLines[unitLineId];

    console.log('unitLine', unitLine);
    console.log('unitLineId', unitLineId);
    console.log('unitLineName', unitLineName);

    return (
        <View style={styles.container}>
            <UnitCosts unitLineId={unitLineId} unitId={unitName}/>

            <MyText style={styles.description}>{getUnitDescription(unitName)}</MyText>
            <Space/>

            <UnitRelated unitId={unitName}/>

            <UnitStats unitLineId={unitLineId} unitId={unitName} />

            <UnitCounters unitId={unitName}/>

            <UnitUpgrades unitLineId={unitLineId} unitId={unitName} />

            {
                !getAbilityEnabledForAllCivs({unit: unitName}) &&
                <>

                    <View style={styles.row}>
                        <MyText style={styles.header1}>
                            Availability
                        </MyText>
                    </View>
                    <Space/>
                    <CivAvailability unit={unitName}/>
                </>
            }

            <View style={appStyles.expanded}/>
            <Fandom articleName={getUnitName(unitName)}/>
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    header1: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '500',
    },

    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        padding: 20,
    },
}));

