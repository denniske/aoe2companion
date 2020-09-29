import {Building, Civ, civs, getAbilityEnabled, Tech, Unit} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {MyText} from "./my-text";
import React from "react";
import Space from "./space";
import {getCivIcon} from "../../helper/civs";
import {createStylesheet} from "../../theming-new";


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

    const availableForAllCivs = civUnavailable.length === 0;

    if (availableForAllCivs) {
        return <View/>;
    }

    return (
        <View style={styles.civListRow}>
            <View style={styles.civList}>
                <MyText>Available</MyText>
                <Space/>
                {
                    !availableForAllCivs && civAvailable.map(civ =>
                        <TouchableOpacity key={civ} style={styles.civCol} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.row}>
                                <Image style={styles.civIcon} fadeDuration={0} source={getCivIcon(civ) as any}/>
                                <MyText> {civ}</MyText>
                            </View>
                        </TouchableOpacity>
                    )
                }
                {
                    availableForAllCivs &&
                    <MyText>All civilizations</MyText>
                }
            </View>
            <View style={styles.civList}>
                <MyText>Unavailable</MyText>
                <Space/>
                {
                    !availableForAllCivs && civUnavailable.map(civ =>
                        <TouchableOpacity key={civ} style={styles.civCol} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.row}>
                                <Image style={styles.civIcon} fadeDuration={0} source={getCivIcon(civ) as any}/>
                                <MyText> {civ}</MyText>
                            </View>
                        </TouchableOpacity>
                    )
                }
                {
                    availableForAllCivs &&
                    <MyText>-</MyText>
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
        width: 100,
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
