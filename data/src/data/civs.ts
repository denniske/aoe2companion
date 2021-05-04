
// function civ(name, tree) {
//     resetToDefault(tree);
//
//     let selectedCiv = civsConfig[name];
//
//     let enabled = selectedCiv.enabled || {};
//     let disabled = selectedCiv.disabled || {};
//     let uniqueConfig = selectedCiv.unique || {};
//     if (selectedCiv.disableHorses) {
//         disableHorses();
//     }
//
//     enable(enabled.buildings || [], enabled.units || [], enabled.techs || []);
//     disable(disabled.buildings || [], disabled.units || [], disabled.techs || []);
//     unique(uniqueConfig || [], selectedCiv.monkPrefix);
// }

const UNIQUE_UNIT = "UNIQUE UNIT";
const ELITE_UNIQUE_UNIT = "ELITE UNIQUE UNIT";
const UNIQUE_TECH_1 = "UNIQUE TECH 1";
const UNIQUE_TECH_2 = "UNIQUE TECH 2";
const MONK_PREFIX_MESO = "meso_";
const MONK_PREFIX_AFRICAN = "african_";
const MONK_PREFIX_ASIAN = "asian_";
const MONK_PREFIX_GENERIC = "";
const BARRACKS = 12;
const DOCK = 45;
const SIEGE_WORKSHOP = 49;
const FARM = 50;
const MILL = 68;
const HOUSE = 70;
const TOWN_CENTER = 71;
const PALISADE_WALL = 72;
const GATE = 487;
const WATCH_TOWER = 79;
const CASTLE = 82;
const MARKET = 84;
const ARCHERY_RANGE = 87;
const STABLE = 101;
const BLACKSMITH = 103;
const MONASTERY = 104;
const STONE_WALL = 117;
const FORTIFIED_WALL = 155;
const FISH_TRAP = 199;
const UNIVERSITY = 209;
const GUARD_TOWER = 234;
const KEEP = 235;
const BOMBARD_TOWER = 236;
const WONDER = 276;
const LUMBER_CAMP = 562;
const MINING_CAMP = 584;
const OUTPOST = 598;
const PALISADE_GATE = 792;
const FEITORIA = 1021;
const KREPOST = 1251;
const DONJON = 1665;
const ARCHER = 4;
const HAND_CANNONEER = 5;
const ELITE_SKIRMISHER = 6;
const SKIRMISHER = 7;
const LONGBOWMAN = 8;
const MANGUDAI = 11;
const FISHING_SHIP = 13;
const TRADE_COG = 17;
const WAR_GALLEY = 21;
const CROSSBOWMAN = 24;
const TEUTONIC_KNIGHT = 25;
const BATTERING_RAM = 1258;
const BOMBARD_CANNON = 36;
const KNIGHT = 38;
const CAVALRY_ARCHER = 39;
const CATAPHRACT = 40;
const HUSKARL = 41;
const TREBUCHET = 331;
const JANISSARY = 46;
const CHU_KO_NU = 73;
const MILITIA = 74;
const MAN_AT_ARMS = 75;
const LONG_SWORDSMAN = 77;
const VILLAGER = 83;
const SPEARMAN = 93;
const MONK = 125;
const TRADE_CART = 128;
const SLINGER = 185;
const IMPERIAL_CAMEL_RIDER = 207;
const WOAD_RAIDER = 232;
const WAR_ELEPHANT = 239;
const LONGBOAT = 250;
const SCORPION = 279;
const MANGONEL = 280;
const THROWING_AXEMAN = 281;
const MAMELUKE = 282;
const CAVALIER = 283;
const SAMURAI = 291;
const CAMEL_RIDER = 329;
const HEAVY_CAMEL_RIDER = 330;
const PIKEMAN = 358;
const HALBERDIER = 359;
const CANNON_GALLEON = 420;
const CAPPED_RAM = 422;
const PETARD = 440;
const HUSSAR = 441;
const GALLEON = 442;
const SCOUT_CAVALRY = 448;
const TWO_HANDED_SWORDSMAN = 473;
const HEAVY_CAV_ARCHER = 474;
const ARBALESTER = 492;
const DEMOLITION_SHIP = 527;
const HEAVY_DEMO_SHIP = 528;
const FIRE_SHIP = 529;
const ELITE_LONGBOWMAN = 530;
const ELITE_THROWING_AXEMAN = 531;
const FAST_FIRE_SHIP = 532;
const ELITE_LONGBOAT = 533;
const ELITE_WOAD_RAIDER = 534;
const GALLEY = 539;
const HEAVY_SCORPION = 542;
const TRANSPORT_SHIP = 545;
const LIGHT_CAVALRY = 546;
const SIEGE_RAM = 548;
const ONAGER = 550;
const ELITE_CATAPHRACT = 553;
const ELITE_TEUTONIC_KNIGHT = 554;
const ELITE_HUSKARL = 555;
const ELITE_MAMELUKE = 556;
const ELITE_JANISSARY = 557;
const ELITE_WAR_ELEPHANT = 558;
const ELITE_CHU_KO_NU = 559;
const ELITE_SAMURAI = 560;
const ELITE_MANGUDAI = 561;
const CHAMPION = 567;
const PALADIN = 569;
const SIEGE_ONAGER = 588;
const ELITE_CANNON_GALLEON = 691;
const BERSERK = 692;
const ELITE_BERSERK = 694;
const JAGUAR_WARRIOR = 725;
const ELITE_JAGUAR_WARRIOR = 726;
const EAGLE_SCOUT = 751;
const ELITE_EAGLE_WARRIOR = 752;
const EAGLE_WARRIOR = 753;
const TARKAN = 755;
const ELITE_TARKAN = 757;
const PLUMED_ARCHER = 763;
const ELITE_PLUMED_ARCHER = 765;
const CONQUISTADOR = 771;
const ELITE_CONQUISTADOR = 773;
const MISSIONARY = 775;
const WAR_WAGON = 827;
const ELITE_WAR_WAGON = 829;
const TURTLE_SHIP = 831;
const ELITE_TURTLE_SHIP = 832;
const GENOESE_CROSSBOWMAN = 866;
const ELITE_GENOESE_CROSSBOWMAN = 868;
const MAGYAR_HUSZAR = 869;
const ELITE_MAGYAR_HUSZAR = 871;
const ELEPHANT_ARCHER = 873;
const ELITE_ELEPHANT_ARCHER = 875;
const BOYAR = 876;
const ELITE_BOYAR = 878;
const KAMAYUK = 879;
const ELITE_KAMAYUK = 881;
const CONDOTTIERO = 882;
const ORGAN_GUN = 1001;
const ELITE_ORGAN_GUN = 1003;
const CARAVEL = 1004;
const ELITE_CARAVEL = 1006;
const CAMEL_ARCHER = 1007;
const ELITE_CAMEL_ARCHER = 1009;
const GENITOUR = 1010;
const ELITE_GENITOUR = 1012;
const GBETO = 1013;
const ELITE_GBETO = 1015;
const SHOTEL_WARRIOR = 1016;
const ELITE_SHOTEL_WARRIOR = 1018;
const FIRE_GALLEY = 1103;
const DEMOLITION_RAFT = 1104;
const SIEGE_TOWER = 1105;
const BALLISTA_ELEPHANT = 1120;
const ELITE_BALLISTA_ELEPHANT = 1122;
const KARAMBIT_WARRIOR = 1123;
const ELITE_KARAMBIT_WARRIOR = 1125;
const ARAMBAI = 1126;
const ELITE_ARAMBAI = 1128;
const RATTAN_ARCHER = 1129;
const ELITE_RATTAN_ARCHER = 1131;
const BATTLE_ELEPHANT = 1132;
const ELITE_BATTLE_ELEPHANT = 1134;
const IMPERIAL_SKIRMISHER = 1155;
const KESHIK = 1228;
const ELITE_KESHIK = 1230;
const KIPCHAK = 1231;
const ELITE_KIPCHAK = 1233;
const LEITIS = 1234;
const ELITE_LEITIS = 1236;
const DISMOUNTED_KONNIK = 1252;
const DISMOUNTED_ELITE_KONNIK = 1253;
const KONNIK = 1254;
const ELITE_KONNIK = 1255;
const FLAMING_CAMEL = 1263;
const STEPPE_LANCER = 1370;
const ELITE_STEPPE_LANCER = 1372;
const XOLOTL_WARRIOR = 1570;
const COUSTILLIER = 1655;
const ELITE_COUSTILLIER = 1657;
const SERJEANT = 1658;
const ELITE_SERJEANT = 1659;
const DSERJEANT = 1660;
const ELITE_DSERJEANT = 1661;
const FLEMISHPIKEMAN = 1699;
const YEOMEN = 3;
const EL_DORADO = 4;
const FUROR_CELTICA = 5;
const DRILL = 6;
const MAHOUTS = 7;
const TOWN_WATCH = 8;
const ZEALOTRY = 9;
const ARTILLERY = 10;
const CRENELLATIONS = 11;
const CROP_ROTATION = 12;
const HEAVY_PLOW = 13;
const HORSE_COLLAR = 14;
const GUILDS = 15;
const ANARCHY = 16;
const BANKING = 17;
const ATHEISM = 21;
const LOOM = 22;
const COINAGE = 23;
const GARLAND_WARS = 24;
const HUSBANDRY = 39;
const FAITH = 45;
const CHEMISTRY = 47;
const CARAVAN = 48;
const BERSERKERGANG = 49;
const MASONRY = 50;
const ARCHITECTURE = 51;
const ROCKETRY = 52;
const TREADMILL_CRANE = 54;
const GOLD_MINING = 55;
const KATAPARUTO = 59;
const LOGISTICA = 61;
const KEEP_TECH = 63;
const BOMBARD_TOWER_TECH = 64;
const GILLNETS = 65;
const FORGING = 67;
const IRON_CASTING = 68;
const SCALE_MAIL_ARMOR = 74;
const BLAST_FURNACE = 75;
const CHAIN_MAIL_ARMOR = 76;
const PLATE_MAIL_ARMOR = 77;
const PLATE_BARDING_ARMOR = 80;
const SCALE_BARDING_ARMOR = 81;
const CHAIN_BARDING_ARMOR = 82;
const BEARDED_AXE = 83;
const BALLISTICS = 93;
const FEUDAL_AGE = 101;
const CASTLE_AGE = 102;
const IMPERIAL_AGE = 103;
const GUARD_TOWER_TECH = 140;
const GOLD_SHAFT_MINING = 182;
const FORTIFIED_WALL_TECH = 194;
const FLETCHING = 199;
const BODKIN_ARROW = 200;
const BRACER = 201;
const DOUBLE_BIT_AXE = 202;
const BOW_SAW = 203;
const PADDED_ARCHER_ARMOR = 211;
const LEATHER_ARCHER_ARMOR = 212;
const WHEELBARROW = 213;
const SQUIRES = 215;
const RING_ARCHER_ARMOR = 219;
const TWO_MAN_SAW = 221;
const BLOCK_PRINTING = 230;
const SANCTITY = 231;
const ILLUMINATION = 233;
const HAND_CART = 249;
const FERVOR = 252;
const STONE_MINING = 278;
const STONE_SHAFT_MINING = 279;
const TOWN_PATROL = 280;
const CONSCRIPTION = 315;
const REDEMPTION = 316;
const ATONEMENT = 319;
const SAPPERS = 321;
const MURDER_HOLES = 322;
const SHIPWRIGHT = 373;
const CAREENING = 374;
const DRY_DOCK = 375;
const SIEGE_ENGINEERS = 377;
const HOARDINGS = 379;
const HEATED_SHOT = 380;
const SPIES_TREASON = 408;
const BLOODLINES = 435;
const PARTHIAN_TACTICS = 436;
const THUMB_RING = 437;
const THEOCRACY = 438;
const HERESY = 439;
const SUPREMACY = 440;
const HERBAL_MEDICINE = 441;
const SHINKICHON = 445;
const PERFUSION = 457;
const ATLATL = 460;
const WARWOLF = 461;
const GREAT_WALL = 462;
const CHIEFTAINS = 463;
const GREEK_FIRE = 464;
const STRONGHOLD = 482;
const MARAUDERS = 483;
const YASAMA = 484;
const OBSIDIAN_ARROWS = 485;
const PANOKSEON = 486;
const NOMADS = 487;
const KAMANDARAN = 488;
const IRONCLAD = 489;
const MADRASAH = 490;
const SIPAHI = 491;
const INQUISITION = 492;
const CHIVALRY = 493;
const PAVISE = 494;
const SILK_ROAD = 499;
const SULTANS = 506;
const SHATAGNI = 507;
const ORTHODOXY = 512;
const DRUZHINA = 513;
const CORVINIAN_ARMY = 514;
const RECURVE_BOW = 515;
const ANDEAN_SLING = 516;
const FABRIC_SHIELDS = 517;
const CARRACK = 572;
const ARQUEBUS = 573;
const ROYAL_HEIRS = 574;
const TORSION_ENGINES = 575;
const TIGUI = 576;
const FARIMBA = 577;
const KASBAH = 578;
const MAGHRABI_CAMELS = 579;
const ARSON = 602;
const ARROWSLITS = 608;
const TUSK_SWORDS = 622;
const DOUBLE_CROSSBOW = 623;
const THALASSOCRACY = 624;
const FORCED_LEVY = 625;
const HOWDAH = 626;
const MANIPUR_CAVALRY = 627;
const CHATRAS = 628;
const PAPER_MONEY = 629;
const STIRRUPS = 685;
const BAGAINS = 686;
const SILK_ARMOR = 687;
const TIMURID_SIEGECRAFT = 688;
const STEPPE_HUSBANDRY = 689;
const CUMAN_MERCENARIES = 690;
const HILL_FORTS = 691;
const TOWER_SHIELDS = 692;
const SUPPLIES = 716;
const BURGUNDIAN_VINEYARDS = 754;
const FLEMISH_REVOLUTION = 755;
const FIRST_CRUSADE = 756;
const SCUTAGE = 757;

