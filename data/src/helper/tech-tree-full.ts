import {ITechTreeRow} from './tech-tree.type';
import {ICivEntry} from './civs';
import {IUnitLine, Unit} from './units';

export function getFullTechTree(civInfo: ICivEntry, uniqueLine?: IUnitLine): ITechTreeRow[] {

    // Complete Replacements:
    //
    // Armenians:
    // - Barracks
    //
    // Burgundians
    // - Market, Mill
    // - LumberCamp, MiningCamp, MuleCart
    // - TownCenter, House
    //
    // Persians:
    // - Archery Range
    //   Parthian Tactics
    //
    // Cumans:
    // - Siege Workshop
    //
    // Armenians & Georgians:
    // - Mule cart vs Lumber/Mining Camp

    const hasMuleCart = civInfo.name === 'Armenians' || civInfo.name === 'Georgians';

    const rows: ITechTreeRow[] = [];

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'FeudalAge', building: 'Blacksmith'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', tech: 'Forging'},
                {age: 'FeudalAge', tech: 'ScaleMailArmor'},
                {age: 'FeudalAge', tech: 'ScaleBardingArmor'},
                {},
                {age: 'FeudalAge', tech: 'Fletching'},
                {age: 'FeudalAge', tech: 'PaddedArcherArmor'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', tech: 'IronCasting'},
                {age: 'CastleAge', tech: 'ChainMailArmor'},
                {age: 'CastleAge', tech: 'ChainBardingArmor'},
                {},
                {age: 'CastleAge', tech: 'BodkinArrow'},
                {age: 'CastleAge', tech: 'LeatherArcherArmor'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', tech: 'BlastFurnace'},
                {age: 'ImperialAge', tech: 'PlateMailArmor'},
                {age: 'ImperialAge', tech: 'PlateBardingArmor'},
                {},
                {age: 'ImperialAge', tech: 'Bracer'},
                {age: 'ImperialAge', tech: 'RingArcherArmor'},
            ],
        },
    );

    rows.push({
            title: ''
        },
        {
            items: [
                {},
                {age: 'CastleAge', building: 'SiegeWorkshop'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'ArmoredElephant'},
                {age: 'CastleAge', unit: 'BatteringRam'},
                {age: 'CastleAge', unit: 'Mangonel'},
                {age: 'CastleAge', unit: 'RocketCart'},
                {age: 'CastleAge', unit: 'Scorpion'},
                {age: 'CastleAge', unit: 'SiegeTower'},
                {age: 'CastleAge', unit: 'WarChariot'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'SiegeElephant'},
                {age: 'ImperialAge', unit: 'CappedRam'},
                {age: 'ImperialAge', unit: 'Onager'},
                {age: 'ImperialAge', unit: 'HeavyRocketCart'},
                {age: 'ImperialAge', unit: 'HeavyScorpion'},
                {},
            ],
        },
        {
            items: [
                {},
                {age: 'ImperialAge', unit: 'FlamingCamel', unique: true},
                {age: 'ImperialAge', unit: 'SiegeRam'},
                {age: 'ImperialAge', unit: 'SiegeOnager'},
                {age: 'ImperialAge', unit: 'MountedTrebuchet'},
                {age: 'ImperialAge', unit: 'TractionTrebuchet'},
                {age: 'ImperialAge', unit: 'BombardCannon'},
            ],
        },
        {
            items: [
                {},
                {},
                {},
                {},
                {},
                {},
                {age: 'ImperialAge', unit: 'Houfnice', unique: true},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'DarkAge', building: 'Barracks'},
            ],
        },
        {
            items: [
                {age: 'DarkAge'},
                {age: 'DarkAge', unit: 'Militia'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', unit: 'ManAtArms'},
                {age: 'FeudalAge', unit: 'Spearman'},
                {age: 'FeudalAge', unit: 'EagleScout'},
                {age: 'FeudalAge', unit: 'FlemishMilitia', unique: true},
                {},
                {},
                {age: 'FeudalAge', tech: 'Arson'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'LongSwordsman'},
                {age: 'CastleAge', unit: 'Pikeman'},
                {age: 'CastleAge', unit: 'EagleWarrior'},
                {},
                {age: 'CastleAge', tech: 'Gambesons'},
                {age: 'CastleAge', tech: 'Squires'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                ...(civInfo.name !== 'Romans' ? [{
                    age: 'ImperialAge' as any,
                    unit: 'TwoHandedSwordsman' as Unit
                }] : [{
                    age: 'ImperialAge' as any,
                    unit: 'Legionary' as Unit,
                    unique: true
                }]),
                {age: 'ImperialAge', unit: 'Halberdier'},
                {age: 'ImperialAge', unit: 'EliteEagleWarrior'},
                {age: 'ImperialAge', unit: 'Condottiero', unique: true},
            ],
        },
        {
            items: [
                {},
                ...(civInfo.name !== 'Romans' ? [{age: 'ImperialAge' as any, unit: 'Champion' as Unit}] : [{}]),
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'FeudalAge', building: 'Stable'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', unit: 'ScoutCavalry'},
                {},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {age: 'FeudalAge', unit: 'CamelScout', unique: true},
                ...(civInfo.name !== 'Gurjaras' ? [{}] : []),
                {},
                {},
                {age: 'FeudalAge', tech: 'Bloodlines'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'LightCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{age: 'CastleAge' as any, unit: 'ShrivamshaRider' as Unit, unique: true}] : []),
                {age: 'CastleAge', unit: 'Knight'},
                {age: 'CastleAge', unit: 'CamelRider'},
                {age: 'CastleAge', unit: 'BattleElephant'},
                {age: 'CastleAge', unit: 'SteppeLancer'},
                ...(['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) ? [{
                    age: 'CastleAge' as any,
                    unit: 'XolotlWarrior' as Unit,
                    unique: true
                }] : []),
                ...(!['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) && civInfo.name !== 'Gurjaras' ? [{}] : []),
                {age: 'CastleAge', tech: 'Husbandry'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'Hussar'},
                ...(civInfo.name === 'Gurjaras' ? [{age: 'ImperialAge' as any, unit: 'EliteShrivamshaRider' as Unit, unique: true}] : []),
                {age: 'ImperialAge', unit: 'Cavalier'},
                {age: 'ImperialAge', unit: 'HeavyCamelRider'},
                {age: 'ImperialAge', unit: 'EliteBattleElephant'},
                {age: 'ImperialAge', unit: 'EliteSteppeLancer'},
            ],
        },
        {
            items: [
                {},
                {age: 'ImperialAge', unit: 'WingedHussar', unique: true},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {age: 'ImperialAge', unit: 'Paladin'},
                {age: 'ImperialAge', unit: 'ImperialCamelRider', unique: true},
                {},
                {},
            ],
        },
        {
            items: [
                {},
                {},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {age: 'ImperialAge', unit: 'Savar', unique: true},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'FeudalAge', building: 'ArcheryRange'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', unit: 'Archer'},
                {age: 'FeudalAge', unit: 'Skirmisher'},
                {},
                {},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'Crossbowman'},
                {age: 'CastleAge', unit: 'EliteSkirmisher'},
                {age: 'CastleAge', unit: 'CavalryArcher'},
                {age: 'CastleAge', unit: 'ElephantArcher'},
                {},

                {age: 'CastleAge', unit: 'Genitour', unique: true},
                {age: 'CastleAge', unit: 'Slinger', unique: true},
                {age: 'CastleAge', unit: 'Grenadier', unique: true},
                {age: 'CastleAge', unit: 'XianbeiRaider', unique: true},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'Arbalester'},
                {age: 'ImperialAge', unit: 'ImperialSkirmisher', unique: true},
                {age: 'ImperialAge', unit: 'HeavyCavalryArcher'},
                {age: 'ImperialAge', unit: 'EliteElephantArcher'},
                {age: 'ImperialAge', unit: 'HandCannoneer'},

                {age: 'ImperialAge', unit: 'EliteGenitour', unique: true},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'FeudalAge', building: 'ArcheryRange'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', tech: 'ThumbRing'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', tech: 'ParthianTactics'},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'DarkAge', building: 'Dock'},
            ],
        },
        {
            items: [
                {age: 'DarkAge'},
                {age: 'DarkAge', unit: 'FishingShip'},
                {age: 'DarkAge', unit: 'TransportShip'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', unit: 'FireGalley'},
                {age: 'FeudalAge', unit: 'TradeCog'},
                {age: 'FeudalAge', unit: 'DemolitionRaft'},
                {age: 'FeudalAge', unit: 'Galley'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'FireShip'},
                {age: 'CastleAge', tech: 'Gillnets'},
                {age: 'CastleAge', unit: 'DemolitionShip'},
                {age: 'CastleAge', unit: 'WarGalley'},
                {age: 'CastleAge', tech: 'Careening'},
                {},
                ...(civInfo.uniqueUnits.includes('Caravel') ? [{age: 'CastleAge' as any, unit: 'Caravel' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('Longboat') ? [{age: 'CastleAge' as any, unit: 'Longboat' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('TurtleShip') ? [{age: 'CastleAge' as any, unit: 'TurtleShip' as Unit, unique: true}] : []),
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'FastFireShip'},
                {age: 'ImperialAge', unit: 'CannonGalleon'},
                {age: 'ImperialAge', unit: 'HeavyDemolitionShip'},
                {age: 'ImperialAge', unit: 'Galleon'},
                {age: 'ImperialAge', tech: 'DryDock'},
                {age: 'ImperialAge', tech: 'Shipwright'},
                ...(civInfo.uniqueUnits.includes('Caravel') ? [{age: 'ImperialAge' as any, unit: 'EliteCaravel' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('Longboat') ? [{age: 'ImperialAge' as any, unit: 'EliteLongboat' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('TurtleShip') ? [{
                    age: 'ImperialAge' as any,
                    unit: 'EliteTurtleShip' as Unit,
                    unique: true
                }] : []),
                ...(civInfo.uniqueUnits.includes('Thirisadai') ? [{age: 'ImperialAge' as any, unit: 'Thirisadai' as Unit, unique: true}] : []),
            ],
        },
        {
            items: [
                {},
                {},
                {age: 'ImperialAge', unit: 'EliteCannonGalleon'},
            ],
        },


        {
            title: ''
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'Dromon'},
            ],
        },


        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'CastleAge', building: 'Castle'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: uniqueLine?.units[0], unique: true},
                {age: 'CastleAge', unit: 'Petard'},
                {age: 'CastleAge', tech: civInfo.uniqueTechs[0]},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: uniqueLine?.units[1], unique: true},
                {age: 'ImperialAge', unit: 'Trebuchet'},
                {age: 'ImperialAge', tech: civInfo.uniqueTechs[1]},
                {age: 'ImperialAge', tech: 'Hoardings'},
                {age: 'ImperialAge', tech: 'Sappers'},
                {age: 'ImperialAge', tech: 'Conscription'},
                {age: 'ImperialAge', tech: 'SpiesTreason'},
            ],
        },
        {
            items: [
                {},
                {age: 'ImperialAge', unit: 'LiuBei'},
                {age: 'ImperialAge', unit: 'CaoCao'},
                {age: 'ImperialAge', unit: 'SunJian'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'CastleAge', building: 'Krepost'},
                {},
                {age: 'FeudalAge', building: 'Donjon'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {},
                {},
                {age: 'FeudalAge', unit: 'Serjeant', unique: true},
                {age: 'FeudalAge', unit: 'Spearman', dependsOn: {building: 'Donjon'}},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'Konnik', unique: true},
                {},
                {},
                {age: 'CastleAge', unit: 'Pikeman', dependsOn: {building: 'Donjon'}},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', unit: 'EliteKonnik', unique: true},
                {},
                {age: 'ImperialAge', unit: 'EliteSerjeant', unique: true},
                {age: 'ImperialAge', unit: 'Halberdier', dependsOn: {building: 'Donjon'}},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'CastleAge', building: hasMuleCart ? 'FortifiedChurch' : 'Monastery'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', unit: 'Monk'},
                {age: 'CastleAge', unit: 'WarriorPriest'},
                {age: 'CastleAge', unit: 'Missionary'},
            ],
        },

        {
            items: [
                {},
                {age: 'CastleAge', tech: 'Devotion'},
                {age: 'CastleAge', tech: 'Redemption'},
                {age: 'CastleAge', tech: 'Atonement'},
                {age: 'CastleAge', tech: 'HerbalMedicine'},
                {age: 'CastleAge', tech: 'Heresy'},
                {age: 'CastleAge', tech: 'Sanctity'},
                {age: 'CastleAge', tech: 'Fervor'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', tech: 'Faith'},
                {age: 'ImperialAge', tech: 'Illumination'},
                {age: 'ImperialAge', tech: 'BlockPrinting'},
                {age: 'ImperialAge', tech: 'Theocracy'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'CastleAge', building: 'University'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', tech: 'Masonry'},
                {age: 'CastleAge', tech: 'FortifiedWall'},
                {age: 'CastleAge', tech: 'TreadmillCrane'},
                {age: 'CastleAge', tech: 'MurderHoles'},
                {age: 'CastleAge', tech: 'HeatedShot'},
                {age: 'CastleAge', tech: 'Ballistics'},
                {age: 'CastleAge', tech: 'GuardTower'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', tech: 'Architecture'},
                {age: 'ImperialAge', tech: 'SiegeEngineers'},
                {},
                {age: 'ImperialAge', tech: 'ArrowSlits'},
                {},
                {age: 'ImperialAge', tech: 'Chemistry'},
                {age: 'ImperialAge', tech: 'Keep'},
            ],
        },
        {
            items: [
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {age: 'ImperialAge', tech: 'BombardTower'},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'FeudalAge', building: 'Market'},
                {},
                {},
                {},
                {age: 'DarkAge', building: 'Folwark'},
                {age: 'DarkAge', building: 'Mill'},
                {age: 'DarkAge', building: 'Pasture'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', unit: 'TradeCart'},
                {},
                {},
                {},
                {},
                {age: 'FeudalAge', tech: 'HorseCollar'},
                {age: 'FeudalAge', tech: 'Domestication'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {},
                {age: 'CastleAge', tech: 'Caravan'},
                {age: 'CastleAge', tech: 'Coinage'},
                {},
                {},
                {age: 'CastleAge', tech: 'HeavyPlow'},
                {age: 'CastleAge', tech: 'Pastoralism'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {},
                {age: 'ImperialAge', tech: 'Guilds'},
                {age: 'ImperialAge', tech: 'Banking'},
                {},
                {},
                {age: 'ImperialAge', tech: 'CropRotation'},
                {age: 'ImperialAge', tech: 'Transhumance'},
            ],
        },
    );
    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'DarkAge', building: hasMuleCart ? 'MuleCart' : 'LumberCamp'},
                ...(hasMuleCart ? [] : [{}]),
                ...(hasMuleCart ? [{}] : [{age: 'DarkAge', building: 'MiningCamp'}]),
                {},
                {},
                ...(hasMuleCart ? [{age: 'DarkAge', building: 'LumberCamp'}] : [{age: 'DarkAge', building: 'MuleCart'}]),
                ...(hasMuleCart ? [{age: 'DarkAge', building: 'MiningCamp'}] : [{}]),
            ],
        } as any,
        {
            items: [
                {age: 'FeudalAge'},
                {age: 'FeudalAge', tech: 'DoubleBitAxe'},
                ...(hasMuleCart ? [] : [{}]),
                {age: 'FeudalAge', tech: 'GoldMining'},
                {age: 'FeudalAge', tech: 'StoneMining'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {age: 'CastleAge', tech: 'BowSaw'},
                ...(hasMuleCart ? [] : [{}]),
                {age: 'CastleAge', tech: 'GoldShaftMining'},
                {age: 'CastleAge', tech: 'StoneShaftMining'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {age: 'ImperialAge', tech: 'TwoManSaw'},
            ],
        },
    );
    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {age: 'DarkAge', building: 'TownCenter'},
                {},
                {},
                {},
                {},
                {age: 'DarkAge', building: 'House'},
            ],
        },
        {
            items: [
                {age: 'DarkAge'},
                {age: 'DarkAge', unit: 'Villager'},
                {age: 'DarkAge', tech: 'Loom'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {},
                {},
                {age: 'FeudalAge', tech: 'Wheelbarrow'},
                {age: 'FeudalAge', tech: 'TownWatch'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {},
                {},
                {age: 'CastleAge', tech: 'HandCart'},
                {age: 'CastleAge', tech: 'TownPatrol'},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Outpost'},
                {},
                {building: 'PalisadeWall'},
                {},
                {building: 'PalisadeGate'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {building: 'WatchTower'},
                {},
                {building: 'StoneWall'},
                {},
                {building: 'Gate'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {building: 'GuardTower'},
                {},
                {building: 'FortifiedWall'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {building: 'Keep'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {building: 'BombardTower'},
            ],
        },
    );

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Wonder'},
                {},
                {building: 'Feitoria'},
                {},
                {building: 'Caravanserai'},
            ],
        },
    );
    return rows;
}
