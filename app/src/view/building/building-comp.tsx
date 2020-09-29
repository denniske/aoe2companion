import React from 'react';
import {createStylesheet} from '../../theming-new';
import {useNavigation} from '@react-navigation/native';
import {RootStackProp} from '../../../App';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {getBuildingIcon} from '../../helper/buildings';
import {MyText} from '../components/my-text';
import {getBuildingDescription, getBuildingName, iconHeight, iconWidth} from '@nex/data';


export function BuildingCompBig({building: building}: any) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    return (
        <TouchableOpacity onPress={() => navigation.push('Building', {building: building})}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getBuildingIcon(building)}/>
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getBuildingName(building)}</MyText>
                    <MyText numberOfLines={1} style={styles.base.small}>{getBuildingDescription(building)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
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
}));
