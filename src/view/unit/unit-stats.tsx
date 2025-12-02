import { Image, StyleSheet, TextStyle, View } from 'react-native';
import { MyText } from '../components/my-text';
import {
    Age,
    ageUpgrades,
    allUnitSections,
    attackClasses,
    Building, getAgeName,
    getBuildingData,
    getBuildingName,
    getUnitClassName,
    getUnitData,
    getUnitLineIdForUnit,
    getUnitName,
    hiddenArmourClasses,
    IUnitInfo,
    keysOf,
    Other,
    sortResources,
    Unit,
    UnitClassNumber,
    UnitLine,
    unitLines,
} from '@nex/data';
import React, { useState } from 'react';
import Picker from '../components/picker';
import Space from '../components/space';
import { getAgeIcon, getOtherIcon, getUnitIcon } from '../../helper/units';
import { createStylesheet } from '../../theming-new';
import { uniq } from 'lodash';
import { IGetTranslation, useTranslation } from '@app/helper/translate';
import { Text } from '@app/components/text';

interface Props {
    unitId: Unit;
    unitLineId: UnitLine;
}

type IFormatter = (x: number) => string;

const includeEliteDataUnitLines = ['ElephantArcher', 'BattleElephant', 'CannonGalleon', 'SteppeLancer'];

function getEliteData(unitLineId: UnitLine) {
    const unitLine = unitLines[unitLineId];
    const eliteUnit = unitLine.unique || includeEliteDataUnitLines.includes(unitLineId) ? unitLine.units[1] : null;
    return eliteUnit ? getUnitData(eliteUnit) : undefined;
}

interface PathProps {
    style?: TextStyle;
    unitId?: Unit;
    buildingId?: Building;
    path: (x: Partial<IUnitInfo>) => any;
    formatter?: IFormatter;
}

interface GetDataParams {
    unitId?: Unit;
    buildingId?: Building;
}

export function getData(params: GetDataParams) {
    const { unitId, buildingId } = params;
    if (unitId) {
        return getUnitData(unitId);
    }
    if (buildingId) {
        return getBuildingData(buildingId);
    }
    throw new Error('getData - no unitId or buildingId given');
}

export function getUpgradeByAgeData(params: GetDataParams) {
    const { unitId, buildingId } = params;
    if (unitId) {
        return ageUpgrades[unitId];
    }
    if (buildingId) {
        return ageUpgrades[buildingId];
    }
    throw new Error('getUpgradeByAgeData - no unitId or buildingId given');
}

export function GetValueByPath(props: PathProps) {
    const getTranslation = useTranslation();
    const { style, unitId, buildingId, path, formatter = (x) => (x || 0).toString() } = props;
    const styles = useStyles();
    const baseData = getData({ unitId, buildingId }) as IUnitInfo;
    const upgradeByAgeData = getUpgradeByAgeData({ unitId, buildingId });
    const eliteData = unitId ? getEliteData(getUnitLineIdForUnit(unitId)) : null;

    const ageList = ['DarkAge', 'FeudalAge', 'CastleAge', 'ImperialAge'] as Age[];

    const hasAgeUpgrade = (age: Age) => upgradeByAgeData?.[age] && path(upgradeByAgeData?.[age]!) != null;
    const hasAnyAgeUpgrade = hasAgeUpgrade('DarkAge') || hasAgeUpgrade('FeudalAge') || hasAgeUpgrade('CastleAge') || hasAgeUpgrade('ImperialAge');

    const getUpgradeOverAges = (age: Age) => {
        let value = 0;
        for (const currentAge of ageList) {
            if (hasAgeUpgrade(currentAge)) {
                value += path(upgradeByAgeData![currentAge]!);
            }
            if (currentAge === age) return value;
        }
    };

    if (eliteData && formatter(path(eliteData)) !== formatter(path(baseData)) && hasAnyAgeUpgrade) {
        return (
            <MyText style={style}>
                {/*<MyText>{" "}</MyText>*/}
                {/*<MyText>{formatter(path(baseData))} </MyText>*/}

                {ageList
                    .filter((age) => hasAgeUpgrade(age))
                    .map(
                        (age, i) =>
                            hasAgeUpgrade(age) && (
                                <MyText key={age}>
                                    {i > 0 && (
                                        // <MyText>, </MyText>
                                        <MyText>{'\n'}</MyText>
                                    )}
                                    <MyText>{formatter(path(baseData) + getUpgradeOverAges(age))} </MyText>
                                    <MyText style={styles.small}>({getAgeName(age)})</MyText>
                                </MyText>
                            )
                    )}

                <MyText>{'\n'}</MyText>
                <MyText>{formatter(path(eliteData))} </MyText>
                <MyText style={styles.small}>({getTranslation('unit.stats.elite')})</MyText>
            </MyText>
        );
    } else if (eliteData && formatter(path(eliteData)) !== formatter(path(baseData))) {
        return (
            <MyText style={style}>
                {/*<MyText>{" "}</MyText>*/}
                <MyText>
                    {formatter(path(baseData))}, {formatter(path(eliteData))}{' '}
                </MyText>
                <MyText style={styles.small}>({getTranslation('unit.stats.elite')})</MyText>
            </MyText>
        );
    } else if (hasAnyAgeUpgrade) {
        return (
            <MyText style={style}>
                {/*<MyText>{" has any "}</MyText>*/}
                {/*{*/}
                {/*    path(baseData) > 0 &&*/}
                {/*    <MyText>{formatter(path(baseData))} BASE</MyText>*/}
                {/*}*/}

                {ageList
                    .filter((age) => hasAgeUpgrade(age))
                    .map((age, i) => (
                        <MyText key={age}>
                            {i > 0 && (
                                // <MyText>, </MyText>
                                <MyText>{'\n'}</MyText>
                            )}
                            <MyText>​</MyText>
                            <Image style={styles.ageIcon} source={getAgeIcon(age)} />
                            <MyText>{formatter(path(baseData) + getUpgradeOverAges(age))}</MyText>
                            {/*<MyText>{" "}</MyText>*/}
                        </MyText>
                    ))}
            </MyText>
        );
    } else {
        return (
            <MyText style={style}>
                {/*<MyText>{" "}</MyText>*/}
                {formatter(path(baseData))}
            </MyText>
        );
    }
}

