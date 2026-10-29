// Item types of the aoe4world explorer dataset, copied from github.com/aoe4world/data
// src/types/items.ts (MIT, Copyright (c) aoe4world). Keep in sync with that file rather than
// editing the shapes here; the data is produced by their parser.

/** aoe4world's civ abbreviation, e.g. "ab", "hr", "zx". See aoe4CivByAbbr for the app's enum. */
export type CivAbbr = string;
export type ItemSlug = string;

export type ItemClass =
  | "light"
  | "heavy"
  | "infantry"
  | "cavalry"
  | "ship"
  | "archer"
  | "springald"
  | "attack"
  | "incendiary"
  | "warship"
  | "ranged"
  | "siege"
  | "melee"
  | "fire"
  | "religious"
  | "gunpowder"
  | "structure"
  | "building"
  | "transport"
  | "support"
  | "wall"
  | "tower"
  | "gate"
  | "landmark"
  | "wonder"
  | "military"
  | "technology"
  | "hunt"
  | "defensive"
  | "worker"
  | string;

export interface Item {
  id: ItemId;
  baseId: ItemId;
  type: "unit" | "building" | "technology" | "upgrade" | "ability";
  civs: CivAbbr[];
  classes: ItemClass[];
  displayClasses: string[];

  name: string;
  age: number;

  description: string;
  icon_src?: string;
  icon?: string;

  unique: boolean;

  producedBy: string[];

  costs: {
    food: number;
    wood: number;
    gold: number;
    stone: number;
    oliveoil?: number;
    silver?: number;
    vizier?: number;
    time: number;
    popcap?: number;
    total: number;
  };

  pbgid?: number;
  attribName?: string;
}

export interface PhysicalItem extends Item {
  weapons: Weapon[];
  armor: Armor[];
  resistance: Resistance[];

  hitpoints: number;

  sight: {
    inner_height: number;
    inner_radius: number;
    outer_height: number;
    outer_radius: number;
    base: number;
    line: number;
    height: number;
  };

  garrison?: {
    capacity: number;
    classes: string[];
  };

  unlockedBy?: ItemSlug[];
}

export interface Unit extends PhysicalItem {
  type: "unit";
  movement: {
    speed: number;
  };
}

// Todo, may add material properties, units/objects that can be garrisoned, etc.
export interface Building extends PhysicalItem {
  type: "building";
  influences?: string[];
  popcapIncrease?: number;
}

export interface Technology extends Item {
  type: "technology";
  effects?: Modifier[];
}

export interface Upgrade extends Item {
  type: "upgrade";
  unlocks: ItemId;
}

export interface Weapon {
  name?: string;
  id?: ItemId;
  type: "melee" | "charge" | "ranged" | "siege" | "fire";
  damage: number;
  speed: number;
  modifiers?: Modifier[];
  range?: {
    min: number;
    max: number;
  };
  durations?: Record<string, number>;
  burst?: { count: number };
  attribName?: string;
  pbgid?: number;
}

export interface Ability extends Item {
  type: "ability";
  active?: "always" | "manual" | "toggle";
  auraRange?: number;
  cooldown?: number;
  toggleGroup?: string;
  effects?: Modifier[];
  unlockedBy?: ItemSlug[];
  activatedOn?: ItemSlug[];
}

export type Selector = { class?: ItemClass[][]; id?: ItemId[] };

export type Modifier = {
  property: ModifyableProperty;
  target?: Selector;
  select?: Selector;
  effect: "multiply" | "change";
  value: number;
  type: "passive" | "ability" | "influence" | "bonus";
  duration?: number;
};

export type Armor = {
  type: "melee" | "ranged" | "fire";
  value: number;
};

export type Resistance = {
  type: "melee" | "ranged" | "fire";
  value: number;
};
export type ItemId = string;

export type ItemType = Building | Unit | Technology | Upgrade | Ability;

