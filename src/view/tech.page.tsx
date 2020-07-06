import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {getTechDescription, getTechIcon, getTechName, Tech, techs} from "../helper/techs";
import {sortBy} from "lodash-es";
import IconHeader from "./navigation-header/icon-header";
import TextHeader from "./navigation-header/text-header";


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

export function TechDetails({tech}: {tech: Tech}) {
    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.description}>{getTechDescription(tech)}</Text>
            <Text/>
        </View>
    );
}

export function TechCompBig({tech: tech}: any) {
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <View style={styles.unitIconTitle}>
                    <Text>{getTechName(tech)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function TechList() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civContainer}>
                {
                    sortBy(Object.keys(techs)).map(ul =>
                        <TechCompBig key={ul} tech={ul}/>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function TechPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Tech'>>();
    const tech = route.params?.tech as Tech;

    if (tech) {
        return <ScrollView><TechDetails tech={tech} /></ScrollView>;
    }

    return <TechList/>
}

const styles = StyleSheet.create({
    description: {
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
