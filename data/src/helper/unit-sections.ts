import {flatMap, sortBy} from 'lodash';
import {Civ, civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';
import {appConfig} from "@nex/dataset";


interface IUnitSection {
    title: string;
    icon: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: 'unit.section.infantry',
        icon: 'sword',
        data:
            [
                'Militia',
                'Spearman',
                'EagleScout',
                'Condottiero',
                'FlemishMilitia',
            ],
    },
    {
        title: 'unit.section.archer',
        icon: 'bow-arrow',
        data:
            [
                'Archer',
                'Skirmisher',
                'CavalryArcher',
                'ElephantArcher',
                'Genitour',
                'HandCannoneer',
                'Slinger',
            ],
    },
    {
        title: 'unit.section.cavalry',
        icon: 'horse-head',
        data:
            [
                'ScoutCavalry',
                'Knight',
                'CamelRider',
                'SteppeLancer',
                'BattleElephant',
                'ShrivamshaRider',
                'XolotlWarrior',
            ],
    },
    {
        title: 'unit.section.siege',
        icon: 'cannon',
        data:
            [
                'ArmoredElephant',
                'BatteringRam',
                'Mangonel',
                'Scorpion',
                'SiegeTower',
                'BombardCannon',
                'Trebuchet',
                'Petard',
                'FlamingCamel',
            ],
    },
    {
        title: 'unit.section.trade',
        icon: 'scale-unbalanced',
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: 'unit.section.villager',
        icon: 'hammer',
        data:
            [
                'Villager',
            ],
    },
    {
        title: 'unit.section.navy',
        icon: 'sailboat',
        data:
            [
                'FishingShip',
                'TransportShip',
                'Galley',
                'FireGalley',
                'DemolitionRaft',
                'CannonGalleon',
                'Caravel',
                'Dromon',
                'Longboat',
                'TurtleShip',
                'Thirisadai',
            ],
    },
    {
        title: 'unit.section.monk',
        icon: 'person-praying',
        data:
            [
                'Monk',
                'Missionary',
            ],
    },
    ...(appConfig.game === 'aoe2de' ? [
        {
            icon: 'star',
            title: 'unit.section.unique',
            data: sortBy(flatMap(civs.filter(c => c != 'Indians'), civ => getUniqueUnitsForSection(civ))),
        },
    ] : []) as any
];

function getUniqueUnitsForSection(civ: Civ) {
    const excluded = [
        'Thirisadai',
        'CamelScout',
        'Genitour',
        'FlemishMilitia',
        'Slinger',
        'ShrivamshaRider',
        'ImperialCamelRider',
        'Condottiero',
        'TurtleShip',
        'WingedHussar',
        'Caravel',
        'Missionary',
        'FlamingCamel',
        'Longboat',
        'Houfnice',
    ];

    const allUnits = [];
    const units = civDict[civ].uniqueUnits.filter(unit => !excluded.includes(unit));

    for (const unit of units) {
        allUnits.push(unit);
        const relatedUnits = getRelatedUnitLines(getUnitLineIdForUnit(unit));
        allUnits.push(...relatedUnits);
    }

    return allUnits;
}

const nonExtendedUnitsInSections = [
    'ElephantArcher',
    'BattleElephant',
    'CannonGalleon',
    'SteppeLancer',
];

export const allUnitSections = unitSections.map(section => ({
    ...section,
    data: flatMap(section.data.map(u => {
        if (unitLines[u] && !unitLines[u].unique && !nonExtendedUnitsInSections.includes(u)) {
            return unitLines[u].units;
        }
        return [u];
    })),
}));

// const missing = [];
// allUnitSections.forEach(section => {
//     section.data.map(u => {
//             const a = getWikiLinkForUnit(u);
//             if (a == null) {
//                 missing.push(u);
//             }
//     });
// })
// console.log(missing);

// export const allUnitsSorted = flatMap(allUnitSections, s => s.data as UnitLine[]);
