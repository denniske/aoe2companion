import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {getTechData, getTechDescription, getTechName, Tech} from "../../helper/techs";
import {appStyles} from "../../styles";
import Fandom from "../components/fandom";
import {getOtherIcon, getUnitData, getUnitLineName, Other, sortResources} from "../../helper/units";
import {MyText} from "../components/my-text";
import {keysOf} from "../../helper/util";


export default function TechDetails({tech}: {tech: Tech}) {
    const data = getTechData(tech);
    return (
        <View style={styles.container}>
            <View style={styles.costsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <View key={res} style={styles.resRow}>
                            <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                            <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>
                        </View>
                    )
                }
                <MyText style={styles.description}>Researched in {data.ResearchTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getTechDescription(tech)}</MyText>
            <MyText/>
            <View style={appStyles.expanded}/>
            <Fandom articleName={getTechName(tech)}/>
        </View>
    );
}


const styles = StyleSheet.create({
    resRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    resIcon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
    resDescription: {
        marginRight: 20,
    },

    costsRow: {
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },

    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        padding: 20,
    },
});
