import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../App";
import {
    getUnitIcon, getUnitLineForUnit, getUnitLineIcon, getUnitLineName, getUnitName, Unit, UnitLine
} from "../../../../data/src/helper/units";
import {aoeCivKey} from "../../../../data/src/data/data";
import IconHeader from "../components/navigation-header/icon-header";
import TextHeader from "../components/navigation-header/text-header";
import UnitDetails from "./unit-details";
import UnitList from "./unit-list";
import {getTechIcon, getTechName, techs} from "../../../../data/src/helper/techs";
import {getCivIcon} from "../../../../data/src/helper/civs";


export function UnitTitle(props: any) {
    const unit = props.route?.params?.unit;
    if (unit) {
        const unitLine = getUnitLineForUnit(unit);
        if (unitLine?.civ) {
            return <IconHeader
                // badgeIcon={unitLine.civ ? getCivIcon(unitLine.civ) : null}
                icon={getUnitIcon(props.route?.params?.unit)}
                text={getUnitName(props.route.params?.unit)}
                subtitle={unitLine.civ + ' unique unit'}
                onLayout={props.titleProps.onLayout}
            />;
        }
        return <IconHeader
            icon={getUnitIcon(props.route?.params?.unit)}
            text={getUnitName(props.route.params?.unit)}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={'Units'} onLayout={props.titleProps.onLayout}/>;
}

export function unitTitle(props: any) {
    return props.route?.params?.unit ? getUnitName(props.route.params?.unit) : 'Units';
}

export default function UnitPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Unit'>>();
    const unit = route.params?.unit as Unit;

    if (unit) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <UnitDetails unitName={unit}/>
            </ScrollView>
        );
    }

    return <UnitList/>;
}

const styles = StyleSheet.create({
    container: {
    },
});
