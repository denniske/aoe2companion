import {Building, Civ, civs, getAbilityEnabled, getCivNameById, orderCivs, Tech, Unit} from "@nex/data";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {MyText} from "./my-text";
import React from "react";
import Space from "./space";
import {getCivIconLocal} from "../../helper/civs";
import {createStylesheet} from "../../theming-new";
import { router } from "expo-router";
import { useTranslation } from '@app/helper/translate';


interface CivAvailabilityProps {
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export default function CivAvailability({tech, unit, building}: CivAvailabilityProps) {
    const getTranslation = useTranslation();
    const styles = useStyles();

    const civAvailable = civs.filter(c => c != 'Indians').filter(civ => getAbilityEnabled({civ, tech, unit, building}));
    const civUnavailable = civs.filter(c => c != 'Indians').filter(civ => !getAbilityEnabled({civ, tech, unit, building}));

    const availableForAllCivs = civAvailable.length === civs.length;
    const availableForOneCivs = civAvailable.length === 1;

    if (availableForAllCivs) {
        return <View/>;
    }

    return (
        <View className="">

            <View style={styles.row}>
                <MyText style={styles.header1}>
                    {getTranslation('unit.heading.availability')}
                </MyText>
            </View>
            <Space/>

            <View style={styles.civListRow}>
                <View style={styles.civList}>
                    <MyText>{getTranslation('unit.availability.available')}</MyText>
                    <Space/>
                    {
                        orderCivs(civAvailable).map(civ =>
                            <TouchableOpacity key={civ} style={styles.civCol}
                                              onPress={() => router.navigate(`/explore/civilizations/${civ}`)}>
                                <View style={styles.row}>
                                    <Image style={styles.civIcon}
                                           source={getCivIconLocal(civ) as any}/>
                                    <MyText> {getCivNameById(civ)}</MyText>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={styles.civList}>
                    <MyText>{getTranslation('unit.availability.unavailable')}</MyText>
                    <Space/>
                    {
                        !availableForOneCivs && orderCivs(civUnavailable).map(civ =>
                            <TouchableOpacity key={civ} style={styles.civCol} onPress={() => router.navigate(`/explore/civilizations/${civ}`)}>
                                <View style={styles.row}>
                                    <Image style={styles.civIcon} source={getCivIconLocal(civ) as any}/>
                                    <MyText> {getCivNameById(civ)}</MyText>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {
                        availableForOneCivs &&
                        <MyText>All other civs</MyText>
                    }
                </View>
            </View>
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    civCol: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
    },

    header1: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '500',
    },

    civList: {
        marginRight: 5,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 110,
        // backgroundColor: 'blue',
    },
    civListRow: {
        flexDirection: 'row',
        // backgroundColor: 'blue',
    },
    civIcon: {
        width: 20,
        height: 20,
    },
} as const));
