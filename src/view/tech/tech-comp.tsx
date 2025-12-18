import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from '@/src/components/uniwind/image';
import {getTechDescription, getTechName, iconHeight, iconWidth, Tech, techs} from "@nex/data";
import {MyText} from "../components/my-text";
import {createStylesheet} from "../../theming-new";
import {getTechIcon} from "../../helper/techs";
import {getCivIconLocal} from "../../helper/civs";
import { router } from 'expo-router';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';


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

export function TechCompBig({ tech: tech, showCivBanner: showCivBanner, canShowCard }: any) {
    const styles = useStyles();
    const showTabBar = useShowTabBar();
    const civ = techs[tech]?.civ;

    if (!showTabBar && canShowCard) {
        return (
            <Card href={`/explore/technologies/${tech}`} direction="vertical" className="items-center w-40 mb-2 flex-1 relative">
                {showCivBanner && civ && <Image className='absolute top-3 right-3 w-6 h-6' source={getCivIconLocal(civ)} />}

                <Image style={styles.unitIconBig} source={getTechIcon(tech)} />

                <Text variant="label-lg" numberOfLines={1}>
                    {getTechName(tech)}
                </Text>

                <Text variant="body-sm" numberOfLines={2} color="subtle" align="center">
                    {getTechDescription(tech)}
                </Text>
            </Card>
        );
    }

    return (
        <TouchableOpacity onPress={() => router.push(`/explore/technologies/${tech}`)} className="h-10">
            <View style={styles.rowBig}>
                <TechIcon style={styles.unitIconBig} tech={tech} />
                <View style={styles.unitIconBigTitle}>
                    <MyText style={styles.name}>{getTechName(tech)}</MyText>
                    <MyText numberOfLines={1} style={styles.base.small}>
                        {getTechDescription(tech)}
                    </MyText>
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
