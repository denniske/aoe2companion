import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getTechDescription, getTechIcon, getTechName, Tech, techs} from "../../helper/techs";
import {sortBy} from "lodash-es";
import {getUnitLineName, unitLines} from "../../helper/units";


export function TechCompBig({tech: tech}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <View style={styles.unitIconTitle}>
                    <Text>{getTechName(tech)}</Text>
                    <Text numberOfLines={1} style={styles.small}>{getTechDescription(tech)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function TechList() {
    return (
        <View>
            {
                sortBy(Object.keys(techs)).map(ul =>
                    <TechCompBig key={ul} tech={ul}/>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
    },
    rowBig: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // backgroundColor: 'blue',
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    unitIconBig: {
        width: 30,
        height: 30,
    },
    unitIconTitle: {
        flex: 1,
        paddingLeft: 8,
        // backgroundColor: 'red',
    },
    small: {
        fontSize: 12,
        color: '#333',
    },
});
