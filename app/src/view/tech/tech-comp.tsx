import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {getTechDescription, getTechName, iconHeight, iconWidth, Tech, techs} from "@nex/data";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {getTechIcon} from "../../helper/techs";
import {getCivIcon} from "../../helper/civs";


export function TechIcon({tech: tech} : any) {
    const styles = useStyles();
    const techInfo = techs[tech];

    if (techInfo.civ) {
        return (
            <View>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>
                <Image style={styles.unitIconBigBanner} source={getCivIcon(techInfo.civ)}/>
            </View>
        );
    }

    return <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>;
}

export function TechCompBig({tech: tech, showCivBanner: showCivBanner}: any) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    return (
        <TouchableOpacity onPress={() => navigation.push('Tech', {tech: tech})}>
            <View style={styles.rowBig}>
                <TechIcon style={styles.unitIconBig} tech={tech}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.base.small}>{getTechDescription(tech)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
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
}));
