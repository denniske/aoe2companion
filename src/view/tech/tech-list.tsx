import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getTechDescription, getTechIcon, getTechName, Tech, techs} from "../../helper/techs";
import {sortBy} from "lodash-es";
import {getUnitLineName, unitLines} from "../../helper/units";
import {MyText} from "../components/my-text";
import {iconHeight, iconWidth} from "../../helper/theme";
import {ITheme, makeVariants, useTheme} from "../../theming";


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

export default function TechList() {
    const styles = useTheme(variants);
    return (
        <View style={styles.container}>
            {
                sortBy(Object.keys(techs)).map(ul =>
                    <TechCompBig key={ul} tech={ul}/>
                )
            }
        </View>
    );
}


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            padding: 20,
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

