import React, {useEffect, useState} from 'react';
import {Image, Platform, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    getUnitIcon, getUnitLineForUnit, getUnitLineIcon, getUnitLineName, getUnitLineNameForUnit, getUnitName, IUnitLine,
    Unit, UnitLine,
    unitLines, units
} from "../../helper/units";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {Searchbar} from "react-native-paper";
import {civDict, civs} from "../../helper/civs";
import {sortBy} from "lodash-es";


function getUnitLineTitle(unitLine: IUnitLine) {
    return unitLine.units.filter((x, i) => i > 0).map(getUnitName).join(', ');
}

export function UnitComp({unit}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.row}>
                <Image style={styles.unitIcon} source={getUnitLineIcon(unit)}/>
                <View style={styles.unitIconTitle}>
                    <MyText>{getUnitLineName(unit)}</MyText>
                    {
                        unitLines[unit].units.length > 1 && !unitLines[unit].unique &&
                        <MyText numberOfLines={1} style={styles.small}>{getUnitLineTitle(unitLines[unit])}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitCompBig({unit}: {unit: Unit}) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitCompBigWithCiv({unit}: {unit: Unit}) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    const unitLine = getUnitLineForUnit(unit);
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unit})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
                    {/*{*/}
                    {/*    unitLine?.unique && false &&*/}
                    {/*    <MyText numberOfLines={1} style={styles.small}>{unitLine.civ} unique unit</MyText>*/}
                    {/*}*/}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function UnitLineCompBig({unitLine}: {unitLine: UnitLine}) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: unitLine})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitLineIcon(unitLine)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitLineName(unitLine)}</MyText>
                    {
                        unitLines[unitLine].units.length > 1 && !unitLines[unitLine].unique &&
                        <MyText numberOfLines={1} style={styles.small}>{getUnitLineTitle(unitLines[unitLine])}</MyText>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

interface ISection {
    title: string;
    data: (UnitLine | Unit)[];
}

const sections: ISection[] = [
    {
        title: 'Infantry',
        data:
            [
                'Militia',
                'Spearman',
                'EagleScout',
                'Condottiero',
            ],
    },
    {
        title: 'Archer',
        data:
            [
                'Archer',
                'Skirmisher',
                'CavalryArcher',
                'Genitour',
            ],
    },
    {
        title: 'Cavalry',
        data:
            [
                'ScoutCavalry',
                'Knight',
                'CamelRider',
                'SteppeLancer',
                'BattleElephant',
                'XolotlWarrior',
            ],
    },
    {
        title: 'Siege',
        data:
            [
                'BatteringRam',
                'Mangonel',
                'Scorpion',
                'SiegeTower',
                'BombardCannon',
                'Trebuchet',
                'Petard',
                'FlamingCamel',
            ],
    },
    {
        title: 'Trade',
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: 'Villager',
        data:
            [
                'Villager',
            ],
    },
    {
        title: 'Navy',
        data:
            [
                'FishingShip',
                'TransportShip',
                'Galley',
                'FireGalley',
                'DemolitionRaft',
                'CannonGalleon',
                'Caravel',
                'Longboat',
                'TurtleShip',
            ],
    },
    {
        title: 'Monk',
        data:
            [
                // 'Missionary',
                'Monk',
            ],
    },
    {
        title: 'Unique',
        data: sortBy(civs.flatMap(civ => civDict[civ].uniqueUnits[0])),
    },
];

// console.log(sections);


export default function UnitList() {
    const styles = useTheme(variants);
    const [text, setText] = useState('');
    const [list, setList] = useState(sections);

    const refresh = () => {
        const newSections = sections.map(section => ({
            ...section,
            data: section.data.map(u => {
                if (unitLines[u] && !unitLines[u].unique) {
                    return unitLines[u].units;
                }
                return [u];
            })
                .flatMap(u => u)
                .filter(u => {
                    // if (unitLines[u]) {
                    //     return unitLines[u].units.some(u => getUnitName(u).toLowerCase().includes(text.toLowerCase()));
                    // }
                    return getUnitName(u).toLowerCase().includes(text.toLowerCase());
                }
            ),
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
                placeholder="unit"
                onChangeText={text => setText(text)}
                value={text}
            />
            <SectionList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                sections={list}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => {
                    // if (unitLines[item] && text.length === 0) {
                    //     return <UnitLineCompBig key={item} unitLine={item}/>
                    // }
                    return <UnitCompBig key={item} unit={item}/>
                }}
                renderSectionHeader={({ section: { title } }) => {
                    // if (civ) {
                    //     return (
                    //         <View style={styles.row}>
                    //             {/*<Image source={getCivIcon(civ)} style={styles.unitIcon}/>*/}
                    //             <Text style={styles.heading}>{title}</Text>
                    //         </View>
                    //     );
                    // }
                    return (
                        <Text style={styles.heading}>{title}</Text>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        list: {
            padding: 20,
        },

        searchbar: {
            marginTop: Platform.select({ ios: 5 }),
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
            marginBottom: 10, // TODO ROLLBACK
            // backgroundColor: 'blue',
        },
        unitIconBig: {
            width: iconWidth,
            height: iconHeight,
            // borderWidth: 1,
            // borderColor: '#555',
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

