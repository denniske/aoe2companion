import {flatMap, sortBy} from 'lodash';
import {civDict, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';
import {getUiTranslation} from '../lib/aoe-data';


interface IUnitSection {
    title: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: getUiTranslation('unit.section.infantry'),
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
        title: getUiTranslation('unit.section.archer'),
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
        title: getUiTranslation('unit.section.cavalry'),
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
        title: getUiTranslation('unit.section.siege'),
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
        title: getUiTranslation('unit.section.trade'),
        data:
            [
                'TradeCart',
                'TradeCog',
            ],
    },
    {
        title: getUiTranslation('unit.section.villager'),
        data:
            [
                'Villager',
            ],
    },
    {
        title: getUiTranslation('unit.section.navy'),
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
        title: getUiTranslation('unit.section.monk'),
        data:
            [
                'Monk',
                'Missionary',
            ],
    },
    {
        title: getUiTranslation('unit.section.unique'),
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
