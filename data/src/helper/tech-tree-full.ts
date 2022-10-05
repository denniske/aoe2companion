import {ITechTreeRow} from './tech-tree.type';
import {ICivEntry} from './civs';
import {IUnitLine, Unit} from './units';

export function getFullTechTree(civInfo: ICivEntry, uniqueLine?: IUnitLine): ITechTreeRow[] {
    return [
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

        ...(civInfo.name !== 'Cumans' ? [{
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
        }]
:
        [{
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
        }]),

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
                {},
                {tech: 'Squires'},
                {tech: 'Arson'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'TwoHandedSwordsman'},
                {unit: 'Halberdier'},
                {unit: 'EliteEagleWarrior'},
                {unit: 'Condottiero', unique: true},
            ],
        },
        {
            items: [
                {},
                {unit: 'Champion'},
            ],
        },

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
                ...(['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) ? [{unit: 'XolotlWarrior' as Unit, unique: true}] : []),
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
                {tech: 'ThumbRing'},
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
                {tech: 'ParthianTactics'},
            ],
        },


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
                ...(civInfo.uniqueUnits.includes('TurtleShip') ? [{unit: 'EliteTurtleShip' as Unit, unique: true}] : []),
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
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'Konnik', unique: true},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'EliteKonnik', unique: true},
                {},
                {unit: 'EliteSerjeant', unique: true},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Monastery'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {unit: 'Monk'},
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
                {unit: 'Missionary', unique: true},
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

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Market'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {unit: 'TradeCart'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {},
                {tech: 'Caravan'},
                {tech: 'Coinage'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {},
                {},
                {tech: 'Banking'},
                {tech: 'Guilds'},
                {},
            ],
        },

        {
            title: ''
        },
        {
            items: [
                {},
                {building: 'Mill'},
                {building: 'Folwark'},
                {},
                {building: 'LumberCamp'},
                {},
                {building: 'MiningCamp'},
            ],
        },
        {
            items: [
                {age: 'FeudalAge'},
                {tech: 'HorseCollar'},
                {},
                {},
                {tech: 'DoubleBitAxe'},
                {},
                {tech: 'GoldMining'},
                {tech: 'StoneMining'},
            ],
        },
        {
            items: [
                {age: 'CastleAge'},
                {tech: 'HeavyPlow'},
                {},
                {},
                {tech: 'BowSaw'},
                {},
                {tech: 'GoldShaftMining'},
                {tech: 'StoneShaftMining'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge'},
                {tech: 'CropRotation'},
                {},
                {},
                {tech: 'TwoManSaw'},
            ],
        },


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
        {
            items: [
                {age: 'ImperialAge'},
                {unit: 'FlemishMilitia', unique: true},
            ],
        },


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
    ];
}
