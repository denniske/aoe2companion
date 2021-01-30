import {flatMap, sortBy} from 'lodash';
import {civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';
import {getTranslation} from '../../../app/src/helper/translate';


interface IUnitSection {
    title: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: getTranslation('unit.section.infantry'),
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
        title: getTranslation('unit.section.archer'),
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
        title: getTranslation('unit.section.cavalry'),
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
        title: getTranslation('unit.section.siege'),
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
        title: getTranslation('unit.section.trade'),
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: getTranslation('unit.section.villager'),
        data:
            [
                'Villager',
            ],
    },
    {
        title: getTranslation('unit.section.navy'),
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
        title: getTranslation('unit.section.monk'),
        data:
            [
                'Monk',
                'Missionary',
            ],
    },
    {
        title: getTranslation('unit.section.unique'),
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
