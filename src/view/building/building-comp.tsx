import React from 'react';
import { createStylesheet } from '../../theming-new';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import { getBuildingIcon } from '../../helper/buildings';
import { MyText } from '../components/my-text';
import { Building, getBuildingDescription, getBuildingName, iconHeight, iconWidth } from '@nex/data';
import { router } from 'expo-router';
import { useShowTabBar } from '../../hooks/use-show-tab-bar';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';

export function BuildingCompBig({ building, subtitle, canShowCard }: { building: Building; subtitle?: string; canShowCard?: boolean }) {
    const styles = useStyles();
    const showTabBar = useShowTabBar();

    if (!showTabBar && canShowCard) {
        return (
            <Card href={`/explore/buildings/${building}`} direction="vertical" className="items-center w-40 mb-2 flex-1">
                <Image style={styles.unitIconBig} source={getBuildingIcon(building)} />

                <Text variant="label-lg" numberOfLines={1}>
                    {getBuildingName(building)}
                </Text>

                {!subtitle && (
                    <Text variant="body-sm" numberOfLines={2} align="center">
                        {getBuildingDescription(building)}
                    </Text>
                )}
            </Card>
        );
    }

    return (
        <TouchableOpacity className="pt-1 pb-1" onPress={() => router.push(`/explore/buildings/${building}`)}>
            <View style={styles.rowBig}>
                <Image style={styles.unitIconBig} source={getBuildingIcon(building)} />
                <View style={styles.unitIconBigTitle}>
                    <MyText>{getBuildingName(building)}</MyText>
                    {subtitle && <MyText style={styles.base.small}>{subtitle}</MyText>}
                    {!subtitle && (
                        <MyText numberOfLines={1} style={styles.base.small}>
                            {getBuildingDescription(building)}
                        </MyText>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
            width: iconWidth / 2.0,
            height: iconHeight / 2.0,
            left: iconWidth / 2.0,
            bottom: -1,
        },
        unitIconBigTitle: {
            flex: 1,
            paddingLeft: 8,
            // backgroundColor: 'red',
        },
    } as const)
);
