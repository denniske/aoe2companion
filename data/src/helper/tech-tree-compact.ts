import {ITechTreeRow} from './tech-tree.type';
import {ICivEntry} from "./civs";
import {Unit} from "./units";

export function getCompactTechTree(civInfo: ICivEntry): ITechTreeRow[] {
    return [
        {
            title: 'techtree.heading.blacksmith'
        },
        {
            items: [
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
                {age: 'ImperialAge', tech: 'BlastFurnace'},
                {age: 'ImperialAge', tech: 'PlateMailArmor'},
                {age: 'ImperialAge', tech: 'PlateBardingArmor'},
                {},
                {age: 'ImperialAge', tech: 'Bracer'},
                {age: 'ImperialAge', tech: 'RingArcherArmor'},
            ],
        },

        {
            title: 'techtree.heading.other'
        },
        {
            items: [
                {age: 'FeudalAge', tech: 'Bloodlines'},
                {age: 'CastleAge', tech: 'Husbandry'},
                {},
                {},
                {age: 'CastleAge', tech: 'ThumbRing'},
                {age: 'ImperialAge', tech: 'ParthianTactics'},
            ],
        },

        {
            title: 'techtree.heading.siege'
        },
        {
            items: [
                {age: 'CastleAge', unit: 'ArmoredElephant'},
                {age: 'CastleAge', unit: 'BatteringRam'},
                {age: 'CastleAge', unit: 'Mangonel'},
                {age: 'CastleAge', unit: 'Scorpion'},
                {},
                {age: 'CastleAge', tech: 'Ballistics'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'SiegeElephant'},
                {age: 'ImperialAge', unit: 'CappedRam'},
                {age: 'ImperialAge', unit: 'Onager'},
                {age: 'ImperialAge', unit: 'HeavyScorpion'},
                {age: 'ImperialAge', unit: 'BombardCannon'},
                {age: 'ImperialAge', tech: 'SiegeEngineers'},
            ],
        },
        {
            items: [
                {},
                {age: 'ImperialAge', unit: 'SiegeRam'},
                {age: 'ImperialAge', unit: 'SiegeOnager'},
                {},
                {age: 'ImperialAge', unit: 'Houfnice', unique: true},
            ],
        },

        {
            title: 'techtree.heading.infantry'
        },
        {
            items: [
                {age: 'CastleAge', unit: 'LongSwordsman'},
                {age: 'DarkAge', unit: 'Spearman'},
                {age: 'DarkAge', unit: 'EagleScout'},
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{age: 'ImperialAge' as any, unit: 'TwoHandedSwordsman' as Unit}] : [{unit: 'Legionary' as Unit, unique: true}]),
                {age: 'CastleAge', unit: 'Pikeman'},
                {age: 'CastleAge', unit: 'EagleWarrior'},
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{age: 'ImperialAge' as any, unit: 'Champion' as Unit}] : [{}]),
                {age: 'ImperialAge', unit: 'Halberdier'},
                {age: 'ImperialAge', unit: 'EliteEagleWarrior'},
                {age: 'ImperialAge', unit: 'Condottiero', unique: true},
                {age: 'ImperialAge', unit: 'FlemishMilitia', unique: true},
            ],
        },

        {
            title: 'techtree.heading.cavalry'
        },
        {
            items: [
                {age: 'FeudalAge', unit: 'ScoutCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{unit: 'ShrivamshaRider' as Unit, unique: true}] : []),
                {age: 'CastleAge', unit: 'Knight'},
                {age: 'CastleAge', unit: 'CamelRider'},
                {age: 'CastleAge', unit: 'BattleElephant'},
                {age: 'CastleAge', unit: 'SteppeLancer'},
                {age: 'CastleAge', unit: 'XolotlWarrior'},
            ],
        },
        {
            items: [
                {age: 'CastleAge', unit: 'LightCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{age: 'ImperialAge' as any, unit: 'EliteShrivamshaRider' as Unit, unique: true}] : []),
                {age: 'ImperialAge', unit: 'Cavalier'},
                {age: 'ImperialAge', unit: 'HeavyCamelRider'},
                {age: 'ImperialAge', unit: 'EliteBattleElephant'},
                {age: 'ImperialAge', unit: 'EliteSteppeLancer'},
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'Hussar'},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {age: 'ImperialAge', unit: 'Paladin'},
                {age: 'ImperialAge', unit: 'ImperialCamelRider', unique: true},
                {},
                {},
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'WingedHussar'},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {age: 'ImperialAge', unit: 'Savar', unique: true},
            ],
        },

        {
            title: 'techtree.heading.archer'
        },
        {
            items: [
                {age: 'FeudalAge', unit: 'Archer'},
                {age: 'FeudalAge', unit: 'Skirmisher'},
                {},
                {},
            ],
        },
        {
            items: [
                {age: 'CastleAge', unit: 'Crossbowman'},
                {age: 'CastleAge', unit: 'EliteSkirmisher'},
                {age: 'CastleAge', unit: 'ElephantArcher'},
                {age: 'CastleAge', unit: 'CavalryArcher'},
                {},
                {age: 'CastleAge', unit: 'Genitour', unique: true},
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'Arbalester'},
                {age: 'ImperialAge', unit: 'ImperialSkirmisher', unique: true},
                {age: 'ImperialAge', unit: 'EliteElephantArcher'},
                {age: 'ImperialAge', unit: 'HeavyCavalryArcher'},
                {age: 'ImperialAge', unit: 'HandCannoneer'},
                {age: 'ImperialAge', unit: 'EliteGenitour', unique: true},
            ],
        },
    ];
}
