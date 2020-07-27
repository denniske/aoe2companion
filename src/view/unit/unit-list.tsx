import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {
    getUnitIcon,
    getUnitLineIcon, getUnitLineName, getUnitLineNameForUnit, getUnitName, IUnitLine, Unit, UnitLine, unitLineNames,
    unitLines
} from "../../helper/units";
import {sortBy} from "lodash-es";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {getTechName, Tech, techs} from "../../helper/techs";
import {Searchbar} from "react-native-paper";
import {TechCompBig} from "../tech/tech-list";


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
        <TouchableOpacity onPress={() => navigation.push('Unit', {unit: getUnitLineNameForUnit(unit)})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getUnitName(unit)}</MyText>
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

const allUnitLines = sortBy(unitLineNames);

export default function UnitList() {
    const styles = useTheme(variants);
    const [text, setText] = useState('');
    const [list, setList] = useState(allUnitLines);

    const refresh = () => {
        if (text.length == 0) {
            setList(allUnitLines);
            return;
        }
        const found = allUnitLines.filter(unitLine => {
            return unitLines[unitLine].units.some(u => getUnitName(u).includes(text));
        });
        setList(found);
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
            <FlatList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                data={list}
                renderItem={({item}) => {
                    return <UnitLineCompBig key={item} unitLine={item}/>
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            paddingTop: 10,
            flex: 1,
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },

        searchbar: {
            // marginTop: 15,
            marginBottom: 25,
            marginHorizontal: 20,
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
    });
};

const variants = makeVariants(getStyles);

