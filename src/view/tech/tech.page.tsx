import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../App";
import {getTechIcon, getTechName, Tech} from "../../helper/techs";
import IconHeader from "../components/navigation-header/icon-header";
import TextHeader from "../components/navigation-header/text-header";
import TechDetails from "./tech-details";
import TechList from "./tech-list";


export function TechTitle(props: any) {
    if (props.route?.params?.tech) {
        return <IconHeader
            icon={getTechIcon(props.route?.params?.tech)}
            text={getTechName(props.route.params?.tech)}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={'Techs'} onLayout={props.titleProps.onLayout}/>;
}

export function techTitle(props: any) {
    return props.route?.params?.tech ? getTechName(props.route.params?.tech) : 'Techs';
}

export default function TechPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Tech'>>();
    const tech = route.params?.tech as Tech;

    if (tech) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <TechDetails tech={tech}/>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TechList/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
    },
});
