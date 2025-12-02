import { Image, StyleSheet, View } from 'react-native';
import { MyText } from '../components/my-text';
import { ICostDict, keysOf, Other, sortResources, Unit, UnitLine } from '@nex/data';
import React from 'react';
import { getOtherIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { Text } from '@app/components/text';

export function Costs({ costDict }: { costDict: ICostDict }) {
    const styles = useStyles();

    return (
        <View className="flex-row items-center gap-2">
            {sortResources(keysOf(costDict)).map((res) => (
                <View key={res} className="flex-row items-center gap-1">
                    <Image style={styles.resIcon} source={getOtherIcon(res as Other)} />
                    <Text variant="body">{costDict[res]}</Text>
                </View>
            ))}
        </View>
    );
}

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

// export function UnitCosts({ unitId, unitLineId }: Props) {
//     const styles = useStyles();
//     const baseData = getUnitData(unitId);
//     return (
//         <View style={styles.costsRow}>
//             <Costs costDict={baseData.Cost}/>
//             <MyText style={styles.description}>
//                 <MyText>{getTranslation('unit.stats.heading.trainedin')} <GetUnitValue unitId={unitId} prop="TrainTime" formatter={(x: number) => x+'s'}/></MyText>
//                 {
//                     unitLineId == 'Serjeant' &&
//                     <MyText> ({getBuildingName('Castle')}), 20s ({getBuildingName('Donjon')})</MyText>
//                 }
//                 {
//                     unitLineId == 'Tarkan' &&
//                     <MyText> ({getBuildingName('Castle')}), 21s ({getBuildingName('Stable')})</MyText>
//                 }
//                 {
//                     unitLineId == 'Huskarl' &&
//                     <MyText> ({getBuildingName('Castle')}), 13s ({getBuildingName('Barracks')})</MyText>
//                 }
//             </MyText>
//         </View>
//     );
// }

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        resIcon: {
            width: 22,
            height: 22,
        },
        resDescription: {
            marginRight: 10,
        },

        costsRow: {
            // backgroundColor: 'blue',
            flexDirection: 'row',
            marginBottom: 5,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    } as const)
);
