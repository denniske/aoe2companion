import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image';
import {getTechDescription, getTechName, iconHeight, iconWidth, Tech, techs} from "@nex/data";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {getTechIcon} from "../../helper/techs";
import {getCivIconLocal} from "../../helper/civs";
import { router } from 'expo-router';


export function TechIcon({tech: tech} : any) {
    const styles = useStyles();
    const techInfo = techs[tech];

    if (techInfo.civ) {
        return (
            <View>
                <Image style={styles.unitIconBig} source={getTechIcon(tech)} cachePolicy="memory-disk"/>
                <Image style={styles.unitIconBigBanner} source={getCivIconLocal(techInfo.civ)}/>
            </View>
        );
    }

    return <Image style={styles.unitIconBig} source={getTechIcon(tech)}/>;
}

export function TechCompBig({tech: tech, showCivBanner: showCivBanner}: any) {
    const styles = useStyles();

    return (
        <TouchableOpacity onPress={() => router.push(`/explore/technologies/${tech}`)} className="h-10">
            <View style={styles.rowBig}>
                <TechIcon style={styles.unitIconBig} tech={tech}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText style={styles.name}>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.base.small}>{getTechDescription(tech)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
    name: {
        lineHeight: 17,
    },
    rowBig: {
        flexDirection: 'row',
        alignItems: 'center',
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
} as const));
