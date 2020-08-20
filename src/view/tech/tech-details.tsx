import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
    Effect, effectNames, getEffectName, getTechData, getTechDescription, getTechName, ITechEffect, Tech, techEffectDict,
    techs
} from "../../helper/techs";
import Fandom from "../components/fandom";
import {
    getOtherIcon, getUnitLineIdForUnit, Other, sortedUnitLines, sortResources, Unit, UnitLine, unitLines
} from "../../helper/units";
import {MyText} from "../components/my-text";
import {keysOf} from "../../helper/util";
import {useTheme} from "../../theming";
import {appVariants} from "../../styles";
import {UnitCompBig} from "../unit/unit-list";
import {capitalize} from "lodash-es";
import CivAvailability from "../components/civ-availability";


function hasUpgrade(unitLineId: UnitLine, tech: Tech) {
    return unitLines[unitLineId].upgrades.some(u => techEffectDict[u].tech == tech);
}

function getUpgrades(unitLineId: UnitLine, tech: Tech) {
    return unitLines[unitLineId].upgrades.filter(u => techEffectDict[u].tech == tech).map(u => techEffectDict[u]);
}

function hasUpgradeUnit(unitId: Unit, tech: Tech) {
    return unitLines[getUnitLineIdForUnit(unitId)].upgrades.some(u => techEffectDict[u].tech == tech && (!techEffectDict[u].unit || techEffectDict[u].unit == unitId));
}

function getUpgradesUnit(unitId: Unit, tech: Tech) {
    return unitLines[getUnitLineIdForUnit(unitId)].upgrades.filter(u => techEffectDict[u].tech == tech && (!techEffectDict[u].unit || techEffectDict[u].unit == unitId)).map(u => techEffectDict[u]);
}

interface IAffectedUnit {
    unitId: Unit;
    upgrades: ITechEffect[];
}

export default function TechDetails({tech}: {tech: Tech}) {
    const appStyles = useTheme(appVariants);
    const data = getTechData(tech);

    const affectedUnitLines = sortedUnitLines.filter(unitLineId => hasUpgrade(unitLineId, tech));

    const affectedUnitInfos = affectedUnitLines.flatMap(unitLineId => unitLines[unitLineId].units)
        .filter(unitId => hasUpgradeUnit(unitId, tech))
        .map(unitId => ({
            unitId,
            upgrades: getUpgradesUnit(unitId, tech),
        }));

    // console.log(affectedUnitInfos);

    const techInfo = techs[tech];

    const getEffectText = (u: ITechEffect, effect: Effect) => {
        return u.effect[effect] + (u.civ && !techInfo.civ ? ' (only '+u.civ+')' : '');
    };

    const getUpgradeList = (affectedUnitInfo: IAffectedUnit) => {
        return keysOf(effectNames).map(effect => ({
            name: getEffectName(effect),
            upgrades: affectedUnitInfo.upgrades.filter(u => effect in u.effect).map(u => getEffectText(u, effect)),
        })).filter(g => g.upgrades.length > 0);
    };

    const techsAffectingAllUnits: Tech[] = ['Faith', 'Heresy', 'Conscription'];

    return (
        <View style={styles.container}>
            <View style={styles.costsRow}>
                {
                    sortResources(keysOf(data.Cost)).map(res =>
                        <View key={res} style={styles.resRow}>
                            <Image style={styles.resIcon} source={getOtherIcon(res as Other)}/>
                            <MyText style={styles.resDescription}>{data.Cost[res]}</MyText>
                        </View>
                    )
                }
                <MyText style={styles.description}>Researched in {data.ResearchTime}s</MyText>
            </View>

            <MyText style={styles.description}>{getTechDescription(tech)}</MyText>
            <MyText/>

            <CivAvailability tech={tech}/>

            {
                !techsAffectingAllUnits.includes(tech) && affectedUnitInfos.length > 0 &&
                <View>
                    <MyText/>
                    <MyText>Affected Units</MyText>
                    <MyText/>
                    {
                        affectedUnitInfos.map(affectedUnit => {
                            console.log(getUpgradeList(affectedUnit).map(g => g.name + ': ' + capitalize(g.upgrades.join(', '))).join('\n'));
                                return <View>
                                    <UnitCompBig key={affectedUnit.unitId} unit={affectedUnit.unitId} subtitle={
                                        getUpgradeList(affectedUnit).map(g => g.name + ': ' + capitalize(g.upgrades.join(', '))).join('\n')
                                    }/>
                                </View>;
                            }
                        )
                    }
                </View>
            }

            <View style={appStyles.expanded}/>
            <Fandom articleName={getTechName(tech)}/>
        </View>
    );
}


const styles = StyleSheet.create({
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
        // backgroundColor: 'blue',
    },

    description: {
        lineHeight: 20,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        padding: 20,
    },
});
