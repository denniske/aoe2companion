import {
    AbilityHelperProps, aoeCivKey, Building, Civ, civDict, getAbilityEnabled, getUnitLineForUnit, Other, Tech, Unit
} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {MyText} from "./my-text";
import {capitalize} from "lodash-es";
import {setPrefValue, useMutate, useSelector} from "../../redux/reducer";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import ButtonPicker from "./button-picker";
import {windowWidth} from "../leaderboard.page";
import {getTechIcon} from "../../helper/techs";
import {getOtherIcon, getUnitIcon} from "../../helper/units";
import {getBuildingIcon} from "../../helper/buildings";
import {getTranslation} from '../../helper/translate';


export function TechTree({civ}: {civ: aoeCivKey}) {
    const mutate = useMutate();
    const techTreeSize = useSelector(state => state.prefs.techTreeSize) || 'full';

    const civInfo = civDict[civ];
    const uniqueLine = getUnitLineForUnit(civInfo.uniqueUnits[0]);

    const values: string[] = [
        'compact',
        'full',
    ];

    const nav = async (str: any) => {
        mutate(setPrefValue('techTreeSize', str));
        await saveCurrentPrefsToStorage();
    };

    return (
        <View style={styles.container}>
            <View style={styles.row2}>
                <MyText style={styles.sectionHeader}>{getTranslation('techtree.title')}    </MyText>
                <ButtonPicker value={techTreeSize} values={values} formatter={x => getTranslation(`techtree.type.${x}`)} onSelect={nav}/>
            </View>

            {
                techTreeSize === 'compact' &&
                <>
                    <MyText style={styles.spacing}/>
                    <MyText style={styles.heading}>{getTranslation('techtree.heading.blacksmith')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} tech="Forging"/>
                        <Ability2 civ={civ} tech="ScaleMailArmor"/>
                        <Ability2 civ={civ} tech="ScaleBardingArmor"/>
                        <Ability0/>
                        <Ability2 civ={civ} tech="Fletching"/>
                        <Ability2 civ={civ} tech="PaddedArcherArmor"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} tech="IronCasting"/>
                        <Ability2 civ={civ} tech="ChainMailArmor"/>
                        <Ability2 civ={civ} tech="ChainBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BodkinArrow"/>
                        <Ability2 civ={civ} tech="LeatherArcherArmor"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} tech="BlastFurnace"/>
                        <Ability2 civ={civ} tech="PlateMailArmor"/>
                        <Ability2 civ={civ} tech="PlateBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Bracer"/>
                        <Ability2 civ={civ} tech="RingArcherArmor"/>
                    </View>

                    <MyText style={styles.heading}>{getTranslation('techtree.heading.other')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} tech="Bloodlines"/>
                        <Ability2 civ={civ} tech="Husbandry"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ThumbRing"/>
                        <Ability2 civ={civ} tech="ParthianTactics"/>
                    </View>

                    <MyText style={styles.heading}>{getTranslation('techtree.heading.siege')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="BatteringRam"/>
                        <Ability2 civ={civ} unit="Mangonel"/>
                        <Ability2 civ={civ} unit="Scorpion"/>
                        <Ability2/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="CappedRam"/>
                        <Ability2 civ={civ} unit="Onager"/>
                        <Ability2 civ={civ} unit="HeavyScorpion"/>
                        <Ability2/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="SiegeRam"/>
                        <Ability2 civ={civ} unit="SiegeOnager"/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="BombardCannon"/>
                        <Ability2 civ={civ} tech="SiegeEngineers"/>
                    </View>

                    <MyText style={styles.heading}>{getTranslation('techtree.heading.infantry')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="LongSwordsman"/>
                        <Ability2 civ={civ} unit="Spearman"/>
                        <Ability2 civ={civ} unit="EagleScout"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="TwoHandedSwordsman"/>
                        <Ability2 civ={civ} unit="Pikeman"/>
                        <Ability2 civ={civ} unit="EagleWarrior"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="Champion"/>
                        <Ability2 civ={civ} unit="Halberdier"/>
                        <Ability2 civ={civ} unit="EliteEagleWarrior"/>
                    </View>

                    <MyText style={styles.heading}>{getTranslation('techtree.heading.cavalry')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="ScoutCavalry"/>
                        <Ability2 civ={civ} unit="Knight"/>
                        <Ability2 civ={civ} unit="CamelRider"/>
                        <Ability2 civ={civ} unit="BattleElephant"/>
                        <Ability2 civ={civ} unit="SteppeLancer"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="LightCavalry"/>
                        <Ability2 civ={civ} unit="Cavalier"/>
                        <Ability2 civ={civ} unit="HeavyCamelRider"/>
                        <Ability2 civ={civ} unit="EliteBattleElephant"/>
                        <Ability2 civ={civ} unit="EliteSteppeLancer"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="Hussar"/>
                        <Ability2 civ={civ} unit="Paladin"/>
                        <Ability2 civ={civ} unit="ImperialCamelRider"/>
                        <Ability2/>
                        <Ability2/>
                    </View>

                    <MyText style={styles.heading}>{getTranslation('techtree.heading.archer')}</MyText>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="Archer"/>
                        <Ability2 civ={civ} unit="Skirmisher"/>
                        <Ability2/>
                        <Ability2/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="Crossbowman"/>
                        <Ability2 civ={civ} unit="EliteSkirmisher"/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="CavalryArcher"/>
                    </View>
                    <View style={styles.row2}>
                        <Ability2 civ={civ} unit="Arbalester"/>
                        <Ability2 civ={civ} unit="ImperialSkirmisher"/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="HeavyCavalryArcher"/>
                        <Ability2 civ={civ} unit="HandCannoneer"/>
                    </View>
                </>
            }


            {
                techTreeSize === 'full' &&
                <>
                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Blacksmith"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} tech="Forging"/>
                        <Ability2 civ={civ} tech="ScaleMailArmor"/>
                        <Ability2 civ={civ} tech="ScaleBardingArmor"/>
                        <Ability0/>
                        <Ability2 civ={civ} tech="Fletching"/>
                        <Ability2 civ={civ} tech="PaddedArcherArmor"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="IronCasting"/>
                        <Ability2 civ={civ} tech="ChainMailArmor"/>
                        <Ability2 civ={civ} tech="ChainBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BodkinArrow"/>
                        <Ability2 civ={civ} tech="LeatherArcherArmor"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="BlastFurnace"/>
                        <Ability2 civ={civ} tech="PlateMailArmor"/>
                        <Ability2 civ={civ} tech="PlateBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Bracer"/>
                        <Ability2 civ={civ} tech="RingArcherArmor"/>
                    </View>


                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="SiegeWorkshop"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="BatteringRam"/>
                        <Ability2 civ={civ} unit="Mangonel"/>
                        <Ability2 civ={civ} unit="Scorpion"/>
                        <Ability2 civ={civ} unit="SiegeTower"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="CappedRam"/>
                        <Ability2 civ={civ} unit="Onager"/>
                        <Ability2 civ={civ} unit="HeavyScorpion"/>
                        <Ability2/>
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} unit="SiegeRam"/>
                        <Ability2 civ={civ} unit="SiegeOnager"/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="BombardCannon"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Barracks"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="Militia"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="ManAtArms"/>
                        <Ability2 civ={civ} unit="Spearman"/>
                        <Ability2 civ={civ} unit="EagleScout"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Supplies"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="LongSwordsman"/>
                        <Ability2 civ={civ} unit="Pikeman"/>
                        <Ability2 civ={civ} unit="EagleWarrior"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Squires"/>
                        <Ability2 civ={civ} tech="Arson"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="TwoHandedSwordsman"/>
                        <Ability2 civ={civ} unit="Halberdier"/>
                        <Ability2 civ={civ} unit="EliteEagleWarrior"/>
                        <Ability2 civ={civ} unit="Condottiero"/>
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} unit="Champion"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Stable"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="ScoutCavalry"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Bloodlines"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="LightCavalry"/>
                        <Ability2 civ={civ} unit="Knight"/>
                        <Ability2 civ={civ} unit="CamelRider"/>
                        <Ability2 civ={civ} unit="BattleElephant"/>
                        <Ability2 civ={civ} unit="SteppeLancer"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Husbandry"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Hussar"/>
                        <Ability2 civ={civ} unit="Cavalier"/>
                        <Ability2 civ={civ} unit="HeavyCamelRider"/>
                        <Ability2 civ={civ} unit="EliteBattleElephant"/>
                        <Ability2 civ={civ} unit="EliteSteppeLancer"/>
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="Paladin"/>
                        <Ability2 civ={civ} unit="ImperialCamelRider"/>
                        <Ability2/>
                        <Ability2/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="ArcheryRange"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="Archer"/>
                        <Ability2 civ={civ} unit="Skirmisher"/>
                        <Ability2/>
                        <Ability2/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Crossbowman"/>
                        <Ability2 civ={civ} unit="EliteSkirmisher"/>
                        <Ability2 civ={civ} unit="CavalryArcher"/>
                        <Ability2 civ={civ} unit="Genitour"/>
                        <Ability2 civ={civ} unit="Slinger"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ThumbRing"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Arbalester"/>
                        <Ability2 civ={civ} unit="ImperialSkirmisher"/>
                        <Ability2 civ={civ} unit="HeavyCavalryArcher"/>
                        <Ability2 civ={civ} unit="EliteGenitour"/>
                        <Ability2 civ={civ} unit="HandCannoneer"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ParthianTactics"/>
                    </View>


                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Dock"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="FishingShip"/>
                        <Ability2 civ={civ} unit="TransportShip"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="FireGalley"/>
                        <Ability2 civ={civ} unit="TradeCog"/>
                        <Ability2 civ={civ} unit="DemolitionRaft"/>
                        <Ability2 civ={civ} unit="Galley"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="FireShip"/>
                        <Ability2 civ={civ} tech="Gillnets"/>
                        <Ability2 civ={civ} unit="DemolitionShip"/>
                        <Ability2 civ={civ} unit="WarGalley"/>
                        <Ability2 civ={civ} tech="Careening"/>
                        <Ability2/>
                        {
                            civInfo.uniqueUnits.includes('Caravel') &&
                            <Ability2 civ={civ} unit="Caravel"/>
                        }
                        {
                            civInfo.uniqueUnits.includes('Longboat') &&
                            <Ability2 civ={civ} unit="Longboat"/>
                        }
                        {
                            civInfo.uniqueUnits.includes('TurtleShip') &&
                            <Ability2 civ={civ} unit="TurtleShip"/>
                        }
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="FastFireShip"/>
                        <Ability2 civ={civ} unit="CannonGalleon"/>
                        <Ability2 civ={civ} unit="HeavyDemolitionShip"/>
                        <Ability2 civ={civ} unit="Galleon"/>
                        <Ability2 civ={civ} tech="DryDock"/>
                        <Ability2 civ={civ} tech="Shipwright"/>
                        {
                            civInfo.uniqueUnits.includes('Caravel') &&
                            <Ability2 civ={civ} unit="EliteCaravel"/>
                        }
                        {
                            civInfo.uniqueUnits.includes('Longboat') &&
                            <Ability2 civ={civ} unit="EliteLongboat"/>
                        }
                        {
                            civInfo.uniqueUnits.includes('TurtleShip') &&
                            <Ability2 civ={civ} unit="EliteTurtleShip"/>
                        }
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="EliteCannonGalleon"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Castle"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit={uniqueLine?.units[0]}/>
                        <Ability2 civ={civ} unit="Petard"/>
                        <Ability2 civ={civ} tech={civInfo.uniqueTechs[0]}/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit={uniqueLine?.units[1]}/>
                        <Ability2 civ={civ} unit="Trebuchet"/>
                        <Ability2 civ={civ} tech={civInfo.uniqueTechs[1]}/>
                        <Ability2 civ={civ} tech="Hoardings"/>
                        <Ability2 civ={civ} tech="Sappers"/>
                        <Ability2 civ={civ} tech="Conscription"/>
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="FlamingCamel"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="SpiesTreason"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Krepost"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Konnik"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="EliteKonnik"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Monastery"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Monk"/>
                        <Ability2 civ={civ} tech="Redemption"/>
                        <Ability2 civ={civ} tech="Atonement"/>
                        <Ability2 civ={civ} tech="HerbalMedicine"/>
                        <Ability2 civ={civ} tech="Heresy"/>
                        <Ability2 civ={civ} tech="Sanctity"/>
                        <Ability2 civ={civ} tech="Fervor"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Missionary"/>
                        <Ability2 civ={civ} tech="Faith"/>
                        <Ability2 civ={civ} tech="Illumination"/>
                        <Ability2 civ={civ} tech="BlockPrinting"/>
                        <Ability2 civ={civ} tech="Theocracy"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="University"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="Masonry"/>
                        <Ability2 civ={civ} tech="FortifiedWall"/>
                        <Ability2 civ={civ} tech="TreadmillCrane"/>
                        <Ability2 civ={civ} tech="MurderHoles"/>
                        <Ability2 civ={civ} tech="HeatedShot"/>
                        <Ability2 civ={civ} tech="Ballistics"/>
                        <Ability2 civ={civ} tech="GuardTower"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="Architecture"/>
                        <Ability2 civ={civ} tech="SiegeEngineers"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ArrowSlits"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Chemistry"/>
                        <Ability2 civ={civ} tech="Keep"/>
                    </View>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BombardTower"/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Market"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="TradeCart"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Caravan"/>
                        <Ability2 civ={civ} tech="Coinage"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Banking"/>
                        <Ability2 civ={civ} tech="Guilds"/>
                        <Ability2/>
                    </View>

                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Mill"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="LumberCamp"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="MiningCamp"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} tech="HorseCollar"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="DoubleBitAxe"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="GoldMining"/>
                        <Ability2 civ={civ} tech="StoneMining"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="HeavyPlow"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BowSaw"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="GoldShaftMining"/>
                        <Ability2 civ={civ} tech="StoneShaftMining"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="CropRotation"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="TwoManSaw"/>
                    </View>


                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="TownCenter"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} building="House"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="Villager"/>
                        <Ability2 civ={civ} tech="Loom"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Wheelbarrow"/>
                        <Ability2 civ={civ} tech="TownWatch"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="HandCart"/>
                        <Ability2 civ={civ} tech="TownPatrol"/>
                    </View>


                    <MyText style={styles.heading}/>
                    <View style={styles.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Outpost"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="PalisadeWall"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="PalisadeGate"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} building="WatchTower"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="StoneWall"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="Gate"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} building="GuardTower"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="FortifiedWall"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} building="Keep"/>
                    </View>
                    <View style={styles.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} building="BombardTower"/>
                    </View>
                </>
            }

        </View>
    );
}

