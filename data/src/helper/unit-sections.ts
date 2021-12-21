import {flatMap, sortBy} from 'lodash';
import {civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';


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
    // {
    //     title: 'unit.section.unique',
    //     data: sortBy(flatMap(civs, civ => [civDict[civ].uniqueUnits[0], ...getRelatedUnitLines(getUnitLineIdForUnit(civDict[civ].uniqueUnits[0]))])),
    // },
];

export const allUnitSections = unitSections.map(section => ({
    ...section,
    data: flatMap(section.data.map(u => {
        if (unitLines[u] && !unitLines[u].unique) {
            return unitLines[u].units;
        }
        return [u];
    })),
}));
