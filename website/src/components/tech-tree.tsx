import {
    AbilityHelperProps, aoeCivKey, Building, Civ, civDict, getAbilityEnabled, getUnitLineForUnit, Other, Tech, Unit
} from "@nex/data";
import React from "react";
import {createStylesheet} from "../helper/styles";
import {getTechIcon} from "../helper/techs";
import {getUnitIcon} from "../helper/units";
import {getBuildingIcon} from "../helper/buildings";
import {getOtherIcon} from "../helper/other";
import {faTimes, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export function TechTree({civ}: {civ: aoeCivKey}) {
    // const mutate = useMutate();
    // const techTreeSize = useSelector(state => state.prefs.techTreeSize) || 'full';
    const techTreeSize = 'full';
    
    const classes = useStyles();
    
    const civInfo = civDict[civ];
    const uniqueLine = getUnitLineForUnit(civInfo.uniqueUnits[0]);

    const values: string[] = [
        'compact',
        'full',
    ];

    // const nav = async (str: any) => {
    //     mutate(setPrefValue('techTreeSize', str));
    //     await saveCurrentPrefsToStorage();
    // };

    return (
        <div className={classes.container}>
            <div className={classes.row2}>
                <div className={classes.sectionHeader}>Tech Tree    </div>
                {/*<ButtonPicker value={techTreeSize} values={values} formatter={capitalize} onSelect={nav}/>*/}
            </div>

            {/*{*/}
            {/*    techTreeSize === 'compact' &&*/}
            {/*    <>*/}
            {/*        <div className={classes.spacing}/>*/}
            {/*        <div className={classes.heading}>Blacksmith</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} tech="Forging"/>*/}
            {/*            <Ability2 civ={civ} tech="ScaleMailArmor"/>*/}
            {/*            <Ability2 civ={civ} tech="ScaleBardingArmor"/>*/}
            {/*            <Ability0/>*/}
            {/*            <Ability2 civ={civ} tech="Fletching"/>*/}
            {/*            <Ability2 civ={civ} tech="PaddedArcherArmor"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} tech="IronCasting"/>*/}
            {/*            <Ability2 civ={civ} tech="ChainMailArmor"/>*/}
            {/*            <Ability2 civ={civ} tech="ChainBardingArmor"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} tech="BodkinArrow"/>*/}
            {/*            <Ability2 civ={civ} tech="LeatherArcherArmor"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} tech="BlastFurnace"/>*/}
            {/*            <Ability2 civ={civ} tech="PlateMailArmor"/>*/}
            {/*            <Ability2 civ={civ} tech="PlateBardingArmor"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} tech="Bracer"/>*/}
            {/*            <Ability2 civ={civ} tech="RingArcherArmor"/>*/}
            {/*        </div>*/}

            {/*        <div className={classes.heading}>Other</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} tech="Bloodlines"/>*/}
            {/*            <Ability2 civ={civ} tech="Husbandry"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} tech="ThumbRing"/>*/}
            {/*            <Ability2 civ={civ} tech="ParthianTactics"/>*/}
            {/*        </div>*/}

            {/*        <div className={classes.heading}>Siege</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="BatteringRam"/>*/}
            {/*            <Ability2 civ={civ} unit="Mangonel"/>*/}
            {/*            <Ability2 civ={civ} unit="Scorpion"/>*/}
            {/*            <Ability2/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="CappedRam"/>*/}
            {/*            <Ability2 civ={civ} unit="Onager"/>*/}
            {/*            <Ability2 civ={civ} unit="HeavyScorpion"/>*/}
            {/*            <Ability2/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="SiegeRam"/>*/}
            {/*            <Ability2 civ={civ} unit="SiegeOnager"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} unit="BombardCannon"/>*/}
            {/*            <Ability2 civ={civ} tech="SiegeEngineers"/>*/}
            {/*        </div>*/}

            {/*        <div className={classes.heading}>Infantry</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="LongSwordsman"/>*/}
            {/*            <Ability2 civ={civ} unit="Spearman"/>*/}
            {/*            <Ability2 civ={civ} unit="EagleScout"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="TwoHandedSwordsman"/>*/}
            {/*            <Ability2 civ={civ} unit="Pikeman"/>*/}
            {/*            <Ability2 civ={civ} unit="EagleWarrior"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="Champion"/>*/}
            {/*            <Ability2 civ={civ} unit="Halberdier"/>*/}
            {/*            <Ability2 civ={civ} unit="EliteEagleWarrior"/>*/}
            {/*        </div>*/}

            {/*        <div className={classes.heading}>Cavalry</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="ScoutCavalry"/>*/}
            {/*            <Ability2 civ={civ} unit="Knight"/>*/}
            {/*            <Ability2 civ={civ} unit="CamelRider"/>*/}
            {/*            <Ability2 civ={civ} unit="BattleElephant"/>*/}
            {/*            <Ability2 civ={civ} unit="SteppeLancer"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="LightCavalry"/>*/}
            {/*            <Ability2 civ={civ} unit="Cavalier"/>*/}
            {/*            <Ability2 civ={civ} unit="HeavyCamelRider"/>*/}
            {/*            <Ability2 civ={civ} unit="EliteBattleElephant"/>*/}
            {/*            <Ability2 civ={civ} unit="EliteSteppeLancer"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="Hussar"/>*/}
            {/*            <Ability2 civ={civ} unit="Paladin"/>*/}
            {/*            <Ability2 civ={civ} unit="ImperialCamelRider"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2/>*/}
            {/*        </div>*/}

            {/*        <div className={classes.heading}>Archer</div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="Archer"/>*/}
            {/*            <Ability2 civ={civ} unit="Skirmisher"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="Crossbowman"/>*/}
            {/*            <Ability2 civ={civ} unit="EliteSkirmisher"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} unit="CavalryArcher"/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.row2}>*/}
            {/*            <Ability2 civ={civ} unit="Arbalester"/>*/}
            {/*            <Ability2 civ={civ} unit="ImperialSkirmisher"/>*/}
            {/*            <Ability2/>*/}
            {/*            <Ability2 civ={civ} unit="HeavyCavalryArcher"/>*/}
            {/*            <Ability2 civ={civ} unit="HandCannoneer"/>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*}*/}


            {
                techTreeSize === 'full' &&
                <>
                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Blacksmith"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} tech="Forging"/>
                        <Ability2 civ={civ} tech="ScaleMailArmor"/>
                        <Ability2 civ={civ} tech="ScaleBardingArmor"/>
                        <Ability0/>
                        <Ability2 civ={civ} tech="Fletching"/>
                        <Ability2 civ={civ} tech="PaddedArcherArmor"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="IronCasting"/>
                        <Ability2 civ={civ} tech="ChainMailArmor"/>
                        <Ability2 civ={civ} tech="ChainBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BodkinArrow"/>
                        <Ability2 civ={civ} tech="LeatherArcherArmor"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="BlastFurnace"/>
                        <Ability2 civ={civ} tech="PlateMailArmor"/>
                        <Ability2 civ={civ} tech="PlateBardingArmor"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Bracer"/>
                        <Ability2 civ={civ} tech="RingArcherArmor"/>
                    </div>


                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="SiegeWorkshop"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="BatteringRam"/>
                        <Ability2 civ={civ} unit="Mangonel"/>
                        <Ability2 civ={civ} unit="Scorpion"/>
                        <Ability2 civ={civ} unit="SiegeTower"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="CappedRam"/>
                        <Ability2 civ={civ} unit="Onager"/>
                        <Ability2 civ={civ} unit="HeavyScorpion"/>
                        <Ability2/>
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} unit="SiegeRam"/>
                        <Ability2 civ={civ} unit="SiegeOnager"/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="BombardCannon"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Barracks"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="Militia"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="ManAtArms"/>
                        <Ability2 civ={civ} unit="Spearman"/>
                        <Ability2 civ={civ} unit="EagleScout"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Supplies"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="LongSwordsman"/>
                        <Ability2 civ={civ} unit="Pikeman"/>
                        <Ability2 civ={civ} unit="EagleWarrior"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Squires"/>
                        <Ability2 civ={civ} tech="Arson"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="TwoHandedSwordsman"/>
                        <Ability2 civ={civ} unit="Halberdier"/>
                        <Ability2 civ={civ} unit="EliteEagleWarrior"/>
                        <Ability2 civ={civ} unit="Condottiero"/>
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} unit="Champion"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Stable"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="ScoutCavalry"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Bloodlines"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="LightCavalry"/>
                        <Ability2 civ={civ} unit="Knight"/>
                        <Ability2 civ={civ} unit="CamelRider"/>
                        <Ability2 civ={civ} unit="BattleElephant"/>
                        <Ability2 civ={civ} unit="SteppeLancer"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Husbandry"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Hussar"/>
                        <Ability2 civ={civ} unit="Cavalier"/>
                        <Ability2 civ={civ} unit="HeavyCamelRider"/>
                        <Ability2 civ={civ} unit="EliteBattleElephant"/>
                        <Ability2 civ={civ} unit="EliteSteppeLancer"/>
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="Paladin"/>
                        <Ability2 civ={civ} unit="ImperialCamelRider"/>
                        <Ability2/>
                        <Ability2/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="ArcheryRange"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="Archer"/>
                        <Ability2 civ={civ} unit="Skirmisher"/>
                        <Ability2/>
                        <Ability2/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Crossbowman"/>
                        <Ability2 civ={civ} unit="EliteSkirmisher"/>
                        <Ability2 civ={civ} unit="CavalryArcher"/>
                        <Ability2 civ={civ} unit="Genitour"/>
                        <Ability2 civ={civ} unit="Slinger"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ThumbRing"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Arbalester"/>
                        <Ability2 civ={civ} unit="ImperialSkirmisher"/>
                        <Ability2 civ={civ} unit="HeavyCavalryArcher"/>
                        <Ability2 civ={civ} unit="EliteGenitour"/>
                        <Ability2 civ={civ} unit="HandCannoneer"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ParthianTactics"/>
                    </div>


                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Dock"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="FishingShip"/>
                        <Ability2 civ={civ} unit="TransportShip"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="FireGalley"/>
                        <Ability2 civ={civ} unit="TradeCog"/>
                        <Ability2 civ={civ} unit="DemolitionRaft"/>
                        <Ability2 civ={civ} unit="Galley"/>
                    </div>
                    <div className={classes.row}>
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
                    </div>
                    <div className={classes.row}>
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
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="EliteCannonGalleon"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Castle"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit={uniqueLine?.units[0]}/>
                        <Ability2 civ={civ} unit="Petard"/>
                        <Ability2 civ={civ} tech={civInfo.uniqueTechs[0]}/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit={uniqueLine?.units[1]}/>
                        <Ability2 civ={civ} unit="Trebuchet"/>
                        <Ability2 civ={civ} tech={civInfo.uniqueTechs[1]}/>
                        <Ability2 civ={civ} tech="Hoardings"/>
                        <Ability2 civ={civ} tech="Sappers"/>
                        <Ability2 civ={civ} tech="Conscription"/>
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} unit="FlamingCamel"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="SpiesTreason"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Krepost"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Konnik"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="EliteKonnik"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Monastery"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} unit="Monk"/>
                        <Ability2 civ={civ} tech="Redemption"/>
                        <Ability2 civ={civ} tech="Atonement"/>
                        <Ability2 civ={civ} tech="HerbalMedicine"/>
                        <Ability2 civ={civ} tech="Heresy"/>
                        <Ability2 civ={civ} tech="Sanctity"/>
                        <Ability2 civ={civ} tech="Fervor"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} unit="Missionary"/>
                        <Ability2 civ={civ} tech="Faith"/>
                        <Ability2 civ={civ} tech="Illumination"/>
                        <Ability2 civ={civ} tech="BlockPrinting"/>
                        <Ability2 civ={civ} tech="Theocracy"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="University"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="Masonry"/>
                        <Ability2 civ={civ} tech="FortifiedWall"/>
                        <Ability2 civ={civ} tech="TreadmillCrane"/>
                        <Ability2 civ={civ} tech="MurderHoles"/>
                        <Ability2 civ={civ} tech="HeatedShot"/>
                        <Ability2 civ={civ} tech="Ballistics"/>
                        <Ability2 civ={civ} tech="GuardTower"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="Architecture"/>
                        <Ability2 civ={civ} tech="SiegeEngineers"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="ArrowSlits"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Chemistry"/>
                        <Ability2 civ={civ} tech="Keep"/>
                    </div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BombardTower"/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Market"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} unit="TradeCart"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Caravan"/>
                        <Ability2 civ={civ} tech="Coinage"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Banking"/>
                        <Ability2 civ={civ} tech="Guilds"/>
                        <Ability2/>
                    </div>

                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Mill"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="LumberCamp"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="MiningCamp"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} tech="HorseCollar"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="DoubleBitAxe"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="GoldMining"/>
                        <Ability2 civ={civ} tech="StoneMining"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} tech="HeavyPlow"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="BowSaw"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="GoldShaftMining"/>
                        <Ability2 civ={civ} tech="StoneShaftMining"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} tech="CropRotation"/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="TwoManSaw"/>
                    </div>


                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="TownCenter"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} building="House"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="DarkAge"/>
                        <Ability2 civ={civ} unit="Villager"/>
                        <Ability2 civ={civ} tech="Loom"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="Wheelbarrow"/>
                        <Ability2 civ={civ} tech="TownWatch"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2/>
                        <Ability2/>
                        <Ability2 civ={civ} tech="HandCart"/>
                        <Ability2 civ={civ} tech="TownPatrol"/>
                    </div>


                    <div className={classes.heading}>&nbsp;</div>
                    <div className={classes.row}>
                        <Ability2/>
                        <Ability2 civ={civ} building="Outpost"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="PalisadeWall"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="PalisadeGate"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="FeudalAge"/>
                        <Ability2 civ={civ} building="WatchTower"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="StoneWall"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="Gate"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="CastleAge"/>
                        <Ability2 civ={civ} building="GuardTower"/>
                        <Ability2/>
                        <Ability2 civ={civ} building="FortifiedWall"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} building="Keep"/>
                    </div>
                    <div className={classes.row}>
                        <Ability3 age="ImperialAge"/>
                        <Ability2 civ={civ} building="BombardTower"/>
                    </div>
                </>
            }

        </div>
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
    return '';
}

