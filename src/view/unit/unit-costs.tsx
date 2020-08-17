import {Image, StyleSheet, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    getOtherIcon, getUnitData, IUnitInfo, Other, sortResources, Unit, UnitLine, unitLines
} from "../../helper/units";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {keysOf} from "../../helper/util";

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

export function UnitCosts({ unitId, unitLineId }: Props) {
    const styles = useTheme(variants);

    const baseData = getUnitData(unitId);

    const unitLine = unitLines[unitLineId];
    const eliteUnit = unitLine.unique ? unitLine.units[1] : null;
    const eliteData = eliteUnit ? getUnitData(eliteUnit) : undefined;

    const getValueByPath = (path: (x: IUnitInfo) => any, formatter: (x: number) => string = x => (x || 0).toString()) => {
        if (eliteData && path(eliteData) !== path(baseData)) {
            return (
                <>
                    <MyText>{formatter(path(baseData))}, {formatter(path(eliteData))} </MyText>
                    <MyText style={styles.small}>(elite)</MyText>
                </>
            );
        } else {
            return (
                <>
                    <MyText>{formatter(path(baseData))}</MyText>
                </>
            );
        }
    };

    const getValue = (key: keyof IUnitInfo, formatter: any = (x: any) => x) => {
        return getValueByPath((x: IUnitInfo) => x[key], formatter);
    };

    return (
        <View style={styles.costsRow}>
            {
                sortResources(keysOf(baseData.Cost)).map(res =>
                    <View key={res} style={styles.resRow}>
                        <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                        <MyText style={styles.resDescription}>{baseData.Cost[res]}</MyText>
                    </View>
                )
            }
            <MyText style={styles.description}>Trained in {getValue('TrainTime', (x: number) => x+'s')}</MyText>
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
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

const variants = makeVariants(getStyles);