interface Ability3Props {
    age: Other;
}

interface AbilityProps {
    civ?: Civ;
    tech?: Tech;
    unit?: Unit;
    building?: Building;
}

export function getAbilityIcon({tech, unit, building}: AbilityHelperProps) {
    if (tech) {
        return getTechIcon(tech);
    }
    if (unit) {
        return getUnitIcon(unit);
    }
    if (building) {
        return getBuildingIcon(building);
    }
    return false;
}

function getAbilityNavCallback({tech, unit, building}: AbilityHelperProps) {
    const navigation = useNavigation<RootStackProp>();
    if (tech) {
        return () => navigation.push('Tech', {tech: tech});
    }
    if (unit) {
        return () => navigation.push('Unit', {unit: unit});
    }
    if (building) {
        return () => navigation.push('Building', {building: building});
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

function Ability2({civ, tech, unit, building}: AbilityProps) {
    if (!civ) return Ability0();
    if (!tech && !unit && !building) return Ability0();
    const enabled = getAbilityEnabled({civ, tech, unit, building});
    const color = enabled ? '#555' : '#C00';
    const opacity = enabled ? 1 : 0.4;
    return (
        <TouchableOpacity style={[styles.imageContainer2, {borderColor: color, opacity: opacity}]} onPress={getAbilityNavCallback({tech, unit, building})}>
            <ImageBackground fadeDuration={0} source={getAbilityIcon({tech, unit, building})} imageStyle={styles.imageInner2} style={styles.image2}>
                {
                    !enabled &&
                    <Icon name={'close'} size={colSize-4} color="red" />
                }
            </ImageBackground>
        </TouchableOpacity>
    );
}

function Ability3({age}: Ability3Props) {
    return (
        <TouchableOpacity style={[styles.imageContainer3]}>
            <ImageBackground fadeDuration={0} source={getOtherIcon(age)} imageStyle={styles.imageInner2} style={styles.image2}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 15,
        fontWeight: '500',
    },
    imageInner2: {
        resizeMode: "cover",
        alignSelf: 'flex-end',
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
    imageContainer3: {
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
        marginLeft: -12,
        // backgroundColor: 'blue',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginHorizontal: -2,
        // backgroundColor: 'yellow',
    },
});