export type ModifyableProperty =
  | "unknown" // Complex effects not easily incoded in buffed stats
  | "burst"
  | "hitpoints"
  | "meleeArmor"
  | "rangedArmor"
  | "fireArmor"
  | "meleeResistance"
  | "rangedResistance"
  | "meleeAttack"
  | "rangedAttack"
  | "siegeAttack"
  | "fireAttack"
  | "moveSpeed"
  | "attackSpeed"
  | "minRange"
  | "maxRange"
  | "heightOfSight"
  | "lineOfSight"
  | "carryCapacity"
  | "huntGatherRate"
  | "huntCarryCapacity"
  | "foodCost"
  | "foodGatherRate"
  | "goldCost"
  | "goldGatherRate"
  | "goldGeneration"
  | "stoneCost"
  | "stoneGatherRate"
  | "woodCost"
  | "woodGatherRate"
  | "berryGatherRate"
  | "farmGatherRate"
  | "populationCost"
  | "healingRate"
  | "repairRate"
  | "maxPopulation"
  | "buildTime"
  | "productionSpeed"
  | "researchSpeed"
  | "areaOfEffect";

export interface UnifiedItem<T extends Item = Item> {
  id: ItemId;
  name: string;
  civs: CivAbbr[];
  unique: boolean;
  variations: T[];
  type: T["type"];
  minAge: number;
  classes: ItemClass[];
  displayClasses: string[];
  icon?: string;
  description?: string;
}

export enum ITEMS {
  UNITS = "units",
  BUILDINGS = "buildings",
  TECHNOLOGIES = "technologies",
  UPGRADES = "upgrades",
}

export type ItemTypes = {
  [ITEMS.UNITS]: Unit;
  [ITEMS.TECHNOLOGIES]: Technology;
  [ITEMS.BUILDINGS]: Building;
  [ITEMS.UPGRADES]: Upgrade;
};

/**
 * The published files are aoe4world's `all-optimized.json`: values shared by every variation of
 * an age are hoisted onto the item (and into `shared`, keyed `<id>-<age>`) and left out of the
 * variation. optimizedToUnified (theirs, src/lib/utils/items.ts) merges them back.
 */
export type OptimizedItem<T extends Item> = UnifiedItem<T> & {
  shared: Record<string, Partial<T>>;
  variations: Partial<T>[];
};

export interface ExplorerFile<T extends Item> {
  __note__?: string;
  __version__?: string;
  data: OptimizedItem<T>[];
}

export function optimizedToUnified<T extends Item>(items: OptimizedItem<T>[]): UnifiedItem<T>[] {
  return items.map((item) => {
    const variations = item.variations.map(
      (variation) => Object.assign({}, item, item.shared?.[variation.id as string], variation, { shared: undefined, variations: undefined }) as unknown as T
    );
    return { ...item, variations };
  });
}

/** aoe4world civ abbreviation -> the app's aoe4 Civ enum value (dataset2/src/data/aoe4/civs.data.ts). */
export const aoe4CivByAbbr: Record<CivAbbr, string> = {
  ab: 'AbbasidDynasty',
  ay: 'Ayyubids',
  by: 'Byzantines',
  ch: 'Chinese',
  de: 'DelhiSultanate',
  en: 'English',
  fr: 'French',
  gol: 'GoldenHorde',
  hr: 'HolyRomanEmpire',
  hl: 'HouseOfLancaster',
  ja: 'Japanese',
  je: 'JeanneDArc',
  jin: 'JinDynasty',
  kt: 'KnightsTemplar',
  mac: 'MacedonianDynasty',
  ma: 'Malians',
  mo: 'Mongols',
  od: 'OrderOfTheDragon',
  ot: 'Ottomans',
  ru: 'Rus',
  sco: 'Scots',
  sen: 'SengokuDaimyo',
  tug: 'TughlaqDynasty',
  vik: 'Vikings',
  zx: 'ZhuXiSLegacy',
};