function getAbilityNavCallback({tech, unit, building}: AbilityHelperProps) {
    return () => {};
}

function Ability0() {
    const classes = useStyles();
    return (
        <div className={classes.imageContainer0}/>
    );
}

const techTreeWidth = 500 - 28;
const colSize = (techTreeWidth / 8)-4;
const colSize2 = colSize-6;

function Ability2({civ, tech, unit, building}: AbilityProps) {
    if (!civ) return Ability0();
    if (!tech && !unit && !building) return Ability0();
    const enabled = getAbilityEnabled({civ, tech, unit, building});
    const color = enabled ? '#555' : '#C00';
    const opacity = enabled ? 1 : 0.4;
    const classes = useStyles();
    return (
        // <MyLink key={civ.toString()} href='/civilization/[id]' as={`/civilization/${civ}`} naked>
        <div className={classes.imageContainer2} style={{borderColor: color, opacity: opacity}}>
            <img src={getAbilityIcon({tech, unit, building})} className={classes.image2} />
            {
                !enabled &&
                <FontAwesomeIcon icon={faTimes} className={classes.overlayIcon} color="red" size={"2x"} />
            }
        </div>
    );
}

function Ability3({age}: Ability3Props) {
    const classes = useStyles();
    return (
        <div className={classes.imageContainer3}>
            <img src={getOtherIcon(age)} className={classes.image2}/>
        </div>
    );
}

const useStyles = createStylesheet((theme) => ({
    overlayIcon: {
        position: "absolute",
        top: '50%',
        left: '50%',
        marginTop: -14,
        marginLeft: -10,
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: 500,
    },
    // imageInner2: {
    //     resizeMode: "cover",
    //     alignSelf: 'flex-end',
    // },
    imageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F00',
        textShadowColor: 'black',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
    },
    image2: {
        // width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        width: colSize2,
        height: colSize2,
        // backgroundColor: 'blue',
    },
    imageContainer0: {
        border: 'solid 3px transparent',
        width: colSize,
        height: colSize,
        margin: 2,
        // backgroundColor: 'blue',
    },
    imageContainer2: {
        border: 'solid 3px #555',
        width: colSize,
        height: colSize,
        margin: 2,
        backgroundColor: 'black',
        position: "relative",
    },
    imageContainer3: {
        border: 'solid 3px transparent',
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
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginLeft: -12,
        // backgroundColor: 'blue',
    },
    row2: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginHorizontal: -2,
        // backgroundColor: 'yellow',
    },
}));
