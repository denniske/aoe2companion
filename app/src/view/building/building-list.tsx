import React, {useEffect, useState} from 'react';
import {Image, Platform, SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {Building, getBuildingDescription, getBuildingName} from "@nex/data";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "@nex/data";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {Searchbar} from "react-native-paper";
import {FinalDarkMode} from "../../redux/reducer";
import {getBuildingIcon} from "../../helper/buildings";


export function BuildingComp({building: building}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Building', {building: building})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getBuildingIcon(building)}/>
                <View style={styles.unitIconTitle}>
                    <MyText>{getBuildingName(building)}</MyText>
                    <MyText numberOfLines={1} style={styles.small}>{getBuildingDescription(building)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function BuildingCompBig({building: building}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    return (
        <TouchableOpacity onPress={() => navigation.push('Building', {building: building})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getBuildingIcon(building)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getBuildingName(building)}</MyText>
                    <MyText numberOfLines={1} style={styles.small}>{getBuildingDescription(building)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

interface ISection {
    title: string;
    data: Building[];
}

export const buildingSections: ISection[] = [
    {
        title: 'Military Production',
        data: [
            "Barracks",
            "ArcheryRange",
            "Stable",
            "SiegeWorkshop",
            "Dock",
            "Castle",
            "Krepost",
        ],
    },
    {
        title: 'Eco',
        data: [
            "FishTrap",
            "Mill",
            "Farm",
            "LumberCamp",
            "MiningCamp",
            "Feitoria",
        ],
    },
    {
        title: 'People & Science',
        data: [
            "TownCenter",
            "House",
            "Blacksmith",
            "Market",
            "Monastery",
            "University",
        ],
    },
    {
        title: 'Special',
        data: [
            "Wonder",
        ],
    },
    {
        title: 'Towers',
        data: [
            "Outpost",
            "WatchTower",
            "GuardTower",
            "Keep",
            "BombardTower",
        ],
    },
    {
        title: 'Walls',
        data: [
            "PalisadeWall",
            "StoneWall",
            "FortifiedWall",
        ],
    },
    {
        title: 'Gates',
        data: [
            "PalisadeGate",
            "Gate",
        ],
    },
];

export default function BuildingList() {
    const styles = useTheme(variants);
    const [text, setText] = useState('');
    const [list, setList] = useState(buildingSections);

    const refresh = () => {
        if (text.length == 0) {
            setList(buildingSections);
            return;
        }
        const newSections = buildingSections.map(section => ({
            ...section,
            data: section.data.filter(building => getBuildingName(building).toLowerCase().includes(text.toLowerCase())),
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
                placeholder="building"
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    return <BuildingCompBig key={item} building={item} showCivBanner={true}/>
                }}
                renderSectionHeader={({ section: { title } }) => (
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
            bottom: -1,
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
        },
    });
};

const variants = makeVariants(getStyles);
