import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../App2";
import {getBuildingName, Building, buildings} from "@nex/data";
import IconHeader from "../components/navigation-header/icon-header";
import TextHeader from "../components/navigation-header/text-header";
import BuildingDetails from "./building-details";
import BuildingList from "./building-list";
import {getBuildingIcon} from "../../helper/buildings";
import {getTranslation} from '../../helper/translate';


export function BuildingTitle(props: any) {
    const building = props.route?.params?.building;
    if (building) {
        return <IconHeader
            icon={getBuildingIcon(building)}
            text={getBuildingName(props.route.params?.building)}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={getTranslation('building.title')} onLayout={props.titleProps.onLayout}/>;
}

export function buildingTitle(props: any) {
    const building = props.route?.params?.building;
    return building ? getBuildingName(building) : getTranslation('building.title');
}

export default function BuildingPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Building'>>();
    const building = route.params?.building as Building;

    if (building) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <BuildingDetails building={building}/>
            </ScrollView>
        );
    }

    return <BuildingList/>;
}

const styles = StyleSheet.create({
    container: {
    },
});
