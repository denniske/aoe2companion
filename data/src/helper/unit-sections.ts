import {flatMap, sortBy} from 'lodash';
import {Civ, civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';
import {appConfig} from "@nex/dataset";


interface IUnitSection {
    title: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: 'unit.section.infantry',
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
        data:
            [
                'Archer',
                'Skirmisher',
                'CavalryArcher',
                'Genitour',
                'HandCannoneer',
                'Slinger',
            ],
    },
    {
        title: 'unit.section.cavalry',
        data:
            [
                'ScoutCavalry',
                'Knight',
                'CamelRider',
                'SteppeLancer',
                'BattleElephant',
                'XolotlWarrior',
            ],
    },
    {
        title: 'unit.section.siege',
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
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: 'unit.section.villager',
        data:
            [
                'Villager',
            ],
    },
    {
        title: 'unit.section.navy',
        data:
            [
                'FishingShip',
                'TransportShip',
                'Galley',
                'FireGalley',
                'DemolitionRaft',
                'CannonGalleon',
                'Caravel',
                'Longboat',
                'TurtleShip',
                'Thirisadai',
            ],
    },
    {
        title: 'unit.section.monk',
        data:
            [
                'Monk',
                'Missionary',
            ],
    },
    ...(appConfig.game === 'aoe2de' ? [
        {
            title: 'unit.section.unique',
            data: sortBy(flatMap(civs.filter(c => c != 'Indians'), civ => getUniqueUnitsForSection(civ))),
        },
    ] : [])
];

function getUniqueUnitsForSection(civ: Civ) {
    const excluded = [
        'Thirisadai',
        'CamelScout',
        'Genitour',
        'FlemishMilitia',
        'Slinger',
        'ImperialCamelRider',
        'Condottiero',
        'TurtleShip',
        'WingedHussar',
        'Caravel',
        'Missionary',
        'FlamingCamel',
        'Longboat',
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

export const allUnitSections = unitSections.map(section => ({
    ...section,
    data: flatMap(section.data.map(u => {
        if (unitLines[u] && !unitLines[u].unique) {
            return unitLines[u].units;
        }
        return [u];
    })),
}));
