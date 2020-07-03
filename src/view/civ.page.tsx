import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import {civs, getCivIcon} from "../helper/civs";
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {
    getUnitLineForUnit, getUnitLineIcon, getUnitLineName, getUnitName, Unit, unitLines, units
} from "../helper/units";
import {aoeData} from "../data/data";
import {UnitComp} from "./unit.page";
import {getTechName, techList} from "../helper/techs";

type aoeStringKey = keyof typeof aoeData.strings;
type aoeCivKey = keyof typeof aoeData.civ_helptexts;








function escapeRegExpFn (string: string): string {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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

    const techReplaceList = techList.map(t => ({ name: t.name, text: getTechName(t.name)}));
    const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineForUnit(t as Unit), text: getUnitName(t as Unit)}));
    const reverseTechMap = Object.assign({}, ...techReplaceList.map((x) => ({[x.text]: x})));
    const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));

    const allReplaceList = [...techReplaceList, ...unitReplaceList];
    
    const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');

    const parts = civDescriptionContent.split(regex);
    console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<Text key={i}>{parts[i]}</Text>);
        } else {
            console.log('part', parts[i]);
            const matchingTech = reverseTechMap[parts[i]]?.name;
            if (matchingTech) {
                texts.push(<Text key={i} style={styles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</Text>);
            }
            const matchingUnit = reverseUnitMap[parts[i]]?.name;
            if (matchingUnit) {
                texts.push(<Text key={i} style={styles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</Text>);
            }
        }
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.content}>{civType}</Text>
            <Text/>
            {/*<Text style={styles.content}>{civDescriptionContent}</Text>*/}
            {/*<Text/>*/}

            <Text style={styles.content}>{texts}</Text>

            {/*{*/}
            {/*    Object.keys(unitLines).map(ul =>*/}
            {/*        <UnitComp key={ul} unit={ul}/>*/}
            {/*    )*/}
            {/*}*/}
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
        return <ScrollView><CivDetails civ={civ} /></ScrollView>;
    }

    return <CivList/>
}

const styles = StyleSheet.create({
    link: {
        color: '#397AF9',
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
