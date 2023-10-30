import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    Building,
    getBuildingData,
    getBuildingDescription,
    getBuildingLineIdForBuilding,
    getBuildingName
} from "@nex/data";
import Fandom from "../components/fandom";
import {MyText} from "../components/my-text";
import {useTheme} from "../../theming";
import {appVariants} from "../../styles";
import CivAvailability from "../components/civ-availability";
import Space from "../components/space";
import {BuildingStats} from "./building-stats";
import {BuildingUpgrades} from "./building-upgrades";


export default function BuildingDetails({building}: {building: Building}) {
    const appStyles = useTheme(appVariants);
    const data = getBuildingData(building);
    const buildingLineId = getBuildingLineIdForBuilding(building);
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

            <BuildingUpgrades buildingLineId={buildingLineId} buildingId={building} />

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
