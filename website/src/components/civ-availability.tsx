import {Building, Civ, civs, getAbilityEnabled, Tech, Unit} from "@nex/data";
import React from "react";
import Space from "./space";
import {getCivIcon} from "../helper/civs";
import {MyText, TouchableOpacity, View, Image, StyleSheet} from "./compat";


interface CivAvailabilityProps {
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export default function CivAvailability({tech, unit, building}: CivAvailabilityProps) {
    const styles = useStyles();
    const civAvailable = civs.filter(c => c != 'Indians').filter(civ => getAbilityEnabled({civ, tech, unit, building}));
    const civUnavailable = civs.filter(c => c != 'Indians').filter(civ => !getAbilityEnabled({civ, tech, unit, building}));

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
                        <TouchableOpacity key={civ} style={styles.civCol} href='/civilization/[civId]' as={`/civilization/${civ}`} naked>
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
                        <TouchableOpacity key={civ} style={styles.civCol} href='/civilization/[civId]' as={`/civilization/${civ}`} naked>
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


const useStyles = StyleSheet.create((theme) => ({
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
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));