// <View style={style}>
//     <View style={styles.resRow}>
//         <MyText>{formatter(path(baseData))} </MyText>
//     </View>
//     {
//         ageList.map(age => hasAgeUpgrade(age) &&
//             <View key={age} style={styles.resRow}>
//                 <MyText>{formatter(path(baseData)+path(upgradeByAgeData![age]!))} </MyText>
//                 <Image style={styles.resIcon} source={getAgeIcon(age)}/>
//             </View>
//         )
//     }
// </View>

interface PathProps2 {
    style?: TextStyle;
    unitId?: Unit;
    buildingId?: Building;
    prop: keyof IUnitInfo;
    formatter?: IFormatter;
}

export function GetUnitValue(props: PathProps2) {
    const { style, unitId, buildingId, prop, formatter = (x: any) => x } = props;
    return <GetValueByPath style={style} unitId={unitId} buildingId={buildingId} path={(x: Partial<IUnitInfo>) => x[prop]} formatter={formatter} />;
}

interface PathProps3 {
    style?: TextStyle;
    unitId?: Unit;
    buildingId?: Building;
    unitClassNumber: UnitClassNumber;
}

function signed(num: number) {
    if (num == null) {
        return '';
    }
    return num > 0 ? '+' + num.toString() : num.toString();
}

export function GetAttackValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return (
        <GetValueByPath
            style={style}
            unitId={unitId}
            buildingId={buildingId}
            path={(x: Partial<IUnitInfo>) => x.Attacks?.find((a) => a.Class === unitClassNumber)?.Amount}
        />
    );
}

export function GetAttackBonusValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return (
        <GetValueByPath
            style={style}
            unitId={unitId}
            buildingId={buildingId}
            path={(x: Partial<IUnitInfo>) => x.Attacks?.find((a) => a.Class === unitClassNumber)?.Amount}
            formatter={(x) => signed(x || 0)}
        />
    );
}

export function GetArmourValue(props: PathProps3) {
    const { style, unitId, buildingId, unitClassNumber } = props;
    return (
        <GetValueByPath
            style={style}
            unitId={unitId}
            buildingId={buildingId}
            path={(x: Partial<IUnitInfo>) => x.Armours?.find((a) => a.Class === unitClassNumber)?.Amount}
            formatter={(x) => signed(x || 0)}
        />
    );
}

export function getAttackBonuses(params: GetDataParams) {
    const data = getData(params);
    const eliteData = params.unitId ? getEliteData(getUnitLineIdForUnit(params.unitId)) : null;

    const attackBonuses = data.Attacks.filter((a) => a.Amount !== 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber))).map(
        (a) => a.Class
    );
    const attackBonusesElite =
        eliteData?.Attacks.filter((a) => a.Amount !== 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber))).map(
            (a) => a.Class
        ) ?? [];

    const upgradeByAgeData = getUpgradeByAgeData(params);
    const ageUpgradeAttackBonuses = (age: Age) =>
        upgradeByAgeData?.[age]?.Attacks?.filter((a) => a.Amount > 0 && !attackClasses.includes(getUnitClassName(a.Class as UnitClassNumber))).map(
            (a) => a.Class
        ) || [];

    return uniq([
        ...attackBonuses,
        ...attackBonusesElite,
        ...ageUpgradeAttackBonuses('FeudalAge'),
        ...ageUpgradeAttackBonuses('CastleAge'),
        ...ageUpgradeAttackBonuses('ImperialAge'),
    ]);
}

