import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MyText} from "../components/my-text";
import {
    attackClasses, getEliteUniqueResearchIcon, getUnitClassName, getUnitData, getUnitIcon, getUnitName,
    hiddenArmourClasses,
    IUnitInfo, Unit,
    UnitClassNumber, UnitLine, unitLines
} from "../../helper/units";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {iconSmallHeight, iconSmallWidth} from "../../helper/theme";
import {getTechIcon, getTechName, Tech, techEffectDict} from "../../helper/techs";
import {appVariants} from "../../styles";
import {Civ} from "../../helper/civs";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";

interface Props {
    unitLineId: UnitLine;
    unitId: Unit;
}

export function UnitUpgrades({ unitLineId, unitId }: Props) {
    const styles = useTheme(variants);
    const appStyles = useTheme(appVariants);

    const navigation = useNavigation<RootStackProp>();

    const unitLine = unitLines[unitLineId];

    const unitLineUpgrades = unitLine.upgrades.map(u => techEffectDict[u]);

    const unitIndex = unitLine.units.indexOf(unitId);
    const upgradedFrom = unitIndex > 0 ? unitLine.units[unitIndex-1] : null;
    const upgradedTo = unitIndex < unitLine.units.length-1 ? unitLine.units[unitIndex+1] : null;

    let groups = [
        {
            name: 'Carry Capacity',
            prop: 'carryCapacity',
            upgrades: unitLineUpgrades.filter(u => 'carryCapacity' in u.effect),
        },
        {
            name: 'Gathering Speed',
            prop: 'gatheringSpeed',
            upgrades: unitLineUpgrades.filter(u => 'gatheringSpeed' in u.effect),
        },
        {
            name: 'Hit Points',
            prop: 'hitPoints',
            upgrades: unitLineUpgrades.filter(u => 'hitPoints' in u.effect),
        },
        {
            name: 'Attack',
            prop: 'attack',
            upgrades: unitLineUpgrades.filter(u => 'attack' in u.effect),
        },
        {
            name: 'Range',
            prop: 'range',
            upgrades: unitLineUpgrades.filter(u => 'range' in u.effect),
        },
        {
            name: 'Firing Rate',
            prop: 'firingRate',
            upgrades: unitLineUpgrades.filter(u => 'firingRate' in u.effect),
        },
        {
            name: 'Accuracy',
            prop: 'accuracy',
            upgrades: unitLineUpgrades.filter(u => 'accuracy' in u.effect),
        },
        {
            name: 'Armor',
            prop: 'armor',
            upgrades: unitLineUpgrades.filter(u => 'armor' in u.effect),
        },
        {
            name: 'Speed',
            prop: 'speed',
            upgrades: unitLineUpgrades.filter(u => 'speed' in u.effect),
        },
        {
            name: 'Sight',
            prop: 'sight',
            upgrades: unitLineUpgrades.filter(u => 'sight' in u.effect),
        },
        {
            name: 'Conversion Defense',
            prop: 'conversionDefense',
            upgrades: unitLineUpgrades.filter(u => 'conversionDefense' in u.effect),
        },
        {
            name: 'Creation Speed',
            prop: 'creationSpeed',
            upgrades: unitLineUpgrades.filter(u => 'creationSpeed' in u.effect),
        },
        {
            name: 'Capacity',
            prop: 'capacity',
            upgrades: unitLineUpgrades.filter(u => 'capacity' in u.effect),
        },
        {
            name: 'Other',
            prop: 'other',
            upgrades: unitLineUpgrades.filter(u => 'other' in u.effect),
        },
    ];

    groups = groups.filter(g => g.upgrades.length > 0);

    const gotoCiv = (civ: Civ) => navigation.push('Civ', {civ: civ});
    const gotoUnit = (unit: Unit) => navigation.push('Unit', {unit: unit});
    const gotoTech = (tech: Tech) => navigation.push('Tech', {tech: tech});

    return (
      <View>

          {
              groups.map(group =>
                  <View key={group.name}>
                      <View style={styles.row}>
                          <MyText size="headline">{group.name}</MyText>
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
                  <MyText/>
                  <View style={styles.row}>
                      <MyText size="headline">Upgraded From</MyText>
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
                  <MyText/>
                  <View style={styles.row}>
                      <MyText size="headline">Upgraded To</MyText>
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
            fontSize: 18,
            fontWeight: '500',
        },
        header2: {
            fontSize: 16,
            fontWeight: '300',
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
