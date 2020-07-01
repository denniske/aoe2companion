import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import {civs, getCivIcon} from "../helper/civs";
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import * as aoeData from "../data/data.json"
import {getString} from "../helper/strings";
import {getUnitLineIcon, getUnitLineName} from "../helper/units";

type aoeStringKey = keyof typeof aoeData.strings;
type aoeCivKey = keyof typeof aoeData.civ_helptexts;

function Unit({unit}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <Text> {getUnitLineName(unit)}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function CivDetails({civ}: {civ: aoeCivKey}) {
    const navigation = useNavigation<RootStackProp>();
    const civStringKey = aoeData.civ_helptexts[civ] as aoeStringKey;
    const civDescription = aoeData.strings[civStringKey]
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<br>/g, '');

    const civNameStringKey = aoeData.civ_names[civ] as aoeStringKey;
    const civName = aoeData.strings[civNameStringKey];

    const civType = civDescription.split('\n')[0];
    const civDescriptionContent = civDescription.split('\n').filter((a, b) => b >= 2).join('\n');

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.content}>{civType}</Text>
            <Text/>
            <Text style={styles.content}>{civDescriptionContent}</Text>
            <Text/>
            <Unit unit="Kamayuk"/>
            <Unit unit="Slinger"/>
        </View>
    );
}

export function CivList() {
    const navigation = useNavigation<RootStackProp>();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civContainer}>
                {
                    civs.map((civ, i) =>
                        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.civBlock}>
                                <Image style={styles.icon} source={getCivIcon(i)}/>
                                <Text style={styles.name}>{civ}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function CivPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Civ'>>();
    const civ = route.params?.civ as aoeCivKey;

    if (civ) {
        return <CivDetails civ={civ} />;
    }

    return <CivList/>
}

const styles = StyleSheet.create({
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
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },

    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
    },
});
