import {Civ, getCivHasTech, getCivHasUnit} from "../../helper/civs";
import {getTechIcon, Tech} from "../../helper/techs";
import {getUnitIcon, getUnitLineForUnit, Unit} from "../../helper/units";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {aoeCivKey} from "../../data/data";
import {MyText} from "./my-text";


export function TechTree({civ}: {civ: aoeCivKey}) {

    return (
        <View style={styles.container}>
            <MyText style={styles.sectionHeader}>Tech Tree</MyText>

            <MyText style={styles.heading}>Blacksmith</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} tech="Forging"/>
                <Ability2 civ={civ} tech="ScaleMailArmor"/>
                <Ability2 civ={civ} tech="ScaleBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="Fletching"/>
                <Ability2 civ={civ} tech="PaddedArcherArmor"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} tech="IronCasting"/>
                <Ability2 civ={civ} tech="ChainMailArmor"/>
                <Ability2 civ={civ} tech="ChainBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="BodkinArrow"/>
                <Ability2 civ={civ} tech="LeatherArcherArmor"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} tech="BlastFurnace"/>
                <Ability2 civ={civ} tech="PlateMailArmor"/>
                <Ability2 civ={civ} tech="PlateBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="Bracer"/>
                <Ability2 civ={civ} tech="RingArcherArmor"/>
            </View>

            <MyText style={styles.heading}>Other</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} tech="Bloodlines"/>
                <Ability2 civ={civ} tech="Husbandry"/>
                <Ability0 civ={civ}/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="ThumbRing"/>
                <Ability2 civ={civ} tech="ParthianTactics"/>
            </View>

            <MyText style={styles.heading}>Siege</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="BatteringRam"/>
                <Ability2 civ={civ} unit="Mangonel"/>
                <Ability2 civ={civ} unit="Scorpion"/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="CappedRam"/>
                <Ability2 civ={civ} unit="Onager"/>
                <Ability2 civ={civ} unit="HeavyScorpion"/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="SiegeRam"/>
                <Ability2 civ={civ} unit="SiegeOnager"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="BombardCannon"/>
                <Ability2 civ={civ} tech="SiegeEngineers"/>
            </View>

            <MyText style={styles.heading}>Infantry</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="LongSwordsman"/>
                <Ability2 civ={civ} unit="Spearman"/>
                <Ability2 civ={civ} unit="EagleScout"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="TwoHandedSwordsman"/>
                <Ability2 civ={civ} unit="Pikeman"/>
                <Ability2 civ={civ} unit="EagleWarrior"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="Champion"/>
                <Ability2 civ={civ} unit="Halberdier"/>
                <Ability2 civ={civ} unit="EliteEagleWarrior"/>
            </View>

            <MyText style={styles.heading}>Cavalry</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="ScoutCavalry"/>
                <Ability2 civ={civ} unit="Knight"/>
                <Ability2 civ={civ} unit="CamelRider"/>
                <Ability2 civ={civ} unit="BattleElephant"/>
                <Ability2 civ={civ} unit="SteppeLancer"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="LightCavalry"/>
                <Ability2 civ={civ} unit="Cavalier"/>
                <Ability2 civ={civ} unit="HeavyCamelRider"/>
                <Ability2 civ={civ} unit="EliteBattleElephant"/>
                <Ability2 civ={civ} unit="EliteSteppeLancer"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="Hussar"/>
                <Ability2 civ={civ} unit="Paladin"/>
                <Ability2 civ={civ} unit="ImperialCamelRider"/>
                <Ability0 civ={civ}/>
                <Ability0 civ={civ}/>
            </View>

            <MyText style={styles.heading}>Archer</MyText>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="Archer"/>
                <Ability2 civ={civ} unit="Skirmisher"/>
                <Ability0 civ={civ}/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="Crossbowman"/>
                <Ability2 civ={civ} unit="EliteSkirmisher"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="CavalryArcher"/>
            </View>
            <View style={styles.row}>
                <Ability2 civ={civ} unit="Arbalester"/>
                <Ability2 civ={civ} unit="ImperialSkirmisher"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="HeavyCavalryArcher"/>
                <Ability2 civ={civ} unit="HandCannoneer"/>
            </View>
        </View>
    );
}

interface AbilityProps {
    civ: Civ;
    tech?: Tech;
    unit?: Unit;
}
interface AbilityHelperProps {
    tech?: Tech;
    unit?: Unit;
}

function getAbilityEnabled({civ, tech, unit}: AbilityProps) {
    if (tech) {
        return getCivHasTech(civ, tech);
    }
    if (unit) {
        return getCivHasUnit(civ, unit);
    }
    return false;
}

function getAbilityIcon({tech, unit}: AbilityHelperProps) {
    if (tech) {
        return getTechIcon(tech);
    }
    if (unit) {
        return getUnitIcon(unit);
    }
    return false;
}

function getAbilityNavCallback({tech, unit}: AbilityHelperProps) {
    const navigation = useNavigation<RootStackProp>();
    if (tech) {
        return () => navigation.push('Tech', {tech: tech});
    }
    if (unit) {
        return () => navigation.push('Unit', {unit: getUnitLineForUnit(unit)!.units[0]});
    }
    return () => {};
}

function Ability0({civ, tech, unit}: AbilityProps) {
    return (
        <View style={[styles.imageContainer0, {borderColor: 'transparent'}]}/>
    );
}

function Ability({civ, tech, unit}: AbilityProps) {
    const enabled = getAbilityEnabled({civ, tech, unit});
    return (
        <View style={styles.imageContainer2}>
            <ImageBackground source={getAbilityIcon({tech, unit})} imageStyle={styles.imageInner2} style={styles.image2}>
                {
                    enabled &&
                    <MyText style={styles.imageText}>+4</MyText>
                }
            </ImageBackground>
        </View>
    );
}

function Ability2({civ, tech, unit}: AbilityProps) {
    const enabled = getAbilityEnabled({civ, tech, unit});
    const color = enabled ? '#555' : '#C00';
    const opacity = enabled ? 1 : 0.4;
    return (
        <TouchableOpacity style={[styles.imageContainer2, {borderColor: color, opacity: opacity}]} onPress={getAbilityNavCallback({tech, unit})}>
            <ImageBackground source={getAbilityIcon({tech, unit})} imageStyle={styles.imageInner2} style={styles.image2}>
                {
                    !enabled &&
                    <Icon name={'close'} size={40} color="red" />
                }
            </ImageBackground>
        </TouchableOpacity>
    );
}

function AbilityText({civ, tech, unit}: AbilityProps) {
    return (
        <MyText style={styles.content}>Has Bloodlines: {getCivHasTech(civ, tech!) ? 'true' : 'false'}</MyText>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        marginTop: 30,
        marginBottom: 15,
        fontSize: 15,
        fontWeight: '500',
    },
    imageInner2: {
        resizeMode: "cover",
        alignSelf: 'flex-end',
    },
    imageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F00',
        textShadowColor: 'black',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
    },
    image2: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        resizeMode: "contain",
        // backgroundColor: 'blue',
    },
    imageContainer0: {
        borderWidth: 3,
        borderColor: '#FFF',
        width: 44,
        height: 44,
        margin: 2,
        // backgroundColor: 'blue',
    },
    imageContainer2: {
        borderWidth: 3,
        borderColor: '#555',
        width: 44,
        height: 44,
        margin: 2,
        // backgroundColor: 'blue',
    },
    heading: {
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
        textAlign: 'left',
        lineHeight: 20,
    },
    container: {
        // flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginHorizontal: -2,
        // backgroundColor: 'blue',
    },
});
