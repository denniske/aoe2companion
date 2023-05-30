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
                {tech: 'BlastFurnace'},
                {tech: 'PlateMailArmor'},
                {tech: 'PlateBardingArmor'},
                {},
                {tech: 'Bracer'},
                {tech: 'RingArcherArmor'},
            ],
        },

        {
            title: 'techtree.heading.other'
        },
        {
            items: [
                {tech: 'Bloodlines'},
                {tech: 'Husbandry'},
                {},
                {},
                {tech: 'ThumbRing'},
                {tech: 'ParthianTactics'},
            ],
        },

        {
            title: 'techtree.heading.siege'
        },
        {
            items: [
                {unit: 'ArmoredElephant'},
                {unit: 'BatteringRam'},
                {unit: 'Mangonel'},
                {unit: 'Scorpion'},
                {},
                {tech: 'Ballistics'},
            ],
        },
        {
            items: [
                {unit: 'SiegeElephant'},
                {unit: 'CappedRam'},
                {unit: 'Onager'},
                {unit: 'HeavyScorpion'},
                {unit: 'BombardCannon'},
                {tech: 'SiegeEngineers'},
            ],
        },
        {
            items: [
                {},
                {unit: 'SiegeRam'},
                {unit: 'SiegeOnager'},
                {},
                {unit: 'Houfnice', unique: true},
            ],
        },

        {
            title: 'techtree.heading.infantry'
        },
        {
            items: [
                {unit: 'LongSwordsman'},
                {unit: 'Spearman'},
                {unit: 'EagleScout'},
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{unit: 'TwoHandedSwordsman' as Unit}] : [{unit: 'Legionary' as Unit, unique: true}]),
                {unit: 'Pikeman'},
                {unit: 'EagleWarrior'},
            ],
        },
        {
            items: [
                ...(civInfo.name !== 'Romans' ? [{unit: 'Champion' as Unit}] : [{}]),
                {unit: 'Halberdier'},
                {unit: 'EliteEagleWarrior'},
                {unit: 'Condottiero', unique: true},
            ],
        },

        {
            title: 'techtree.heading.cavalry'
        },
        {
            items: [
                {unit: 'ScoutCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{unit: 'ShrivamshaRider' as Unit, unique: true}] : []),
                {unit: 'Knight'},
                {unit: 'CamelRider'},
                {unit: 'BattleElephant'},
                {unit: 'SteppeLancer'},
                {unit: 'XolotlWarrior'},
            ],
        },
        {
            items: [
                {unit: 'LightCavalry'},
                ...(civInfo.name === 'Gurjaras' ? [{unit: 'EliteShrivamshaRider' as Unit, unique: true}] : []),
                {unit: 'Cavalier'},
                {unit: 'HeavyCamelRider'},
                {unit: 'EliteBattleElephant'},
                {unit: 'EliteSteppeLancer'},
            ],
        },
        {
            items: [
                {unit: 'Hussar'},
                ...(civInfo.name === 'Gurjaras' ? [{}] : []),
                {unit: 'Paladin'},
                {unit: 'ImperialCamelRider', unique: true},
                {},
                {},
            ],
        },
        {
            items: [
                {unit: 'WingedHussar'},
            ],
        },

        {
            title: 'techtree.heading.archer'
        },
        {
            items: [
                {unit: 'Archer'},
                {unit: 'Skirmisher'},
                {},
                {},
            ],
        },
        {
            items: [
                {unit: 'Crossbowman'},
                {unit: 'EliteSkirmisher'},
                {unit: 'ElephantArcher'},
                {unit: 'CavalryArcher'},
                {},
                {unit: 'Genitour', unique: true},
            ],
        },
        {
            items: [
                {unit: 'Arbalester'},
                {unit: 'ImperialSkirmisher', unique: true},
                {unit: 'EliteElephantArcher'},
                {unit: 'HeavyCavalryArcher'},
                {unit: 'HandCannoneer'},
                {unit: 'EliteGenitour', unique: true},
            ],
        },
    ];
}
