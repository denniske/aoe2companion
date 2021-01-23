import {flatMap, sortBy} from 'lodash';
import {civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';


interface IUnitSection {
    title: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: 'Infantry',
        data:
            [
                'Militia',
                'Spearman',
                'EagleScout',
                'Condottiero',
            ],
    },
    {
        title: 'Archer',
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
        title: 'Cavalry',
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
        title: 'Siege',
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
        title: 'Trade',
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: 'Villager',
        data:
            [
                'Villager',
            ],
    },
    {
        title: 'Navy',
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
        title: 'Monk',
        data:
            [
                'Monk',
                'Missionary',
            ],
    },
    {
        title: 'Unique',
        data: sortBy(flatMap(civs, civ => [civDict[civ].uniqueUnits[0], ...getRelatedUnitLines(getUnitLineIdForUnit(civDict[civ].uniqueUnits[0]))])),
    },
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
