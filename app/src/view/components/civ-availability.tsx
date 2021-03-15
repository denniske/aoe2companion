import {Building, Civ, civs, getAbilityEnabled, getCivNameById, orderCivs, Tech, Unit} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {MyText} from "./my-text";
import React from "react";
import Space from "./space";
import {getCivIcon} from "../../helper/civs";
import {createStylesheet} from "../../theming-new";
import {getTranslation} from '../../helper/translate';


interface CivAvailabilityProps {
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export default function CivAvailability({tech, unit, building}: CivAvailabilityProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const civAvailable = civs.filter(civ => getAbilityEnabled({civ, tech, unit, building}));
    const civUnavailable = civs.filter(civ => !getAbilityEnabled({civ, tech, unit, building}));

    const availableForAllCivs = civAvailable.length === civs.length;
    const availableForOneCivs = civAvailable.length === 1;

    if (availableForAllCivs) {
        return <View/>;
    }

    return (
        <View style={styles.civListRow}>
            <View style={styles.civList}>
                <MyText>{getTranslation('unit.availability.available')}</MyText>
                <Space/>
                {
                    orderCivs(civAvailable).map(civ =>
                        <TouchableOpacity key={civ} style={styles.civCol} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.row}>
                                <Image fadeDuration={0} style={styles.civIcon} source={getCivIcon(civ) as any}/>
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
                        <TouchableOpacity key={civ} style={styles.civCol} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.row}>
                                <Image fadeDuration={0} style={styles.civIcon} source={getCivIcon(civ) as any}/>
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
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    civCol: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
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
}));
