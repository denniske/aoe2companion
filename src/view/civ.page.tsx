import React, {useEffect, useState} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, Image, View, ScrollView, ImageBackground, TouchableHighlight
} from 'react-native';
import {Civ, civs, getCivHasTech, getCivHasUnit, getCivHistoryImage, getCivIconByIndex} from "../helper/civs";
import {RouteProp, useLinkTo, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {
    getUnitIcon,
    getUnitLineForUnit, getUnitLineIcon, getUnitLineName, getUnitName, Unit, unitLines, units
} from "../helper/units";
import {aoeCivKey, aoeData, aoeStringKey} from "../data/data";
import {getTechIcon, getTechName, Tech, techList} from "../helper/techs";
import {escapeRegExpFn} from "../helper/util";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export function CivDetails({civ}: {civ: aoeCivKey}) {
    const navigation = useNavigation<RootStackProp>();
    const civStringKey = aoeData.civ_helptexts[civ] as aoeStringKey;
    const civDescription = aoeData.strings[civStringKey]
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<br>/g, '');

    const civNameStringKey = aoeData.civ_names[civ] as aoeStringKey;
    const civName = aoeData.strings[civNameStringKey];

    const civType = civDescription.split('\n')[0];
    const civDescriptionContent = civDescription.split('\n').filter((a, b) => b >= 2).join('\n');

    const techReplaceList = techList.map(t => ({ name: t.name, text: getTechName(t.name)}));
    const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineForUnit(t as Unit), text: getUnitName(t as Unit)}));
    const reverseTechMap = Object.assign({}, ...techReplaceList.map((x) => ({[x.text]: x})));
    const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));

    const allReplaceList = [...techReplaceList, ...unitReplaceList];
    
    const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');

    const parts = civDescriptionContent.split(regex);
    console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<Text key={i}>{parts[i]}</Text>);
        } else {
            console.log('part', parts[i]);
            const matchingTech = reverseTechMap[parts[i]]?.name;
            if (matchingTech) {
                texts.push(<Text key={i} style={styles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</Text>);
            }
            const matchingUnit = reverseUnitMap[parts[i]]?.name;
            if (matchingUnit) {
                texts.push(<Text key={i} style={styles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</Text>);
            }
        }
    }

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.content}>{civType}</Text>
            <Text/>
            <Text style={styles.content}>{texts}</Text>

            {/*<Text style={styles.content}>Has Bloodlines: {getCivHasTech(civ, 'Bloodlines') ? 'true' : 'false'}</Text>*/}
            {/*<Image style={styles.unitIcon} source={getTechIcon(tech)}/>*/}

            {/*<View style={styles.row2}>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability civ={civ} tech="Forging"/>*/}
            {/*    <Ability2 civ={civ} tech="ScaleMailArmor"/>*/}
            {/*    <Ability2 civ={civ} tech="ScaleBardingArmor"/>*/}
            {/*</View>*/}
            {/*<View style={styles.row2}>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*    <Ability2 civ={civ} tech="Fletching"/>*/}
            {/*    <Ability2 civ={civ} tech="PaddedArcherArmor"/>*/}
            {/*    <Ability0 civ={civ}/>*/}
            {/*</View>*/}
            {/*<View style={styles.row2}>*/}
            {/*    <Ability2 civ={civ} unit="SiegeRam"/>*/}
            {/*    <Ability2 civ={civ} unit="SiegeOnager"/>*/}
            {/*    <Ability2 civ={civ} unit="HeavyScorpion"/>*/}
            {/*    <Ability2 civ={civ} unit="BombardCannon"/>*/}
            {/*    <Ability2 civ={civ} tech="Bloodlines"/>*/}
            {/*    <Ability2 civ={civ} tech="Husbandry"/>*/}
            {/*    <Ability2 civ={civ} tech="ThumbRing"/>*/}
            {/*</View>*/}

            <Text style={styles.sectionHeader}>Tech Tree</Text>

            <Text style={styles.heading}>Blacksmith</Text>
            <View style={styles.row2}>
                <Ability2 civ={civ} tech="Forging"/>
                <Ability2 civ={civ} tech="ScaleMailArmor"/>
                <Ability2 civ={civ} tech="ScaleBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="Fletching"/>
                <Ability2 civ={civ} tech="PaddedArcherArmor"/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} tech="IronCasting"/>
                <Ability2 civ={civ} tech="ChainMailArmor"/>
                <Ability2 civ={civ} tech="ChainBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="BodkinArrow"/>
                <Ability2 civ={civ} tech="LeatherArcherArmor"/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} tech="BlastFurnace"/>
                <Ability2 civ={civ} tech="PlateMailArmor"/>
                <Ability2 civ={civ} tech="PlateBardingArmor"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="Bracer"/>
                <Ability2 civ={civ} tech="RingArcherArmor"/>
            </View>

            <Text style={styles.heading}>Other</Text>
            <View style={styles.row2}>
                <Ability2 civ={civ} tech="Bloodlines"/>
                <Ability2 civ={civ} tech="Husbandry"/>
                <Ability0 civ={civ}/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} tech="ThumbRing"/>
            </View>

            <Text style={styles.heading}>Siege</Text>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="BatteringRam"/>
                <Ability2 civ={civ} unit="Mangonel"/>
                <Ability2 civ={civ} unit="Scorpion"/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="CappedRam"/>
                <Ability2 civ={civ} unit="Onager"/>
                <Ability2 civ={civ} unit="HeavyScorpion"/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="SiegeRam"/>
                <Ability2 civ={civ} unit="SiegeOnager"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="BombardCannon"/>
                <Ability2 civ={civ} tech="SiegeEngineers"/>
            </View>


            <Text style={styles.heading}>Infantry & Cavalry</Text>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="LongSwordsman"/>
                <Ability2 civ={civ} unit="Spearman"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="ScoutCavalry"/>
                <Ability2 civ={civ} unit="Knight"/>
                <Ability2 civ={civ} unit="CamelRider"/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="TwoHandedSwordsman"/>
                <Ability2 civ={civ} unit="Pikeman"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="LightCavalry"/>
                <Ability2 civ={civ} unit="Cavalier"/>
                <Ability2 civ={civ} unit="HeavyCamelRider"/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="Champion"/>
                <Ability2 civ={civ} unit="Halberdier"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="Hussar"/>
                <Ability2 civ={civ} unit="Paladin"/>
                <Ability2 civ={civ} unit="ImperialCamelRider"/>
            </View>

            <Text style={styles.heading}>Archer</Text>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="Archer"/>
                <Ability2 civ={civ} unit="Skirmisher"/>
                <Ability0 civ={civ}/>
                <Ability0 civ={civ}/>
            </View>
            <View style={styles.row2}>
                <Ability2 civ={civ} unit="Crossbowman"/>
                <Ability2 civ={civ} unit="EliteSkirmisher"/>
                <Ability0 civ={civ}/>
                <Ability2 civ={civ} unit="CavalryArcher"/>
            </View>
            <View style={styles.row2}>
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
                <Text style={styles.imageText}>+4</Text>
            }
        </ImageBackground>
        </View>
    );
}

