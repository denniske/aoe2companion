import {flatMap, uniq} from 'lodash';
import {getAbilityEnabled} from './tree';
import {Civ, civDict, civList, civs} from './civs';
import {getRelatedUnitLines, getUnitLineIdForUnit, Unit, UnitLine, unitLines} from './units';
import {appConfig} from "@nex/dataset";


export interface IUnitSection {
    title?: string;
    civ?: Civ;
    icon?: string;
    data: (UnitLine | Unit)[];
}

const unitSections: IUnitSection[] = [
    {
        title: 'unit.section.infantry',
        icon: 'sword',
        data:
            [
                'Militia',
                'ChampiScout',
                'Spearman',
                'EagleScout',
                'FireLancer',
                'Condottiero',
                'FlemishMilitia',
                'VarangianGuard',
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
                'MountedCrossbowman',
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
                'HeiGuangCavalry',
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
                'RocketCart',
                'Scorpion',
                'SiegeTower',
                'BombardCannon',
                'Trebuchet',
                'Petard',
                'MountedTrebuchet',
                'TractionTrebuchet',
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
                'Hulk',
                'FireGalley',
                'DemolitionRaft',
                'CatapultGalleon',
                'CannonGalleon',
                'LouChuan',
                'Caravel',
                'Dromon',
                'Longship',
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
    // One section per civ, mirroring the unique tech sections. Every unique unit belongs
    // to exactly one civ, so no unit shows up twice here.
    ...(appConfig.game === 'aoe2' ? [
        ...civs.filter(c => c != 'Indians').map(civ => ({
            civ: civ,
            icon: 'star',
            data: getUniqueUnitsForSection(civ),
        })),
    ] : []) as any
];

// unitLines only carries a `civ` for some of the unique units - the newer ones (Kona,
// Bolas Rider, Ghulam, ...) and the ones handed out by a bonus rather than the castle
// (Condottiero, Missionary, ...) never got one, so anything reading unitLine.civ showed
// no civ for them. Derive it from the civ data instead, which covers every unique unit.
const civByUniqueUnitLine: Partial<Record<UnitLine, Civ>> = Object.fromEntries(
    flatMap(civList, civ => civ.uniqueUnits
        .map(unit => getUnitLineIdForUnit(unit))
        // Only claim the line when its base unit is the civ's own. Civ-specific upgrades of
        // a generic line (Houfnice -> Bombard Cannon, Winged Hussar -> Hussar, ...) must not
        // turn the whole generic line into that civ's unique unit.
        .filter(line => line && civ.uniqueUnits.includes(unitLines[line]?.units[0] as Unit))
        .map(line => [line, civ.name]))
);

// The civs a unit page should call this a unique unit of. A unit a civ lists itself
// (Houfnice, Winged Hussar, ...) is unique to every civ that can actually build it - the
// Winged Hussar is listed by the Poles but also built by the Lithuanians. Other units in
// that line (the Bombard Cannon, the Hussar) are not unique. Every other unit falls back
// to its line, so the Elite Kona still reads as a Mapuche unique unit.
export function getCivsForUniqueUnit(unit: Unit): Civ[] {
    const listedBy = civList.filter(civ => civ.uniqueUnits.includes(unit)).map(civ => civ.name);
    if (listedBy.length > 0) {
        const builtBy = civs.filter(civ => civ != 'Indians' && getAbilityEnabled({civ, unit}));
        return uniq([...listedBy, ...builtBy]);
    }
    const lineId = getUnitLineIdForUnit(unit);
    const civ = unitLines[lineId]?.civ ?? civByUniqueUnitLine[lineId];
    return civ ? [civ] : [];
}

function getUniqueUnitsForSection(civ: Civ) {
    const excluded: Unit[] = [
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
        'Houfnice',
        'Savar',
        'ImperialSkirmisher',
        'MountedTrebuchet',
        'TractionTrebuchet',
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
    'FireLancer',
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
