import React, {useEffect, useState} from 'react';
import {Image, Platform, SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getTechDescription, getTechIcon, getTechName, Tech, techs} from "../../helper/techs";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {Searchbar} from "react-native-paper";
import {civDict, civs, getCivIcon} from "../../helper/civs";
import {FinalDarkMode} from "../../redux/reducer";


export function TechComp({tech: tech}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getTechIcon(tech)}/>
                <View style={styles.unitIconTitle}>
                    <MyText>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.small}>{getTechDescription(tech)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function TechIcon({tech: tech} : any) {
    const styles = useTheme(variants);
    const techInfo = techs[tech];

    if (techInfo.civ) {
        return (
            <View>
                {/*<Image style={styles.unitIconBig} source={getCivIcon(techInfo.civ)}/>*/}
                {/*<Image style={styles.unitIconBigBanner} source={getTechIcon(tech)}/>*/}
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <Image style={styles.unitIconBigBanner} source={getCivIcon(techInfo.civ)}/>
            </View>
        );
    }

    return <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>;
}

export function TechCompBig({tech: tech, showCivBanner: showCivBanner}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <TechIcon style={styles.unitIconBig} tech={tech}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.small}>{getTechDescription(tech)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

interface ISection {
    title: string;
    data: Tech[];
}

const sections: ISection[] = [
    {
        title: 'Town Center',
        data: [
            "Loom",
            "Wheelbarrow",
            "HandCart",
            "TownWatch",
            "TownPatrol",
        ],
    },
    {
        title: 'Mill',
        data: [
            "HorseCollar",
            "HeavyPlow",
            "CropRotation",
        ],
    },
    {
        title: 'Lumber Camp',
        data: [
            "DoubleBitAxe",
            "BowSaw",
            "TwoManSaw",
        ],
    },
    {
        title: 'Mining Camp',
        data: [
            "StoneMining",
            "GoldMining",
            "StoneShaftMining",
            "GoldShaftMining",
        ],
    },
    {
        title: 'Market',
        data: [
            "Caravan",
            "Coinage",
            "Banking",
            "Guilds",
        ],
    },
    {
        title: 'Monastery',
        data: [
            "Sanctity",
            "Redemption",
            "Atonement",
            "HerbalMedicine",
            "Fervor",
            "Illumination",
            "BlockPrinting",
            "Theocracy",
            "Faith",
            "Heresy",
        ],
    },
    {
        title: 'Dock',
        data: [
            "Gillnets",
            "Shipwright",
            "Careening",
            "DryDock",
        ],
    },
    {
        title: 'University',
        data: [
            "Masonry",
            "Architecture",
            "SiegeEngineers",
            "TreadmillCrane",
            "MurderHoles",
            "ArrowSlits",
            "HeatedShot",
            "Ballistics",
            "Chemistry",
        ],
    },
    {
        title: 'Blacksmith',
        data: [
            "Forging",
            "IronCasting",
            "BlastFurnace",

            "ScaleMailArmor",
            "ChainMailArmor",
            "PlateMailArmor",

            "ScaleBardingArmor",
            "ChainBardingArmor",
            "PlateBardingArmor",

            "Fletching",
            "BodkinArrow",
            "Bracer",

            "PaddedArcherArmor",
            "LeatherArcherArmor",
            "RingArcherArmor",
        ],
    },
    {
        title: 'Stable',
        data: [
            "Bloodlines",
            "Husbandry",
        ],
    },
    {
        title: 'Archery Range',
        data: [
            "ThumbRing",
            "ParthianTactics",
        ],
    },
    {
        title: 'Barracks',
        data: [
            "Tracking",
            "Supplies",
            "Squires",
            "Arson",
        ],
    },
    {
        title: 'Castle',
        data: [
            "Hoardings",
            "Sappers",
            "Conscription",
            "SpiesTreason",
        ],
    },
    {
        title: 'Age',
        data: [
            "FeudalAge",
            "CastleAge",
            "ImperialAge",
        ],
    },
    ...civs.map(civ => ({
        title: civ,
        data: civDict[civ].uniqueTechs,
    })),
];

export default function TechList() {
    const styles = useTheme(variants);
    const [text, setText] = useState('');
    const [list, setList] = useState(sections);

    const refresh = () => {
        if (text.length == 0) {
            setList(sections);
            return;
        }
        const newSections = sections.map(section => ({
            ...section,
            data: section.data.filter(tech => getTechName(tech).toLowerCase().includes(text.toLowerCase())),
        })).filter(section => section.data.length > 0);
        setList(newSections);
    };

    useEffect(() => {
        refresh();
    }, [text]);

    return (
        <View style={styles.container}>
            <Searchbar

                style={styles.searchbar}
                placeholder="tech"
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    return <TechCompBig key={item} tech={item} showCivBanner={true}/>
                }}
                renderSectionHeader={({ section: { title } }) => (
                    // <View/>
                    <MyText style={styles.heading}>{title}</MyText>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}


const getStyles = (theme: ITheme, mode: FinalDarkMode) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        list: {
            padding: 20,
        },

        searchbar: {
            marginTop: Platform.select({ ios: mode == 'light' ? 5 : 0 }),
            borderRadius: 0,
            paddingHorizontal: 10,
        },

        row: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
            // backgroundColor: 'blue',
        },
        unitIcon: {
            width: 20,
            height: 20,
            marginRight: 5,
        },
        unitIconTitle: {
            flex: 1,
            // backgroundColor: 'red',
        },

        rowBig: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            // backgroundColor: 'blue',
        },
        unitIconBig: {
            width: iconWidth,
            height: iconHeight,
        },
        unitIconBigBanner: {
            position: 'absolute',
            width: iconWidth/2.0,
            height: iconHeight/2.0,
            left: iconWidth/2.0,
            bottom: -1,//iconHeight/2.0,
        },
        unitIconBigTitle: {
            flex: 1,
            paddingLeft: 8,
            // backgroundColor: 'red',
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },

        heading: {
            paddingVertical: 12,
            marginBottom: 5,
            fontWeight: 'bold',
            // backgroundColor: theme.backgroundColor,
        },
    });
};

const variants = makeVariants(getStyles);
