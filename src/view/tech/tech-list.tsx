import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getTechDescription, getTechIcon, getTechName, Tech, techs} from "../../helper/techs";
import {keys, sortBy} from "lodash-es";
import {getUnitLineName, unitLines} from "../../helper/units";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {Searchbar} from "react-native-paper";
import RefreshControlThemed from "../components/refresh-control-themed";
import {keysOf} from "../../helper/util";


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

export function TechCompBig({tech: tech}: any) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();
    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.small}>{getTechDescription(tech)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const allTechs = sortBy(Object.keys(techs));

export default function TechList() {
    const styles = useTheme(variants);
    const [text, setText] = useState('');
    const [list, setList] = useState(allTechs);

    const refresh = () => {
        if (text.length == 0) {
            setList(allTechs);
            return;
        }
        const found = allTechs.filter(tech => getTechName(tech as Tech).includes(text));
        setList(found);
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
            <FlatList
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={styles.list}
                data={list}
                renderItem={({item}) => {
                    return <TechCompBig key={item} tech={item}/>
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
            marginBottom: 10,
            // backgroundColor: 'blue',
        },
        unitIconBig: {
            width: iconWidth,
            height: iconHeight,
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
