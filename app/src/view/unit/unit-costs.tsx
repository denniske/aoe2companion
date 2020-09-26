import {Image, StyleSheet, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    getUnitData, ICostDict, Other, sortResources, Unit, UnitLine, unitLines
} from "@nex/data";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {keysOf} from "@nex/data";
import {GetUnitValue} from "./unit-stats";
import {getOtherIcon} from "../../helper/units";


export function Costs({ costDict }: { costDict: ICostDict }) {
    const styles = useTheme(variants);

    return (
        <View style={styles.row}>
            {
                sortResources(keysOf(costDict)).map(res =>
                    <View key={res} style={styles.resRow}>
                        <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                        <MyText style={styles.resDescription}>{costDict[res]}</MyText>
                    </View>
                )
            }
        </View>
    );
}

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

export function UnitCosts({ unitId, unitLineId }: Props) {
    const styles = useTheme(variants);
    const baseData = getUnitData(unitId);
    return (
        <View style={styles.costsRow}>
            <Costs costDict={baseData.Cost}/>
            <MyText style={styles.description}>Trained in <GetUnitValue unitId={unitId} prop="TrainTime" formatter={(x: number) => x+'s'}/></MyText>
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

        row: {
            flexDirection: 'row',
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
