import {
    AbilityHelperProps, Age,
    aoeCivKey,
    Building,
    Civ,
    civDict, getAbilityAge,
    getAbilityEnabled, getBuildingName,
    getCompactTechTree,
    getFullTechTree, getTechName,
    getUnitLineForUnit, getUnitName,
    ITechTreeRow,
    Tech,
    Unit,
} from '@nex/data';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, ImageBackground } from '@/src/components/uniwind/image';
import React, { Fragment } from 'react';
import { MyText } from './my-text';
import ButtonPicker from './button-picker';
import { getTechIcon } from '../../helper/techs';
import { getAgeIcon, getOtherIcon, getUnitIcon } from '../../helper/units';
import { getBuildingIcon } from '../../helper/buildings';
import { isEmpty } from 'lodash';
import { Delayed } from './delayed';
import { Link } from 'expo-router';
import { useTechTreeSize } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useTranslation } from '@app/helper/translate';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';

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
    const showTabBar = useShowTabBar()

    return (
        <View style={styles.container}>
            <View style={styles.row} className="lg:gap-2">
                <MyText style={styles.sectionHeader}>{getTranslation('techtree.title')} </MyText>
                <ButtonPicker value={techTreeSize} values={values} formatter={(x) => getTranslation(`techtree.type.${x}` as any)} onSelect={nav} />
            </View>
            {techTreeSize === 'compact' && (
                <View style={styles.compactTechTree}>
                    {compactTechTree.map((row, i) =>
                        showTabBar ? (
                            <Delayed key={i} delay={i * 30}>
                                <TechTreeRow civ={civ} row={row} />
                            </Delayed>
                        ) : (
                            <TechTreeRow civ={civ} row={row} />
                        )
                    )}
                </View>
            )}
            {techTreeSize === 'full' && (
                <View style={styles.fullTechTree}>
                    {fullTechTree.map((row, i) =>
                        showTabBar ? (
                            <Delayed key={i} delay={i * 30}>
                                <TechTreeRow civ={civ} row={row} />
                            </Delayed>
                        ) : (
                            <TechTreeRow civ={civ} row={row} />
                        )
                    )}
                </View>
            )}
        </View>
    );
}

interface Ability3Props {
    age: Age;
}

interface AbilityProps {
    age?: Age;
    civ?: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
    unique?: boolean;
    dependsOn?: any;
}

export function getAbilityName({tech, unit, building}: AbilityHelperProps) {
    if (tech) {
        return getTechName(tech);
    }
    if (unit) {
        return getUnitName(unit);
    }
    if (building) {
        return getBuildingName(building);
    }
    return false;
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

export function getAbilityNavHref({tech, unit, building}: AbilityHelperProps) {
    if (tech) {
        return `/explore/technologies/${tech}` as const;
    }
    if (unit) {
        return `/explore/units/${unit}` as const;
    }
    if (building) {
        return `/explore/buildings/${building}` as const;
    }
    return '/'
}

function Ability0() {
    return (
        <View style={[styles.imageContainer0, {borderColor: 'transparent'}]}/>
    );
}

const techTreeWidth = Math.min(Dimensions.get('window').width, 450) - 28;
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
        <Link asChild href={getAbilityNavHref({ tech, unit, building })} style={[styles.imageContainer2, { borderColor, opacity }]}>
            <TouchableOpacity>
                <ImageBackground
                    source={getAbilityIcon({ civ, tech, unit, building })}
                    imageStyle={styles.imageInner2}
                    contentFit="cover"
                    style={styles.image2}
                >
                    {!enabled && <Image source={getOtherIcon('Cross' as any)} style={styles.cross} />}
                    {age !== availableAge && (
                        <Image
                            source={getAgeIcon(availableAge as any)}
                            style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 16,
                                height: 16,
                            }}
                            className="absolute -top-2 -right-2 w-4 h-4 md:-top-4 md:-right-4 md:w-8 md:h-8"
                        />
                    )}
                </ImageBackground>
            </TouchableOpacity>
        </Link>
    );
}

function Ability3({age}: Ability3Props) {
    return (
        <TouchableOpacity style={[styles.imageContainer3]}>
            <ImageBackground source={getAgeIcon(age)} imageStyle={styles.imageInner2} contentFit="cover" style={styles.image2}/>
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
