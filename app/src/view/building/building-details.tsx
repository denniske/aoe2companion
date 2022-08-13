import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {getBuildingData, getBuildingDescription, getBuildingName, Building} from "@nex/data";
import Fandom from "../components/fandom";
import {Other, sortResources} from "@nex/data";
import {MyText} from "../components/my-text";
import {keysOf} from "@nex/data";
import {useTheme} from "../../theming";
import {appVariants} from "../../styles";
import CivAvailability from "../components/civ-availability";
import Space from "../components/space";
import {BuildingStats} from "./building-stats";
import {getOtherIcon} from "../../helper/units";
import {getTranslation} from '../../helper/translate';


export default function BuildingDetails({building}: {building: Building}) {
    const appStyles = useTheme(appVariants);
    const data = getBuildingData(building);
    return (
        <View style={styles.container}>
            {/*<View style={styles.costsRow}>*/}
            {/*    {*/}
            {/*        sortResources(keysOf(data.Cost)).map(res =>*/}
            {/*            <View key={res} style={styles.resRow}>*/}
            {/*                <Image fadeDuration={0} style={styles.resIcon} source={getOtherIcon(res as Other)}/>*/}
            {/*                <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>*/}
            {/*            </View>*/}
            {/*        )*/}
            {/*    }*/}
            {/*    <MyText style={styles.description}>{getTranslation('unit.stats.heading.builtin')} {data.TrainTime}s</MyText>*/}
            {/*</View>*/}

            <MyText style={styles.description}>{getBuildingDescription(building)}</MyText>
            <Space/>

            <BuildingStats buildingId={building} />

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
