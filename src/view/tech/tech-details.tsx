import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getTechDescription, getTechName, Tech} from "../../helper/techs";
import {appStyles} from "../styles";
import Fandom from "../components/fandom";
import {getUnitLineName} from "../../helper/units";


export default function TechDetails({tech}: {tech: Tech}) {
    return (
        <View style={styles.container}>
            <Text style={styles.description}>{getTechDescription(tech)}</Text>
            <Text/>
            <View style={appStyles.expanded}/>
            <Fandom articleName={getTechName(tech)}/>
        </View>
    );
}


const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: 'white',
        padding: 20,
    },
});
