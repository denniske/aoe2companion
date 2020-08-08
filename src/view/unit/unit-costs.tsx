import {Image, StyleSheet, Text, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    attackClasses, getOtherIcon, getUnitClassName, getUnitData, hiddenArmourClasses, IUnitInfo, Other, sortResources,
    Unit,
    UnitClassNumber,
    unitLines
} from "../../helper/units";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {iconSmallHeight, iconSmallWidth} from "../../helper/theme";
import {keysOf} from "../../helper/util";

interface Props {
    unitId: Unit;
}

export function UnitCosts({ unitId }: Props) {
    const styles = useTheme(variants);

    const data = getUnitData(unitId);

    return (
        <View style={styles.costsRow}>
            {
                sortResources(keysOf(data.Cost)).map(res =>
                    <View key={res} style={styles.resRow}>
                        <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                        <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>
                    </View>
                )
            }
            <MyText style={styles.description}>Trained in {data.TrainTime}s</MyText>
        </View>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        resRow: {
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },
        resIcon: {
            width: 22,
            height: 22,
            marginRight: 5,
        },
        resDescription: {
            marginRight: 20,
        },

        costsRow: {
            flexDirection: 'row',
            marginBottom: 5,
        },
        description: {
            lineHeight: 20,
        },
    });
};

const variants = makeVariants(getStyles);