function Ability2({civ, tech, unit}: AbilityProps) {
    const enabled = getAbilityEnabled({civ, tech, unit});
    const color = enabled ? '#555' : '#C00';
    // const color = '#555';
    const opacity = enabled ? 1 : 0.4;
    return (
        <View style={[styles.imageContainer2, {borderColor: color, opacity: opacity}]}>
        <ImageBackground source={getAbilityIcon({tech, unit})} imageStyle={styles.imageInner2} style={styles.image2}>
            {
                !enabled &&
                <Icon name={'close'} size={40} color="red" />
            }
        </ImageBackground>
        </View>
    );
}

function AbilityText({civ, tech, unit}: AbilityProps) {
    return (
        <Text style={styles.content}>Has Bloodlines: {getCivHasTech(civ, tech!) ? 'true' : 'false'}</Text>
    );
}

export function CivList() {
    const navigation = useNavigation<RootStackProp>();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civContainer}>
                {
                    civs.map((civ, i) =>
                        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
                            <View style={styles.civBlock}>
                                <Image style={styles.icon} source={getCivIconByIndex(i)}/>
                                <Text style={styles.name}>{civ}</Text>
                                {/*<Text style={styles.name}>{civ} {getCivHasTech(civ, 'Supplies') ? '' : 'FALSE'}</Text>*/}
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function CivPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Civ'>>();
    const civ = route.params?.civ as aoeCivKey;

    if (civ) {
        return (
            <ImageBackground imageStyle={styles.imageInner} source={getCivHistoryImage(civ)} style={styles.image}>
                <ScrollView>
                    <CivDetails civ={civ}/>
                </ScrollView>
            </ImageBackground>
        );
    }

    return <CivList/>
}

const styles = StyleSheet.create({
    sectionHeader: {
        marginTop: 30,
        marginBottom: 15,
        fontSize: 15,
        fontWeight: '500',
        // textAlign: 'center',
    },
    imageInner2: {
        // opacity: 0.1,
        resizeMode: "cover",
        alignSelf: 'flex-end',
        // bottom: -50,
        // right: 0,
        // left: undefined,
        // top: undefined,
        // height: 400,
        // width: '100%',
    },
    imageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F00',
        // fontFamily: 'Arial',
        textShadowColor: 'black',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
        // textAlignVertical: 'center',
        // height: '100%',
        // backgroundColor: 'red'
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
    imageInner: {
        opacity: 0.1,
        resizeMode: "cover",
        alignSelf: 'flex-end',
        bottom: -50,
        // right: 0,
        // left: undefined,
        top: undefined,
        height: 400,
        // width: '100%',
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        // backgroundColor: 'blue',
    },
    link: {
        color: '#397AF9',
    },
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
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
    detailsContainer: {
        flex: 1,
        // backgroundColor: 'yellow',
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
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },

    rowSpacer: {
        marginBottom: 10,
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginHorizontal: -2,
        // backgroundColor: 'blue',
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        width: 20,
        height: 20,
    },
});