export const horseDisabledBuildings = [STABLE];
export const horseDisabledUnits = [SCOUT_CAVALRY, LIGHT_CAVALRY, HUSSAR, KNIGHT, PALADIN, CAMEL_RIDER,
   HEAVY_CAMEL_RIDER, CAVALIER, CAVALRY_ARCHER, HEAVY_CAV_ARCHER];
export const horseDisabledTechs = [BLOODLINES, HUSBANDRY, SCALE_BARDING_ARMOR, CHAIN_BARDING_ARMOR,
   PLATE_BARDING_ARMOR, PARTHIAN_TACTICS];

export const defaultDisabledUnits = [
   BATTLE_ELEPHANT,
   ELITE_BATTLE_ELEPHANT,
   STEPPE_LANCER,
   ELITE_STEPPE_LANCER,
   EAGLE_SCOUT,
   EAGLE_WARRIOR,
   ELITE_EAGLE_WARRIOR,
   // Unique units
   SLINGER,
   IMPERIAL_SKIRMISHER,
   GENITOUR,
   ELITE_GENITOUR,
   CONDOTTIERO,
   IMPERIAL_CAMEL_RIDER,
   XOLOTL_WARRIOR,
   TURTLE_SHIP,
   ELITE_TURTLE_SHIP,
   LONGBOAT,
   ELITE_LONGBOAT,
   CARAVEL,
   ELITE_CARAVEL,
   FLAMING_CAMEL,
   KONNIK,
   ELITE_KONNIK,
   MISSIONARY,
   DSERJEANT,
   ELITE_DSERJEANT,
   SERJEANT,
   ELITE_SERJEANT,
   FLEMISHPIKEMAN,
];

