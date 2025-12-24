import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import { getUnitLineForUnit, getUnitLineName, getUnitName, iconHeight, iconWidth, IUnitLine, Unit, UnitLine, unitLines } from '@nex/data';
import { MyText } from '../components/my-text';
import { getUnitIcon, getUnitLineIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { Link } from 'expo-router';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';

function getUnitLineTitle(unitLine: IUnitLine) {
    return unitLine.units
        .filter((x, i) => i > 0)
        .map(getUnitName)
        .join(', ');
}

export function UnitCompBig({ unit, subtitle, canShowCard }: { unit: Unit; subtitle?: string; canShowCard?: boolean }) {
    const styles = useStyles();
    const showTabBar = useShowTabBar();

    if (!showTabBar && canShowCard) {
        return (
            <Card href={`/explore/units/${unit}`} direction="vertical" className="items-center w-40 mb-2 flex-1">
                <Image style={styles.unitIconBig} source={getUnitIcon(unit)} />

                <Text variant="label-lg" numberOfLines={1}>
                    {getUnitName(unit)}
                </Text>

                {subtitle != null && (
                    <Text variant="body-sm" color="subtle" numberOfLines={2}>
                        {subtitle}
                    </Text>
                )}
            </Card>
        );
    }

    return (
        <Link asChild href={`/explore/units/${unit}`}>
            <TouchableOpacity>
                <View style={styles.rowBig}>
                    <Image style={styles.unitIconBig} source={getUnitIcon(unit)} />
                    <View style={styles.unitIconBigTitle}>
                        <MyText>{getUnitName(unit)}</MyText>
                        {subtitle != null && <MyText style={styles.base.small}>{subtitle}</MyText>}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

export function UnitCompBigWithCiv({ unit }: { unit: Unit }) {
    const styles = useStyles();
    const unitLine = getUnitLineForUnit(unit);
    return (
        <Link asChild href={`/explore/units/${unit}`}>
            <TouchableOpacity>
                <View style={styles.rowBig}>
                    <Image style={styles.unitIconBig} source={getUnitIcon(unit)} />
                    <View style={styles.unitIconBigTitle}>
                        <MyText>{getUnitName(unit)}</MyText>
                        {/*{*/}
                        {/*    unitLine?.unique && false &&*/}
                        {/*    <MyText numberOfLines={1} style={styles.small}>{unitLine.civ} unique unit</MyText>*/}
                        {/*}*/}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

export function UnitLineCompBig({ unitLine }: { unitLine: UnitLine }) {
    const styles = useStyles();
    return (
        <Link asChild href={`/explore/units/${unitLine}`}>
            <TouchableOpacity>
                <View style={styles.rowBig}>
                    <Image style={styles.unitIconBig} source={getUnitLineIcon(unitLine)} />
                    <View style={styles.unitIconBigTitle}>
                        <MyText>{getUnitLineName(unitLine)}</MyText>
                        {unitLines[unitLine].units.length > 1 && !unitLines[unitLine].unique && (
                            <MyText numberOfLines={1} style={styles.base.small}>
                                {getUnitLineTitle(unitLines[unitLine])}
                            </MyText>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

const useStyles = createStylesheet((theme, mode) =>
    StyleSheet.create({
        rowBig: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10, // TODO ROLLBACK
            // backgroundColor: 'blue',
        },
        unitIconBig: {
            width: iconWidth,
            height: iconHeight,
            // borderWidth: 1,
            // borderColor: '#555',
        },
        unitIconBigTitle: {
            flex: 1,
            paddingLeft: 8,
            // backgroundColor: 'red',
        },
    } as const)
);
