import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getTechDescription, Tech} from "../../helper/techs";


export default function TechDetails({tech}: {tech: Tech}) {
    return (
        <View style={styles.container}>
            <Text style={styles.description}>{getTechDescription(tech)}</Text>
            <Text/>
        </View>
    );
}


const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
    container: {
        backgroundColor: 'white',
    },
});