export function getArmourClasses(params: GetDataParams) {
    const data = getData(params);
    return data.Armours.filter((a) => !hiddenArmourClasses.includes(getUnitClassName(a.Class as UnitClassNumber)));
}

function formatChargeType(getTranslation: IGetTranslation, chargeType: number) {
    const chargeTypeMap: any = {
        1: 'attack',
        3: 'areaattack',
        4: 'projectiledodging',
        5: 'meleeattackdodging',
        6: 'ranged',
    };
    return getTranslation(`unit.stats.heading.chargetype.${chargeTypeMap[chargeType]}` as any);
}

export function UnitStats({ unitId, unitLineId }: Props) {
    const getTranslation = useTranslation();
    const styles = useStyles();

    const [comparisonUnit, setComparisonUnit] = useState<Unit>();

    const baseData = getUnitData(unitId);
    const baseData2 = comparisonUnit ? getUnitData(comparisonUnit) : null;

    const unitNone = null;

    const formatUnit = (x: string | null, inList?: boolean) => {
        if (x == unitNone) {
            return getTranslation('unit.stats.action.compare');
        }
        return getUnitName(x as Unit);
    };
    const icon = (x: any, inList?: boolean) => {
        if (!inList) return null;
        return <Image style={styles.unitIcon} source={getUnitIcon(x)} />;
    };
    const onComparisonUnitSelected = (unit: Unit) => {
        setComparisonUnit(unit);
    };

    const units = comparisonUnit ? [unitId, comparisonUnit!] : [unitId];

    return (
        <View style={styles.statsContainer}>
            <View style={[styles.statsRowHeader, { marginBottom: comparisonUnit ? 0 : 15 }]}>
                {comparisonUnit && (
                    <>
                        <MyText style={styles.cellName} />
                        <MyText style={styles.cellValue}>{getUnitName(unitId)}</MyText>
                    </>
                )}
                {!comparisonUnit && (
                    <>
                        <MyText style={styles.cellName} />
                        <MyText style={styles.cellValue} />
                        <MyText style={styles.cellValue} />
                    </>
                )}
                <View style={styles.cellValue}>
                    <Picker
                        popupAlign="right"
                        itemHeight={40}
                        textMinWidth={150}
                        container="sectionlist"
                        icon={icon}
                        value={comparisonUnit}
                        sections={allUnitSections}
                        sectionFormatter={(str) => getTranslation(str as any)}
                        formatter={formatUnit}
                        onSelect={onComparisonUnitSelected}
                    />
                </View>
            </View>

            <View style={styles.costsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.costs')}</MyText>
                <View className="flex-row items-center gap-2" style={styles.cellValue}>
                    {sortResources(keysOf(baseData.Cost)).map((res) => (
                        <View key={res} className="flex-row items-center gap-1">
                            <Image style={styles.resIcon} source={getOtherIcon(res as Other)} />
                            <MyText>{baseData.Cost[res]}</MyText>
                        </View>
                    ))}
                </View>
                {comparisonUnit && (
                    <View className="flex-row items-center gap-2" style={styles.cellValue}>
                        {sortResources(keysOf(baseData2!.Cost)).map((res) => (
                            <View key={res} className="flex-row items-center gap-1">
                                <Image style={styles.resIcon} source={getOtherIcon(res as Other)} />
                                <MyText>{baseData2!.Cost[res]}</MyText>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.trainedin')}</MyText>
                {units.map((u) => (
                    <MyText key={u} style={styles.cellValue}>
                        <GetUnitValue style={styles.cellValue} unitId={u} prop="TrainTime" formatter={(x) => x + ' s'} />
                        {getUnitLineIdForUnit(u) == 'Tarkan' && (
                            <MyText>
                                <MyText style={styles.small}> ({getBuildingName('Castle')})</MyText>, 21s{' '}
                                <MyText style={styles.small}>({getBuildingName('Stable')})</MyText>
                            </MyText>
                        )}
                        {getUnitLineIdForUnit(u) == 'Huskarl' && (
                            <MyText>
                                <MyText style={styles.small}> ({getBuildingName('Castle')})</MyText>, 13s{' '}
                                <MyText style={styles.small}>({getBuildingName('Barracks')})</MyText>
                            </MyText>
                        )}
                    </MyText>
                ))}
            </View>

            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.hitpoints')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="HP" />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.attack')}</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.melee')}</MyText>
                {units.map((u) => (
                    <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={4} />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.pierce')}</MyText>
                {units.map((u) => (
                    <GetAttackValue key={u} style={styles.cellValue} unitId={u} unitClassNumber={3} />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.bonus')}</MyText>
                {units.map((u) => (
                    <View key={u} style={styles.cellValue}>
                        {(getAttackBonuses({ unitId: u }).length > 0 &&
                            getAttackBonuses({ unitId: u }).map((bonusClass) => (
                                <MyText key={bonusClass}>
                                    <GetAttackBonusValue style={styles.cellValue} unitId={u} unitClassNumber={bonusClass} />
                                    <MyText style={styles.small}> ({getUnitClassName(bonusClass as UnitClassNumber).toLowerCase()})</MyText>
                                </MyText>
                            ))) || <Text>-</Text>}
                    </View>
                ))}
            </View>

            {baseData.MaxCharge > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.charge')}</MyText>
                </View>
            )}
            {baseData.MaxCharge > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.chargetype')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="ChargeType" formatter={(x) => formatChargeType(getTranslation, x)} />
                    ))}
                </View>
            )}
            {baseData.MaxCharge > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.maxcharge')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="MaxCharge" />
                    ))}
                </View>
            )}
            {baseData.RechargeRate > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.rechargerate')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue
                            key={u}
                            style={styles.cellValue}
                            unitId={u}
                            prop="RechargeRate"
                            formatter={(x) => {
                                if (!isFinite(x) || x > Number.MAX_SAFE_INTEGER) return '∞';
                                return x ? x.toFixed(2) + ' s' : '';
                            }}
                        />
                    ))}
                </View>
            )}
            {baseData.RechargeDuration > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.rechargeduration')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue
                            key={u}
                            style={styles.cellValue}
                            unitId={u}
                            prop="RechargeDuration"
                            formatter={(x) => (x ? x.toFixed(2) + ' s' : '')}
                        />
                    ))}
                </View>
            )}

            {baseData.BlastWidth > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.blastradius')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="BlastWidth" formatter={(x) => x?.toFixed(2)} />
                    ))}
                </View>
            )}
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.rateoffire')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="ReloadTime" formatter={(x) => x.toFixed(2) + ' s'} />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.framedelay')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="FrameDelay" />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.range')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="Range" />
                ))}
            </View>
            {baseData.MinRange > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.minimumrange')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="MinRange" />
                    ))}
                </View>
            )}
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.accuracy')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="AccuracyPercent" formatter={(x) => x + ' %'} />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.armour')}</MyText>
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.melee')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="MeleeArmor" />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.pierce')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="PierceArmor" />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={[styles.cellName, styles.small]}>{getTranslation('unit.stats.heading.bonus')}</MyText>
                {units.map((u) => (
                    <View key={u} style={styles.cellValue}>
                        {(getArmourClasses({ unitId: u }).length > 0 &&
                            getArmourClasses({ unitId: u }).map((a) => (
                                <MyText key={a.Class}>
                                    <GetArmourValue style={styles.cellValue} unitId={u} unitClassNumber={a.Class} />
                                    <MyText style={styles.small}> ({getUnitClassName(a.Class as UnitClassNumber).toLowerCase()})</MyText>
                                </MyText>
                            ))) || <Text>-</Text>}
                    </View>
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.speed')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="Speed" formatter={(x) => x.toFixed(2)} />
                ))}
            </View>
            <View style={styles.statsRow}>
                <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.lineofsight')}</MyText>
                {units.map((u) => (
                    <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="LineOfSight" />
                ))}
            </View>
            {baseData.GarrisonCapacity > 0 && (
                <View style={styles.statsRow}>
                    <MyText style={styles.cellName}>{getTranslation('unit.stats.heading.garrisoncapacity')}</MyText>
                    {units.map((u) => (
                        <GetUnitValue key={u} style={styles.cellValue} unitId={u} prop="GarrisonCapacity" />
                    ))}
                </View>
            )}
            <Space />
        </View>
    );
}

const padding = 2;

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        unitIcon: {
            width: 20,
            height: 20,
            marginRight: 5,
        },

        resRow: {
            flexDirection: 'row',
            // marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },
        resIcon: {
            width: 18,
            height: 18,
        },
        ageIcon: {
            width: 18,
            height: 18,
        },

        costsRow: {
            flexDirection: 'row',
            // marginBottom: 5,
        },

        statsContainer: {
            marginTop: 5,
            marginHorizontal: -padding,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        statsRowHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
        },
        cellName: {
            padding: padding,
            flex: 3,
            fontWeight: 'bold',
            lineHeight: 22,
        },
        cellValue: {
            lineHeight: 24,
            flex: 4,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
            textTransform: 'lowercase',
        },
    } as const)
);
