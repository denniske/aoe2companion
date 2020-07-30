import React from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    Civ, civDict, civs, getCivDescription, getCivHistoryImage, getCivIconByIndex, getCivTeamBonus, parseCivDescription
} from "../helper/civs";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootStackProp} from "../../App";
import {getUnitLineNameForUnit, getUnitName, Unit, units} from "../helper/units";
import {aoeCivKey} from "../data/data";
import {getTechName, Tech, techList} from "../helper/techs";
import {escapeRegExpFn} from "../helper/util";
import IconHeader from "./components/navigation-header/icon-header";
import TextHeader from "./components/navigation-header/text-header";
import {TechTree} from "./components/tech-tree";
import {UnitCompBig} from "./unit/unit-list";
import {TechCompBig} from "./tech/tech-list";
import {MyText} from "./components/my-text";
import {iconHeight, iconWidth} from "../helper/theme";
import {ITheme, makeVariants, useTheme} from "../theming";
import {appVariants} from "../styles";


export function CivTitle(props: any) {
    if (props.route?.params?.civ) {
        return <IconHeader
            icon={getCivIconByIndex(civs.indexOf(props.route?.params?.civ))}
            text={props.route.params?.civ}
            onLayout={props.titleProps.onLayout}
        />;
    }
    return <TextHeader text={'Civs'} onLayout={props.titleProps.onLayout}/>;
}

export function civTitle(props: any) {
    return props.route?.params?.civ || 'Civs';
}

function highlightUnitAndTechs(str: string) {
    const appStyles = useTheme(appVariants);
    const navigation = useNavigation<RootStackProp>();

    const techReplaceList = techList.map(t => ({ name: t.name, text: getTechName(t.name)}));
    const unitReplaceList = Object.keys(units).map(t => ({ name: getUnitLineNameForUnit(t as Unit), text: getUnitName(t as Unit)}));
    const reverseTechMap = Object.assign({}, ...techReplaceList.map((x) => ({[x.text]: x})));
    const reverseUnitMap = Object.assign({}, ...unitReplaceList.map((x) => ({[x.text]: x})));

    const allReplaceList = [...techReplaceList, ...unitReplaceList];

    const regex = new RegExp('('+allReplaceList.map(m => '\\b'+escapeRegExpFn(m.text)+'\\b').join("|")+')', '');

    const parts = str.split(regex);
    // console.log('parts', parts);
    // console.log('map', map);

    const texts = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 == 0) {
            texts.push(<MyText key={i}>{parts[i]}</MyText>);
        } else {
            // console.log('part', parts[i]);
            const matchingTech = reverseTechMap[parts[i]]?.name;
            if (matchingTech) {
                texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Tech', {tech: matchingTech})}>{parts[i]}</MyText>);
            }
            const matchingUnit = reverseUnitMap[parts[i]]?.name;
            if (matchingUnit) {
                texts.push(<MyText key={i} style={appStyles.link} onPress={() => navigation.push('Unit', {unit: matchingUnit})}>{parts[i]}</MyText>);
            }
        }
    }
    return texts;
}

export function CivDetails({civ}: {civ: aoeCivKey}) {
    const styles = useTheme(variants);
    const civDescription = parseCivDescription(civ);
    const civDescription2 = getCivDescription(civ);

    const {type, boni, uniqueUnitsTitle, uniqueTechsTitle, teamBonusTitle, teamBonus} = civDescription;

    return (
        <View style={styles.detailsContainer}>
            <MyText style={styles.content}>{type}</MyText>
            {/*<MyText/>*/}

            <View style={styles.box}>
                <MyText style={styles.heading}>Bonus</MyText>
                {
                    boni.map((bonus, i) =>
                        <View key={i} style={styles.bonusRow}>
                            <MyText style={styles.content}>• </MyText>
                            <MyText style={styles.content}>{highlightUnitAndTechs(bonus)}</MyText>
                        </View>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>Unique Unit</MyText>
                {
                    civDict[civ].uniqueUnits.map(unit =>
                        <UnitCompBig key={unit} unit={unit}/>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>Unique Tech</MyText>
                {
                    civDict[civ].uniqueTechs.map(tech =>
                        <TechCompBig key={tech} tech={tech}/>
                    )
                }
            </View>

            <View style={styles.box}>
                <MyText style={styles.heading}>{teamBonusTitle.replace(':', '')}</MyText>
                <MyText style={styles.content}>{highlightUnitAndTechs(teamBonus)}</MyText>
            </View>

            {/*<MyText style={styles.content}>{civDescription2}</MyText>*/}

            <View style={styles.box}>
                <TechTree civ={civ}/>
            </View>
        </View>
    );
}

export function CivList() {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.civList}>
                {
                    civs.map((civ, i) =>
                        <TouchableOpacity key={civ} onPress={() => navigation.push('Civ', {civ})}>
                                <View style={styles.civBlock}>
                                    <Image style={styles.icon} source={getCivIconByIndex(i)}/>
                                    <View style={styles.civRow}>
                                        <MyText style={styles.name}>{civ}</MyText>
                                        <MyText style={styles.small} numberOfLines={1}>{getCivTeamBonus(civ)}</MyText>
                                    </View>
                                </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        </ScrollView>
    );
}

export default function CivPage() {
    const styles = useTheme(variants);
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


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        sectionHeader: {
            marginTop: 30,
            marginBottom: 15,
            fontSize: 15,
            fontWeight: '500',
        },
        imageInner: {
            opacity: 0.1,
            resizeMode: "cover",
            alignSelf: 'flex-end',
            bottom: -50,
            top: undefined,
            height: 400,
        },
        image: {
            flex: 1,
            resizeMode: "contain",
            // backgroundColor: 'blue',
        },
        title: {
            marginTop: 20,
            fontSize: 16,
            fontWeight: 'bold',
        },
        heading: {
            marginVertical: 10,
            lineHeight: 20,
            fontWeight: 'bold',
        },

        box: {
            // borderTopWidth: 1,
            // borderTopColor: '#DDD',
            // borderBottomWidth: 1,
            // borderBottomColor: '#CCC',
            // marginTop: 10,
            // marginHorizontal: -20,
            // paddingHorizontal: 20,
        },

        content: {
            // marginBottom: 5,
            textAlign: 'left',
            lineHeight: 22,
            // fontSize: 17,
        },
        detailsContainer: {
            flex: 1,
            padding: 20,
            // backgroundColor: 'yellow',
        },
        icon: {
            width: iconWidth,
            height: iconHeight,
        },
        name: {},
        civBlock: {
            flexDirection: 'row',
            marginVertical: 5,
            // backgroundColor: 'yellow',
        },
        civRow: {
            flex: 1,
            marginLeft: 10,
            // backgroundColor: 'blue',
        },
        civList: {
            // backgroundColor: 'red',
        },
        container: {
            padding: 20,
        },
        row: {
            marginLeft: 5,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
            // backgroundColor: 'blue',
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
        bonusRow: {
            // marginLeft: 40,
            flexDirection: 'row',
        },
    });
};

const variants = makeVariants(getStyles);

