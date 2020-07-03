import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {
    getEliteUniqueResearchIcon, getUnitDescription, getUnitIcon, getUnitLineIcon, getUnitLineName, getUnitName,
    IUnitLine, Unit, UnitLine,
    unitLines,
    units
} from "../helper/units";
import {getTechDescription, getTechIcon, getTechName, ITechEffect, Tech, techEffectDict, techs} from "../helper/techs";
import {aoeCivKey} from "../data/data";
import {groupBy, sortBy} from "lodash-es";
import {Civ, civs, getCivIcon} from "../helper/civs";
import {CivDetails, CivList} from "./civ.page";


export function TechDetails({tech}: {tech: Tech}) {
    const navigation = useNavigation<RootStackProp>();
    const unitLine = techs[tech];

    return (
        <View style={styles.detailsContainer}>
            {/*<View style={styles.row}>*/}
            {/*    <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>*/}
            {/*    <Text> {getUnitLineName(unit)}</Text>*/}
            {/*</View>*/}
            <Text style={styles.description}> {getTechDescription(tech)}</Text>
            <Text/>
        </View>
    );
}

function getUnitLineTitle(unitLine: IUnitLine) {
    // if (unitLine.unique) {
    //     return getUnitName(unitLine.units[0]);// + ' + Elite';
    // }
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function TechCompBig({tech: tech}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <View style={styles.unitIconTitle}>
                    <Text> {getTechName(tech)}</Text>
                </View>
                {/*<Text> {getUnitLineName(unit)}</Text>*/}
            </View>
        </TouchableOpacity>
    );
}

function TechList() {
    const navigation = useNavigation<RootStackProp>();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civContainer}>
                {
                    sortBy(Object.keys(techs)).map(ul =>
                            // <Text key={ul} >{ul}</Text>
                        <TechCompBig key={ul} tech={ul}/>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function TechPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Tech'>>();
    const tech = route.params?.tech as aoeCivKey;

    if (tech) {
        return <ScrollView><TechDetails tech={tech} /></ScrollView>;
    }

    return <TechList/>
}

const styles = StyleSheet.create({
    description: {
        lineHeight: 20,
    },
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        // marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
        textAlign: 'left',
        lineHeight: 20,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },

    icon: {
      width: 30,
      height: 30,
    },
    name: {
        textAlign: 'center',
        marginLeft: 15,
    },
    civBlock: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        marginHorizontal: 0,
        marginVertical: 5,
    },
    civContainer: {
        // flex: 1,
        // backgroundColor: 'yellow',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        padding: 20,
    },

    rowBig: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // width: 100,
        // backgroundColor: 'blue',
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // width: 100,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    unitIconBig: {
        width: 30,
        height: 30,
        // flex: 1,
        // marginRight: 5,
    },
    unitIconTitle: {
        // width: '100%',
        flex: 1,
        // marginLeft: 5,
        paddingLeft: 5,
        // backgroundColor: 'red',
    },
    link: {
        color: '#397AF9',
    },
    small: {
        fontSize: 12,
    }
});
