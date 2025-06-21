import {
    AbilityHelperProps,
    aoeCivKey,
    Building,
    Civ,
    civDict, getAbilityAge,
    getAbilityEnabled,
    getCompactTechTree,
    getFullTechTree,
    getUnitLineForUnit,
    ITechTreeRow,
    Other,
    Tech,
    Unit,
} from '@nex/data';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import React, { Fragment } from 'react';
import { MyText } from './my-text';
import ButtonPicker from './button-picker';
import { getTechIcon } from '../../helper/techs';
import { getAgeIcon, getOtherIcon, getUnitIcon } from '../../helper/units';
import { getBuildingIcon } from '../../helper/buildings';
import { isEmpty } from 'lodash';
import { Delayed } from './delayed';
import { router } from 'expo-router';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { useTechTreeSize } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useTranslation } from '@app/helper/translate';

function TechTreeRow({ civ, row }: { civ: aoeCivKey; row: ITechTreeRow }) {
    const getTranslation = useTranslation();
    return (
        <View style={styles.row}>
            {row.title !== undefined && <MyText style={styles.heading}>{getTranslation(row.title as any)}</MyText>}
            {row.items?.map((item, i) => (
                <Fragment key={i}>
                    {isEmpty(item) && <Ability0 />}
                    {item.unit && <Ability2 civ={civ} age={item.age} unit={item.unit as any} unique={item.unique} dependsOn={item.dependsOn} />}
                    {item.tech && <Ability2 civ={civ} age={item.age} tech={item.tech as any} unique={item.unique} dependsOn={item.dependsOn} />}
                    {item.building && <Ability2 civ={civ} age={item.age} building={item.building as any} unique={item.unique} dependsOn={item.dependsOn} />}
                    {item.age && (!item.unit && !item.tech && !item.building) && <Ability3 age={item.age} />}
                </Fragment>
            ))}
        </View>
    );
}

export function TechTree({civ}: {civ: aoeCivKey}) {
    const getTranslation = useTranslation();
    const techTreeSize = useTechTreeSize() || 'full';
    const savePrefsMutation = useSavePrefsMutation();

    const civInfo = civDict[civ];
    const uniqueLine = getUnitLineForUnit(civInfo.uniqueUnits[0]);

    const values: string[] = [
        'compact',
        'full',
    ];

    const nav = async (techTreeSize: string) => {
        savePrefsMutation.mutate({techTreeSize});
    };

    const compactTechTree = getCompactTechTree(civInfo);
    const fullTechTree = getFullTechTree(civInfo, uniqueLine);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <MyText style={styles.sectionHeader}>{getTranslation('techtree.title')}    </MyText>
                <ButtonPicker value={techTreeSize} values={values} formatter={x => getTranslation(`techtree.type.${x}` as any)} onSelect={nav}/>
            </View>
            {
                techTreeSize === 'compact' &&
                <View style={styles.compactTechTree}>
                    {
                        compactTechTree.map((row, i) =>
                            <Delayed key={i} delay={i*30}><TechTreeRow civ={civ} row={row}/></Delayed>
                        )
                    }
                </View>
            }
            {
                techTreeSize === 'full' &&
                <View style={styles.fullTechTree}>
                    {
                        fullTechTree.map((row, i) =>
                            <Delayed key={i} delay={i*30}><TechTreeRow civ={civ} row={row}/></Delayed>
                        )
                    }
                </View>
            }
        </View>
    );
}

interface Ability3Props {
    age: Other;
}

interface AbilityProps {
    age?: Other;
    civ?: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
    unique?: boolean;
    dependsOn?: any;
}

export function getAbilityIcon({civ, tech, unit, building}: AbilityHelperProps) {
    if (tech) {
        return getTechIcon(tech);
    }
    if (unit) {
        return getUnitIcon(unit, civ);
    }
    if (building) {
        return getBuildingIcon(building);
    }
    return false;
}

function getAbilityNavCallback({tech, unit, building}: AbilityHelperProps) {
    if (tech) {
        return () => router.navigate(`/explore/technologies/${tech}`);
    }
    if (unit) {
        return () => router.navigate(`/explore/units/${unit}`);
    }
    if (building) {
        return () => router.navigate(`/explore/buildings/${building}`);
    }
    return () => {};
}

function Ability0() {
    return (
        <View style={[styles.imageContainer0, {borderColor: 'transparent'}]}/>
    );
}

const techTreeWidth = windowWidth - 28;
const colSize = (techTreeWidth / 8)-4;
const colSize2 = colSize-6;

function Ability2({civ, age, tech, unit, building, unique, dependsOn}: AbilityProps) {
    if (!civ) return Ability0();
    if (!tech && !unit && !building) return Ability0();
    const enabled = getAbilityEnabled({civ, tech, unit, building, dependsOn});
    const availableAge = getAbilityAge({civ, tech, unit, building, dependsOn});
    let borderColor = '#555';
    const opacity = enabled ? 1 : 0.4;
    if (tech) {
        borderColor = '#397A39';
    }
    if (unit) {
        borderColor = unique ? '#8C2682' : '#0075A1';
    }
    if (building) {
        borderColor = '#AA460F';
    }
    return (
        <TouchableOpacity style={[styles.imageContainer2, {borderColor, opacity}]} onPress={getAbilityNavCallback({tech, unit, building})}>
            <ImageBackground source={getAbilityIcon({civ, tech, unit, building})} imageStyle={styles.imageInner2} contentFit="cover" style={styles.image2}>
                {
                    !enabled &&
                    <Image source={getOtherIcon('Cross' as any)} style={styles.cross}/>
                }
                {
                    age !== availableAge &&
                    <Image source={getOtherIcon(availableAge as any)} style={styles.availableAge}/>
                }
            </ImageBackground>
        </TouchableOpacity>
    );
}

function Ability3({age}: Ability3Props) {
    return (
        <TouchableOpacity style={[styles.imageContainer3]}>
            <ImageBackground source={getOtherIcon(age)} imageStyle={styles.imageInner2} contentFit="cover" style={styles.image2}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 15,
        fontWeight: '500',
    },
    imageInner2: {
        // alignSelf: 'flex-end',
    },
    imageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F00',
        textShadowColor: 'black',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
    },
    image2: {
        alignItems: 'center',
        justifyContent: 'center',
        width: colSize2,
        height: colSize2,
        // backgroundColor: 'blue',
    },
    imageContainer0: {
        // backgroundColor: 'blue',
        borderWidth: 3,
        borderColor: '#FFF',
        width: colSize,
        height: colSize,
        margin: 2,
        // backgroundColor: 'blue',
    },
    imageContainer2: {
        borderWidth: 3,
        borderColor: '#555',
        width: colSize,
        height: colSize,
        margin: 2,
        backgroundColor: 'black',
    },
    cross: {
        width: 28,
        height: 28,
    },
    availableAge: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 16,
        height: 16,
    },
    imageContainer3: {
        // backgroundColor: 'yellow',
        borderWidth: 3,
        borderColor: 'transparent',
        width: colSize,
        height: colSize,
        margin: 2,
    },
    spacing: {
        marginTop: 5,
    },
    heading: {
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 5,
        // backgroundColor: 'red',
    },
    heading2: {
        marginVertical: 10,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    content: {
        marginBottom: 5,
        textAlign: 'left',
        lineHeight: 20,
    },
    container: {
        marginTop: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginLeft: 0,
        // backgroundColor: 'yellow',
        // flex: 1,
        // width: 100,
    },
    compactTechTree: {
        marginTop: 20,
        minHeight: 400,
    },
    fullTechTree: {
        marginLeft: -10,
        minHeight: 400,
    },
});
