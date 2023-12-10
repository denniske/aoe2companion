import {Image, StyleSheet, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    getBuildingName,
    getUnitData, ICostDict, Other, sortResources, Unit, UnitLine, unitLines
} from "@nex/data";
import React from "react";
import {makeVariants, useTheme} from "../../theming";
import {keysOf} from "@nex/data";
import {GetUnitValue} from "./unit-stats";
import {getOtherIcon} from "../../helper/units";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';


export function Costs({ costDict }: { costDict: ICostDict }) {
    const styles = useStyles();

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
    const styles = useStyles();
    const baseData = getUnitData(unitId);
    return (
        <View style={styles.costsRow}>
            <Costs costDict={baseData.Cost}/>
            <MyText style={styles.description}>
                <MyText>{getTranslation('unit.stats.heading.trainedin')} <GetUnitValue unitId={unitId} prop="TrainTime" formatter={(x: number) => x+'s'}/></MyText>
                {
                    unitLineId == 'Serjeant' &&
                    <MyText> ({getBuildingName('Castle')}), 20s ({getBuildingName('Donjon')})</MyText>
                }
                {
                    unitLineId == 'Tarkan' &&
                    <MyText> ({getBuildingName('Castle')}), 21s ({getBuildingName('Stable')})</MyText>
                }
                {
                    unitLineId == 'Huskarl' &&
                    <MyText> ({getBuildingName('Castle')}), 13s ({getBuildingName('Barracks')})</MyText>
                }
            </MyText>
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    resRow: {
        flexDirection: 'row',
        // marginBottom: 5,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    resIcon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
    resDescription: {
        marginRight: 10,
    },

    row: {
        flexDirection: 'row',
    },
    costsRow: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        marginBottom: 5,
    },
    description: {
        lineHeight: 20,
        flex: 1,
    },
    small: {
        fontSize: 12,
        color: theme.textNoteColor,
    },
}));
