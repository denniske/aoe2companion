export interface IBuildOrderBuilding {
    type: string;
    count: number;
}

export interface IBuildOrderResources {
    wood: number;
    build: number;
    stone: number;
    gold: number;
    food: number;
}

export interface IBuildOrderStep {
    buildings?: IBuildOrderBuilding[];
    type: string;
    task?: string;
    resources: IBuildOrderResources;
    count?: any;
    tech?: string[];
    age?: string;
    to?: string;
    from?: string;
    unit?: string;
}

export const fakeBuild: IBuildOrderStep[] = [{
    "buildings": [{"type": "house", "count": 2}],
    "type": "newVillagers",
    "task": "sheep",
    "resources": {"wood": 0, "build": 0, "stone": 0, "gold": 0, "food": 6},
    "count": 6
}, {
    "type": "newVillagers",
    "count": 4,
    "resources": {"gold": 0, "stone": 0, "wood": 4, "food": 6, "build": 0},
    "task": "wood"
}, {
    "task": "boar",
    "count": 1,
    "resources": {"stone": 0, "food": 7, "gold": 0, "wood": 4, "build": 0},
    "type": "newVillagers"
}, {
    "count": 3,
    "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
    "resources": {"food": 10, "build": 0, "stone": 0, "gold": 0, "wood": 4},
    "task": "berries",
    "type": "newVillagers"
}, {
    "resources": {"gold": 0, "stone": 0, "wood": 4, "food": 11, "build": 0},
    "task": "boar",
    "count": 1,
    "type": "newVillagers"
}, {
    "count": 1,
    "resources": {"food": 12, "gold": 0, "stone": 0, "build": 0, "wood": 4},
    "type": "newVillagers",
    "task": "berries"
}, {
    "task": "sheep",
    "resources": {"gold": 0, "wood": 4, "stone": 0, "food": 14, "build": 0},
    "count": 2,
    "type": "newVillagers"
}, {
    "task": "wood",
    "count": 3,
    "type": "newVillagers",
    "resources": {"stone": 0, "gold": 0, "wood": 7, "build": 0, "food": 14}
}, {
    "tech": ["loom"],
    "type": "research",
    "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 7, "food": 14}
}, {
    "age": "feudalAge",
    "type": "ageUp",
    "resources": {"wood": 7, "stone": 0, "food": 14, "gold": 0, "build": 0}
}, {
    "count": 3,
    "to": "wood",
    "from": "sheep",
    "type": "moveVillagers",
    "resources": {"build": 0, "gold": 0, "stone": 0, "food": 11, "wood": 10}
}, {
    "resources": {"build": 0, "stone": 0, "gold": 3, "wood": 10, "food": 8},
    "to": "gold",
    "from": "sheep",
    "count": 3,
    "type": "moveVillagers"
}, {
    "type": "build",
    "resources": {"gold": 3, "build": 0, "wood": 10, "food": 8, "stone": 0},
    "buildings": [{"type": "barracks", "count": 1}]
}, {
    "resources": {"gold": 3, "wood": 10, "build": 0, "stone": 0, "food": 8},
    "type": "newAge",
    "age": "feudalAge"
}, {
    "type": "research",
    "tech": ["doubleBitAxe"],
    "resources": {"build": 0, "stone": 0, "gold": 3, "wood": 10, "food": 8}
}, {
    "count": 4,
    "type": "newVillagers",
    "resources": {"build": 0, "wood": 10, "food": 8, "stone": 0, "gold": 7},
    "buildings": [{"type": "archeryRange", "count": 2}],
    "task": "gold"
}, {
    "unit": "archer",
    "resources": {"build": 0, "gold": 7, "stone": 0, "food": 8, "wood": 10},
    "count": "∞",
    "type": "trainUnit"
}, {
    "resources": {"gold": 7, "stone": 0, "food": 8, "wood": 10, "build": 0},
    "buildings": [{"type": "blacksmith", "count": 1}],
    "type": "build"
}, {
    "tech": ["fletching"],
    "resources": {"stone": 0, "food": 8, "build": 0, "gold": 7, "wood": 10},
    "type": "research"
}, {
    "task": "farm",
    "type": "newVillagers",
    "count": 10,
    "resources": {"gold": 7, "build": 0, "food": 18, "stone": 0, "wood": 10}
}, {
    "task": "gold",
    "resources": {"wood": 10, "food": 18, "stone": 0, "gold": 8, "build": 0},
    "count": 1,
    "type": "newVillagers"
}, {
    "resources": {"food": 18, "gold": 8, "wood": 10, "build": 0, "stone": 0},
    "tech": ["wheelbarrow"],
    "type": "research"
}, {
    "resources": {"gold": 8, "build": 0, "wood": 10, "stone": 0, "food": 18},
    "type": "ageUp",
    "age": "castleAge"
}, {
    "resources": {"food": 18, "gold": 8, "wood": 10, "stone": 0, "build": 0},
    "tech": ["horseCollar", "paddedArcherArmor", "goldMining"],
    "type": "research"
}, {
    "age": "castleAge", "type": "newAge", "resources":
        {"wood": 10, "gold": 8, "stone": 0, "food": 18, "build": 0}
}, {
    "type": "research",
    "resources": {"stone": 0, "build": 0, "food": 18, "gold": 8, "wood": 10},
    "tech": ["crossbowman", "bodkinArrow", "bowSaw"]
}];
