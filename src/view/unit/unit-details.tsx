import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    getUnitDescription, getUnitLineIdForUnit, getUnitLineNameForUnit, getUnitName, Unit, unitLines
} from "../../helper/units";
import Fandom from "../components/fandom";
import {MyText} from "../components/my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {appVariants} from "../../styles";
import {UnitStats} from "./unit-stats";
import {UnitUpgrades} from "./unit-upgrades";
import {UnitCosts} from "./unit-costs";
import UnitCounters from "./unit-counters";
import CivAvailability from "../components/civ-availability";
import {getAbilityEnabledForAllCivs} from "../components/tech-tree";


export default function UnitDetails({unitName}: {unitName: Unit}) {
    const appStyles = useTheme(appVariants);
    const styles = useTheme(variants);
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
            <MyText/>

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
                    <MyText/>
                    <CivAvailability unit={unitName}/>
                </>
            }

            <View style={appStyles.expanded}/>
            <Fandom articleName={getUnitName(unitName)}/>
        </View>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);

