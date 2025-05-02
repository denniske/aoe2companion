import {ITechTreeRow} from './tech-tree.type';
import {ICivEntry} from "./civs";
import {Unit} from "./units";
import { getCivHasUnit } from './tree';

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
                {age: 'CastleAge', unit: 'RocketCart'},
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
                {age: 'ImperialAge', unit: 'HeavyRocketCart'},
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
                {},
                {age: 'ImperialAge', unit: 'Houfnice', unique: true},
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'FlamingCamel'},
                {age: 'ImperialAge', unit: 'MountedTrebuchet'},
                {age: 'ImperialAge', unit: 'TractionTrebuchet'},
            ],
        },

        {
            title: 'techtree.heading.infantry'
        },
        {
            items: [
                {age: 'CastleAge', unit: 'LongSwordsman'},
                {age: 'FeudalAge', unit: 'Spearman'},
                {age: 'FeudalAge', unit: 'EagleScout'},

                ...(['Burgundians'].includes(civInfo.name) ? [{
                    age: 'FeudalAge' as any,
                    unit: 'FlemishMilitia' as Unit,
                    unique: true
                }] : [{}]),
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{age: 'ImperialAge' as any, unit: 'TwoHandedSwordsman' as Unit}] : [{age: 'ImperialAge' as any, unit: 'Legionary' as Unit, unique: true}]),
                {age: 'CastleAge', unit: 'Pikeman'},
                {age: 'CastleAge', unit: 'EagleWarrior'},

                ...(['Wu'].includes(civInfo.name) ? [{
                    age: 'CastleAge' as any,
                    unit: 'JianSwordsman' as Unit,
                    unique: true
                }] : []),
                ...(['Chinese', 'Jurchens', 'Khitans', 'Koreans', 'Vietnamese'].includes(civInfo.name) ? [{
                    age: 'CastleAge' as any,
                    unit: 'FireLancer' as Unit,
                    unique: true
                }] : []),
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{age: 'ImperialAge' as any, unit: 'Champion' as Unit}] : [{}]),
                {age: 'ImperialAge', unit: 'Halberdier'},
                {age: 'ImperialAge', unit: 'EliteEagleWarrior'},

                ...(['Chinese', 'Jurchens', 'Khitans', 'Koreans', 'Vietnamese'].includes(civInfo.name) ? [{
                    age: 'ImperialAge' as any,
                    unit: 'EliteFireLancer' as Unit,
                    unique: true
                }] : []),
                ...(['Italians'].includes(civInfo.name) ? [{
                    age: 'ImperialAge' as any,
                    unit: 'Condottiero' as Unit,
                    unique: true
                }] : []),
            ],
        },

        {
            title: 'techtree.heading.cavalry'
        },
        {
            items: [
                {age: 'FeudalAge', unit: 'ScoutCavalry'},
                {age: 'CastleAge', unit: 'Knight'},
                {age: 'CastleAge', unit: 'CamelRider'},
                {age: 'CastleAge', unit: 'BattleElephant'},
                {age: 'CastleAge', unit: 'SteppeLancer'},

                ...(civInfo.name === 'Gurjaras' ? [{age: 'CastleAge' as any, unit: 'ShrivamshaRider' as Unit, unique: true}] : []),
                ...(['Aztecs', 'Mayans', 'Incas'].includes(civInfo.name) ? [{
                    age: 'CastleAge' as any,
                    unit: 'XolotlWarrior' as Unit,
                    unique: true
                }] : []),
                ...(['Shu', 'Wei', 'Wu'].includes(civInfo.name) ? [{
                    age: 'CastleAge' as any,
                    unit: 'HeiGuangCavalry' as Unit,
                    unique: true
                }] : []),
            ],
        },
        {
            items: [
                {age: 'CastleAge', unit: 'LightCavalry'},
                {age: 'ImperialAge', unit: 'Cavalier'},
                {age: 'ImperialAge', unit: 'HeavyCamelRider'},
                {age: 'ImperialAge', unit: 'EliteBattleElephant'},
                {age: 'ImperialAge', unit: 'EliteSteppeLancer'},

                ...(civInfo.name === 'Gurjaras' ? [{age: 'ImperialAge' as any, unit: 'EliteShrivamshaRider' as Unit, unique: true}] : []),
                ...(['Shu', 'Wei', 'Wu'].includes(civInfo.name) ? [{
                    age: 'ImperialAge' as any,
                    unit: 'HeavyHeiGuangCavalry' as Unit,
                    unique: true
                }] : []),
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'Hussar'},
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
                ...(getCivHasUnit(civInfo.name, 'Genitour') ? [{age: 'CastleAge' as any, unit: 'Genitour' as Unit, unique: true}] : [{}]),
                ...(getCivHasUnit(civInfo.name, 'Slinger') ? [{age: 'CastleAge' as any, unit: 'Slinger' as Unit, unique: true}] : []),
                ...(getCivHasUnit(civInfo.name, 'Grenadier') ? [{age: 'CastleAge' as any, unit: 'Grenadier' as Unit, unique: true}] : []),
                ...(getCivHasUnit(civInfo.name, 'XianbeiRaider') ? [{age: 'CastleAge' as any, unit: 'XianbeiRaider' as Unit, unique: true}] : []),
            ],
        },
        {
            items: [
                {age: 'ImperialAge', unit: 'Arbalester'},
                {age: 'ImperialAge', unit: 'ImperialSkirmisher', unique: true},
                {age: 'ImperialAge', unit: 'EliteElephantArcher'},
                {age: 'ImperialAge', unit: 'HeavyCavalryArcher'},
                {age: 'ImperialAge', unit: 'HandCannoneer'},
                ...(getCivHasUnit(civInfo.name, 'EliteGenitour') ? [{age: 'ImperialAge' as any, unit: 'EliteGenitour' as Unit, unique: true}] : [{}]),
            ],
        },
    ];
}