export const defaultDisabledBuildings = [KREPOST, FEITORIA, DONJON];

export const civsConfig = {
   Aztecs: {
      disableHorses: true,
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            HOARDINGS,
            RING_ARCHER_ARMOR,
            MASONRY,
            ARCHITECTURE,
            BOMBARD_TOWER_TECH,
            KEEP_TECH,
            TWO_MAN_SAW,
            GUILDS
         ],
         units: [
            HAND_CANNONEER,
            HALBERDIER,
            CANNON_GALLEON,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP,
            GALLEON,
            HEAVY_SCORPION,
            BOMBARD_CANNON
         ]
      },
      enabled: {
         units: [
            EAGLE_SCOUT,
            EAGLE_WARRIOR,
            ELITE_EAGLE_WARRIOR,
            XOLOTL_WARRIOR,
         ]
      },
      monkPrefix: MONK_PREFIX_MESO,
      unique: [
         JAGUAR_WARRIOR,
         ELITE_JAGUAR_WARRIOR,
         ATLATL,
         GARLAND_WARS
      ]
   },
   Berbers: {
      disabled: {
         buildings: [
            BOMBARD_TOWER,
            KEEP
         ],
         techs: [
            PARTHIAN_TACTICS,
            SHIPWRIGHT,
            SANCTITY,
            BLOCK_PRINTING,
            SAPPERS,
            ARCHITECTURE,
            BOMBARD_TOWER_TECH,
            KEEP_TECH,
            TWO_MAN_SAW
         ],
         units: [
            ARBALESTER,
            HALBERDIER,
            PALADIN,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      enabled: {
         units: [
            GENITOUR,
            ELITE_GENITOUR
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         CAMEL_ARCHER,
         ELITE_CAMEL_ARCHER,
         KASBAH,
         MAGHRABI_CAMELS
      ]
   },
   Britons: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            BLOODLINES,
            REDEMPTION,
            ATONEMENT,
            HERESY,
            BOMBARD_TOWER_TECH,
            TREADMILL_CRANE,
            STONE_SHAFT_MINING,
            CROP_ROTATION
         ],
         units: [
            HAND_CANNONEER,
            HUSSAR,
            PALADIN,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            ELITE_CANNON_GALLEON,
            SIEGE_RAM,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      unique: [
         LONGBOWMAN,
         ELITE_LONGBOWMAN,
         YEOMEN,
         WARWOLF
      ]
   },
   Bulgarians: {
      disabled: {
         buildings: [
            FORTIFIED_WALL,
            BOMBARD_TOWER
         ],
         techs: [
            RING_ARCHER_ARMOR,
            DRY_DOCK,
            SHIPWRIGHT,
            FORTIFIED_WALL_TECH,
            TREADMILL_CRANE,
            ARROWSLITS,
            BOMBARD_TOWER_TECH,
            HOARDINGS,
            SAPPERS,
            ATONEMENT,
            SANCTITY,
            FAITH,
            BLOCK_PRINTING,
            TWO_MAN_SAW,
            GUILDS
         ],
         units: [
            CROSSBOWMAN,
            ARBALESTER,
            HAND_CANNONEER,
            CHAMPION,
            PALADIN,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            BOMBARD_CANNON,
            FAST_FIRE_SHIP,
            HEAVY_DEMO_SHIP,
            ELITE_CANNON_GALLEON
         ]
      },
      enabled: {
         buildings: [
            KREPOST
         ],
         units: [
            KONNIK,
            ELITE_KONNIK
         ]
      },
      unique: [
         KONNIK,
         ELITE_KONNIK,
         STIRRUPS,
         BAGAINS
      ]
   },
   Burgundians: {
      disabled: {
         buildings: [],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            SUPPLIES,
            BLOODLINES,
            RING_ARCHER_ARMOR,
            DRY_DOCK,
            SHIPWRIGHT,
            SIEGE_ENGINEERS,
            HEATED_SHOT,
            THEOCRACY,
            HERESY,
         ],
         units: [
            ARBALESTER,
            HEAVY_CAV_ARCHER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            SIEGE_RAM,
            SIEGE_ONAGER,
            HEAVY_SCORPION,
            HEAVY_DEMO_SHIP,
         ]
      },
      enabled: {
         buildings: [],
         units: [
            FLEMISHPIKEMAN,
         ]
      },
      unique: [
         COUSTILLIER,
         ELITE_COUSTILLIER,
         BURGUNDIAN_VINEYARDS,
         FLEMISH_REVOLUTION,
      ]
   },
   Burmese: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            SHIPWRIGHT,
            HERESY,
            HOARDINGS,
            SAPPERS,
            LEATHER_ARCHER_ARMOR,
            RING_ARCHER_ARMOR,
            BOMBARD_TOWER_TECH,
            ARROWSLITS,
            STONE_SHAFT_MINING
         ],
         units: [
            ARBALESTER,
            HAND_CANNONEER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            FAST_FIRE_SHIP,
            HEAVY_DEMO_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      enabled: {
         units: [
            BATTLE_ELEPHANT,
            ELITE_BATTLE_ELEPHANT
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         ARAMBAI,
         ELITE_ARAMBAI,
         HOWDAH,
         MANIPUR_CAVALRY
      ]
   },
   Byzantines: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            BLOODLINES,
            HERBAL_MEDICINE,
            SAPPERS,
            BLAST_FURNACE,
            MASONRY,
            ARCHITECTURE,
            SIEGE_ENGINEERS,
            HEATED_SHOT,
            TREADMILL_CRANE
         ],
         units: [
            HEAVY_SCORPION,
            SIEGE_ONAGER
         ]
      },
      unique: [
         CATAPHRACT,
         ELITE_CATAPHRACT,
         GREEK_FIRE,
         LOGISTICA
      ]
   },
   Celts: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            SQUIRES,
            BLOODLINES,
            REDEMPTION,
            ILLUMINATION,
            ATONEMENT,
            BLOCK_PRINTING,
            THEOCRACY,
            RING_ARCHER_ARMOR,
            BRACER,
            PLATE_BARDING_ARMOR,
            ARCHITECTURE,
            BOMBARD_TOWER_TECH,
            TWO_MAN_SAW,
            CROP_ROTATION
         ],
         units: [
            ARBALESTER,
            HAND_CANNONEER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            FAST_FIRE_SHIP,
            ELITE_CANNON_GALLEON,
            BOMBARD_CANNON
         ]
      },
      unique: [
         WOAD_RAIDER,
         ELITE_WOAD_RAIDER,
         STRONGHOLD,
         FUROR_CELTICA
      ]
   },
   Chinese: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            HERESY,
            REDEMPTION,
            HOARDINGS,
            SIEGE_ENGINEERS,
            TREADMILL_CRANE,
            GUILDS,
            CROP_ROTATION,
            SUPPLIES,
         ],
         units: [
            HAND_CANNONEER,
            HUSSAR,
            PALADIN,
            FAST_FIRE_SHIP,
            ELITE_CANNON_GALLEON,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         CHU_KO_NU,
         ELITE_CHU_KO_NU,
         GREAT_WALL,
         ROCKETRY
      ]
   },
   Cumans: {
      disabled: {
         buildings: [
            GATE,
            STONE_WALL,
            FORTIFIED_WALL,
            GUARD_TOWER,
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            BRACER,
            DRY_DOCK,
            SHIPWRIGHT,
            FORTIFIED_WALL_TECH,
            GUARD_TOWER_TECH,
            TREADMILL_CRANE,
            ARCHITECTURE,
            SIEGE_ENGINEERS,
            KEEP_TECH,
            ARROWSLITS,
            BOMBARD_TOWER_TECH,
            ILLUMINATION,
            REDEMPTION,
            BLOCK_PRINTING,
            THEOCRACY,
            STONE_SHAFT_MINING,
            HUSBANDRY,
            SUPPLIES,
         ],
         units: [
            ARBALESTER,
            HAND_CANNONEER,
            HEAVY_CAMEL_RIDER,
            HEAVY_SCORPION,
            BOMBARD_CANNON,
            CANNON_GALLEON,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP
         ]
      },
      enabled: {
         units: [
            STEPPE_LANCER,
            ELITE_STEPPE_LANCER
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         KIPCHAK,
         ELITE_KIPCHAK,
         STEPPE_HUSBANDRY,
         CUMAN_MERCENARIES
      ]
   },
   Ethiopians: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            PARTHIAN_TACTICS,
            BLOODLINES,
            REDEMPTION,
            BLOCK_PRINTING,
            HOARDINGS,
            PLATE_BARDING_ARMOR,
            TREADMILL_CRANE,
            ARROWSLITS,
            BOMBARD_TOWER_TECH,
            CROP_ROTATION
         ],
         units: [
            HAND_CANNONEER,
            CHAMPION,
            PALADIN,
            FAST_FIRE_SHIP,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         SHOTEL_WARRIOR,
         ELITE_SHOTEL_WARRIOR,
         ROYAL_HEIRS,
         TORSION_ENGINES
      ]
   },
   Franks: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            BLOODLINES,
            SHIPWRIGHT,
            REDEMPTION,
            ATONEMENT,
            SAPPERS,
            RING_ARCHER_ARMOR,
            BRACER,
            HEATED_SHOT,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            TREADMILL_CRANE,
            STONE_SHAFT_MINING,
            TWO_MAN_SAW,
            GUILDS
         ],
         units: [
            ARBALESTER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            HUSSAR,
            ELITE_CANNON_GALLEON,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      unique: [
         THROWING_AXEMAN,
         ELITE_THROWING_AXEMAN,
         CHIVALRY,
         BEARDED_AXE
      ]
   },
   Goths: {
      disabled: {
         buildings: [
            GUARD_TOWER,
            KEEP,
            BOMBARD_TOWER,
            GATE,
            STONE_WALL,
            FORTIFIED_WALL
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            DRY_DOCK,
            GUARD_TOWER_TECH,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            FORTIFIED_WALL_TECH,
            REDEMPTION,
            ATONEMENT,
            BLOCK_PRINTING,
            HERESY,
            HOARDINGS,
            PLATE_BARDING_ARMOR,
            PLATE_MAIL_ARMOR,
            SIEGE_ENGINEERS,
            TREADMILL_CRANE,
            ARROWSLITS,
            GOLD_SHAFT_MINING,
            SUPPLIES,
            ARSON,
         ],
         units: [
            ARBALESTER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            ELITE_CANNON_GALLEON,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      unique: [
         HUSKARL,
         ELITE_HUSKARL,
         ANARCHY,
         PERFUSION
      ]
   },
   Huns: {
      disabled: {
         buildings: [
            GUARD_TOWER,
            KEEP,
            BOMBARD_TOWER,
            FORTIFIED_WALL,
            HOUSE
         ],
         techs: [
            SHIPWRIGHT,
            GUARD_TOWER_TECH,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            REDEMPTION,
            HERBAL_MEDICINE,
            BLOCK_PRINTING,
            THEOCRACY,
            HOARDINGS,
            RING_ARCHER_ARMOR,
            PLATE_MAIL_ARMOR,
            FORTIFIED_WALL_TECH,
            HEATED_SHOT,
            TREADMILL_CRANE,
            ARCHITECTURE,
            SIEGE_ENGINEERS,
            ARROWSLITS,
            STONE_SHAFT_MINING,
            CROP_ROTATION,
            SUPPLIES,
         ],
         units: [
            ARBALESTER,
            HAND_CANNONEER,
            CHAMPION,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            FAST_FIRE_SHIP,
            CANNON_GALLEON,
            ELITE_CANNON_GALLEON,
            ONAGER,
            SIEGE_ONAGER,
            HEAVY_SCORPION,
            BOMBARD_CANNON
         ]
      },
      unique: [
         TARKAN,
         ELITE_TARKAN,
         MARAUDERS,
         ATHEISM
      ]
   },
   Incas: {
      disableHorses: true,
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            BOMBARD_TOWER_TECH,
            ATONEMENT,
            FERVOR,
            ARCHITECTURE,
            TWO_MAN_SAW
         ],
         units: [
            HAND_CANNONEER,
            CANNON_GALLEON,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      enabled: {
         units: [
            EAGLE_SCOUT,
            EAGLE_WARRIOR,
            ELITE_EAGLE_WARRIOR,
            SLINGER,
            XOLOTL_WARRIOR,
         ]
      },
      monkPrefix: MONK_PREFIX_MESO,
      unique: [
         KAMAYUK,
         ELITE_KAMAYUK,
         ANDEAN_SLING,
         FABRIC_SHIELDS
      ]
   },
   Indians: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            SHIPWRIGHT,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            ATONEMENT,
            HERESY,
            SAPPERS,
            PLATE_MAIL_ARMOR,
            PLATE_BARDING_ARMOR,
            ARCHITECTURE,
            ARROWSLITS,
            TREADMILL_CRANE,
            CROP_ROTATION
         ],
         units: [
            ARBALESTER,
            KNIGHT,
            CAVALIER,
            PALADIN,
            FAST_FIRE_SHIP,
            HEAVY_SCORPION,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      enabled: {
         units: [
            IMPERIAL_CAMEL_RIDER
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         ELEPHANT_ARCHER,
         ELITE_ELEPHANT_ARCHER,
         SULTANS,
         SHATAGNI
      ]
   },
   Italians: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            HERESY,
            SAPPERS,
            SIEGE_ENGINEERS,
            GOLD_SHAFT_MINING
         ],
         units: [
            HEAVY_CAV_ARCHER,
            HALBERDIER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            HEAVY_DEMO_SHIP,
            HEAVY_SCORPION,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      enabled: {
         units: [
            CONDOTTIERO
         ]
      },
      unique: [
         GENOESE_CROSSBOWMAN,
         ELITE_GENOESE_CROSSBOWMAN,
         PAVISE,
         SILK_ROAD
      ]
   },
   Japanese: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            BOMBARD_TOWER_TECH,
            HERESY,
            HOARDINGS,
            SAPPERS,
            PLATE_BARDING_ARMOR,
            ARCHITECTURE,
            HEATED_SHOT,
            STONE_SHAFT_MINING,
            GUILDS,
            CROP_ROTATION
         ],
         units: [
            HUSSAR,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            HEAVY_DEMO_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         SAMURAI,
         ELITE_SAMURAI,
         YASAMA,
         KATAPARUTO
      ]
   },
   Khmer: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            SQUIRES,
            BOMBARD_TOWER_TECH,
            ATONEMENT,
            HERESY,
            BLOCK_PRINTING,
            SHIPWRIGHT,
            PLATE_MAIL_ARMOR,
            ARROWSLITS,
            TREADMILL_CRANE,
            TWO_MAN_SAW,
            GUILDS,
            SUPPLIES,
         ],
         units: [
            CHAMPION,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            HEAVY_DEMO_SHIP,
            SIEGE_ONAGER,
            BOMBARD_CANNON,
         ]
      },
      enabled: {
         units: [
            BATTLE_ELEPHANT,
            ELITE_BATTLE_ELEPHANT
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         BALLISTA_ELEPHANT,
         ELITE_BALLISTA_ELEPHANT,
         TUSK_SWORDS,
         DOUBLE_CROSSBOW
      ]
   },
   Koreans: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            BLOODLINES,
            REDEMPTION,
            ATONEMENT,
            HERESY,
            ILLUMINATION,
            HOARDINGS,
            SAPPERS,
            BLAST_FURNACE,
            PLATE_BARDING_ARMOR,
            CROP_ROTATION
         ],
         units: [
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            DEMOLITION_RAFT,
            DEMOLITION_SHIP,
            HEAVY_DEMO_SHIP,
            SIEGE_RAM,
            HEAVY_SCORPION
         ]
      },
      enabled: {
         units: [
            TURTLE_SHIP,
            ELITE_TURTLE_SHIP
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         WAR_WAGON,
         ELITE_WAR_WAGON,
         PANOKSEON,
         SHINKICHON
      ]
   },
   Lithuanians: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            PLATE_MAIL_ARMOR,
            SHIPWRIGHT,
            SIEGE_ENGINEERS,
            ARROWSLITS,
            SAPPERS,
            GOLD_SHAFT_MINING,
            SUPPLIES,
         ],
         units: [
            ARBALESTER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            SIEGE_RAM,
            SIEGE_ONAGER,
            HEAVY_SCORPION,
            HEAVY_DEMO_SHIP
         ]
      },
      unique: [
         LEITIS,
         ELITE_LEITIS,
         HILL_FORTS,
         TOWER_SHIELDS
      ]
   },
   Magyars: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER,
            FORTIFIED_WALL
         ],
         techs: [
            SQUIRES,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            FORTIFIED_WALL_TECH,
            REDEMPTION,
            ATONEMENT,
            FAITH,
            PLATE_MAIL_ARMOR,
            ARCHITECTURE,
            ARROWSLITS,
            STONE_SHAFT_MINING,
            GUILDS
         ],
         units: [
            HAND_CANNONEER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      unique: [
         MAGYAR_HUSZAR,
         ELITE_MAGYAR_HUSZAR,
         CORVINIAN_ARMY,
         RECURVE_BOW
      ]
   },
   Malay: {
      disabled: {
         buildings: [
            FORTIFIED_WALL
         ],
         techs: [
            PARTHIAN_TACTICS,
            BLOODLINES,
            FORTIFIED_WALL_TECH,
            FERVOR,
            THEOCRACY,
            HOARDINGS,
            CHAIN_BARDING_ARMOR,
            PLATE_BARDING_ARMOR,
            ARCHITECTURE,
            ARROWSLITS,
            TREADMILL_CRANE,
            TWO_MAN_SAW
         ],
         units: [
            HAND_CANNONEER,
            HEAVY_CAV_ARCHER,
            CHAMPION,
            HUSSAR,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            HEAVY_DEMO_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER
         ]
      },
      enabled: {
         units: [
            BATTLE_ELEPHANT,
            ELITE_BATTLE_ELEPHANT
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         KARAMBIT_WARRIOR,
         ELITE_KARAMBIT_WARRIOR,
         THALASSOCRACY,
         FORCED_LEVY
      ]
   },
   Malians: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            PARTHIAN_TACTICS,
            SHIPWRIGHT,
            BOMBARD_TOWER_TECH,
            BRACER,
            ILLUMINATION,
            BLAST_FURNACE,
            SIEGE_ENGINEERS,
            ARROWSLITS,
            TWO_MAN_SAW
         ],
         units: [
            HALBERDIER,
            HUSSAR,
            PALADIN,
            GALLEON,
            ELITE_CANNON_GALLEON,
            SIEGE_RAM,
            HEAVY_SCORPION
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         GBETO,
         ELITE_GBETO,
         TIGUI,
         FARIMBA
      ]
   },
   Mayans: {
      disableHorses: true,
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            BOMBARD_TOWER_TECH,
            REDEMPTION,
            ILLUMINATION,
            SIEGE_ENGINEERS,
            ARROWSLITS,
            GOLD_SHAFT_MINING,
            SUPPLIES,
         ],
         units: [
            HAND_CANNONEER,
            CHAMPION,
            CANNON_GALLEON,
            ELITE_CANNON_GALLEON,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      enabled: {
         units: [
            EAGLE_SCOUT,
            EAGLE_WARRIOR,
            ELITE_EAGLE_WARRIOR,
            XOLOTL_WARRIOR,
         ]
      },
      monkPrefix: MONK_PREFIX_MESO,
      unique: [
         PLUMED_ARCHER,
         ELITE_PLUMED_ARCHER,
         OBSIDIAN_ARROWS,
         EL_DORADO
      ]
   },
   Mongols: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            DRY_DOCK,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            REDEMPTION,
            ILLUMINATION,
            SANCTITY,
            BLOCK_PRINTING,
            THEOCRACY,
            RING_ARCHER_ARMOR,
            PLATE_BARDING_ARMOR,
            ARCHITECTURE,
            HEATED_SHOT,
            TREADMILL_CRANE,
            ARROWSLITS,
            TWO_MAN_SAW,
            GUILDS,
            CROP_ROTATION,
            SUPPLIES,
         ],
         units: [
            HAND_CANNONEER,
            HALBERDIER,
            PALADIN,
            ELITE_CANNON_GALLEON,
            BOMBARD_CANNON
         ]
      },
      enabled: {
         units: [
            STEPPE_LANCER,
            ELITE_STEPPE_LANCER
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         MANGUDAI,
         ELITE_MANGUDAI,
         NOMADS,
         DRILL
      ]
   },
   Persians: {
      disabled: {
         buildings: [
            FORTIFIED_WALL,
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            SHIPWRIGHT,
            FORTIFIED_WALL_TECH,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            REDEMPTION,
            ILLUMINATION,
            ATONEMENT,
            HERESY,
            SANCTITY,
            BRACER,
            SIEGE_ENGINEERS,
            ARROWSLITS,
            TREADMILL_CRANE
         ],
         units: [
            ARBALESTER,
            TWO_HANDED_SWORDSMAN,
            CHAMPION,
            SIEGE_ONAGER
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         WAR_ELEPHANT,
         ELITE_WAR_ELEPHANT,
         KAMANDARAN,
         MAHOUTS
      ]
   },
   Portuguese: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            SQUIRES,
            SHIPWRIGHT,
            ILLUMINATION,
            HOARDINGS,
            ARROWSLITS,
            GOLD_SHAFT_MINING
         ],
         units: [
            HEAVY_CAV_ARCHER,
            HUSSAR,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            FAST_FIRE_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER,
            HEAVY_SCORPION
         ]
      },
      enabled: {
         buildings: [
            FEITORIA
         ],
         units: [
            CARAVEL,
            ELITE_CARAVEL
         ]
      },
      unique: [
         ORGAN_GUN,
         ELITE_ORGAN_GUN,
         CARRACK,
         ARQUEBUS
      ]
   },
   Saracens: {
      disabled: {
         buildings: [
            BOMBARD_TOWER
         ],
         techs: [
            SHIPWRIGHT,
            BOMBARD_TOWER_TECH,
            SAPPERS,
            ARCHITECTURE,
            HEATED_SHOT,
            STONE_SHAFT_MINING,
            GUILDS,
            CROP_ROTATION
         ],
         units: [
            HALBERDIER,
            CAVALIER,
            PALADIN,
            FAST_FIRE_SHIP,
            HEAVY_SCORPION
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         MAMELUKE,
         ELITE_MAMELUKE,
         MADRASAH,
         ZEALOTRY
      ]
   },
   Sicilians: {
      disabled: {
         buildings: [
            FORTIFIED_WALL,
            WATCH_TOWER,
            GUARD_TOWER,
            KEEP,
            BOMBARD_TOWER,
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            RING_ARCHER_ARMOR,
            ARCHITECTURE,
            FORTIFIED_WALL_TECH,
            BOMBARD_TOWER_TECH,
            GUARD_TOWER_TECH,
            KEEP_TECH,
            REDEMPTION,
            ATONEMENT,
            BLOCK_PRINTING,
            THEOCRACY,
            HERESY,
            TWO_MAN_SAW,
         ],
         units: [
            HAND_CANNONEER,
            HEAVY_CAV_ARCHER,
            HUSSAR,
            PALADIN,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            SIEGE_ONAGER,
            BOMBARD_CANNON,
            ELITE_CANNON_GALLEON,
         ]
      },
      enabled: {
         buildings: [
            DONJON,
         ],
         units: [
            DSERJEANT,
            ELITE_DSERJEANT,
         ]
      },
      unique: [
         SERJEANT,
         ELITE_SERJEANT,
         FIRST_CRUSADE,
         SCUTAGE,
      ]
   },
   Slavs: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            SHIPWRIGHT,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            HERESY,
            BRACER,
            ARCHITECTURE,
            ARROWSLITS,
            HEATED_SHOT,
            TREADMILL_CRANE,
            STONE_SHAFT_MINING,
            GUILDS
         ],
         units: [
            ARBALESTER,
            HAND_CANNONEER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            ELITE_CANNON_GALLEON,
            HEAVY_DEMO_SHIP,
            BOMBARD_CANNON
         ]
      },
      unique: [
         BOYAR,
         ELITE_BOYAR,
         ORTHODOXY,
         DRUZHINA
      ]
   },
   Spanish: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            SIEGE_ENGINEERS,
            HEATED_SHOT,
            TREADMILL_CRANE,
            GOLD_SHAFT_MINING,
            CROP_ROTATION
         ],
         units: [
            CROSSBOWMAN,
            ARBALESTER,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            SIEGE_ONAGER,
            HEAVY_SCORPION
         ]
      },
      enabled: {
         units: [
            MISSIONARY
         ]
      },
      unique: [
         CONQUISTADOR,
         ELITE_CONQUISTADOR,
         INQUISITION,
         SUPREMACY
      ]
   },
   Tatars: {
      disabled: {
         buildings: [
            KEEP
         ],
         techs: [
            CHAIN_MAIL_ARMOR,
            PLATE_MAIL_ARMOR,
            SHIPWRIGHT,
            ARCHITECTURE,
            KEEP_TECH,
            ARROWSLITS,
            HOARDINGS,
            REDEMPTION,
            HERESY,
            SANCTITY,
            FAITH,
            THEOCRACY,
            STONE_SHAFT_MINING,
            TWO_MAN_SAW,
            SUPPLIES,
         ],
         units: [
            ARBALESTER,
            CHAMPION,
            PALADIN,
            SIEGE_ONAGER,
            BOMBARD_CANNON,
            HEAVY_DEMO_SHIP
         ]
      },
      enabled: {
         units: [
            STEPPE_LANCER,
            ELITE_STEPPE_LANCER,
            FLAMING_CAMEL,
         ]
      },
      unique: [
         KESHIK,
         ELITE_KESHIK,
         SILK_ARMOR,
         TIMURID_SIEGECRAFT
      ]
   },
   Teutons: {
      disabled: {
         techs: [
            THUMB_RING,
            PARTHIAN_TACTICS,
            HUSBANDRY,
            DRY_DOCK,
            SHIPWRIGHT,
            BRACER,
            ARCHITECTURE,
            GOLD_SHAFT_MINING
         ],
         units: [
            ARBALESTER,
            HEAVY_CAV_ARCHER,
            LIGHT_CAVALRY,
            HUSSAR,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            ELITE_CANNON_GALLEON,
            SIEGE_RAM
         ]
      },
      unique: [
         TEUTONIC_KNIGHT,
         ELITE_TEUTONIC_KNIGHT,
         IRONCLAD,
         CRENELLATIONS
      ]
   },
   Turks: {
      disabled: {
         techs: [
            HERBAL_MEDICINE,
            ILLUMINATION,
            BLOCK_PRINTING,
            STONE_SHAFT_MINING,
            CROP_ROTATION,
            SIEGE_ENGINEERS
         ],
         units: [
            ARBALESTER,
            ELITE_SKIRMISHER,
            PIKEMAN,
            HALBERDIER,
            PALADIN,
            FAST_FIRE_SHIP,
            ONAGER,
            SIEGE_ONAGER
         ]
      },
      monkPrefix: MONK_PREFIX_AFRICAN,
      unique: [
         JANISSARY,
         ELITE_JANISSARY,
         SIPAHI,
         ARTILLERY
      ]
   },
   Vietnamese: {
      disabled: {
         techs: [
            PARTHIAN_TACTICS,
            SHIPWRIGHT,
            REDEMPTION,
            HERESY,
            FERVOR,
            BLAST_FURNACE,
            MASONRY,
            ARCHITECTURE,
            GOLD_SHAFT_MINING
         ],
         units: [
            HAND_CANNONEER,
            HUSSAR,
            PALADIN,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            FAST_FIRE_SHIP,
            SIEGE_RAM,
            SIEGE_ONAGER,
            HEAVY_SCORPION
         ]
      },
      enabled: {
         units: [
            BATTLE_ELEPHANT,
            ELITE_BATTLE_ELEPHANT,
            IMPERIAL_SKIRMISHER
         ]
      },
      monkPrefix: MONK_PREFIX_ASIAN,
      unique: [
         RATTAN_ARCHER,
         ELITE_RATTAN_ARCHER,
         CHATRAS,
         PAPER_MONEY
      ]
   },
   Vikings: {
      disabled: {
         buildings: [
            KEEP,
            BOMBARD_TOWER
         ],
         techs: [
            PARTHIAN_TACTICS,
            BLOODLINES,
            HUSBANDRY,
            SHIPWRIGHT,
            KEEP_TECH,
            BOMBARD_TOWER_TECH,
            REDEMPTION,
            HERBAL_MEDICINE,
            SANCTITY,
            ILLUMINATION,
            THEOCRACY,
            PLATE_BARDING_ARMOR,
            STONE_SHAFT_MINING,
            GUILDS
         ],
         units: [
            HAND_CANNONEER,
            HEAVY_CAV_ARCHER,
            HALBERDIER,
            HUSSAR,
            CAMEL_RIDER,
            HEAVY_CAMEL_RIDER,
            PALADIN,
            FIRE_GALLEY,
            FIRE_SHIP,
            FAST_FIRE_SHIP,
            SIEGE_ONAGER,
            BOMBARD_CANNON
         ]
      },
      enabled: {
         units: [
            LONGBOAT,
            ELITE_LONGBOAT
         ]
      },
      unique: [
         BERSERK,
         ELITE_BERSERK,
         CHIEFTAINS,
         BERSERKERGANG
      ]
   }
};
