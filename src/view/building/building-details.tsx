import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {getBuildingData, getBuildingDescription, getBuildingName, Building} from "../../helper/buildings";
import Fandom from "../components/fandom";
import {getOtherIcon, Other, sortResources} from "../../helper/units";
import {MyText} from "../components/my-text";
import {keysOf} from "../../helper/util";
import {useTheme} from "../../theming";
import {appVariants} from "../../styles";
import CivAvailability from "../components/civ-availability";


export default function BuildingDetails({building}: {building: Building}) {
    const appStyles = useTheme(appVariants);
    const data = getBuildingData(building);
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
                <MyText style={styles.description}>Built in {data.TrainTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getBuildingDescription(building)}</MyText>
            <MyText/>

            <CivAvailability building={building}/>

            <View style={appStyles.expanded}/>
            <Fandom articleName={getBuildingName(building)}/>
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
