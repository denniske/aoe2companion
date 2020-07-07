import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../App";
import {getUnitLineIcon, getUnitLineName} from "../../helper/units";
import {aoeCivKey} from "../../data/data";
import IconHeader from "../components/navigation-header/icon-header";
import TextHeader from "../components/navigation-header/text-header";
import UnitDetails from "./unit-details";
import UnitList from "./unit-list";


export function UnitTitle(props: any) {
    if (props.route?.params?.unit) {
        return <IconHeader
            icon={getUnitLineIcon(props.route?.params?.unit)}
            text={getUnitLineName(props.route.params?.unit)}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={'Units'} onLayout={props.titleProps.onLayout}/>;
}

export function unitTitle(props: any) {
    return props.route?.params?.unit ? getUnitLineName(props.route.params?.unit) : 'Units';
}

export default function UnitPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Unit'>>();
    const unit = route.params?.unit as aoeCivKey;

    if (unit) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <UnitDetails unit={unit}/>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <UnitList/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
});
