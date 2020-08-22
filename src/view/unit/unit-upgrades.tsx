import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {MyText} from "../components/my-text";
import {getEliteUniqueResearchIcon, getUnitIcon, getUnitName, Unit, UnitLine, unitLines} from "../../helper/units";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {iconSmallHeight, iconSmallWidth} from "../../helper/theme";
import {effectNames, getEffectName, getTechIcon, getTechName, Tech, techEffectDict} from "../../helper/techs";
import {appVariants} from "../../styles";
import {Civ} from "../../helper/civs";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {keysOf} from "../../helper/util";
import Space from "../components/space";

interface Props {
    unitLineId: UnitLine;
    unitId: Unit;
}

export function UnitUpgrades({ unitLineId, unitId }: Props) {
    const styles = useTheme(variants);
    const appStyles = useTheme(appVariants);

    const navigation = useNavigation<RootStackProp>();

    const unitLine = unitLines[unitLineId];

    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]).filter(u => !u.unit || u.unit == unitId);

    const unitIndex = unitLine.units.indexOf(unitId);
    const upgradedFrom = unitIndex > 0 ? unitLine.units[unitIndex-1] : null;
    const upgradedTo = unitIndex < unitLine.units.length-1 ? unitLine.units[unitIndex+1] : null;

    let groups = keysOf(effectNames).map(effect => ({
        name: getEffectName(effect),
        prop: effect,
        upgrades: unitLineUpgrades.filter(u => effect in u.effect),
    }));

    groups = groups.filter(g => g.upgrades.length > 0);

    const gotoCiv = (civ: Civ) => navigation.push('Civ', {civ: civ});
    const gotoUnit = (unit: Unit) => navigation.push('Unit', {unit: unit});
    const gotoTech = (tech: Tech) => navigation.push('Tech', {tech: tech});

    return (
      <View>
          <View style={styles.row}>
              <MyText style={styles.header1}>
                  Upgrades
              </MyText>
          </View>

          {
              groups.map(group =>
                  <View key={group.name}>
                      <View style={styles.row}>
                          <MyText style={styles.header2}>{group.name}</MyText>
                      </View>
                      {
                          group.upgrades.map(upgrade =>
                              <View style={styles.row} key={upgrade.name}>
                                  <Image style={styles.unitIcon} source={getTechIcon(upgrade.tech)}/>
                                  <MyText style={styles.unitDesc}>
                                      <MyText style={appStyles.link} onPress={() => gotoTech(upgrade.tech!)}>{getTechName(upgrade.tech)}</MyText>
                                      <MyText size="footnote">
                                          {upgrade.effect[group.prop] ? ' (' + upgrade.effect[group.prop] : ''}
                                          {
                                              upgrade.civ &&
                                              <>
                                                  <MyText size="footnote">, only </MyText>
                                                  <MyText size="footnote" style={appStyles.link} onPress={() => gotoCiv(upgrade.civ!)}>{upgrade.civ}</MyText>
                                              </>
                                          }
                                          {upgrade.effect[group.prop] ? ')' : ''}
                                      </MyText>
                                  </MyText>
                              </View>
                          )
                      }
                  </View>
              )
          }
          {
              upgradedFrom &&
              <View>
                  <Space/>
                  <View style={styles.row}>
                      <MyText style={styles.header2}>Upgraded From</MyText>
                  </View>
                  <TouchableOpacity onPress={() => gotoUnit(upgradedFrom)}>
                      <View style={styles.row}>
                          <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedFrom)}/>
                          <MyText style={styles.unitDesc}>{getUnitName(upgradedFrom)}</MyText>
                      </View>
                  </TouchableOpacity>
              </View>
          }
          {
              upgradedTo &&
              <View>
                  <Space/>
                  <View style={styles.row}>
                      <MyText style={styles.header2}>Upgraded To</MyText>
                  </View>
                  <TouchableOpacity disabled={unitLine.unique} onPress={() => gotoUnit(upgradedTo)}>
                      <View style={styles.row}>
                          <Image style={styles.unitIcon} source={unitLine.unique ? getEliteUniqueResearchIcon() : getUnitIcon(upgradedTo)}/>
                          <MyText style={styles.unitDesc}>{getUnitName(upgradedTo)}</MyText>
                      </View>
                  </TouchableOpacity>
              </View>
          }
      </View>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        description: {
            lineHeight: 20,
        },
        container: {
            flex: 1,
            minHeight: '100%',
            padding: 20,
        },
        row: {
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
            // backgroundColor: 'blue',
        },

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

        checkboxCell: {
            flex: 1,
            marginLeft: -6
        },
        checkboxDesc: {
            flex: 11,
            marginLeft: 4
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
        header1: {
            marginTop: 10,
            fontSize: 18,
            fontWeight: '500',
        },
        header2: {
            fontSize: 15,
            marginVertical: 5,
        },
        unitIcon: {
            width: iconSmallWidth,
            height: iconSmallHeight,
            marginRight: 5,
        },
        unitDesc: {
            lineHeight: 20,
            flex: 1,
        },
    });
};

const variants = makeVariants(getStyles);
