import {ITechTreeRow} from './tech-tree.type';

export function getCompactTechTree(): ITechTreeRow[] {
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
                {unit: 'Houfnice'},
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
                {unit: 'TwoHandedSwordsman'},
                {unit: 'Pikeman'},
                {unit: 'EagleWarrior'},
            ],
        },
        {
            items: [
                {unit: 'Champion'},
                {unit: 'Halberdier'},
                {unit: 'EliteEagleWarrior'},
            ],
        },

        {
            title: 'techtree.heading.cavalry'
        },
        {
            items: [
                {unit: 'ScoutCavalry'},
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
                {unit: 'Cavalier'},
                {unit: 'HeavyCamelRider'},
                {unit: 'EliteBattleElephant'},
                {unit: 'EliteSteppeLancer'},
            ],
        },
        {
            items: [
                {unit: 'Hussar'},
                {unit: 'Paladin'},
                {unit: 'ImperialCamelRider'},
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
                {unit: 'Genitour'},
            ],
        },
        {
            items: [
                {unit: 'Arbalester'},
                {unit: 'ImperialSkirmisher'},
                {unit: 'EliteElephantArcher'},
                {unit: 'HeavyCavalryArcher'},
                {unit: 'HandCannoneer'},
                {unit: 'EliteGenitour'},
            ],
        },
    ];
}
