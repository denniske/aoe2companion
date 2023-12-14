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
    // - Archery Range (Techs)
    //
    // Cumans:
    // - Siege Workshop

    const hasMuleCart = civInfo.name === 'Armenians' || civInfo.name === 'Georgians';
    const rows: ITechTreeRow[] = [];
    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Blacksmith'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {tech: 'Forging'},
                {tech: 'ScaleMailArmor'},
                {tech: 'ScaleBardingArmor'},
                {},
                {tech: 'Fletching'},
                {tech: 'PaddedArcherArmor'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {tech: 'IronCasting'},
                {tech: 'ChainMailArmor'},
                {tech: 'ChainBardingArmor'},
                {},
                {tech: 'BodkinArrow'},
                {tech: 'LeatherArcherArmor'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {tech: 'BlastFurnace'},
                {tech: 'PlateMailArmor'},
                {tech: 'PlateBardingArmor'},
                {},
                {tech: 'Bracer'},
                {tech: 'RingArcherArmor'},
            ],
        },
    );

    if (civInfo.name !== 'Cumans') {
        rows.push({
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'SiegeWorkshop'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {unit: 'ArmoredElephant'},
                    {unit: 'BatteringRam'},
                    {unit: 'Mangonel'},
                    {unit: 'Scorpion'},
                    {unit: 'SiegeTower'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {unit: 'SiegeElephant'},
                    {unit: 'CappedRam'},
                    {unit: 'Onager'},
                    {unit: 'HeavyScorpion'},
                    {},
                ],
            },
            {
                items: [
                    {},
                    {},
                    {unit: 'SiegeRam'},
                    {unit: 'SiegeOnager'},
                    {},
                    {unit: 'BombardCannon'},
                ],
            },
            {
                items: [
                    {},
                    {},
                    {},
                    {},
                    {},
                    {unit: 'Houfnice', unique: true},
                ],
            },
        );
    } else {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'SiegeWorkshop'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {},
                    {unit: 'BatteringRam'},
                    {},
                    {},
                    {},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {unit: 'ArmoredElephant'},
                    {unit: 'CappedRam'},
                    {unit: 'Mangonel'},
                    {unit: 'Scorpion'},
                    {unit: 'SiegeTower'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {unit: 'SiegeElephant'},
                    {unit: 'SiegeRam'},
                    {unit: 'Onager'},
                    {unit: 'HeavyScorpion'},
                    {},
                ],
            },
            {
                items: [
                    {},
                    {},
                    {},
                    {unit: 'SiegeOnager'},
                    {},
                    {unit: 'BombardCannon'},
                ],
            },
            {
                items: [
                    {},
                    {},
                    {},
                    {},
                    {},
                    {unit: 'Houfnice', unique: true},
                ],
            },
        );
    }


    if (civInfo.name === 'Armenians') {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'Barracks'},
                ],
            },
            {
                items: [
                    {age: 'DarkAge'},
                    {unit: 'Militia'},
                    {unit: 'Spearman'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {unit: 'ManAtArms'},
                    {unit: 'Pikeman'},
                    {unit: 'EagleScout'},
                    {},
                    {tech: 'Supplies'},
                ],
            },
            {
                items: [
                    {},
                    {unit: 'LongSwordsman'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {unit: 'TwoHandedSwordsman'},
                    {unit: 'Halberdier'},
                    {unit: 'EagleWarrior'},
                    {},
                    {tech: 'Gambesons'},
                    {tech: 'Squires'},
                    {tech: 'Arson'},
                ],
            },
            {
                items: [
                    {},
                    {unit: 'Champion'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {},
                    {},
                    {unit: 'EliteEagleWarrior'},
                    {unit: 'Condottiero', unique: true},
                    {unit: 'FlemishMilitia', unique: true},
                ],
            },
        );
    } else {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'Barracks'},
                ],
            },
            {
                items: [
                    {age: 'DarkAge'},
                    {unit: 'Militia'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {unit: 'ManAtArms'},
                    {unit: 'Spearman'},
                    {unit: 'EagleScout'},
                    {},
                    {tech: 'Supplies'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {unit: 'LongSwordsman'},
                    {unit: 'Pikeman'},
                    {unit: 'EagleWarrior'},
                    {},
                    {tech: 'Gambesons'},
                    {tech: 'Squires'},
                    {tech: 'Arson'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    ...(civInfo.name !== 'Romans' ? [{unit: 'TwoHandedSwordsman' as Unit}] : [{
                        unit: 'Legionary' as Unit,
                        unique: true
                    }]),
                    {unit: 'Halberdier'},
                    {unit: 'EliteEagleWarrior'},
                    {unit: 'Condottiero', unique: true},
                    {unit: 'FlemishMilitia', unique: true},
                ],
            },
            {
                items: [
                    {},
                    ...(civInfo.name !== 'Romans' ? [{unit: 'Champion' as Unit}] : [{}]),
                ],
            },
        );
    }

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Stable'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {unit: 'ScoutCavalry'},
                {},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {unit: 'CamelScout', unique: true},
                ...(civInfo.name !== 'Gurjaras' ? [{}] : []),
                {},
                {},
                {tech: 'Bloodlines'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'LightCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{unit: 'ShrivamshaRider' as Unit, unique: true}] : []),
                {unit: 'Knight'},
                {unit: 'CamelRider'},
                {unit: 'BattleElephant'},
                {unit: 'SteppeLancer'},
                ...(['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) ? [{
                    unit: 'XolotlWarrior' as Unit,
                    unique: true
                }] : []),
                ...(!['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) && civInfo.name !== 'Gurjaras' ? [{}] : []),
                {tech: 'Husbandry'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'Hussar'},
                ...(civInfo.name === 'Gurjaras' ? [{unit: 'EliteShrivamshaRider' as Unit, unique: true}] : []),
                {unit: 'Cavalier'},
                {unit: 'HeavyCamelRider'},
                {unit: 'EliteBattleElephant'},
                {unit: 'EliteSteppeLancer'},
            ],
        },
        {
            items: [
                {},
                {unit: 'WingedHussar', unique: true},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {unit: 'Paladin'},
                {unit: 'ImperialCamelRider', unique: true},
                {},
                {},
            ],
        },
        {
            items: [
                {},
                {},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {unit: 'Savar'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'ArcheryRange'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {unit: 'Archer'},
                {unit: 'Skirmisher'},
                {},
                {},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'Crossbowman'},
                {unit: 'EliteSkirmisher'},
                {unit: 'CavalryArcher'},
                {unit: 'ElephantArcher'},
                {unit: 'Genitour', unique: true},
                {unit: 'Slinger', unique: true},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'Arbalester'},
                {unit: 'ImperialSkirmisher', unique: true},
                {unit: 'HeavyCavalryArcher'},
                {unit: 'EliteElephantArcher'},
                {unit: 'EliteGenitour', unique: true},
                {unit: 'HandCannoneer'},
            ],
        },
    );

    if (civInfo.name === 'Persians') {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'ArcheryRange'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {tech: 'ThumbRing'},
                    {tech: 'ParthianTactics'},
                ],
            },
        );
    } else {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'ArcheryRange'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {tech: 'ThumbRing'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {tech: 'ParthianTactics'},
                ],
            },
        );
    }

    rows.push(
        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Dock'},
            ],
        },
        {
            items: [
                {age: 'DarkAge'},
                {unit: 'FishingShip'},
                {unit: 'TransportShip'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {unit: 'FireGalley'},
                {unit: 'TradeCog'},
                {unit: 'DemolitionRaft'},
                {unit: 'Galley'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'FireShip'},
                {tech: 'Gillnets'},
                {unit: 'DemolitionShip'},
                {unit: 'WarGalley'},
                {tech: 'Careening'},
                {},
                ...(civInfo.uniqueUnits.includes('Caravel') ? [{unit: 'Caravel' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('Longboat') ? [{unit: 'Longboat' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('TurtleShip') ? [{unit: 'TurtleShip' as Unit, unique: true}] : []),
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'FastFireShip'},
                {unit: 'CannonGalleon'},
                {unit: 'HeavyDemolitionShip'},
                {unit: 'Galleon'},
                {tech: 'DryDock'},
                {tech: 'Shipwright'},
                ...(civInfo.uniqueUnits.includes('Caravel') ? [{unit: 'EliteCaravel' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('Longboat') ? [{unit: 'EliteLongboat' as Unit, unique: true}] : []),
                ...(civInfo.uniqueUnits.includes('TurtleShip') ? [{
                    unit: 'EliteTurtleShip' as Unit,
                    unique: true
                }] : []),
                ...(civInfo.uniqueUnits.includes('Thirisadai') ? [{unit: 'Thirisadai' as Unit, unique: true}] : []),
            ],
        },
        {
            items: [
                {},
                {},
                {unit: 'EliteCannonGalleon'},
            ],
        },


        {
            title: ''
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'Dromon'},
            ],
        },


        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Castle'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: uniqueLine?.units[0], unique: true},
                {unit: 'Petard'},
                {tech: civInfo.uniqueTechs[0]},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: uniqueLine?.units[1], unique: true},
                {unit: 'Trebuchet'},
                {tech: civInfo.uniqueTechs[1]},
                {tech: 'Hoardings'},
                {tech: 'Sappers'},
                {tech: 'Conscription'},
            ],
        },
        {
            items: [
                {},
                {},
                {unit: 'FlamingCamel', unique: true},
                {},
                {},
                {},
                {tech: 'SpiesTreason'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Krepost'},
                {},
                {building: 'Donjon'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {},
                {},
                {unit: 'Serjeant', unique: true},
                {unit: 'Spearman', dependsOn: {building: 'Donjon'}},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'Konnik', unique: true},
                {},
                {},
                {unit: 'Pikeman', dependsOn: {building: 'Donjon'}},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'EliteKonnik', unique: true},
                {},
                {unit: 'EliteSerjeant', unique: true},
                {unit: 'Halberdier', dependsOn: {building: 'Donjon'}},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: hasMuleCart ? 'FortifiedChurch' : 'Monastery'},
                // {building: 'Monastery'},
                // {building: 'FortifiedChurch'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'Monk'},
                {unit: 'WarriorPriest'},
                {unit: 'Missionary'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: hasMuleCart ? 'FortifiedChurch' : 'Monastery'},
                // {building: 'Monastery'},
                // {building: 'FortifiedChurch'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {tech: 'Devotion'},
                {tech: 'Redemption'},
                {tech: 'Atonement'},
                {tech: 'HerbalMedicine'},
                {tech: 'Heresy'},
                {tech: 'Sanctity'},
                {tech: 'Fervor'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {tech: 'Faith'},
                {tech: 'Illumination'},
                {tech: 'BlockPrinting'},
                {tech: 'Theocracy'},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'University'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {tech: 'Masonry'},
                {tech: 'FortifiedWall'},
                {tech: 'TreadmillCrane'},
                {tech: 'MurderHoles'},
                {tech: 'HeatedShot'},
                {tech: 'Ballistics'},
                {tech: 'GuardTower'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {tech: 'Architecture'},
                {tech: 'SiegeEngineers'},
                {},
                {tech: 'ArrowSlits'},
                {},
                {tech: 'Chemistry'},
                {tech: 'Keep'},
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
                {tech: 'BombardTower'},
            ],
        },
    );

    if (civInfo.name === 'Burgundians') {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'Market'},
                    {},
                    {},
                    {},
                    {},
                    {building: 'Mill'},
                    {building: 'Folwark'},
                ],
            },
            {
                items: [
                    {age: 'DarkAge'},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {tech: 'HorseCollar'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {unit: 'TradeCart'},
                    {tech: 'Caravan'},
                    {},
                    {},
                    {},
                    {tech: 'HeavyPlow'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {},
                    {tech: 'Guilds'},
                    {tech: 'Coinage'},
                    {},
                    {},
                    {tech: 'CropRotation'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {},
                    {},
                    {tech: 'Banking'},
                    {},
                    {},
                    {},
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
                    {building: hasMuleCart ? 'MuleCart' : 'LumberCamp'},
                    ...(hasMuleCart ? [] : [{}]),
                    ...(hasMuleCart ? [{}] : [{building: 'MiningCamp'}]),
                    {},
                    {},
                    ...(hasMuleCart ? [{building: 'LumberCamp'}] : [{building: 'MuleCart'}]),
                    ...(hasMuleCart ? [{building: 'MiningCamp'}] : [{}]),
                ],
            } as any,
            {
                items: [
                    {age: 'DarkAge'},
                    {tech: 'DoubleBitAxe'},
                    ...(hasMuleCart ? [] : [{}]),
                    {tech: 'GoldMining'},
                    {tech: 'StoneMining'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {tech: 'BowSaw'},
                    ...(hasMuleCart ? [] : [{}]),
                    {tech: 'GoldShaftMining'},
                    {tech: 'StoneShaftMining'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {tech: 'TwoManSaw'},
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
                    {building: 'TownCenter'},
                    {},
                    {},
                    {},
                    {},
                    {building: 'House'},
                ],
            },
            {
                items: [
                    {age: 'DarkAge'},
                    {unit: 'Villager'},
                    {tech: 'Loom'},
                    {tech: 'Wheelbarrow'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {},
                    {},
                    {tech: 'HandCart'},
                    {tech: 'TownWatch'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {},
                    {},
                    {},
                    {tech: 'TownPatrol'},
                ],
            },
        );
    } else {
        rows.push(
            {
                title: ''
            },
            {
                items: [
                    {},
                    {building: 'Market'},
                    {},
                    {},
                    {},
                    {},
                    {building: 'Mill'},
                    {building: 'Folwark'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {unit: 'TradeCart'},
                    {},
                    {},
                    {},
                    {},
                    {tech: 'HorseCollar'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {},
                    {tech: 'Caravan'},
                    {tech: 'Coinage'},
                    {},
                    {},
                    {tech: 'HeavyPlow'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {},
                    {tech: 'Guilds'},
                    {tech: 'Banking'},
                    {},
                    {},
                    {tech: 'CropRotation'},
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
                    {building: hasMuleCart ? 'MuleCart' : 'LumberCamp'},
                    ...(hasMuleCart ? [] : [{}]),
                    ...(hasMuleCart ? [{}] : [{building: 'MiningCamp'}]),
                    {},
                    {},
                    ...(hasMuleCart ? [{building: 'LumberCamp'}] : [{building: 'MuleCart'}]),
                    ...(hasMuleCart ? [{building: 'MiningCamp'}] : [{}]),
                ],
            } as any,
            {
                items: [
                    {age: 'FeudalAge'},
                    {tech: 'DoubleBitAxe'},
                    ...(hasMuleCart ? [] : [{}]),
                    {tech: 'GoldMining'},
                    {tech: 'StoneMining'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {tech: 'BowSaw'},
                    ...(hasMuleCart ? [] : [{}]),
                    {tech: 'GoldShaftMining'},
                    {tech: 'StoneShaftMining'},
                ],
            },
            {
                items: [
                    {age: 'ImperialAge'},
                    {tech: 'TwoManSaw'},
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
                    {building: 'TownCenter'},
                    {},
                    {},
                    {},
                    {},
                    {building: 'House'},
                ],
            },
            {
                items: [
                    {age: 'DarkAge'},
                    {unit: 'Villager'},
                    {tech: 'Loom'},
                ],
            },
            {
                items: [
                    {age: 'FeudalAge'},
                    {},
                    {},
                    {tech: 'Wheelbarrow'},
                    {tech: 'TownWatch'},
                ],
            },
            {
                items: [
                    {age: 'CastleAge'},
                    {},
                    {},
                    {tech: 'HandCart'},
                    {tech: 'TownPatrol'},
                ],
            },
        );
    }

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
