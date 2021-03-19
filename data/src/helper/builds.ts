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


export const fakeBuilds = [{
    "image": "Fire Galley",
    "description": "A build for hybrid maps like Costal, Continental, Highland, Rivers, Scandinavia, etc. that is more focused on land than on water. In this build order, we start off with a dock in Dark age to make use of the fish, and then we quickly transition into a more land approch in Feudal age. The best civs for this are Japanese, Malians, Mayans, or Mongols. Other top civs for this build order and hybrid maps are Huns, Byzantines, or Koreans.",
    "attributes": ["water", "fastFeudal"],
    "readyForPublish": true,
    "reference": "https://www.youtube.com/watch?v=IgYGPZG4ECw",
    "author": "Hera",
    "difficulty": 3,
    "build": [{
        "count": 6,
        "resources": {"wood": 0, "food": 6, "gold": 0, "build": 0, "stone": 0},
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 0, "wood": 4, "food": 6, "gold": 0},
        "count": 4,
        "task": "wood"
    }, {
        "resources": {"wood": 4, "gold": 0, "stone": 0, "build": 0, "food": 7},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "resources": {"gold": 0, "stone": 0, "food": 7, "build": 1, "wood": 4},
        "count": 1,
        "buildings": [{"count": 2, "type": "house"}, {"type": "dock", "count": 1}],
        "task": "build",
        "type": "newVillagers"
    }, {
        "type": "trainUnit",
        "count": 4,
        "resources": {"wood": 4, "stone": 0, "build": 1, "gold": 0, "food": 7},
        "unit": "fishingShip"
    }, {
        "type": "moveVillagers",
        "to": "sheep",
        "count": 1,
        "from": "build",
        "resources": {"food": 8, "gold": 0, "stone": 0, "build": 0, "wood": 4}
    }, {
        "type": "newVillagers",
        "count": 2,
        "task": "wood",
        "resources": {"gold": 0, "food": 8, "build": 0, "wood": 6, "stone": 0}
    }, {
        "count": 1,
        "animal": "boar",
        "type": "lure",
        "resources": {"stone": 0, "food": 8, "gold": 0, "build": 0, "wood": 6}
    }, {
        "resources": {"build": 0, "food": 15, "gold": 0, "wood": 6, "stone": 0},
        "type": "newVillagers",
        "count": 7,
        "task": "sheep"
    }, {
        "resources": {"food": 15, "build": 0, "stone": 0, "gold": 0, "wood": 6},
        "tech": ["loom"],
        "type": "research"
    }, {
        "resources": {"stone": 0, "gold": 0, "wood": 6, "food": 15, "build": 0},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "from": "sheep",
        "to": "wood",
        "resources": {"wood": 17, "stone": 0, "food": 4, "build": 0, "gold": 0},
        "count": 11,
        "type": "moveVillagers"
    }, {
        "type": "moveVillagers",
        "to": "gold",
        "count": 4,
        "from": "sheep",
        "resources": {"gold": 4, "food": 0, "wood": 17, "build": 0, "stone": 0}
    }, {
        "type": "build",
        "resources": {"food": 0, "gold": 4, "stone": 0, "build": 0, "wood": 17},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "resources": {"build": 0, "gold": 4, "wood": 17, "food": 0, "stone": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "count": 3,
        "buildings": [{"count": 2, "type": "archeryRange"}],
        "resources": {"gold": 7, "build": 0, "wood": 17, "food": 0, "stone": 0},
        "task": "gold",
        "type": "newVillagers"
    }, {
        "type": "research",
        "resources": {"stone": 0, "food": 0, "wood": 17, "gold": 7, "build": 0},
        "tech": ["doubleBitAxe"]
    }, {
        "count": 2,
        "unit": "fireGalley",
        "resources": {"gold": 7, "food": 0, "wood": 17, "build": 0, "stone": 0},
        "type": "trainUnit"
    }, {
        "count": 4,
        "buildings": [{"type": "mill", "count": 1}],
        "resources": {"build": 0, "food": 4, "gold": 7, "wood": 17, "stone": 0},
        "type": "newVillagers",
        "task": "berries"
    }, {
        "type": "newVillagers",
        "count": 7,
        "resources": {"stone": 0, "gold": 7, "food": 11, "wood": 17, "build": 0},
        "task": "farm"
    }, {
        "to": "farm",
        "from": "wood",
        "count": 6,
        "resources": {"build": 0, "stone": 0, "wood": 11, "food": 17, "gold": 7},
        "type": "moveVillagers"
    }, {
        "type": "research",
        "tech": ["wheelbarrow"],
        "resources": {"gold": 7, "stone": 0, "wood": 11, "food": 17, "build": 0}
    }, {
        "resources": {"food": 17, "gold": 7, "stone": 0, "wood": 11, "build": 0},
        "type": "ageUp",
        "age": "castleAge"
    }, {
        "type": "research",
        "resources": {"stone": 0, "build": 0, "gold": 7, "food": 17, "wood": 11},
        "tech": ["horseCollar", "goldMining"]
    }, {
        "tech": ["paddedArcherArmor"],
        "resources": {"stone": 0, "wood": 11, "gold": 7, "food": 17, "build": 0},
        "type": "research"
    }],
    "uptime": {"feudalAge": "10:05", "castleAge": "18:35"},
    "civilization": "Generic",
    "id": 18,
    "title": "1 Dock + 2 Ranges",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFire%20Galley.png?alt=media&token=dc30b27a-50bf-46c3-ab88-14b8c61c9a8f",
    "pop": {"castleAge": 14, "feudalAge": 22}
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7",
    "civilization": "Generic",
    "uptime": {"castleAge": "19:00", "feudalAge": "10:05"},
    "description": "Going for archers in Feudal Age is one of the easiest builds, yet it’s very powerful. This build gets you to two ranges working faster than Cicero's Archers build with only 22 pop before clicking up to Feudal but delays Horse Collar in return. When reaching the Castle Age you can go for 2 TCs or a university and fast ballistics.",
    "attributes": ["fastFeudal"],
    "image": "Archer",
    "author": "Hera",
    "id": 4,
    "readyForPublish": true,
    "pop": {"castleAge": 15, "feudalAge": 22},
    "title": "Archers",
    "reference": "https://www.reddit.com/r/aoe2/comments/juuw7y/hera_build_order_straight_archers_with_new/",
    "build": [{
        "task": "sheep",
        "count": 6,
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "resources": {"stone": 0, "gold": 0, "build": 0, "food": 6, "wood": 0}
    }, {
        "task": "wood",
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 0, "food": 6},
        "count": 4,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 1,
        "task": "boar",
        "resources": {"wood": 4, "build": 0, "stone": 0, "gold": 0, "food": 7}
    }, {
        "task": "berries",
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "count": 3,
        "resources": {"stone": 0, "gold": 0, "wood": 4, "build": 0, "food": 10},
        "type": "newVillagers"
    }, {
        "resources": {"gold": 0, "build": 0, "food": 11, "wood": 4, "stone": 0},
        "type": "newVillagers",
        "count": 1,
        "task": "boar"
    }, {
        "resources": {"wood": 4, "food": 12, "stone": 0, "build": 0, "gold": 0},
        "task": "berries",
        "count": 1,
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "stone": 0, "build": 0, "gold": 0, "food": 14},
        "count": 2,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "task": "wood",
        "count": 3,
        "resources": {"food": 14, "build": 0, "gold": 0, "stone": 0, "wood": 7},
        "type": "newVillagers"
    }, {
        "resources": {"stone": 0, "build": 0, "gold": 0, "food": 14, "wood": 7},
        "type": "research",
        "tech": ["loom"]
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"food": 14, "wood": 7, "stone": 0, "build": 0, "gold": 0}
    }, {
        "resources": {"food": 11, "gold": 0, "wood": 10, "build": 0, "stone": 0},
        "type": "moveVillagers",
        "to": "wood",
        "from": "sheep",
        "count": 3
    }, {
        "type": "moveVillagers",
        "to": "gold",
        "from": "sheep",
        "count": 3,
        "resources": {"gold": 3, "food": 8, "wood": 10, "stone": 0, "build": 0}
    }, {
        "resources": {"wood": 10, "food": 8, "build": 0, "gold": 3, "stone": 0},
        "type": "build",
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"build": 0, "wood": 10, "food": 8, "stone": 0, "gold": 3}
    }, {
        "type": "research",
        "resources": {"build": 0, "wood": 10, "gold": 3, "stone": 0, "food": 8},
        "tech": ["doubleBitAxe"]
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 4,
        "buildings": [{"count": 2, "type": "archeryRange"}],
        "resources": {"stone": 0, "build": 0, "gold": 7, "wood": 10, "food": 8}
    }, {
        "count": "∞",
        "unit": "archer",
        "type": "trainUnit",
        "resources": {"build": 0, "stone": 0, "wood": 10, "food": 8, "gold": 7}
    }, {
        "resources": {"stone": 0, "gold": 7, "build": 0, "wood": 10, "food": 8},
        "type": "build",
        "buildings": [{"type": "blacksmith", "count": 1}]
    }, {
        "tech": ["fletching"],
        "type": "research",
        "resources": {"gold": 7, "food": 8, "build": 0, "wood": 10, "stone": 0}
    }, {
        "type": "newVillagers",
        "task": "farm",
        "count": 10,
        "resources": {"wood": 10, "food": 18, "gold": 7, "build": 0, "stone": 0}
    }, {
        "count": 1,
        "resources": {"build": 0, "gold": 8, "food": 18, "wood": 10, "stone": 0},
        "type": "newVillagers",
        "task": "gold"
    }, {
        "resources": {"wood": 10, "food": 18, "gold": 8, "stone": 0, "build": 0},
        "tech": ["wheelbarrow"],
        "type": "research"
    }, {
        "age": "castleAge",
        "resources": {"wood": 10, "stone": 0, "food": 18, "build": 0, "gold": 8},
        "type": "ageUp"
    }, {
        "resources": {"build": 0, "gold": 8, "food": 18, "stone": 0, "wood": 10},
        "tech": ["horseCollar", "paddedArcherArmor", "goldMining"],
        "type": "research"
    }, {
        "resources": {"food": 18, "gold": 8, "wood": 10, "stone": 0, "build": 0},
        "type": "newAge",
        "age": "castleAge"
    }, {
        "type": "research",
        "tech": ["crossbowman", "bodkinArrow", "bowSaw"],
        "resources": {"wood": 10, "food": 18, "build": 0, "gold": 8, "stone": 0}
    }],
    "difficulty": 1
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7",
    "readyForPublish": true,
    "difficulty": 2,
    "author": "Cicero",
    "description": "This is a slower build since archers need to be massed to be effective. The aim is to keep 2 ranges working constantly - archers also need fletching as a minimum to be effective. This is often a poor build to use 1v1, partly because it is quite weak against the faster scout build, so it is mainly used in team games as flank where its weaknesses can be covered by other players.",
    "pop": {"feudalAge": 23, "castleAge": 15},
    "civilization": "Generic",
    "uptime": {"feudalAge": "10:30", "castleAge": "19:25"},
    "title": "Archers",
    "build": [{
        "resources": {"build": 0, "food": 6, "stone": 0, "gold": 0, "wood": 0},
        "count": 6,
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 4,
        "resources": {"gold": 0, "stone": 0, "wood": 4, "food": 6, "build": 0}
    }, {
        "count": 1,
        "task": "boar",
        "resources": {"wood": 4, "stone": 0, "gold": 0, "food": 7, "build": 0},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "gold": 0, "food": 11, "wood": 4, "build": 0},
        "count": 4,
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "task": "berries"
    }, {
        "animal": "boar",
        "type": "lure",
        "count": 1,
        "resources": {"gold": 0, "food": 11, "wood": 4, "stone": 0, "build": 0}
    }, {
        "resources": {"stone": 0, "gold": 0, "wood": 4, "build": 0, "food": 14},
        "type": "newVillagers",
        "count": 3,
        "task": "sheep"
    }, {
        "count": 1,
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"wood": 4, "food": 14, "stone": 0, "build": 0, "gold": 0},
        "to": "farm"
    }, {
        "resources": {"stone": 0, "gold": 0, "food": 14, "build": 0, "wood": 8},
        "count": 4,
        "task": "wood",
        "type": "newVillagers"
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"build": 0, "gold": 0, "wood": 8, "stone": 0, "food": 14}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"stone": 0, "gold": 0, "food": 14, "wood": 8, "build": 0}
    }, {
        "resources": {"gold": 3, "wood": 8, "food": 11, "build": 0, "stone": 0},
        "type": "moveVillagers",
        "count": 3,
        "from": "sheep",
        "to": "gold"
    }, {
        "to": "wood",
        "count": 3,
        "type": "moveVillagers",
        "resources": {"food": 8, "gold": 3, "build": 0, "wood": 11, "stone": 0},
        "from": "sheep"
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "type": "build",
        "resources": {"food": 8, "wood": 11, "build": 0, "stone": 0, "gold": 3}
    }, {
        "age": "feudalAge",
        "resources": {"gold": 3, "food": 8, "wood": 11, "stone": 0, "build": 0},
        "type": "newAge"
    }, {
        "resources": {"wood": 11, "build": 0, "gold": 8, "stone": 0, "food": 8},
        "count": 5,
        "task": "gold",
        "buildings": [{"type": "archeryRange", "count": 2}],
        "type": "newVillagers"
    }, {
        "tech": ["doubleBitAxe", "horseCollar"],
        "resources": {"food": 8, "wood": 11, "stone": 0, "gold": 8, "build": 0},
        "type": "research"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}],
        "resources": {"gold": 8, "build": 0, "food": 18, "wood": 11, "stone": 0},
        "type": "newVillagers",
        "task": "farm",
        "count": 10
    }, {
        "type": "research",
        "resources": {"food": 18, "gold": 8, "stone": 0, "build": 0, "wood": 11},
        "tech": ["wheelbarrow"]
    }, {"resources": {"wood": 11, "stone": 0, "gold": 8, "build": 0, "food": 18}, "age": "castleAge", "type": "ageUp"}],
    "id": 5,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "image": "Archer",
    "attributes": ["fastFeudal"]
}, {
    "civilization": "Aztecs",
    "pop": {"castleAge": 2, "feudalAge": 25},
    "author": "HumzaCrumza",
    "build": [{
        "resources": {"build": 0, "food": 6, "gold": 0, "stone": 0, "wood": 0},
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep",
        "type": "newVillagers",
        "count": 6
    }, {
        "resources": {"stone": 0, "gold": 0, "build": 0, "wood": 4, "food": 6},
        "task": "wood",
        "type": "newVillagers",
        "count": 4
    }, {
        "type": "newVillagers",
        "count": 1,
        "resources": {"stone": 0, "build": 0, "food": 7, "gold": 0, "wood": 4},
        "task": "boar"
    }, {
        "count": 1,
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "resources": {"stone": 0, "wood": 4, "food": 8, "build": 0, "gold": 0},
        "task": "berries"
    }, {
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 4, "food": 8},
        "count": 3,
        "animal": "deer",
        "type": "lure"
    }, {
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"stone": 0, "wood": 4, "gold": 0, "build": 0, "food": 14},
        "count": 6
    }, {
        "count": 1,
        "resources": {"wood": 4, "stone": 0, "food": 14, "gold": 0, "build": 0},
        "animal": "boar",
        "type": "lure"
    }, {
        "task": "wood",
        "resources": {"build": 0, "food": 14, "gold": 0, "wood": 8, "stone": 0},
        "count": 4,
        "type": "newVillagers"
    }, {
        "to": "berries",
        "count": 3,
        "type": "moveVillagers",
        "from": "sheep",
        "resources": {"build": 0, "gold": 0, "wood": 8, "stone": 0, "food": 14}
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 2,
        "resources": {"gold": 2, "wood": 8, "food": 14, "stone": 0, "build": 0}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"gold": 2, "stone": 0, "build": 0, "food": 14, "wood": 8}
    }, {
        "resources": {"wood": 10, "build": 0, "gold": 2, "stone": 0, "food": 12},
        "from": "sheep",
        "type": "moveVillagers",
        "count": 2,
        "to": "stragglerTree"
    }, {
        "from": "sheep",
        "count": 3,
        "resources": {"food": 12, "build": 0, "wood": 10, "stone": 0, "gold": 2},
        "type": "moveVillagers",
        "to": "farm"
    }, {
        "resources": {"wood": 10, "food": 12, "stone": 0, "gold": 2, "build": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "task": "gold",
        "resources": {"wood": 10, "food": 12, "build": 0, "gold": 4, "stone": 0},
        "count": 2,
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "blacksmith"}, {"type": "market", "count": 1}]
    }, {
        "resources": {"gold": 4, "food": 12, "stone": 0, "wood": 10, "build": 0},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "resources": {"stone": 0, "gold": 4, "food": 12, "build": 0, "wood": 10},
        "tech": ["doubleBitAxe"],
        "type": "research"
    }, {
        "to": "farm",
        "resources": {"wood": 10, "stone": 0, "gold": 4, "build": 0, "food": 12},
        "type": "moveVillagers",
        "from": "sheep",
        "count": 2
    }, {
        "to": "gold",
        "count": 3,
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 10, "build": 0, "food": 9, "gold": 7},
        "from": "berries"
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "type": "build",
        "resources": {"stone": 0, "food": 9, "gold": 7, "wood": 10, "build": 0}
    }, {
        "resources": {"stone": 0, "gold": 7, "food": 9, "wood": 10, "build": 0},
        "type": "newAge",
        "age": "castleAge"
    }, {
        "resources": {"wood": 10, "food": 9, "build": 0, "stone": 0, "gold": 7},
        "type": "trainUnit",
        "unit": "eagleScout",
        "count": 10
    }, {
        "count": 200,
        "action": "sell",
        "resource": "stone",
        "resources": {"build": 0, "wood": 10, "stone": 0, "gold": 7, "food": 9},
        "type": "trade"
    }, {
        "resources": {"gold": 7, "wood": 10, "stone": 0, "build": 0, "food": 9},
        "type": "research",
        "tech": ["eagleWarrior"]
    }, {
        "buildings": [{"type": "monastery", "count": 1}, {"count": 1, "type": "siegeWorkshop"}],
        "type": "build",
        "resources": {"gold": 7, "stone": 0, "build": 0, "wood": 10, "food": 9}
    }, {
        "type": "newVillagers",
        "count": 9,
        "task": "gold",
        "resources": {"build": 0, "gold": 16, "stone": 0, "food": 9, "wood": 10}
    }, {
        "resources": {"build": 0, "gold": 16, "food": 9, "wood": 10, "stone": 0},
        "type": "trainUnit",
        "unit": "monk",
        "count": 3
    }, {
        "resources": {"wood": 10, "food": 9, "build": 0, "stone": 0, "gold": 16},
        "type": "trainUnit",
        "unit": "batteringRam",
        "count": 3
    }, {
        "tech": ["redemption"],
        "resources": {"stone": 0, "food": 9, "wood": 10, "gold": 16, "build": 0},
        "type": "research"
    }, {
        "resources": {"food": 9, "wood": 20, "build": 0, "stone": 0, "gold": 16},
        "type": "newVillagers",
        "task": "wood",
        "count": 10
    }],
    "difficulty": 3,
    "description": "The Aztecs have always been a deadly Arena civ, mostly for the fact that they can grab map control decisively with their stronger monks and eagle warriors. This strategy tries to highlight this strength by using that same map control and going aggressive with Monks and Siege.",
    "title": "Siege + Monks Rush",
    "image": "Native Monk",
    "reference": "https://www.youtube.com/watch?v=981tpPgpOAU",
    "readyForPublish": true,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FNative%20Monk.png?alt=media&token=a105aa7c-dd3f-4d8b-976a-638b96f923d0",
    "uptime": {"feudalAge": "10:55", "castleAge": "14:25"},
    "attributes": ["fastCastle", "arena"],
    "id": 29
}, {
    "uptime": {"feudalAge": "08:50"},
    "title": "Fast Archers",
    "author": "Holenz",
    "difficulty": 3,
    "pop": {"feudalAge": 19},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FLongbowman.png?alt=media&token=64c24272-ecbc-4079-a6bb-c1d80a899cf8",
    "civilization": "Britons",
    "build": [{
        "count": 5,
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}],
        "type": "newVillagers",
        "resources": {"food": 5, "wood": 0, "stone": 0, "gold": 0, "build": 0}
    }, {
        "count": 2,
        "resources": {"food": 5, "build": 0, "wood": 2, "stone": 0, "gold": 0},
        "type": "newVillagers",
        "task": "wood"
    }, {
        "resources": {"stone": 0, "wood": 2, "build": 0, "gold": 0, "food": 9},
        "type": "newVillagers",
        "task": "boar",
        "count": 4
    }, {
        "buildings": [{"type": "house", "count": 1}, {"type": "mill", "count": 1}],
        "resources": {"stone": 0, "build": 0, "wood": 2, "food": 11, "gold": 0},
        "type": "newVillagers",
        "task": "berries",
        "count": 2
    }, {
        "resources": {"stone": 0, "wood": 2, "food": 11, "build": 0, "gold": 0},
        "count": 1,
        "animal": "boar",
        "type": "lure"
    }, {
        "resources": {"build": 0, "food": 13, "gold": 0, "wood": 2, "stone": 0},
        "count": 2,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "type": "newVillagers",
        "count": 2,
        "resources": {"gold": 0, "build": 0, "stone": 0, "wood": 4, "food": 13},
        "task": "wood"
    }, {
        "resources": {"gold": 1, "wood": 4, "food": 13, "stone": 0, "build": 0},
        "count": 1,
        "type": "newVillagers",
        "task": "gold"
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"gold": 1, "build": 0, "wood": 4, "stone": 0, "food": 13}
    }, {
        "resources": {"wood": 4, "stone": 0, "build": 0, "food": 13, "gold": 1},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "to": "wood",
        "count": 4,
        "resources": {"food": 9, "wood": 8, "stone": 0, "build": 0, "gold": 1},
        "type": "moveVillagers",
        "from": "sheep"
    }, {
        "to": "stragglerTree",
        "count": 3,
        "from": "sheep",
        "resources": {"gold": 1, "build": 0, "wood": 11, "stone": 0, "food": 6},
        "type": "moveVillagers"
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "resources": {"stone": 0, "build": 0, "wood": 11, "food": 6, "gold": 1},
        "type": "build"
    }, {
        "resources": {"wood": 11, "stone": 0, "build": 0, "food": 6, "gold": 1},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "resources": {"wood": 11, "food": 6, "gold": 5, "stone": 0, "build": 0},
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "archeryRange"}, {"count": 1, "type": "blacksmith"}],
        "count": 4,
        "task": "gold"
    }, {
        "type": "research",
        "resources": {"food": 6, "wood": 11, "build": 0, "stone": 0, "gold": 5},
        "tech": ["doubleBitAxe", "horseCollar"]
    }, {
        "tech": ["fletching"],
        "resources": {"wood": 11, "stone": 0, "build": 0, "food": 6, "gold": 5},
        "type": "research"
    }],
    "image": "Longbowman",
    "attributes": ["fastFeudal"],
    "reference": "https://www.reddit.com/r/aoe2/comments/hm84p1/19pop_britons_fast_archers_bo/",
    "id": 30,
    "description": "Compared to a standard 23 pop double range build, this build produces the first group of archers faster. It's more flexible as well since it's not as easily countered by one range skirms, because we don't blindly invest in a 2nd range in early feudal.",
    "readyForPublish": true
}, {
    "id": 60,
    "pop": {"feudalAge": 26, "castleAge": 2},
    "image": "Coustillier",
    "readyForPublish": true,
    "author": "Morley Games",
    "build": [{
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "type": "newVillagers",
        "resources": {"wood": 0, "gold": 0, "build": 0, "food": 6, "stone": 0}
    }, {
        "type": "newVillagers",
        "count": 1,
        "task": "boar",
        "resources": {"wood": 0, "food": 7, "stone": 0, "build": 0, "gold": 0}
    }, {
        "resources": {"stone": 0, "gold": 0, "food": 7, "wood": 4, "build": 0},
        "task": "wood",
        "count": 4,
        "type": "newVillagers"
    }, {
        "count": 4,
        "type": "newVillagers",
        "resources": {"wood": 4, "build": 0, "food": 11, "stone": 0, "gold": 0},
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "task": "berries"
    }, {
        "resources": {"stone": 0, "gold": 0, "food": 11, "build": 0, "wood": 4},
        "type": "research",
        "tech": ["doubleBitAxe"]
    }, {
        "task": "sheep",
        "count": 2,
        "type": "newVillagers",
        "resources": {"build": 0, "food": 13, "wood": 4, "stone": 0, "gold": 0}
    }, {
        "task": "wood",
        "count": 4,
        "type": "newVillagers",
        "resources": {"wood": 8, "food": 13, "build": 0, "gold": 0, "stone": 0}
    }, {
        "count": 2,
        "resources": {"gold": 2, "wood": 8, "food": 13, "build": 0, "stone": 0},
        "type": "newVillagers",
        "task": "gold"
    }, {
        "count": 2,
        "type": "newVillagers",
        "resources": {"wood": 8, "build": 0, "food": 15, "stone": 0, "gold": 2},
        "task": "sheep"
    }, {
        "age": "feudalAge",
        "resources": {"wood": 8, "food": 15, "gold": 2, "stone": 0, "build": 0},
        "type": "ageUp"
    }, {
        "from": "sheep",
        "to": "stone",
        "type": "moveVillagers",
        "count": 2,
        "resources": {"wood": 8, "food": 13, "gold": 2, "stone": 2, "build": 0}
    }, {
        "from": "sheep",
        "count": 9,
        "type": "moveVillagers",
        "resources": {"gold": 2, "stone": 2, "wood": 8, "build": 0, "food": 13},
        "to": "farm"
    }, {
        "type": "newAge",
        "resources": {"stone": 2, "food": 13, "build": 0, "wood": 8, "gold": 2},
        "age": "feudalAge"
    }, {
        "task": "stone",
        "buildings": [{"type": "blacksmith", "count": 1}, {"type": "market", "count": 1}],
        "count": 2,
        "type": "newVillagers",
        "resources": {"gold": 2, "food": 13, "build": 0, "wood": 8, "stone": 4}
    }, {
        "resources": {"food": 13, "build": 0, "stone": 4, "gold": 2, "wood": 8},
        "type": "ageUp",
        "age": "castleAge"
    }, {
        "resources": {"gold": 2, "food": 13, "stone": 8, "wood": 4, "build": 0},
        "count": 4,
        "to": "stone",
        "from": "wood",
        "type": "moveVillagers"
    }, {
        "type": "research",
        "tech": ["horseCollar"],
        "resources": {"food": 13, "wood": 4, "build": 0, "stone": 8, "gold": 2}
    }, {
        "type": "newAge",
        "age": "castleAge",
        "resources": {"build": 0, "gold": 2, "stone": 8, "wood": 4, "food": 13}
    }, {
        "resources": {"stone": 8, "gold": 2, "build": 0, "food": 13, "wood": 4},
        "type": "build",
        "buildings": [{"type": "castle", "count": 1}]
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 2,
        "resources": {"build": 0, "stone": 8, "gold": 4, "food": 13, "wood": 4}
    }, {
        "task": "sheep",
        "resources": {"wood": 4, "stone": 8, "gold": 4, "build": 0, "food": 15},
        "type": "newVillagers",
        "count": 2
    }, {
        "resources": {"wood": 4, "gold": 8, "stone": 8, "build": 0, "food": 11},
        "count": 4,
        "type": "moveVillagers",
        "to": "gold",
        "from": "berries"
    }, {
        "type": "newVillagers",
        "count": 2,
        "task": "wood",
        "resources": {"build": 0, "food": 11, "gold": 8, "stone": 8, "wood": 6}
    }, {
        "resources": {"build": 0, "food": 11, "gold": 8, "wood": 12, "stone": 2},
        "to": "wood",
        "from": "stone",
        "type": "moveVillagers",
        "count": 6
    }, {
        "resources": {"stone": 2, "food": 14, "wood": 12, "build": 0, "gold": 8},
        "type": "newVillagers",
        "count": 3,
        "task": "farm"
    }],
    "uptime": {"feudalAge": "11:20", "castleAge": "14:50"},
    "title": "Coustillier Rush",
    "attributes": ["fastCastle"],
    "civilization": "Burgundians",
    "reference": "https://youtu.be/olqhZTwKALM",
    "description": "This build order allows you to rush with Coustillier as the Burgundians. ",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCoustillier.png?alt=media&token=e17659cd-4094-481f-b602-0a7446b8a034",
    "difficulty": 2
}, {
    "civilization": "Burmese",
    "author": "AoE2 Arena",
    "build": [{
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers",
        "resources": {"food": 6, "build": 0, "stone": 0, "wood": 0, "gold": 0},
        "count": 6,
        "task": "sheep"
    }, {
        "count": 1,
        "task": "stragglerTree",
        "buildings": [{"type": "house", "count": 1}],
        "type": "newVillagers",
        "resources": {"food": 6, "wood": 1, "build": 0, "stone": 0, "gold": 0}
    }, {
        "resources": {"build": 0, "stone": 0, "wood": 1, "food": 10, "gold": 0},
        "task": "berries",
        "type": "newVillagers",
        "buildings": [{"type": "mill", "count": 1}],
        "count": 4
    }, {
        "type": "newVillagers",
        "task": "boar",
        "count": 1,
        "resources": {"build": 0, "stone": 0, "food": 11, "wood": 1, "gold": 0}
    }, {
        "type": "newVillagers",
        "task": "stragglerTree",
        "count": 2,
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 3, "food": 11}
    }, {
        "resources": {"build": 0, "gold": 0, "wood": 6, "stone": 0, "food": 11},
        "buildings": [{"count": 1, "type": "lumberCamp"}],
        "count": 3,
        "type": "newVillagers",
        "task": "wood"
    }, {
        "type": "newVillagers",
        "count": 2,
        "resources": {"build": 0, "wood": 6, "food": 13, "stone": 0, "gold": 0},
        "task": "sheep"
    }, {
        "task": "stone",
        "resources": {"stone": 6, "build": 0, "gold": 0, "wood": 6, "food": 13},
        "type": "newVillagers",
        "count": 6
    }, {
        "resources": {"wood": 6, "stone": 6, "food": 13, "build": 0, "gold": 2},
        "type": "newVillagers",
        "task": "gold",
        "count": 2
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"gold": 2, "wood": 6, "stone": 6, "food": 13, "build": 0}
    }, {
        "count": 2,
        "to": "stone",
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"stone": 8, "wood": 6, "food": 11, "build": 0, "gold": 2}
    }, {
        "type": "moveVillagers",
        "to": "farm",
        "from": "sheep",
        "count": 2,
        "resources": {"gold": 2, "wood": 6, "food": 11, "stone": 8, "build": 0}
    }, {
        "from": "sheep",
        "to": "gold",
        "type": "moveVillagers",
        "resources": {"food": 6, "build": 0, "gold": 7, "wood": 6, "stone": 8},
        "count": 5
    }, {
        "resources": {"wood": 6, "stone": 8, "build": 0, "gold": 7, "food": 6},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "resources": {"stone": 10, "build": 0, "wood": 6, "gold": 7, "food": 6},
        "buildings": [{"count": 1, "type": "blacksmith"}, {"type": "market", "count": 1}],
        "count": 2,
        "task": "stone",
        "type": "newVillagers"
    }, {
        "type": "ageUp",
        "resources": {"gold": 7, "stone": 10, "build": 0, "wood": 6, "food": 6},
        "age": "castleAge"
    }, {
        "type": "moveVillagers",
        "resources": {"wood": 10, "food": 2, "build": 0, "stone": 10, "gold": 7},
        "from": "berries",
        "count": 4,
        "to": "wood"
    }, {
        "resources": {"stone": 10, "food": 2, "gold": 7, "build": 0, "wood": 10},
        "type": "newAge",
        "age": "castleAge"
    }, {
        "buildings": [{"type": "castle", "count": 2}],
        "type": "build",
        "resources": {"food": 2, "stone": 10, "gold": 7, "wood": 10, "build": 0}
    }, {
        "type": "moveVillagers",
        "count": 5,
        "to": "gold",
        "resources": {"food": 2, "wood": 10, "stone": 5, "gold": 12, "build": 0},
        "from": "stone"
    }, {
        "type": "moveVillagers",
        "to": "wood",
        "from": "stone",
        "resources": {"gold": 12, "stone": 0, "build": 0, "wood": 15, "food": 2},
        "count": 5
    }, {
        "count": 4,
        "task": "farm",
        "resources": {"food": 6, "build": 0, "gold": 12, "stone": 0, "wood": 15},
        "type": "newVillagers"
    }, {
        "count": 2,
        "resources": {"gold": 14, "stone": 0, "wood": 15, "build": 0, "food": 6},
        "task": "gold",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 2,
        "task": "wood",
        "resources": {"stone": 0, "gold": 14, "wood": 17, "build": 0, "food": 6}
    }, {
        "task": "farm",
        "resources": {"wood": 17, "food": 9, "build": 0, "stone": 0, "gold": 14},
        "type": "newVillagers",
        "count": 3
    }],
    "description": "The fastest way to get to two castles constantly producing Arambai.",
    "difficulty": 2,
    "image": "Arambai",
    "reference": "https://youtu.be/Gpo6VJWY6ng",
    "uptime": {"castleAge": "15:40", "feudalAge": "12:10"},
    "readyForPublish": true,
    "id": 33,
    "attributes": ["fastCastle", "arena"],
    "pop": {"castleAge": 2, "feudalAge": 28},
    "title": "Two Castle Arambai",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArambai.png?alt=media&token=c8342b8d-4497-4ad4-b945-e4a9deafdd45"
}, {
    "readyForPublish": true,
    "id": 45,
    "civilization": "Celts",
    "attributes": ["drush", "fastCastle"],
    "description": "Hoang is infamous for climbing the ladder with one strategy, and one strategy only: a Celtic rush in Dark Age, and then going for a fast Castle Age to start applying pressure with siege, knights, and monks.",
    "title": "Hoang Rush",
    "difficulty": 3,
    "image": "Mangonel",
    "pop": {"castleAge": 2, "feudalAge": 29},
    "build": [{
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"food": 6, "build": 0, "gold": 0, "stone": 0, "wood": 0},
        "count": 6,
        "type": "newVillagers"
    }, {
        "task": "wood",
        "resources": {"build": 0, "wood": 4, "stone": 0, "food": 6, "gold": 0},
        "type": "newVillagers",
        "count": 4
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "boar",
        "resources": {"stone": 0, "wood": 4, "food": 7, "build": 0, "gold": 0}
    }, {
        "count": 1,
        "buildings": [{"count": 1, "type": "barracks"}, {"type": "wall", "count": 1}],
        "type": "newVillagers",
        "task": "build",
        "resources": {"build": 1, "wood": 4, "food": 7, "gold": 0, "stone": 0}
    }, {
        "resources": {"stone": 0, "gold": 0, "food": 10, "wood": 4, "build": 1},
        "task": "boar",
        "type": "newVillagers",
        "count": 3
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 1,
        "resources": {"build": 1, "stone": 0, "wood": 4, "gold": 1, "food": 10}
    }, {
        "type": "trainUnit",
        "count": 3,
        "resources": {"gold": 1, "wood": 4, "build": 1, "stone": 0, "food": 10},
        "unit": "militia"
    }, {
        "count": 6,
        "type": "newVillagers",
        "task": "berries",
        "resources": {"stone": 0, "gold": 1, "food": 16, "build": 1, "wood": 4},
        "buildings": [{"count": 1, "type": "house"}, {"type": "mill", "count": 1}]
    }, {
        "task": "wood",
        "buildings": [],
        "resources": {"build": 1, "wood": 5, "food": 16, "gold": 1, "stone": 0},
        "type": "newVillagers",
        "count": 1
    }, {
        "count": 2,
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"build": 1, "wood": 5, "food": 18, "stone": 0, "gold": 1}
    }, {
        "to": "farm",
        "type": "moveVillagers",
        "count": 2,
        "from": "sheep",
        "resources": {"gold": 1, "food": 18, "build": 1, "wood": 5, "stone": 0}
    }, {
        "resources": {"build": 1, "stone": 0, "food": 18, "gold": 4, "wood": 5},
        "type": "newVillagers",
        "task": "gold",
        "count": 3
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"build": 1, "food": 18, "stone": 0, "wood": 5, "gold": 4}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"wood": 5, "gold": 4, "build": 1, "stone": 0, "food": 18}
    }, {
        "count": 6,
        "type": "moveVillagers",
        "resources": {"wood": 5, "food": 18, "gold": 4, "stone": 0, "build": 1},
        "from": "sheep",
        "to": "deer"
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"stone": 0, "gold": 4, "build": 1, "food": 18, "wood": 5}
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "stable"}],
        "count": 2,
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 1, "gold": 6, "food": 18, "wood": 5},
        "task": "gold"
    }, {
        "type": "ageUp",
        "resources": {"stone": 0, "gold": 6, "food": 18, "wood": 5, "build": 1},
        "age": "castleAge"
    }, {
        "type": "moveVillagers",
        "from": "berries",
        "count": 6,
        "to": "wood",
        "resources": {"wood": 11, "stone": 0, "build": 1, "food": 12, "gold": 6}
    }, {
        "from": "deer",
        "to": "gold",
        "type": "moveVillagers",
        "resources": {"wood": 11, "gold": 9, "build": 1, "food": 9, "stone": 0},
        "count": 3
    }, {
        "to": "farm",
        "type": "moveVillagers",
        "count": 7,
        "resources": {"food": 9, "wood": 11, "stone": 0, "build": 1, "gold": 9},
        "from": "sheep"
    }, {
        "tech": ["doubleBitAxe", "horseCollar", "goldMining"],
        "resources": {"stone": 0, "build": 1, "gold": 9, "food": 9, "wood": 11},
        "type": "research"
    }, {
        "type": "moveVillagers",
        "from": "wood",
        "count": 1,
        "to": "forward",
        "resources": {"wood": 10, "stone": 0, "gold": 9, "food": 9, "build": 2}
    }, {
        "from": "build",
        "type": "moveVillagers",
        "resources": {"wood": 10, "build": 2, "gold": 9, "stone": 0, "food": 9},
        "to": "forward",
        "count": 1
    }, {
        "age": "castleAge",
        "resources": {"gold": 9, "build": 2, "food": 9, "wood": 10, "stone": 0},
        "type": "newAge"
    }, {
        "type": "build",
        "resources": {"food": 9, "build": 2, "wood": 10, "stone": 0, "gold": 9},
        "buildings": [{"type": "monastery", "count": 1}, {"type": "siegeWorkshop", "count": 1}]
    }],
    "uptime": {"feudalAge": "13:00", "castleAge": "16:30"},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMangonel.png?alt=media&token=3cbf5937-30a2-40da-8b1b-64fce80c31af",
    "reference": "https://youtu.be/2MWO-WjOVY0",
    "author": "Hoang"
}, {
    "civilization": "Cumans",
    "author": "Hera",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FTown%20Center.png?alt=media&token=65f446d8-5fca-4001-965d-b13636fe7d76",
    "build": [{
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}],
        "type": "newVillagers",
        "count": 6,
        "resources": {"food": 6, "build": 0, "wood": 0, "stone": 0, "gold": 0}
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 4,
        "resources": {"wood": 4, "food": 6, "stone": 0, "build": 0, "gold": 0}
    }, {
        "type": "newVillagers",
        "count": 2,
        "task": "boar",
        "resources": {"gold": 0, "build": 0, "wood": 4, "stone": 0, "food": 8}
    }, {
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "task": "berries",
        "count": 4,
        "resources": {"food": 12, "wood": 4, "stone": 0, "build": 0, "gold": 0}
    }, {
        "resources": {"food": 12, "wood": 4, "stone": 0, "gold": 0, "build": 0},
        "animal": "boar",
        "type": "lure",
        "count": 1
    }, {
        "resources": {"gold": 0, "food": 12, "stone": 0, "wood": 4, "build": 1},
        "buildings": [{"type": "wall", "count": 1}],
        "count": 1,
        "type": "newVillagers",
        "task": "build"
    }, {
        "count": 2,
        "resources": {"build": 1, "stone": 0, "gold": 0, "food": 14, "wood": 4},
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 1,
        "resources": {"food": 14, "wood": 5, "stone": 0, "build": 1, "gold": 0}
    }, {
        "type": "research",
        "resources": {"wood": 5, "gold": 0, "food": 14, "build": 1, "stone": 0},
        "tech": ["loom"]
    }, {
        "resources": {"gold": 0, "food": 14, "build": 1, "stone": 0, "wood": 5},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "resources": {"stone": 0, "build": 1, "food": 14, "gold": 0, "wood": 5},
        "buildings": [{"type": "wall", "count": 1}],
        "type": "build"
    }, {
        "resources": {"build": 1, "stone": 0, "gold": 0, "wood": 5, "food": 14},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "buildings": [{"count": 1, "type": "townCenter"}],
        "resources": {"gold": 0, "build": 1, "wood": 5, "food": 14, "stone": 0},
        "type": "build"
    }, {
        "tech": ["doubleBitAxe", "horseCollar"],
        "resources": {"build": 1, "wood": 5, "stone": 0, "gold": 0, "food": 14},
        "type": "research"
    }],
    "image": "Town Center",
    "uptime": {"feudalAge": "09:40"},
    "readyForPublish": true,
    "id": 42,
    "description": "A quick build to get as fast as possible to the Cuman double Town Center boom. This is a very flexible build order and can be adapted in Feudal Age depending on the situation.",
    "attributes": ["fastFeudal"],
    "reference": "https://www.youtube.com/watch?v=jNAYfhJZoT8&feature=youtu.be",
    "difficulty": 2,
    "title": "Feudal Boom",
    "pop": {"feudalAge": 21}
}, {
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "author": "Cicero",
    "readyForPublish": true,
    "image": "Militia",
    "attributes": ["drush"],
    "uptime": {"feudalAge": "11:20", "castleAge": "19:50"},
    "description": "A Dark Age rush: three militia created in Dark Age used to delay the opponent. This is another way of buying time to mass archers. At the time of writing, this build has become less popular, with the men-at-arms build being preferred. It can be quite weak against the men-at-arms build since the opponent will have militia to defend, which can then be upgraded after they hit Feudal first. A drush can also be used to buy time to perform a Fast Castle.",
    "pop": {"castleAge": 14, "feudalAge": 25},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMilitia.png?alt=media&token=465ff671-67e6-49cb-a020-5615c426c480",
    "title": "Drush → Archers",
    "build": [{
        "resources": {"wood": 0, "food": 6, "stone": 0, "build": 0, "gold": 0},
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "resources": {"stone": 0, "food": 6, "gold": 0, "build": 0, "wood": 4},
        "type": "newVillagers",
        "task": "wood",
        "count": 4
    }, {
        "resources": {"gold": 0, "food": 8, "wood": 4, "stone": 0, "build": 0},
        "task": "boar",
        "type": "newVillagers",
        "count": 2
    }, {
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "resources": {"gold": 0, "stone": 0, "wood": 4, "build": 0, "food": 12},
        "task": "berries",
        "count": 4
    }, {
        "resources": {"stone": 0, "gold": 0, "wood": 4, "food": 12, "build": 0},
        "type": "lure",
        "count": 1,
        "animal": "boar"
    }, {
        "resources": {"stone": 0, "wood": 4, "food": 12, "build": 1, "gold": 0},
        "count": 1,
        "type": "newVillagers",
        "task": "build",
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "to": "gold",
        "resources": {"food": 12, "wood": 4, "stone": 0, "build": 0, "gold": 1},
        "subType": "moveVillagers",
        "type": "collectGold",
        "count": 1,
        "from": "build",
        "task": "collect10GoldAfterBarracksIsBuilt"
    }, {
        "from": "gold",
        "to": "wood",
        "count": 1,
        "resources": {"build": 0, "wood": 5, "stone": 0, "food": 12, "gold": 0},
        "type": "moveVillagers"
    }, {
        "resources": {"stone": 0, "gold": 0, "wood": 5, "food": 12, "build": 0},
        "type": "trainUnit",
        "unit": "militia",
        "count": 3
    }, {
        "count": 7,
        "resources": {"wood": 5, "food": 19, "gold": 0, "build": 0, "stone": 0},
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "count": 3,
        "from": "sheep",
        "to": "farm",
        "resources": {"gold": 0, "food": 19, "build": 0, "wood": 5, "stone": 0},
        "type": "moveVillagers"
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"gold": 0, "food": 19, "build": 0, "wood": 5, "stone": 0}
    }, {
        "resources": {"food": 19, "gold": 0, "wood": 5, "stone": 0, "build": 0},
        "type": "ageUp",
        "loom": false,
        "age": "feudalAge"
    }, {
        "resources": {"stone": 0, "food": 12, "build": 0, "wood": 12, "gold": 0},
        "to": "wood",
        "count": 7,
        "from": "sheep",
        "type": "moveVillagers"
    }, {
        "from": "sheep",
        "resources": {"gold": 4, "wood": 12, "food": 8, "stone": 0, "build": 0},
        "to": "gold",
        "count": 4,
        "type": "moveVillagers"
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "gold": 4, "stone": 0, "food": 8, "wood": 12},
        "type": "newAge"
    }, {
        "tech": ["doubleBitAxe", "horseCollar"],
        "type": "research",
        "resources": {"stone": 0, "gold": 4, "food": 8, "wood": 12, "build": 0}
    }, {
        "buildings": [{"type": "archeryRange", "count": 2}],
        "count": 4,
        "resources": {"wood": 12, "food": 8, "build": 0, "gold": 8, "stone": 0},
        "task": "gold",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"build": 0, "gold": 8, "stone": 0, "wood": 12, "food": 18},
        "count": 10,
        "task": "farm"
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "resources": {"food": 18, "stone": 0, "wood": 12, "build": 0, "gold": 8}
    }, {
        "type": "research",
        "resources": {"stone": 0, "gold": 8, "build": 0, "food": 18, "wood": 12},
        "tech": ["fletching"]
    }, {
        "tech": ["wheelbarrow"],
        "type": "research",
        "resources": {"wood": 12, "stone": 0, "build": 0, "gold": 8, "food": 18}
    }, {
        "resources": {"build": 0, "gold": 8, "food": 18, "stone": 0, "wood": 12},
        "loom": false,
        "type": "ageUp",
        "age": "castleAge"
    }],
    "difficulty": 3,
    "civilization": "Generic",
    "id": 9
}, {
    "description": "A Dark Age rush: three militia created in Dark Age used to delay the opponent. This is another way of buying time to mass archers. At the time of writing, this build has become less popular, with the men-at-arms build being preferred. It can be quite weak against the men-at-arms build since the opponent will have militia to defend, which can then be upgraded after they hit Feudal first. A drush can also be used to buy time to perform a fast Castle. This has also gone out of fashion at the time of writing, though it can still sometimes be pulled off with a good map. Research fletching as a minimum for the crossbows.",
    "civilization": "Generic",
    "id": 10,
    "image": "Crossbowman",
    "title": "Drush → FC + Crossbows",
    "build": [{
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"stone": 0, "wood": 0, "build": 0, "food": 6, "gold": 0},
        "type": "newVillagers",
        "task": "sheep",
        "count": 6
    }, {
        "count": 4,
        "task": "wood",
        "resources": {"build": 0, "stone": 0, "wood": 4, "gold": 0, "food": 6},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "build": 0, "food": 7, "gold": 0, "stone": 0},
        "task": "boar",
        "type": "newVillagers",
        "count": 1
    }, {
        "resources": {"build": 0, "gold": 0, "food": 11, "stone": 0, "wood": 4},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "task": "berries",
        "count": 4
    }, {
        "type": "newVillagers",
        "task": "boar",
        "count": 1,
        "resources": {"wood": 4, "build": 0, "gold": 0, "stone": 0, "food": 12}
    }, {
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"wood": 4, "build": 1, "stone": 0, "food": 12, "gold": 0},
        "type": "newVillagers",
        "task": "build",
        "count": 1
    }, {
        "to": "gold",
        "task": "collect10GoldAfterBarracksIsBuilt",
        "count": 1,
        "resources": {"stone": 0, "gold": 1, "food": 12, "wood": 4, "build": 0},
        "type": "collectGold",
        "from": "build",
        "subType": "moveVillagers"
    }, {
        "type": "moveVillagers",
        "to": "wood",
        "resources": {"gold": 0, "food": 12, "stone": 0, "wood": 5, "build": 0},
        "from": "gold",
        "count": 1
    }, {
        "resources": {"wood": 8, "stone": 0, "build": 0, "food": 12, "gold": 0},
        "task": "wood",
        "count": 3,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 2,
        "task": "berries",
        "resources": {"stone": 0, "gold": 0, "wood": 8, "build": 0, "food": 14}
    }, {
        "type": "newVillagers",
        "task": "sheep",
        "count": 6,
        "resources": {"build": 0, "food": 20, "gold": 0, "stone": 0, "wood": 8}
    }, {
        "type": "moveVillagers",
        "to": "farm",
        "from": "sheep",
        "count": 8,
        "resources": {"build": 0, "gold": 0, "stone": 0, "wood": 8, "food": 20}
    }, {
        "tech": ["loom"],
        "resources": {"gold": 0, "food": 20, "stone": 0, "wood": 8, "build": 0},
        "type": "research"
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"wood": 8, "food": 20, "stone": 0, "gold": 0, "build": 0}
    }, {
        "from": "sheep",
        "resources": {"gold": 4, "stone": 0, "build": 0, "wood": 8, "food": 16},
        "type": "moveVillagers",
        "count": 4,
        "to": "gold"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"build": 0, "wood": 8, "food": 16, "stone": 0, "gold": 4}
    }, {
        "task": "gold",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "archeryRange"}, {"count": 1, "type": "blacksmith"}],
        "count": 2,
        "resources": {"gold": 6, "food": 16, "build": 0, "wood": 8, "stone": 0}
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"gold": 6, "food": 16, "stone": 0, "wood": 8, "build": 0}
    }, {
        "from": "sheep",
        "type": "moveVillagers",
        "count": 2,
        "to": "gold",
        "resources": {"gold": 8, "food": 14, "build": 0, "wood": 8, "stone": 0}
    }, {
        "type": "moveVillagers",
        "resources": {"gold": 8, "stone": 0, "food": 10, "wood": 12, "build": 0},
        "to": "wood",
        "from": "berries",
        "count": 4
    }, {
        "resources": {"food": 10, "gold": 8, "build": 0, "stone": 0, "wood": 12},
        "type": "moveVillagers",
        "to": "farm",
        "from": "berries",
        "count": 2
    }, {
        "resources": {"build": 0, "wood": 12, "gold": 8, "stone": 0, "food": 10},
        "buildings": [{"count": 1, "type": "archeryRange"}],
        "type": "build"
    }],
    "uptime": {"feudalAge": "13:00", "castleAge": "16:30"},
    "attributes": ["drush", "fastCastle"],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCrossbowman.png?alt=media&token=de25424b-7565-4f71-928c-0b9c9dea25bb",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "pop": {"feudalAge": 29, "castleAge": 2},
    "difficulty": 3,
    "readyForPublish": true,
    "author": "Cicero"
}, {
    "attributes": ["fastFeudal"],
    "uptime": {"feudalAge": "09:40"},
    "readyForPublish": true,
    "pop": {"feudalAge": 21},
    "id": 46,
    "title": "Fast Archers",
    "author": "Morley Games",
    "description": "This archer rush is specifically for the Ethiopians and is quite a simple and straight forward build order which will enable you to attack your enemy a little sooner than your generic archer rush, as the Ethiopian archer rush advances with 21 pop. ",
    "civilization": "Ethiopians",
    "difficulty": 1,
    "image": "Archer",
    "build": [{
        "count": 6,
        "type": "newVillagers",
        "resources": {"food": 6, "build": 0, "gold": 0, "stone": 0, "wood": 0},
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep"
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 6, "wood": 3},
        "task": "wood",
        "count": 3,
        "type": "newVillagers"
    }, {
        "task": "boar",
        "resources": {"gold": 0, "build": 0, "food": 7, "wood": 3, "stone": 0},
        "type": "newVillagers",
        "count": 1
    }, {
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "resources": {"stone": 0, "gold": 0, "food": 11, "build": 0, "wood": 3},
        "count": 4,
        "task": "berries",
        "type": "newVillagers"
    }, {
        "resources": {"build": 0, "food": 12, "wood": 3, "stone": 0, "gold": 0},
        "type": "newVillagers",
        "count": 1,
        "task": "boar"
    }, {
        "task": "sheep",
        "count": 2,
        "type": "newVillagers",
        "resources": {"wood": 3, "stone": 0, "food": 14, "build": 0, "gold": 0}
    }, {
        "task": "wood",
        "resources": {"stone": 0, "wood": 6, "food": 14, "build": 0, "gold": 0},
        "buildings": [{"count": 1, "type": "lumberCamp"}],
        "count": 3,
        "type": "newVillagers"
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"gold": 0, "build": 0, "wood": 6, "stone": 0, "food": 14}
    }, {
        "age": "feudalAge",
        "resources": {"stone": 0, "wood": 6, "build": 0, "food": 14, "gold": 0},
        "type": "ageUp"
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "wood": 10, "food": 10},
        "type": "moveVillagers",
        "to": "wood",
        "count": 4,
        "from": "sheep"
    }, {
        "from": "sheep",
        "to": "gold",
        "count": 2,
        "type": "moveVillagers",
        "resources": {"stone": 0, "build": 0, "gold": 2, "food": 8, "wood": 10}
    }, {
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"wood": 10, "food": 8, "build": 0, "gold": 2, "stone": 0},
        "type": "build"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"wood": 10, "stone": 0, "food": 8, "build": 0, "gold": 2}
    }, {
        "tech": ["doubleBitAxe"],
        "type": "research",
        "resources": {"food": 8, "stone": 0, "build": 0, "gold": 2, "wood": 10}
    }, {
        "task": "gold",
        "buildings": [{"count": 2, "type": "archeryRange"}],
        "resources": {"wood": 10, "build": 0, "stone": 0, "gold": 8, "food": 8},
        "type": "newVillagers",
        "count": 6
    }, {
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "resources": {"gold": 8, "food": 8, "wood": 10, "stone": 0, "build": 0},
        "type": "build"
    }, {
        "tech": ["fletching"],
        "resources": {"food": 8, "gold": 8, "stone": 0, "build": 0, "wood": 10},
        "type": "research"
    }],
    "reference": "https://youtu.be/_QrL7jJsupU",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7"
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Castle.png?alt=media&token=a12d6e5f-f68b-4f5d-bf8b-9b7670beb357",
    "id": 20,
    "uptime": {"castleAge": "14:50", "feudalAge": "11:20"},
    "attributes": ["fastCastle", "arena"],
    "pop": {"feudalAge": 26, "castleAge": 2},
    "author": "Cicero",
    "difficulty": 1,
    "description": "Generic build. Pushing deer for an eco-boost and earlier up-time is standard on Arena, but these builds can be done without. Also, skip loom if possible for these builds.",
    "build": [{
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "resources": {"food": 6, "wood": 0, "build": 0, "gold": 0, "stone": 0},
        "count": 6,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 4,
        "resources": {"build": 0, "food": 6, "wood": 4, "stone": 0, "gold": 0}
    }, {
        "task": "boar",
        "resources": {"food": 7, "build": 0, "gold": 0, "stone": 0, "wood": 4},
        "count": 1,
        "type": "newVillagers"
    }, {
        "count": 4,
        "type": "newVillagers",
        "task": "berries",
        "resources": {"food": 11, "stone": 0, "gold": 0, "build": 0, "wood": 4},
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}]
    }, {
        "resources": {"build": 0, "gold": 0, "wood": 4, "stone": 0, "food": 11},
        "type": "lure",
        "count": 1,
        "animal": "boar"
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 4, "food": 14, "stone": 0},
        "task": "sheep",
        "count": 3,
        "type": "newVillagers"
    }, {
        "from": "sheep",
        "to": "farm",
        "count": 2,
        "type": "moveVillagers",
        "resources": {"gold": 0, "food": 14, "wood": 4, "build": 0, "stone": 0}
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 4,
        "resources": {"stone": 0, "food": 14, "build": 0, "gold": 0, "wood": 8}
    }, {
        "count": 2,
        "from": "sheep",
        "type": "moveVillagers",
        "to": "berries",
        "resources": {"food": 14, "wood": 8, "gold": 0, "stone": 0, "build": 0}
    }, {
        "count": 3,
        "resources": {"wood": 8, "build": 0, "food": 14, "gold": 0, "stone": 0},
        "type": "moveVillagers",
        "from": "sheep",
        "to": "farm"
    }, {
        "type": "newVillagers",
        "count": 3,
        "task": "gold",
        "resources": {"gold": 3, "food": 14, "wood": 8, "build": 0, "stone": 0}
    }, {
        "resources": {"gold": 3, "stone": 0, "wood": 8, "build": 0, "food": 14},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"build": 0, "wood": 8, "stone": 0, "food": 14, "gold": 3}
    }, {
        "task": "gold",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "blacksmith"}, {"type": "market", "count": 1}],
        "count": 2,
        "resources": {"build": 0, "gold": 5, "food": 14, "wood": 8, "stone": 0}
    }, {"age": "castleAge", "type": "ageUp", "resources": {"gold": 5, "food": 14, "build": 0, "wood": 8, "stone": 0}}],
    "readyForPublish": true,
    "image": "Fast Castle",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "civilization": "Generic",
    "title": "Fast Castle"
}, {
    "author": "Cicero",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFemale%20Villager.png?alt=media&token=1ee0eed4-4824-4b0c-8d86-f66fe8fa1b93",
    "build": [{
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}],
        "resources": {"gold": 0, "stone": 0, "build": 0, "food": 6, "wood": 0},
        "count": 6,
        "type": "newVillagers"
    }, {
        "task": "wood",
        "resources": {"wood": 4, "build": 0, "stone": 0, "food": 6, "gold": 0},
        "type": "newVillagers",
        "count": 4
    }, {
        "type": "newVillagers",
        "count": 1,
        "resources": {"build": 0, "food": 7, "wood": 4, "stone": 0, "gold": 0},
        "task": "boar"
    }, {
        "type": "newVillagers",
        "count": 4,
        "task": "berries",
        "resources": {"stone": 0, "build": 0, "wood": 4, "food": 11, "gold": 0},
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}]
    }, {
        "count": 1,
        "animal": "boar",
        "type": "lure",
        "resources": {"build": 0, "gold": 0, "food": 11, "wood": 4, "stone": 0}
    }, {
        "count": 3,
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"build": 0, "wood": 4, "food": 14, "gold": 0, "stone": 0}
    }, {
        "count": 2,
        "resources": {"food": 14, "wood": 4, "stone": 0, "build": 0, "gold": 0},
        "type": "moveVillagers",
        "from": "sheep",
        "to": "farm"
    }, {
        "resources": {"wood": 9, "build": 0, "stone": 0, "food": 14, "gold": 0},
        "task": "wood",
        "count": 5,
        "type": "newVillagers"
    }, {
        "count": 3,
        "resources": {"wood": 9, "build": 0, "stone": 0, "food": 14, "gold": 3},
        "type": "newVillagers",
        "task": "gold"
    }, {
        "resources": {"gold": 3, "stone": 0, "food": 14, "build": 0, "wood": 9},
        "type": "research",
        "tech": ["loom"]
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"stone": 0, "wood": 9, "food": 14, "gold": 3, "build": 0}
    }, {
        "count": 2,
        "type": "moveVillagers",
        "resources": {"wood": 9, "build": 0, "food": 14, "gold": 3, "stone": 0},
        "to": "berries",
        "from": "sheep"
    }, {
        "type": "moveVillagers",
        "to": "farm",
        "resources": {"stone": 0, "gold": 3, "build": 0, "wood": 9, "food": 14},
        "from": "sheep",
        "count": 6
    }, {
        "resources": {"food": 14, "build": 0, "wood": 9, "gold": 3, "stone": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "buildings": [{"count": 1, "type": "blacksmith"}, {"count": 1, "type": "market"}],
        "resources": {"stone": 0, "wood": 11, "food": 14, "build": 0, "gold": 3},
        "type": "newVillagers",
        "count": 2,
        "task": "wood"
    }, {
        "age": "castleAge",
        "type": "ageUp",
        "resources": {"food": 14, "gold": 3, "wood": 11, "stone": 0, "build": 0}
    }, {
        "to": "wood",
        "type": "moveVillagers",
        "count": 3,
        "from": "berries",
        "resources": {"build": 0, "food": 11, "wood": 14, "stone": 0, "gold": 3}
    }],
    "image": "Female Villager",
    "difficulty": 1,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "uptime": {"castleAge": "15:40", "feudalAge": "12:10"},
    "title": "Fast Castle → Boom",
    "readyForPublish": true,
    "civilization": "Generic",
    "id": 15,
    "attributes": ["fastCastle", "arena"],
    "description": "Place two extra town centers upon hitting Castle and maintain production from all three. In Castle, set all gather points to wood, and build farms as soon as wood becomes available. Leaving villagers on gold means food can be bought if needed, and it can also be used to buy stone for a fourth town center later. Usually, only used on closed maps.\n\n",
    "pop": {"castleAge": 2, "feudalAge": 27}
}, {
    "uptime": {"castleAge": "16:05", "feudalAge": "12:35"},
    "build": [{
        "resources": {"gold": 0, "build": 0, "stone": 0, "wood": 0, "food": 6},
        "task": "sheep",
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "count": 6
    }, {
        "type": "newVillagers",
        "count": 4,
        "task": "wood",
        "resources": {"food": 6, "gold": 0, "stone": 0, "wood": 4, "build": 0}
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 1,
        "resources": {"food": 7, "wood": 4, "build": 0, "stone": 0, "gold": 0}
    }, {
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "type": "newVillagers",
        "task": "berries",
        "count": 4,
        "resources": {"wood": 4, "build": 0, "food": 11, "stone": 0, "gold": 0}
    }, {
        "animal": "boar",
        "resources": {"stone": 0, "food": 11, "gold": 0, "build": 0, "wood": 4},
        "type": "lure",
        "count": 1
    }, {
        "count": 3,
        "type": "newVillagers",
        "resources": {"gold": 0, "stone": 0, "build": 0, "food": 14, "wood": 4},
        "task": "sheep"
    }, {
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "count": 2,
        "resources": {"wood": 4, "gold": 0, "stone": 0, "build": 0, "food": 14}
    }, {
        "count": 5,
        "task": "wood",
        "resources": {"build": 0, "gold": 0, "food": 14, "stone": 0, "wood": 9},
        "type": "newVillagers"
    }, {
        "resources": {"gold": 2, "food": 14, "build": 0, "wood": 9, "stone": 0},
        "count": 2,
        "type": "newVillagers",
        "task": "gold"
    }, {
        "task": "stone",
        "type": "newVillagers",
        "count": 2,
        "resources": {"food": 14, "stone": 2, "wood": 9, "gold": 2, "build": 0}
    }, {
        "resources": {"wood": 9, "stone": 2, "gold": 2, "build": 0, "food": 14},
        "tech": ["loom"],
        "type": "research"
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"stone": 2, "wood": 9, "food": 14, "build": 0, "gold": 2}
    }, {
        "count": 6,
        "from": "sheep",
        "resources": {"stone": 2, "gold": 2, "food": 14, "wood": 9, "build": 0},
        "to": "farm",
        "type": "moveVillagers"
    }, {
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"wood": 9, "build": 0, "stone": 4, "gold": 2, "food": 12},
        "count": 2,
        "to": "stone"
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"stone": 4, "wood": 9, "gold": 2, "food": 12, "build": 0}
    }, {
        "type": "newVillagers",
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "task": "stone",
        "count": 2,
        "resources": {"food": 12, "gold": 2, "build": 0, "wood": 9, "stone": 6}
    }, {
        "resources": {"wood": 9, "gold": 2, "build": 0, "food": 12, "stone": 6},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "age": "castleAge",
        "type": "newAge",
        "resources": {"build": 0, "food": 12, "gold": 2, "stone": 6, "wood": 9}
    }, {
        "resources": {"stone": 6, "build": 0, "wood": 9, "gold": 2, "food": 12},
        "type": "build",
        "buildings": [{"type": "castle", "count": 1}]
    }],
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "author": "Cicero",
    "pop": {"castleAge": 2, "feudalAge": 28},
    "image": "Teutonic Knight",
    "id": 14,
    "civilization": "Generic",
    "readyForPublish": true,
    "title": "Fast Castle → Unique Unit",
    "attributes": ["fastCastle", "arena"],
    "difficulty": 1,
    "description": "Fast castle and have the stone to build one when reaching it. Sometimes used as a pocket with civs such as Burmese/Mayans/Spanish. Eco balance while advancing to Castle will vary according to the civ and their unique unit.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FTeutonic%20Knight.png?alt=media&token=bc8452dd-13aa-47ec-b60b-26d626f4bd45"
}, {
    "pop": {"imperialAge": 3, "castleAge": 2, "feudalAge": 32},
    "description": "Castle drop into fast Imperial for trebs.",
    "title": "Fast Imp Castle Drop",
    "image": "Fast Imperial",
    "author": "Cicero",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Imperial.png?alt=media&token=0d8d1c36-fe49-41f3-b8d7-9f6aa3c6cd6e",
    "build": [{
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "resources": {"stone": 0, "wood": 0, "build": 0, "food": 6, "gold": 0},
        "type": "newVillagers"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 4,
        "resources": {"food": 6, "wood": 4, "gold": 0, "stone": 0, "build": 0}
    }, {
        "task": "boar",
        "count": 1,
        "resources": {"wood": 4, "food": 7, "build": 0, "gold": 0, "stone": 0},
        "type": "newVillagers"
    }, {
        "task": "berries",
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "count": 4,
        "resources": {"food": 11, "gold": 0, "stone": 0, "build": 0, "wood": 4}
    }, {
        "resources": {"gold": 0, "build": 0, "food": 11, "stone": 0, "wood": 4},
        "animal": "boar",
        "count": 1,
        "type": "lure"
    }, {
        "count": 6,
        "task": "wood",
        "resources": {"gold": 0, "build": 0, "food": 11, "wood": 10, "stone": 0},
        "type": "newVillagers"
    }, {
        "resources": {"stone": 0, "wood": 10, "build": 0, "food": 16, "gold": 0},
        "count": 5,
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "count": 12,
        "type": "moveVillagers",
        "resources": {"wood": 10, "food": 16, "build": 0, "stone": 0, "gold": 0},
        "to": "farm",
        "from": "sheep"
    }, {
        "resources": {"wood": 10, "food": 16, "build": 0, "stone": 0, "gold": 5},
        "task": "gold",
        "count": 5,
        "type": "newVillagers"
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"food": 16, "build": 0, "gold": 5, "wood": 10, "stone": 0}
    }, {
        "count": 4,
        "from": "wood",
        "to": "stone",
        "type": "moveVillagers",
        "resources": {"stone": 4, "gold": 5, "build": 0, "food": 16, "wood": 6}
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "food": 16, "gold": 5, "wood": 6, "stone": 4},
        "type": "newAge"
    }, {
        "task": "stone",
        "count": 2,
        "buildings": [{"type": "blacksmith", "count": 1}, {"type": "market", "count": 1}],
        "type": "newVillagers",
        "resources": {"gold": 5, "wood": 6, "food": 16, "stone": 6, "build": 0}
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"stone": 6, "gold": 5, "wood": 6, "build": 0, "food": 16}
    }, {
        "resources": {"stone": 6, "wood": 6, "food": 14, "gold": 7, "build": 0},
        "type": "moveVillagers",
        "from": "berries",
        "to": "gold",
        "count": 2
    }, {
        "type": "newAge",
        "age": "castleAge",
        "resources": {"wood": 6, "food": 14, "stone": 6, "build": 0, "gold": 7}
    }, {
        "buildings": [{"count": 1, "type": "castle"}],
        "resources": {"food": 14, "gold": 7, "wood": 6, "build": 0, "stone": 6},
        "type": "build"
    }, {
        "resources": {"wood": 6, "food": 14, "gold": 10, "build": 0, "stone": 6},
        "type": "newVillagers",
        "task": "gold",
        "count": 3
    }, {
        "resources": {"stone": 6, "build": 0, "wood": 6, "food": 14, "gold": 10},
        "loom": false,
        "age": "imperialAge",
        "type": "ageUp"
    }],
    "attributes": ["fastImperial", "arena"],
    "readyForPublish": true,
    "uptime": {"castleAge": "17:20", "feudalAge": "13:50", "imperialAge": "21:45"},
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "id": 23,
    "civilization": "Generic",
    "difficulty": 2
}, {
    "civilization": "Generic",
    "difficulty": 1,
    "description": "Generic build. Pushing deer would improve these builds. Get double-bit axe while advancing to Castle. Turks are one of the most viable for a fast imperial due to their strong, faster gunpowder. For Turks, send just 1 to Gold from Wood after clicking Feudal and build Barracks while advancing to Feudal age and then a Range instead of a Market.",
    "readyForPublish": true,
    "author": "Cicero",
    "id": 12,
    "build": [{
        "resources": {"food": 6, "build": 0, "wood": 0, "stone": 0, "gold": 0},
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers",
        "count": 6
    }, {
        "type": "newVillagers",
        "count": 4,
        "task": "wood",
        "resources": {"wood": 4, "gold": 0, "stone": 0, "build": 0, "food": 6}
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 1,
        "resources": {"build": 0, "stone": 0, "food": 7, "gold": 0, "wood": 4}
    }, {
        "count": 4,
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"wood": 4, "food": 11, "gold": 0, "stone": 0, "build": 0},
        "type": "newVillagers",
        "task": "berries"
    }, {
        "type": "lure",
        "count": 1,
        "resources": {"stone": 0, "food": 11, "build": 0, "wood": 4, "gold": 0},
        "animal": "boar"
    }, {
        "resources": {"wood": 10, "build": 0, "gold": 0, "stone": 0, "food": 11},
        "task": "wood",
        "count": 6,
        "type": "newVillagers"
    }, {
        "task": "sheep",
        "count": 5,
        "type": "newVillagers",
        "resources": {"food": 16, "stone": 0, "gold": 0, "build": 0, "wood": 10}
    }, {
        "count": 12,
        "type": "moveVillagers",
        "resources": {"gold": 0, "wood": 10, "food": 16, "build": 0, "stone": 0},
        "from": "sheep",
        "to": "farm"
    }, {
        "resources": {"stone": 0, "gold": 4, "food": 16, "wood": 10, "build": 0},
        "type": "newVillagers",
        "task": "gold",
        "count": 4
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"gold": 4, "wood": 10, "build": 0, "stone": 0, "food": 16}
    }, {
        "count": 2,
        "from": "wood",
        "to": "gold",
        "type": "moveVillagers",
        "resources": {"food": 16, "gold": 6, "stone": 0, "wood": 8, "build": 0}
    }, {
        "age": "feudalAge",
        "resources": {"gold": 6, "build": 0, "stone": 0, "food": 16, "wood": 8},
        "type": "newAge"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "type": "newVillagers",
        "resources": {"stone": 0, "wood": 8, "build": 0, "food": 16, "gold": 8},
        "task": "gold",
        "count": 2
    }, {
        "resources": {"gold": 8, "stone": 0, "food": 16, "build": 0, "wood": 8},
        "type": "ageUp",
        "age": "castleAge"
    }, {
        "resources": {"stone": 0, "build": 0, "wood": 8, "food": 16, "gold": 8},
        "from": "berries",
        "count": 2,
        "to": "farm",
        "type": "moveVillagers"
    }, {
        "age": "castleAge",
        "type": "newAge",
        "resources": {"gold": 8, "build": 0, "stone": 0, "food": 16, "wood": 8}
    }, {
        "count": 2,
        "resources": {"stone": 0, "gold": 10, "wood": 8, "food": 16, "build": 0},
        "task": "gold",
        "buildings": [{"type": "monastery", "count": 1}, {"type": "siegeWorkshop", "count": 1}],
        "type": "newVillagers"
    }, {
        "type": "ageUp",
        "age": "imperialAge",
        "resources": {"stone": 0, "gold": 10, "build": 0, "wood": 8, "food": 16}
    }],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Imperial.png?alt=media&token=0d8d1c36-fe49-41f3-b8d7-9f6aa3c6cd6e",
    "uptime": {"imperialAge": "20:55", "feudalAge": "13:25", "castleAge": "16:55"},
    "image": "Fast Imperial",
    "title": "Fast Imperial",
    "pop": {"feudalAge": 31, "castleAge": 2, "imperialAge": 2},
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "attributes": ["fastImperial"]
}, {
    "difficulty": 1,
    "civilization": "Generic",
    "build": [{
        "resources": {"wood": 0, "stone": 0, "gold": 0, "build": 0, "food": 6},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "task": "sheep"
    }, {
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 0, "food": 6},
        "type": "newVillagers",
        "count": 4,
        "task": "wood"
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 2,
        "resources": {"gold": 0, "stone": 0, "food": 8, "wood": 4, "build": 0}
    }, {
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "count": 4,
        "resources": {"build": 0, "gold": 0, "food": 12, "wood": 4, "stone": 0},
        "type": "newVillagers",
        "task": "berries"
    }, {
        "count": 1,
        "resources": {"food": 12, "gold": 0, "stone": 0, "wood": 4, "build": 0},
        "animal": "boar",
        "type": "lure"
    }, {
        "resources": {"food": 12, "stone": 0, "build": 0, "gold": 0, "wood": 9},
        "type": "newVillagers",
        "task": "wood",
        "count": 5
    }, {
        "resources": {"build": 0, "food": 14, "gold": 0, "wood": 9, "stone": 0},
        "count": 2,
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "count": 10,
        "type": "moveVillagers",
        "to": "farm",
        "resources": {"food": 14, "wood": 9, "build": 0, "stone": 0, "gold": 0},
        "from": "sheep"
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"stone": 0, "gold": 4, "wood": 9, "build": 0, "food": 14},
        "count": 4
    }, {
        "type": "ageUp",
        "resources": {"build": 0, "stone": 0, "gold": 4, "food": 14, "wood": 9},
        "age": "feudalAge"
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "gold": 4, "stone": 0, "food": 14, "wood": 9},
        "type": "newAge"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "count": 2,
        "type": "newVillagers",
        "task": "gold",
        "resources": {"stone": 0, "food": 14, "gold": 6, "build": 0, "wood": 9}
    }, {
        "type": "ageUp",
        "resources": {"wood": 9, "stone": 0, "gold": 6, "food": 14, "build": 0},
        "age": "castleAge"
    }, {
        "type": "research",
        "resources": {"food": 14, "stone": 0, "gold": 6, "build": 0, "wood": 9},
        "tech": ["doubleBitAxe"]
    }, {
        "type": "newAge",
        "resources": {"wood": 9, "stone": 0, "food": 14, "build": 0, "gold": 6},
        "age": "castleAge"
    }, {
        "resources": {"gold": 8, "build": 0, "food": 14, "stone": 0, "wood": 9},
        "count": 2,
        "task": "gold",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "monastery"}, {"count": 1, "type": "siegeWorkshop"}]
    }, {
        "resources": {"build": 0, "gold": 8, "food": 14, "stone": 0, "wood": 9},
        "type": "ageUp",
        "age": "imperialAge"
    }],
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "author": "Cicero",
    "title": "Fast Imperial",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Imperial.png?alt=media&token=0d8d1c36-fe49-41f3-b8d7-9f6aa3c6cd6e",
    "uptime": {"castleAge": "15:40", "feudalAge": "12:10", "imperialAge": "19:40"},
    "description": "Arena build. Byzantines are one of the best civs for a fast Imperial due to the reduced cost, and they have strong options including monks and gunpowder.",
    "pop": {"castleAge": 2, "imperialAge": 2, "feudalAge": 28},
    "image": "Fast Imperial",
    "readyForPublish": true,
    "id": 37,
    "attributes": ["fastImperial", "arena"]
}, {
    "image": "Market",
    "uptime": {"feudalAge": "10:55", "castleAge": "14:25"},
    "pop": {"castleAge": 2, "feudalAge": 25},
    "difficulty": 2,
    "attributes": ["fastCastle", "arena"],
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "civilization": "Generic",
    "id": 22,
    "author": "Ciceo",
    "description": "Collect 30 gold without a mining camp and sell 100 wood in Feudal for a faster Castle time. Skip loom.",
    "title": "FC - Selling Wood",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMarket.png?alt=media&token=d28450e6-f636-46ff-b3fe-ef10d54e7561",
    "build": [{
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "task": "sheep",
        "resources": {"stone": 0, "gold": 0, "wood": 0, "build": 0, "food": 6}
    }, {
        "count": 4,
        "task": "wood",
        "resources": {"wood": 4, "food": 6, "build": 0, "gold": 0, "stone": 0},
        "type": "newVillagers"
    }, {
        "count": 1,
        "resources": {"gold": 0, "stone": 0, "wood": 4, "food": 7, "build": 0},
        "task": "boar",
        "type": "newVillagers"
    }, {
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "resources": {"food": 11, "gold": 0, "build": 0, "stone": 0, "wood": 4},
        "task": "berries",
        "count": 4,
        "type": "newVillagers"
    }, {
        "count": 4,
        "type": "newVillagers",
        "resources": {"wood": 4, "food": 15, "build": 0, "gold": 0, "stone": 0},
        "task": "sheep"
    }, {
        "type": "moveVillagers",
        "from": "sheep",
        "count": 3,
        "resources": {"wood": 4, "build": 0, "food": 15, "stone": 0, "gold": 0},
        "to": "farm"
    }, {
        "count": 4,
        "type": "newVillagers",
        "resources": {"wood": 8, "food": 15, "stone": 0, "build": 0, "gold": 0},
        "task": "wood"
    }, {
        "type": "moveVillagers",
        "resources": {"food": 15, "build": 0, "gold": 0, "wood": 8, "stone": 0},
        "count": 2,
        "from": "sheep",
        "to": "berries"
    }, {
        "type": "moveVillagers",
        "count": 3,
        "from": "sheep",
        "resources": {"gold": 0, "food": 15, "wood": 8, "build": 0, "stone": 0},
        "to": "farm"
    }, {
        "type": "collectGold",
        "resources": {"wood": 8, "stone": 0, "food": 15, "gold": 1, "build": 0},
        "task": "collect30GoldWithNewVillager",
        "count": 1,
        "subType": "newVillagers"
    }, {
        "resources": {"stone": 0, "gold": 1, "build": 0, "wood": 8, "food": 15},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "resources": {"gold": 1, "food": 15, "build": 0, "wood": 8, "stone": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "task": "gold",
        "count": 2,
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "type": "newVillagers",
        "resources": {"gold": 3, "stone": 0, "wood": 8, "build": 0, "food": 15}
    }, {
        "resources": {"gold": 3, "stone": 0, "build": 0, "food": 15, "wood": 8},
        "action": "sell",
        "type": "trade",
        "count": 100,
        "resource": "wood"
    }, {"resources": {"food": 15, "wood": 8, "gold": 3, "build": 0, "stone": 0}, "age": "castleAge", "type": "ageUp"}],
    "readyForPublish": true
}, {
    "title": "FC Castle Drop",
    "author": "Cicero",
    "uptime": {"castleAge": "15:15", "feudalAge": "11:45"},
    "difficulty": 1,
    "build": [{
        "buildings": [{"type": "house", "count": 2}],
        "resources": {"stone": 0, "food": 6, "gold": 0, "wood": 0, "build": 0},
        "task": "sheep",
        "count": 6,
        "type": "newVillagers"
    }, {
        "count": 4,
        "resources": {"build": 0, "gold": 0, "wood": 4, "stone": 0, "food": 6},
        "type": "newVillagers",
        "task": "wood"
    }, {
        "resources": {"wood": 4, "food": 7, "gold": 0, "build": 0, "stone": 0},
        "count": 1,
        "task": "boar",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "count": 4,
        "task": "berries",
        "resources": {"gold": 0, "food": 11, "wood": 4, "build": 0, "stone": 0}
    }, {
        "resources": {"food": 11, "wood": 4, "build": 0, "gold": 0, "stone": 0},
        "animal": "boar",
        "count": 1,
        "type": "lure"
    }, {
        "count": 3,
        "resources": {"food": 14, "gold": 0, "stone": 0, "build": 0, "wood": 4},
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "from": "sheep",
        "resources": {"gold": 0, "wood": 4, "food": 14, "build": 0, "stone": 0},
        "to": "farm",
        "type": "moveVillagers",
        "count": 2
    }, {
        "count": 4,
        "resources": {"food": 14, "wood": 8, "gold": 0, "build": 0, "stone": 0},
        "task": "wood",
        "type": "newVillagers"
    }, {
        "resources": {"build": 0, "food": 14, "gold": 0, "wood": 8, "stone": 0},
        "from": "sheep",
        "count": 2,
        "to": "berries",
        "type": "moveVillagers"
    }, {
        "from": "sheep",
        "to": "farm",
        "count": 3,
        "type": "moveVillagers",
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 14, "wood": 8}
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"stone": 0, "wood": 8, "food": 14, "build": 0, "gold": 2},
        "count": 2
    }, {
        "resources": {"wood": 8, "food": 14, "build": 0, "gold": 2, "stone": 2},
        "count": 2,
        "task": "stone",
        "type": "newVillagers"
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"stone": 2, "build": 0, "food": 14, "gold": 2, "wood": 8}
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "gold": 2, "wood": 8, "stone": 2, "food": 14},
        "type": "newAge"
    }, {
        "resources": {"gold": 2, "food": 14, "build": 0, "stone": 4, "wood": 8},
        "type": "newVillagers",
        "task": "stone",
        "count": 2,
        "buildings": [{"count": 1, "type": "blacksmith"}, {"count": 1, "type": "market"}]
    }, {
        "resources": {"food": 14, "wood": 8, "build": 0, "stone": 4, "gold": 2},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "count": 2,
        "type": "moveVillagers",
        "resources": {"stone": 6, "gold": 2, "wood": 8, "food": 12, "build": 0},
        "from": "sheep",
        "to": "stone"
    }, {
        "type": "newAge",
        "resources": {"wood": 8, "stone": 6, "gold": 2, "food": 12, "build": 0},
        "age": "castleAge"
    }, {
        "type": "build",
        "resources": {"build": 0, "stone": 6, "wood": 8, "food": 12, "gold": 2},
        "buildings": [{"count": 1, "type": "castle"}]
    }],
    "attributes": ["fastCastle", "arena"],
    "readyForPublish": true,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "description": "A Fast Castle Build that allows for building a castle upon hitting Castle Age.",
    "id": 21,
    "image": "Castle",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCastle.png?alt=media&token=3e2e8e46-8121-46db-bf51-8740fb75022b",
    "civilization": "Generic",
    "pop": {"feudalAge": 27, "castleAge": 2}
}, {
    "author": "HumzaCrumza",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "difficulty": 2,
    "civilization": "Franks",
    "uptime": {"feudalAge": "08:50", "castleAge": "17:45"},
    "pop": {"castleAge": 15, "feudalAge": 19},
    "title": "Fast Scouts",
    "reference": "https://youtu.be/WzNOfza1Xso",
    "build": [{
        "resources": {"gold": 0, "food": 6, "wood": 0, "build": 0, "stone": 0},
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "boar",
        "resources": {"build": 0, "gold": 0, "food": 7, "wood": 0, "stone": 0},
        "count": 1
    }, {
        "resources": {"food": 7, "gold": 0, "stone": 0, "build": 0, "wood": 3},
        "task": "wood",
        "count": 3,
        "type": "newVillagers"
    }, {
        "resources": {"build": 0, "food": 9, "gold": 0, "stone": 0, "wood": 3},
        "count": 2,
        "type": "newVillagers",
        "task": "boar"
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "wood": 3, "food": 15, "build": 0, "gold": 0},
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "mill"}],
        "task": "berries",
        "count": 6
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"build": 0, "stone": 0, "gold": 0, "food": 15, "wood": 3}
    }, {
        "age": "feudalAge",
        "resources": {"food": 15, "gold": 0, "build": 0, "stone": 0, "wood": 3},
        "type": "ageUp"
    }, {
        "count": 5,
        "from": "sheep",
        "resources": {"wood": 8, "build": 0, "gold": 0, "food": 10, "stone": 0},
        "type": "moveVillagers",
        "to": "wood"
    }, {
        "type": "build",
        "resources": {"stone": 0, "build": 0, "wood": 8, "food": 10, "gold": 0},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"build": 0, "stone": 0, "food": 10, "gold": 0, "wood": 8}
    }, {
        "task": "wood",
        "count": 2,
        "type": "newVillagers",
        "resources": {"food": 10, "gold": 0, "wood": 10, "stone": 0, "build": 0},
        "buildings": [{"type": "stable", "count": 1}]
    }, {
        "type": "research",
        "tech": ["doubleBitAxe"],
        "resources": {"build": 0, "food": 10, "stone": 0, "gold": 0, "wood": 10}
    }, {
        "task": "farm",
        "type": "newVillagers",
        "resources": {"build": 0, "wood": 10, "food": 18, "gold": 0, "stone": 0},
        "count": 8
    }, {
        "resources": {"gold": 5, "stone": 0, "wood": 10, "food": 18, "build": 0},
        "count": 5,
        "type": "newVillagers",
        "task": "gold"
    }, {"resources": {"stone": 0, "wood": 10, "build": 0, "gold": 5, "food": 18}, "type": "ageUp", "age": "castleAge"}],
    "readyForPublish": true,
    "id": 44,
    "description": "A faster scout rush build with the Franks making sure to hit your opponent before walls go up, which makes use of the berry bonus.",
    "attributes": ["fastFeudal"],
    "image": "Scout"
}, {
    "author": "TaToH",
    "uptime": {"feudalAge": "10:30"},
    "difficulty": 2,
    "description": "Fast all in water build order to win water by producing galleys out of 3 docks and build 5 fishing ships in Dark Age.",
    "id": 6,
    "readyForPublish": true,
    "pop": {"feudalAge": 23},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FGalley.png?alt=media&token=02fd70df-3b7a-4fd7-b145-a9234140149e",
    "civilization": "Generic",
    "image": "Galley",
    "attributes": ["water", "fastFeudal"],
    "reference": "https://www.youtube.com/watch?v=wWkfpFcKK3o",
    "build": [{
        "count": 6,
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"food": 6, "wood": 0, "stone": 0, "gold": 0, "build": 0},
        "task": "sheep"
    }, {
        "resources": {"stone": 0, "wood": 4, "build": 0, "food": 6, "gold": 0},
        "task": "wood",
        "count": 4,
        "type": "newVillagers"
    }, {
        "count": 1,
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "dock"}],
        "resources": {"build": 1, "gold": 0, "stone": 0, "wood": 4, "food": 6},
        "type": "newVillagers",
        "task": "build"
    }, {
        "unit": "fishingShip",
        "count": 5,
        "resources": {"wood": 4, "food": 6, "build": 1, "gold": 0, "stone": 0},
        "type": "trainUnit"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "resources": {"stone": 0, "wood": 5, "gold": 0, "food": 6, "build": 1},
        "count": 1
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "boar",
        "resources": {"wood": 5, "food": 7, "build": 1, "gold": 0, "stone": 0}
    }, {
        "count": 5,
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"wood": 5, "build": 1, "food": 12, "gold": 0, "stone": 0}
    }, {
        "resources": {"build": 1, "stone": 0, "gold": 0, "food": 12, "wood": 5},
        "type": "lure",
        "count": 1,
        "animal": "boar"
    }, {
        "type": "newVillagers",
        "count": 4,
        "task": "wood",
        "resources": {"build": 1, "stone": 0, "wood": 9, "food": 12, "gold": 0}
    }, {
        "tech": ["loom"],
        "resources": {"build": 1, "stone": 0, "gold": 0, "wood": 9, "food": 12},
        "type": "research"
    }, {
        "age": "feudalAge",
        "resources": {"wood": 9, "build": 1, "stone": 0, "food": 12, "gold": 0},
        "type": "ageUp"
    }, {
        "from": "sheep",
        "type": "moveVillagers",
        "count": 4,
        "resources": {"wood": 9, "food": 8, "build": 1, "gold": 4, "stone": 0},
        "to": "gold"
    }, {
        "type": "moveVillagers",
        "to": "wood",
        "from": "sheep",
        "resources": {"build": 1, "gold": 4, "stone": 0, "food": 0, "wood": 17},
        "count": 8
    }, {
        "type": "build",
        "buildings": [{"type": "dock", "count": 1}],
        "resources": {"wood": 17, "build": 1, "food": 0, "stone": 0, "gold": 4}
    }, {
        "resources": {"gold": 4, "build": 1, "stone": 0, "wood": 17, "food": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "type": "research",
        "tech": ["doubleBitAxe"],
        "resources": {"stone": 0, "wood": 17, "food": 0, "build": 1, "gold": 4}
    }, {
        "task": "berries",
        "count": 4,
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "mill"}],
        "resources": {"gold": 4, "build": 1, "wood": 17, "food": 4, "stone": 0}
    }, {
        "buildings": [{"type": "dock", "count": 1}],
        "type": "build",
        "resources": {"build": 1, "food": 4, "gold": 4, "stone": 0, "wood": 17}
    }, {
        "unit": "galley",
        "count": "∞",
        "type": "trainUnit",
        "resources": {"build": 1, "gold": 4, "stone": 0, "wood": 17, "food": 4}
    }, {
        "task": "gold",
        "type": "newVillagers",
        "resources": {"food": 4, "stone": 0, "wood": 17, "build": 1, "gold": 6},
        "count": 2
    }],
    "title": "Galleys"
}, {
    "attributes": ["fastFeudal", "water"],
    "author": "Cicero",
    "difficulty": 2,
    "description": "Generic water build; fast Feudal with four fishing ships, followed by constant production from two, then three docks shortly after. Usually, start with fire galleys; fletching is necessary if switching to galleys.",
    "title": "Galleys",
    "id": 19,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FGalley.png?alt=media&token=02fd70df-3b7a-4fd7-b145-a9234140149e",
    "civilization": "Generic",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "pop": {"castleAge": 21, "feudalAge": 21},
    "image": "Galley",
    "readyForPublish": true,
    "uptime": {"feudalAge": "09:40", "castleAge": "21:05"},
    "build": [{
        "task": "sheep",
        "resources": {"stone": 0, "food": 6, "build": 0, "wood": 0, "gold": 0},
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "resources": {"wood": 4, "build": 0, "gold": 0, "stone": 0, "food": 6},
        "count": 4
    }, {
        "resources": {"stone": 0, "wood": 4, "build": 0, "gold": 0, "food": 7},
        "count": 1,
        "task": "boar",
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "build": 1, "stone": 0, "food": 7, "gold": 0},
        "task": "build",
        "buildings": [{"count": 2, "type": "house"}, {"type": "dock", "count": 1}],
        "count": 1,
        "type": "newVillagers"
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "wood",
        "resources": {"stone": 0, "wood": 5, "food": 7, "gold": 0, "build": 1}
    }, {
        "type": "newVillagers",
        "resources": {"food": 8, "stone": 0, "gold": 0, "build": 1, "wood": 5},
        "task": "boar",
        "count": 1
    }, {
        "type": "trainUnit",
        "count": 4,
        "unit": "fishingShip",
        "resources": {"stone": 0, "gold": 0, "wood": 5, "food": 8, "build": 1}
    }, {
        "count": 6,
        "resources": {"stone": 0, "wood": 5, "food": 14, "build": 1, "gold": 0},
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"food": 14, "gold": 0, "stone": 0, "build": 1, "wood": 5}
    }, {
        "resources": {"wood": 5, "gold": 0, "build": 1, "stone": 0, "food": 14},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "to": "wood",
        "type": "moveVillagers",
        "resources": {"build": 1, "stone": 0, "gold": 0, "wood": 14, "food": 5},
        "count": 9,
        "from": "sheep"
    }, {
        "from": "sheep",
        "resources": {"stone": 0, "gold": 5, "build": 1, "food": 0, "wood": 14},
        "to": "gold",
        "count": 5,
        "type": "moveVillagers"
    }, {
        "buildings": [{"type": "dock", "count": 1}],
        "type": "build",
        "resources": {"gold": 5, "build": 1, "stone": 0, "wood": 14, "food": 0}
    }, {
        "resources": {"stone": 0, "food": 0, "build": 1, "wood": 14, "gold": 5},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "count": 1,
        "type": "newVillagers",
        "resources": {"gold": 6, "food": 0, "stone": 0, "wood": 14, "build": 1},
        "task": "gold"
    }, {
        "resources": {"build": 1, "wood": 14, "stone": 0, "food": 0, "gold": 6},
        "buildings": [{"count": 1, "type": "dock"}],
        "type": "build"
    }, {
        "count": 8,
        "task": "berries",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "mill"}],
        "resources": {"gold": 6, "wood": 14, "stone": 0, "food": 8, "build": 1}
    }, {
        "buildings": [{"count": 1, "type": "blacksmith"}, {"count": 1, "type": "market"}],
        "type": "build",
        "resources": {"build": 1, "stone": 0, "gold": 6, "food": 8, "wood": 14}
    }, {
        "count": 8,
        "type": "newVillagers",
        "task": "farm",
        "resources": {"food": 16, "gold": 6, "stone": 0, "wood": 14, "build": 1}
    }, {
        "count": 2,
        "task": "gold",
        "resources": {"build": 1, "stone": 0, "food": 16, "wood": 14, "gold": 8},
        "type": "newVillagers"
    }, {
        "count": 2,
        "task": "wood",
        "type": "newVillagers",
        "resources": {"build": 1, "stone": 0, "gold": 8, "wood": 16, "food": 16}
    }, {
        "age": "castleAge",
        "resources": {"food": 16, "gold": 8, "build": 1, "wood": 16, "stone": 0},
        "type": "ageUp"
    }, {
        "from": "berries",
        "count": 8,
        "type": "moveVillagers",
        "resources": {"stone": 0, "food": 8, "wood": 24, "build": 1, "gold": 8},
        "to": "wood"
    }]
}, {
    "pop": {"feudalAge": 28, "castleAge": 2},
    "author": "Art of War",
    "difficulty": 1,
    "uptime": {"castleAge": "16:05", "feudalAge": "12:35"},
    "build": [{
        "task": "sheep",
        "resources": {"wood": 0, "stone": 0, "food": 6, "build": 0, "gold": 0},
        "type": "newVillagers",
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}]
    }, {
        "type": "newVillagers",
        "count": 4,
        "resources": {"gold": 0, "wood": 4, "food": 6, "stone": 0, "build": 0},
        "task": "wood"
    }, {
        "task": "boar",
        "type": "newVillagers",
        "resources": {"gold": 0, "food": 7, "stone": 0, "build": 0, "wood": 4},
        "count": 1
    }, {
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "type": "newVillagers",
        "resources": {"stone": 0, "food": 10, "wood": 4, "build": 0, "gold": 0},
        "task": "berries",
        "count": 3
    }, {
        "type": "newVillagers",
        "resources": {"wood": 4, "gold": 0, "build": 0, "food": 11, "stone": 0},
        "task": "boar",
        "count": 1
    }, {
        "type": "newVillagers",
        "count": 3,
        "task": "berries",
        "resources": {"wood": 4, "gold": 0, "food": 14, "stone": 0, "build": 0}
    }, {
        "count": 6,
        "resources": {"gold": 0, "stone": 0, "food": 14, "wood": 10, "build": 0},
        "task": "wood",
        "type": "newVillagers"
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 14, "wood": 10},
        "from": "sheep",
        "count": 8,
        "to": "farm",
        "type": "moveVillagers"
    }, {
        "type": "newVillagers",
        "count": 3,
        "task": "gold",
        "resources": {"build": 0, "gold": 3, "food": 14, "wood": 10, "stone": 0}
    }, {
        "resources": {"wood": 10, "food": 14, "build": 0, "gold": 3, "stone": 0},
        "tech": ["loom"],
        "type": "research"
    }, {
        "resources": {"build": 0, "gold": 3, "food": 14, "wood": 10, "stone": 0},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "resources": {"build": 0, "food": 14, "wood": 10, "gold": 3, "stone": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "resources": {"gold": 3, "wood": 12, "build": 0, "stone": 0, "food": 14},
        "buildings": [{"type": "blacksmith", "count": 1}, {"type": "market", "count": 1}],
        "count": 2
    }, {"age": "castleAge", "resources": {"food": 14, "stone": 0, "gold": 3, "wood": 12, "build": 0}, "type": "ageUp"}],
    "id": 16,
    "reference": "",
    "civilization": "Generic",
    "description": "One of the most common strategies in multiplayer games is the Fast Castle Age strategy. The goal is to get to the Castle Age as fast as possible.",
    "attributes": ["fastCastle"],
    "title": "Generic Fast Castle",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Castle.png?alt=media&token=a12d6e5f-f68b-4f5d-bf8b-9b7670beb357",
    "readyForPublish": true,
    "image": "Fast Castle"
}, {
    "author": "ShadowCrystallux",
    "civilization": "Generic",
    "readyForPublish": true,
    "difficulty": 1,
    "image": "Fast Feudal",
    "title": "Generic Fast Feudal",
    "build": [{
        "type": "newVillagers",
        "resources": {"food": 6, "wood": 0, "build": 0, "stone": 0, "gold": 0},
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "task": "sheep"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "resources": {"stone": 0, "food": 6, "gold": 0, "wood": 4, "build": 0},
        "count": 4
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 1,
        "resources": {"gold": 0, "build": 0, "wood": 4, "food": 7, "stone": 0}
    }, {
        "count": 4,
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "type": "newVillagers",
        "task": "berries",
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 4, "food": 11}
    }, {
        "count": 1,
        "resources": {"wood": 4, "food": 11, "stone": 0, "gold": 0, "build": 0},
        "animal": "boar",
        "type": "lure"
    }, {
        "task": "sheep",
        "count": 5,
        "resources": {"gold": 0, "food": 16, "wood": 4, "build": 0, "stone": 0},
        "type": "newVillagers"
    }, {
        "type": "research",
        "resources": {"gold": 0, "food": 16, "wood": 4, "build": 0, "stone": 0},
        "tech": ["loom"]
    }, {"age": "feudalAge", "type": "ageUp", "resources": {"food": 16, "gold": 0, "build": 0, "wood": 4, "stone": 0}}],
    "reference": "https://youtu.be/jeRv-ZLFG6s",
    "description": "This is a non-specialiced fast Feudal build. Most standard Feudal rushing builds only have slight adjustments to this one.",
    "attributes": ["fastFeudal"],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Feudal.png?alt=media&token=042110b3-3f5a-4e9a-a649-010d88b50797",
    "uptime": {"feudalAge": "09:40"},
    "id": 34,
    "pop": {"feudalAge": 21}
}, {
    "title": "Towers",
    "build": [{
        "resources": {"food": 6, "gold": 0, "build": 0, "stone": 0, "wood": 0},
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 2,
        "resources": {"stone": 0, "wood": 2, "build": 0, "food": 6, "gold": 0}
    }, {
        "count": 3,
        "resources": {"stone": 0, "food": 9, "wood": 2, "build": 0, "gold": 0},
        "task": "boar",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "berries",
        "count": 4,
        "resources": {"food": 13, "build": 0, "wood": 2, "stone": 0, "gold": 0},
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}]
    }, {
        "animal": "boar",
        "count": 1,
        "type": "lure",
        "resources": {"wood": 2, "food": 13, "stone": 0, "build": 0, "gold": 0}
    }, {
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"food": 16, "build": 0, "gold": 0, "stone": 0, "wood": 2},
        "count": 3
    }, {
        "tech": ["loom"],
        "resources": {"wood": 2, "food": 16, "build": 0, "stone": 0, "gold": 0},
        "type": "research"
    }, {
        "age": "feudalAge",
        "resources": {"stone": 0, "wood": 2, "build": 0, "food": 16, "gold": 0},
        "type": "ageUp"
    }, {
        "count": 2,
        "resources": {"gold": 0, "food": 14, "build": 0, "wood": 2, "stone": 2},
        "from": "sheep",
        "type": "moveVillagers",
        "to": "stone"
    }, {
        "from": "sheep",
        "to": "wood",
        "type": "moveVillagers",
        "resources": {"build": 0, "wood": 4, "food": 12, "stone": 2, "gold": 0},
        "count": 2
    }, {
        "count": 10,
        "resources": {"build": 10, "stone": 2, "wood": 4, "gold": 0, "food": 2},
        "type": "moveVillagers",
        "from": "sheep",
        "to": "forward"
    }, {
        "resources": {"gold": 0, "stone": 2, "wood": 4, "food": 2, "build": 10},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "count": 10,
        "task": "sheep",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "resources": {"wood": 4, "food": 12, "stone": 2, "gold": 0, "build": 10}
    }, {
        "tech": ["wheelbarrow", "scaleMailArmor", "forging"],
        "resources": {"wood": 4, "stone": 2, "food": 12, "gold": 0, "build": 10},
        "type": "research"
    }],
    "difficulty": 2,
    "readyForPublish": true,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FBlacksmith.png?alt=media&token=13f41de8-2dba-49f9-8713-9511f2aefc82",
    "attributes": ["fastFeudal"],
    "uptime": {"feudalAge": "08:50"},
    "id": 28,
    "description": "A player made famous by a legend video released by T90, Noboru developed this build and was defeating players with much higher elo than himself.",
    "pop": {"feudalAge": 19},
    "reference": "https://www.youtube.com/watch?v=antAHrlZ2f4",
    "civilization": "Incas",
    "author": "Noboru",
    "image": "Blacksmith"
}, {
    "id": 57,
    "build": [{
        "resources": {"food": 6, "gold": 0, "stone": 0, "build": 0, "wood": 0},
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "resources": {"gold": 0, "wood": 2, "food": 6, "stone": 0, "build": 0},
        "count": 2
    }, {
        "resources": {"food": 7, "build": 0, "gold": 0, "wood": 2, "stone": 0},
        "count": 1,
        "type": "newVillagers",
        "task": "boar"
    }, {
        "count": 4,
        "task": "berries",
        "buildings": [{"count": 1, "type": "house"}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "resources": {"gold": 0, "food": 11, "build": 0, "wood": 2, "stone": 0}
    }, {
        "type": "lure",
        "resources": {"stone": 0, "gold": 0, "wood": 2, "build": 0, "food": 11},
        "count": 1,
        "animal": "boar"
    }, {
        "count": 4,
        "resources": {"build": 0, "gold": 0, "food": 15, "wood": 2, "stone": 0},
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "build",
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"wood": 2, "build": 1, "gold": 0, "stone": 0, "food": 15}
    }, {
        "task": "gold",
        "count": 1,
        "resources": {"build": 1, "wood": 2, "food": 15, "gold": 1, "stone": 0},
        "type": "newVillagers"
    }, {
        "type": "research",
        "resources": {"gold": 1, "stone": 0, "build": 1, "wood": 2, "food": 15},
        "tech": ["loom"]
    }, {
        "age": "feudalAge",
        "resources": {"stone": 0, "build": 1, "food": 15, "gold": 1, "wood": 2},
        "type": "ageUp"
    }, {
        "resources": {"wood": 2, "stone": 0, "gold": 2, "food": 15, "build": 0},
        "to": "gold",
        "from": "build",
        "count": 1,
        "type": "moveVillagers"
    }, {
        "count": "∞",
        "unit": "militia",
        "resources": {"stone": 0, "build": 0, "wood": 2, "food": 15, "gold": 2},
        "type": "trainUnit"
    }, {
        "count": 8,
        "resources": {"build": 0, "gold": 2, "wood": 10, "stone": 0, "food": 7},
        "type": "moveVillagers",
        "from": "sheep",
        "to": "wood"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"build": 0, "food": 7, "wood": 10, "gold": 2, "stone": 0}
    }, {
        "type": "research",
        "resources": {"stone": 0, "build": 0, "food": 7, "gold": 2, "wood": 10},
        "tech": ["doubleBitAxe", "manAtArms"]
    }],
    "description": "A build that allows for creating 3 militia while advancing and researching the men-at-arms upgrade upon hitting Feudal but adapted for the Japanese wood bonus that allows going up with 20 pop instead of the standard 22 pop. You then can follow up with archers or towers.",
    "uptime": {"feudalAge": "09:15"},
    "reference": "https://buildorderguide.com",
    "image": "Man-at-Arms",
    "civilization": "Japanese",
    "pop": {"feudalAge": 20},
    "readyForPublish": true,
    "difficulty": 3,
    "attributes": ["fastFeudal"],
    "title": "Fast Men-at-Arms",
    "author": "Build Order Guide",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773"
}, {
    "image": "Man-at-Arms",
    "title": "Men-at-Arms Flud",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773",
    "readyForPublish": true,
    "difficulty": 3,
    "reference": "https://buildorderguide.com",
    "author": "Build Order Guide",
    "id": 47,
    "uptime": {"feudalAge": "07:10"},
    "description": "Get as fast as possible to Men-at-Arms and make use of the Japanese bonus of faster attacking infantry to overwhelm your opponent before they can even think about clicking up.",
    "civilization": "Japanese",
    "build": [{
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "type": "newVillagers",
        "resources": {"build": 0, "food": 6, "gold": 0, "stone": 0, "wood": 0},
        "task": "sheep"
    }, {
        "count": 1,
        "task": "boar",
        "resources": {"wood": 0, "build": 0, "gold": 0, "stone": 0, "food": 7},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "sheep",
        "count": 2,
        "resources": {"gold": 0, "build": 0, "food": 9, "stone": 0, "wood": 0}
    }, {
        "type": "newVillagers",
        "resources": {"food": 9, "stone": 0, "wood": 0, "build": 1, "gold": 0},
        "buildings": [{"count": 1, "type": "lumberCamp"}, {"type": "miningCamp", "count": 1}],
        "count": 1,
        "task": "build"
    }, {
        "task": "sheep",
        "resources": {"gold": 0, "stone": 0, "build": 1, "food": 13, "wood": 0},
        "type": "newVillagers",
        "count": 4
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"gold": 0, "build": 1, "food": 13, "wood": 0, "stone": 0}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"food": 13, "gold": 0, "build": 1, "wood": 0, "stone": 0}
    }, {
        "resources": {"food": 13, "gold": 1, "wood": 0, "stone": 0, "build": 0},
        "count": 1,
        "from": "build",
        "type": "moveVillagers",
        "to": "gold"
    }, {
        "type": "moveVillagers",
        "to": "gold",
        "count": 2,
        "from": "sheep",
        "resources": {"build": 0, "gold": 3, "wood": 0, "stone": 0, "food": 11}
    }, {
        "from": "sheep",
        "count": 11,
        "type": "moveVillagers",
        "to": "wood",
        "resources": {"build": 0, "gold": 3, "stone": 0, "wood": 11, "food": 0}
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "type": "build",
        "resources": {"build": 0, "stone": 0, "gold": 3, "food": 0, "wood": 11}
    }, {
        "unit": "militia",
        "type": "trainUnit",
        "resources": {"wood": 11, "build": 0, "stone": 0, "gold": 3, "food": 0},
        "count": "∞"
    }, {
        "type": "moveVillagers",
        "from": "wood",
        "count": 9,
        "resources": {"build": 0, "wood": 2, "food": 9, "stone": 0, "gold": 3},
        "to": "sheep"
    }, {
        "age": "feudalAge",
        "resources": {"food": 9, "gold": 3, "stone": 0, "build": 0, "wood": 2},
        "type": "newAge"
    }, {
        "resources": {"wood": 2, "stone": 0, "gold": 3, "food": 9, "build": 0},
        "type": "research",
        "tech": ["manAtArms"]
    }],
    "attributes": ["fastFeudal", "meme"],
    "pop": {"feudalAge": 15}
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Castle.png?alt=media&token=a12d6e5f-f68b-4f5d-bf8b-9b7670beb357",
    "attributes": ["fastCastle", "arena"],
    "pop": {"castleAge": 0, "feudalAge": 28},
    "difficulty": 2,
    "civilization": "Khmer",
    "id": 36,
    "readyForPublish": true,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "description": "A Fast Castle build adapted for the Khmer.",
    "author": "Cicero",
    "uptime": {"feudalAge": "12:10", "castleAge": "14:50"},
    "title": "Fast Castle",
    "image": "Fast Castle",
    "build": [{
        "task": "sheep",
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"build": 0, "gold": 0, "wood": 0, "food": 6, "stone": 0},
        "type": "newVillagers"
    }, {
        "count": 4,
        "resources": {"gold": 0, "build": 0, "wood": 4, "stone": 0, "food": 6},
        "task": "wood",
        "type": "newVillagers"
    }, {
        "task": "boar",
        "count": 1,
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 4, "food": 7},
        "type": "newVillagers"
    }, {
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "count": 4,
        "resources": {"stone": 0, "food": 11, "build": 0, "gold": 0, "wood": 4},
        "task": "berries"
    }, {
        "resources": {"wood": 4, "build": 0, "food": 14, "gold": 0, "stone": 0},
        "task": "sheep",
        "count": 3,
        "type": "newVillagers"
    }, {
        "to": "farm",
        "type": "moveVillagers",
        "resources": {"build": 0, "gold": 0, "food": 14, "stone": 0, "wood": 4},
        "from": "sheep",
        "count": 2
    }, {
        "resources": {"gold": 0, "stone": 0, "food": 14, "wood": 8, "build": 0},
        "type": "newVillagers",
        "count": 4,
        "task": "wood"
    }, {
        "task": "gold",
        "type": "newVillagers",
        "resources": {"build": 0, "food": 14, "stone": 0, "gold": 3, "wood": 8},
        "count": 3
    }, {
        "type": "newVillagers",
        "count": 2,
        "resources": {"gold": 3, "wood": 8, "stone": 0, "food": 16, "build": 0},
        "task": "berries"
    }, {
        "age": "feudalAge",
        "resources": {"stone": 0, "food": 16, "wood": 8, "build": 0, "gold": 3},
        "type": "ageUp"
    }, {
        "type": "moveVillagers",
        "from": "sheep",
        "to": "farm",
        "resources": {"build": 0, "gold": 3, "food": 16, "stone": 0, "wood": 8},
        "count": 10
    }, {
        "type": "newAge",
        "resources": {"food": 16, "gold": 3, "stone": 0, "wood": 8, "build": 0},
        "age": "feudalAge"
    }, {"age": "castleAge", "resources": {"food": 16, "build": 0, "wood": 8, "stone": 0, "gold": 3}, "type": "ageUp"}]
}, {
    "id": 35,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "civilization": "Khmer",
    "build": [{
        "type": "newVillagers",
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "resources": {"build": 0, "food": 6, "gold": 0, "stone": 0, "wood": 0}
    }, {
        "task": "stragglerTree",
        "resources": {"food": 6, "build": 0, "stone": 0, "gold": 0, "wood": 1},
        "count": 1,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "boar",
        "count": 1,
        "resources": {"gold": 0, "wood": 1, "food": 7, "stone": 0, "build": 0}
    }, {
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "count": 4,
        "type": "newVillagers",
        "resources": {"gold": 0, "build": 0, "wood": 1, "stone": 0, "food": 11},
        "task": "berries"
    }, {
        "type": "newVillagers",
        "resources": {"build": 0, "gold": 0, "food": 16, "wood": 1, "stone": 0},
        "task": "sheep",
        "count": 5
    }, {
        "tech": ["loom"],
        "resources": {"wood": 1, "stone": 0, "build": 0, "food": 16, "gold": 0},
        "type": "research"
    }, {
        "resources": {"stone": 0, "wood": 1, "food": 16, "build": 0, "gold": 0},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "to": "wood",
        "from": "sheep",
        "resources": {"build": 0, "wood": 8, "stone": 0, "food": 9, "gold": 0},
        "type": "moveVillagers",
        "count": 7
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"food": 9, "stone": 0, "gold": 0, "build": 0, "wood": 8}
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "stable"}],
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 8, "food": 9}
    }, {
        "unit": "scout",
        "count": 4,
        "type": "trainUnit",
        "resources": {"food": 9, "gold": 0, "build": 0, "wood": 8, "stone": 0}
    }],
    "readyForPublish": true,
    "difficulty": 3,
    "title": "Fast Scouts",
    "uptime": {"feudalAge": "08:25"},
    "description": "The Khmer scouts build can be almost as good as the Mongol build.",
    "attributes": ["fastFeudal"],
    "author": "Cicero",
    "image": "Scout",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "pop": {"feudalAge": 18}
}, {
    "civilization": "Khmer",
    "readyForPublish": true,
    "difficulty": 3,
    "pop": {"castleAge": 18, "feudalAge": 16},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "author": "HumzaCrumza",
    "build": [{
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"build": 0, "food": 6, "wood": 0, "gold": 0, "stone": 0},
        "count": 6
    }, {
        "task": "boar",
        "resources": {"build": 0, "food": 8, "gold": 0, "wood": 0, "stone": 0},
        "count": 2,
        "type": "newVillagers"
    }, {
        "resources": {"stone": 0, "food": 12, "wood": 0, "build": 0, "gold": 0},
        "task": "sheep",
        "type": "newVillagers",
        "count": 4
    }, {
        "count": 1,
        "type": "lure",
        "animal": "boar",
        "resources": {"build": 0, "gold": 0, "food": 12, "stone": 0, "wood": 0}
    }, {
        "count": 2,
        "type": "lure",
        "resources": {"food": 12, "stone": 0, "gold": 0, "build": 0, "wood": 0},
        "animal": "deer"
    }, {
        "count": 3,
        "resources": {"gold": 0, "wood": 0, "build": 0, "stone": 0, "food": 15},
        "buildings": [],
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"build": 0, "food": 15, "gold": 0, "wood": 0, "stone": 0}
    }, {
        "age": "feudalAge",
        "resources": {"wood": 0, "build": 0, "stone": 0, "food": 15, "gold": 0},
        "type": "ageUp"
    }, {
        "from": "sheep",
        "resources": {"wood": 8, "build": 0, "stone": 0, "gold": 0, "food": 7},
        "type": "moveVillagers",
        "count": 8,
        "to": "wood"
    }, {
        "age": "feudalAge",
        "resources": {"food": 7, "build": 0, "wood": 8, "gold": 0, "stone": 0},
        "type": "newAge"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 2,
        "buildings": [{"count": 1, "type": "stable"}],
        "resources": {"build": 0, "wood": 10, "stone": 0, "food": 7, "gold": 0}
    }, {
        "type": "research",
        "resources": {"stone": 0, "build": 0, "food": 7, "gold": 0, "wood": 10},
        "tech": ["doubleBitAxe"]
    }, {
        "unit": "scout",
        "type": "trainUnit",
        "count": 2,
        "resources": {"gold": 0, "stone": 0, "wood": 10, "build": 0, "food": 7}
    }, {
        "to": "berries",
        "count": 5,
        "type": "moveVillagers",
        "resources": {"gold": 0, "food": 7, "build": 0, "wood": 10, "stone": 0},
        "from": "sheep"
    }, {
        "resources": {"wood": 10, "stone": 0, "gold": 0, "food": 7, "build": 0},
        "type": "research",
        "tech": ["horseCollar"]
    }, {
        "type": "newVillagers",
        "resources": {"food": 18, "wood": 10, "build": 0, "stone": 0, "gold": 0},
        "task": "farm",
        "count": 11
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"wood": 10, "food": 18, "gold": 5, "stone": 0, "build": 0},
        "count": 5
    }, {
        "tech": ["wheelbarrow"],
        "resources": {"food": 18, "build": 0, "wood": 10, "stone": 0, "gold": 5},
        "type": "research"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}],
        "type": "build",
        "resources": {"food": 18, "gold": 5, "build": 0, "stone": 0, "wood": 10}
    }, {"age": "castleAge", "resources": {"food": 18, "gold": 5, "wood": 10, "build": 0, "stone": 0}, "type": "ageUp"}],
    "id": 43,
    "reference": "https://www.youtube.com/watch?v=fzMDhRF_9RE&feature=youtu.be",
    "description": "In the quest for the fast Scout rushes, it seems that Khmer have risen to the occasion with a Scout rush uptime that rivals the Mongols. While this build is extremely lean, it can be adapted to go up at 17/18 population as well in order to adjust for the game being played.",
    "image": "Scout",
    "title": "Fast Scouts",
    "attributes": ["fastFeudal"],
    "uptime": {"castleAge": "17:45", "feudalAge": "07:35"}
}, {
    "build": [{
        "type": "newVillagers",
        "resources": {"stone": 0, "gold": 0, "build": 0, "food": 6, "wood": 0},
        "task": "sheep",
        "count": 6,
        "buildings": [{"type": "house", "count": 2}]
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 4,
        "resources": {"gold": 0, "stone": 0, "build": 0, "food": 6, "wood": 4}
    }, {
        "task": "boar",
        "count": 1,
        "type": "newVillagers",
        "resources": {"food": 7, "build": 0, "gold": 0, "stone": 0, "wood": 4}
    }, {
        "task": "berries",
        "count": 4,
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "resources": {"wood": 4, "food": 11, "gold": 0, "stone": 0, "build": 0}
    }, {
        "animal": "boar",
        "resources": {"wood": 4, "gold": 0, "stone": 0, "build": 0, "food": 11},
        "count": 1,
        "type": "lure"
    }, {
        "count": 3,
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 0, "food": 14}
    }, {
        "type": "moveVillagers",
        "count": 2,
        "resources": {"wood": 4, "build": 0, "food": 14, "stone": 0, "gold": 0},
        "to": "farm",
        "from": "sheep"
    }, {
        "resources": {"food": 14, "stone": 0, "build": 0, "gold": 0, "wood": 10},
        "count": 6,
        "task": "wood",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 3,
        "task": "gold",
        "resources": {"food": 14, "wood": 10, "build": 0, "stone": 0, "gold": 3}
    }, {
        "tech": ["loom"],
        "resources": {"build": 0, "food": 14, "gold": 3, "stone": 0, "wood": 10},
        "type": "research"
    }, {
        "type": "ageUp",
        "resources": {"build": 0, "wood": 10, "food": 14, "stone": 0, "gold": 3},
        "age": "feudalAge"
    }, {
        "count": 2,
        "from": "sheep",
        "to": "berries",
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 10, "build": 0, "gold": 3, "food": 14}
    }, {
        "to": "farm",
        "count": 6,
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 10, "food": 14, "gold": 3, "build": 0}
    }, {
        "buildings": [{"count": 1, "type": "barracks"}],
        "type": "build",
        "resources": {"stone": 0, "gold": 3, "food": 14, "build": 0, "wood": 10}
    }, {
        "resources": {"food": 14, "wood": 10, "stone": 0, "gold": 5, "build": 0},
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "stable"}, {"type": "blacksmith", "count": 1}],
        "count": 2,
        "task": "gold"
    }, {
        "resources": {"food": 14, "gold": 5, "wood": 10, "build": 0, "stone": 0},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "from": "berries",
        "resources": {"wood": 10, "food": 14, "build": 0, "gold": 5, "stone": 0},
        "type": "moveVillagers",
        "to": "farm",
        "count": 2
    }, {
        "type": "moveVillagers",
        "resources": {"gold": 6, "build": 0, "wood": 10, "stone": 0, "food": 13},
        "to": "gold",
        "count": 1,
        "from": "berries"
    }, {
        "buildings": [{"type": "stable", "count": 1}],
        "resources": {"gold": 6, "build": 0, "wood": 10, "stone": 0, "food": 13},
        "type": "build"
    }, {
        "age": "castleAge",
        "type": "newAge",
        "resources": {"stone": 0, "wood": 10, "food": 13, "gold": 6, "build": 0}
    }, {
        "resources": {"food": 13, "build": 0, "stone": 0, "gold": 6, "wood": 10},
        "count": 6,
        "type": "trainUnit",
        "unit": "knight"
    }],
    "id": 13,
    "author": "Cicero",
    "civilization": "Generic",
    "image": "Knight",
    "pop": {"castleAge": 2, "feudalAge": 28},
    "title": "Knight Rush",
    "readyForPublish": true,
    "attributes": ["fastCastle"],
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "description": "Usually done from a pocket position in team games. Knights are ideal for this position because of their mobility, but the crossbowmen build might occasionally be used depending on the civ. This allows for at least six knights to be produced from both, following by constant production from one stable.",
    "difficulty": 1,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FKnight.png?alt=media&token=6841f7c6-7df3-470b-ba7b-53fd2f709abe",
    "uptime": {"castleAge": "16:05", "feudalAge": "12:35"}
}, {
    "attributes": ["fastFeudal"],
    "civilization": "Koreans",
    "build": [{
        "type": "newVillagers",
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}],
        "count": 6,
        "resources": {"gold": 0, "stone": 0, "wood": 0, "build": 0, "food": 6}
    }, {
        "resources": {"wood": 2, "build": 0, "gold": 0, "stone": 0, "food": 6},
        "count": 2,
        "task": "wood",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 3,
        "resources": {"build": 0, "stone": 0, "gold": 0, "food": 9, "wood": 2},
        "task": "boar"
    }, {
        "resources": {"stone": 0, "food": 11, "gold": 0, "build": 0, "wood": 2},
        "count": 2,
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "mill"}],
        "task": "berries"
    }, {
        "type": "lure",
        "resources": {"wood": 2, "food": 11, "build": 0, "stone": 0, "gold": 0},
        "animal": "boar",
        "count": 1
    }, {
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 2, "build": 0, "stone": 0, "food": 16},
        "count": 5,
        "task": "sheep"
    }, {
        "type": "research",
        "resources": {"food": 16, "wood": 2, "gold": 0, "build": 0, "stone": 0},
        "tech": ["loom"]
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"gold": 0, "build": 0, "wood": 2, "food": 16, "stone": 0}
    }, {
        "count": 2,
        "to": "stone",
        "type": "moveVillagers",
        "from": "sheep",
        "resources": {"gold": 0, "stone": 2, "build": 0, "wood": 2, "food": 14}
    }, {
        "from": "sheep",
        "resources": {"wood": 4, "gold": 0, "food": 12, "stone": 2, "build": 0},
        "type": "moveVillagers",
        "count": 2,
        "to": "wood"
    }, {
        "count": 6,
        "from": "sheep",
        "resources": {"stone": 2, "build": 6, "gold": 0, "wood": 4, "food": 6},
        "to": "forward",
        "type": "moveVillagers"
    }, {
        "type": "newAge",
        "resources": {"food": 6, "gold": 0, "stone": 2, "wood": 4, "build": 6},
        "age": "feudalAge"
    }, {
        "task": "stone",
        "count": 3,
        "type": "newVillagers",
        "resources": {"wood": 4, "food": 6, "build": 6, "stone": 5, "gold": 0}
    }, {
        "type": "moveVillagers",
        "resources": {"build": 6, "gold": 0, "stone": 5, "food": 6, "wood": 4},
        "to": "farm",
        "count": 2,
        "from": "sheep"
    }, {
        "to": "berries",
        "count": 2,
        "resources": {"wood": 4, "stone": 5, "build": 6, "gold": 0, "food": 6},
        "type": "moveVillagers",
        "from": "sheep"
    }],
    "difficulty": 2,
    "author": "Cicero",
    "id": 26,
    "readyForPublish": true,
    "uptime": {"feudalAge": "08:50"},
    "pop": {"feudalAge": 19},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FTower.png?alt=media&token=3ca603df-e3b3-4e1a-a32e-80c8e50bea65",
    "image": "Tower",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "description": "Towers are the only thing the Koreans are good at, so it's worth knowing a build for them. Can be used with other civs but will be less effective.",
    "title": "Towers"
}, {
    "image": "Militia",
    "id": 31,
    "author": "Hera",
    "civilization": "Lithuanians",
    "uptime": {},
    "readyForPublish": true,
    "title": "3 Minute Rush",
    "build": [{
        "buildings": [{"count": 1, "type": "house"}, {"type": "barracks", "count": 1}],
        "task": "stragglerTree",
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 0, "gold": 0, "food": 0, "wood": 2},
        "count": 2
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "wood": 2, "food": 6},
        "count": 6,
        "task": "sheep",
        "buildings": [{"type": "house", "count": 1}],
        "type": "newVillagers"
    }, {
        "type": "trainUnit",
        "count": 2,
        "unit": "militia",
        "resources": {"build": 0, "gold": 0, "wood": 2, "food": 6, "stone": 0}
    }, {
        "resources": {"wood": 4, "food": 6, "build": 0, "stone": 0, "gold": 0},
        "count": 2,
        "buildings": [{"type": "house", "count": 1}, {"count": 1, "type": "lumberCamp"}],
        "task": "wood",
        "type": "newVillagers"
    }],
    "description": "Taking advantage of the 150 food bonus of the Lithuanians to have 2 milita out after 3 minutes for the fastest possible rush. After you built the lumber camp, you can lure your first boar and continue a standard build like archers scouts, or fast castle.\n\n",
    "attributes": ["drush"],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMilitia.png?alt=media&token=465ff671-67e6-49cb-a020-5615c426c480",
    "difficulty": 3,
    "reference": "https://youtu.be/CZHoBeR36hg",
    "pop": {"feudalAge": "?"}
}, {
    "description": "Lithuanians are basically the new Mongols, in terms of how fast they can get up to Feudal and get their scout rush going. This is the best scout rush build order and timing to be able to sustain production in feudal, as well as get up very quickly.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "readyForPublish": true,
    "build": [{
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "type": "newVillagers",
        "count": 6,
        "resources": {"food": 6, "stone": 0, "wood": 0, "build": 0, "gold": 0}
    }, {
        "resources": {"gold": 0, "food": 6, "stone": 0, "build": 0, "wood": 3},
        "task": "wood",
        "type": "newVillagers",
        "count": 3
    }, {
        "task": "boar",
        "resources": {"gold": 0, "food": 7, "stone": 0, "build": 0, "wood": 3},
        "type": "newVillagers",
        "count": 1
    }, {
        "count": 1,
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "mill"}],
        "resources": {"wood": 3, "stone": 0, "gold": 0, "build": 0, "food": 8},
        "type": "newVillagers",
        "task": "berries"
    }, {
        "resources": {"food": 12, "wood": 3, "build": 0, "stone": 0, "gold": 0},
        "count": 4,
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "count": 1,
        "resources": {"gold": 0, "food": 12, "stone": 0, "build": 0, "wood": 3},
        "type": "lure",
        "animal": "boar"
    }, {
        "resources": {"build": 0, "food": 14, "stone": 0, "gold": 0, "wood": 3},
        "count": 2,
        "task": "berries",
        "type": "newVillagers"
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"build": 0, "wood": 3, "food": 14, "stone": 0, "gold": 0}
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"food": 14, "build": 0, "stone": 0, "gold": 0, "wood": 3}
    }, {
        "type": "moveVillagers",
        "resources": {"stone": 0, "food": 10, "gold": 0, "build": 0, "wood": 7},
        "to": "wood",
        "count": 4,
        "from": "sheep"
    }, {
        "to": "berries",
        "resources": {"wood": 7, "food": 10, "stone": 0, "build": 0, "gold": 0},
        "count": 1,
        "type": "moveVillagers",
        "from": "sheep"
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "barracks"}],
        "resources": {"food": 10, "gold": 0, "stone": 0, "wood": 7, "build": 0}
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "gold": 0, "wood": 7, "food": 10, "stone": 0},
        "type": "newAge"
    }, {
        "buildings": [{"count": 1, "type": "stable"}],
        "type": "build",
        "resources": {"gold": 0, "build": 0, "food": 10, "stone": 0, "wood": 7}
    }, {
        "tech": ["doubleBitAxe"],
        "resources": {"gold": 0, "build": 0, "food": 10, "wood": 7, "stone": 0},
        "type": "research"
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 7, "food": 10, "stone": 0},
        "type": "trainUnit",
        "unit": "scout",
        "count": 5
    }, {
        "task": "wood",
        "count": 3,
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 10, "stone": 0, "food": 10, "build": 0}
    }, {
        "type": "research",
        "resources": {"wood": 10, "stone": 0, "build": 0, "gold": 0, "food": 10},
        "tech": ["horseCollar"]
    }, {
        "count": 8,
        "task": "farm",
        "resources": {"wood": 10, "food": 18, "build": 0, "gold": 0, "stone": 0},
        "type": "newVillagers"
    }, {
        "task": "gold",
        "type": "newVillagers",
        "resources": {"food": 18, "stone": 0, "wood": 10, "build": 0, "gold": 5},
        "count": 5
    }, {
        "tech": ["wheelbarrow"],
        "type": "research",
        "resources": {"build": 0, "wood": 10, "food": 18, "gold": 5, "stone": 0}
    }, {"age": "castleAge", "type": "ageUp", "resources": {"gold": 5, "food": 18, "stone": 0, "wood": 10, "build": 0}}],
    "image": "Scout",
    "uptime": {"castleAge": "17:45", "feudalAge": "08:25"},
    "title": "Fast Scouts",
    "reference": "https://youtu.be/AJqfHlSLYyA",
    "difficulty": 2,
    "author": "Hera",
    "civilization": "Lithuanians",
    "id": 49,
    "pop": {"castleAge": 16, "feudalAge": 18},
    "attributes": ["fastFeudal"]
}, {
    "civilization": "Lithuanians",
    "id": 48,
    "reference": "https://youtu.be/ek7-ojHwBI4",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FKnight.png?alt=media&token=6841f7c6-7df3-470b-ba7b-53fd2f709abe",
    "attributes": ["fastCastle", "water"],
    "description": "This is the best opening for Lithuanians on Four Lakes. It can probably be used for other maps where you have fairly safe fish as well. If you’re going crossbowmen, get 9 on gold (for 2 ranges). You can afford a university + ballistics and even some siege since you have so many lumberjacks.",
    "title": "Hybrid FC",
    "difficulty": 3,
    "pop": {"feudalAge": 21, "castleAge": 2},
    "build": [{
        "count": 5,
        "type": "newVillagers",
        "resources": {"wood": 5, "food": 0, "gold": 0, "build": 0, "stone": 0},
        "task": "wood",
        "buildings": [{"count": 2, "type": "house"}]
    }, {
        "count": 1,
        "buildings": [{"type": "dock", "count": 1}],
        "type": "newVillagers",
        "task": "build",
        "resources": {"stone": 0, "gold": 0, "build": 1, "food": 0, "wood": 5}
    }, {
        "type": "newVillagers",
        "count": 4,
        "resources": {"food": 4, "gold": 0, "wood": 5, "stone": 0, "build": 1},
        "task": "sheep"
    }, {
        "resources": {"stone": 0, "food": 5, "build": 0, "gold": 0, "wood": 5},
        "to": "shoreFish",
        "count": 1,
        "from": "build",
        "type": "moveVillagers"
    }, {
        "unit": "fishingShip",
        "count": 7,
        "type": "trainUnit",
        "resources": {"food": 5, "build": 0, "stone": 0, "gold": 0, "wood": 5}
    }, {
        "count": 2,
        "resources": {"stone": 0, "wood": 7, "gold": 0, "build": 0, "food": 5},
        "task": "wood",
        "type": "newVillagers"
    }, {
        "task": "boar",
        "count": 1,
        "resources": {"gold": 0, "build": 0, "wood": 7, "stone": 0, "food": 6},
        "type": "newVillagers"
    }, {
        "count": 4,
        "task": "sheep",
        "resources": {"wood": 7, "food": 10, "stone": 0, "build": 0, "gold": 0},
        "type": "newVillagers"
    }, {
        "count": 1,
        "resources": {"wood": 7, "food": 10, "stone": 0, "gold": 0, "build": 0},
        "animal": "boar",
        "type": "lure"
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 10, "wood": 10},
        "count": 3,
        "task": "wood",
        "type": "newVillagers"
    }, {
        "type": "research",
        "resources": {"wood": 10, "stone": 0, "build": 0, "gold": 0, "food": 10},
        "tech": ["loom"]
    }, {
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 10, "wood": 10},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "from": "sheep",
        "type": "moveVillagers",
        "to": "gold",
        "resources": {"stone": 0, "wood": 10, "build": 0, "food": 7, "gold": 3},
        "count": 3
    }, {
        "resources": {"gold": 3, "build": 0, "food": 7, "stone": 0, "wood": 10},
        "buildings": [{"count": 1, "type": "barracks"}],
        "type": "build"
    }, {
        "resources": {"stone": 0, "wood": 10, "food": 7, "gold": 3, "build": 0},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "count": 2,
        "buildings": [{"type": "blacksmith", "count": 1}, {"type": "stable", "count": 1}],
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"stone": 0, "food": 9, "wood": 10, "build": 0, "gold": 3}
    }, {
        "age": "castleAge",
        "resources": {"gold": 3, "build": 0, "food": 9, "wood": 10, "stone": 0},
        "type": "ageUp"
    }, {
        "tech": ["doubleBitAxe"],
        "type": "research",
        "resources": {"stone": 0, "gold": 3, "food": 9, "build": 0, "wood": 10}
    }, {
        "resources": {"wood": 10, "gold": 3, "build": 0, "food": 9, "stone": 0},
        "type": "trainUnit",
        "count": 5,
        "unit": "fishingShip"
    }, {
        "age": "castleAge",
        "type": "newAge",
        "resources": {"food": 9, "wood": 10, "stone": 0, "gold": 3, "build": 0}
    }, {
        "tech": ["bowSaw", "gillnets"],
        "resources": {"stone": 0, "build": 0, "gold": 3, "food": 9, "wood": 10},
        "type": "research"
    }, {
        "count": 5,
        "from": "sheep",
        "resources": {"wood": 10, "gold": 3, "stone": 0, "build": 0, "food": 9},
        "to": "berries",
        "type": "moveVillagers"
    }, {
        "count": 4,
        "type": "newVillagers",
        "resources": {"food": 9, "gold": 7, "build": 0, "wood": 10, "stone": 0},
        "task": "gold"
    }, {
        "type": "build",
        "buildings": [{"type": "dock", "count": 1}],
        "resources": {"gold": 7, "stone": 0, "build": 0, "wood": 10, "food": 9}
    }, {
        "unit": "fishingShip",
        "type": "trainUnit",
        "count": 5,
        "resources": {"gold": 7, "stone": 0, "build": 0, "food": 9, "wood": 10}
    }, {
        "resources": {"wood": 10, "stone": 0, "food": 9, "gold": 7, "build": 0},
        "type": "research",
        "tech": ["horseCollar"]
    }, {
        "resources": {"wood": 10, "food": 15, "build": 0, "gold": 7, "stone": 0},
        "type": "newVillagers",
        "task": "farm",
        "count": 6
    }],
    "readyForPublish": true,
    "image": "Knight",
    "author": "Survivalist",
    "uptime": {"feudalAge": "09:40", "castleAge": "13:10"}
}, {
    "description": "Lithuanians start with +150 food which allows going up faster. They also have a bonus that makes their spearman-line and skirmishers move 10% faster. These two bonuses make the Skirm + Spear rush strategy so viable.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FSpearman.png?alt=media&token=f926a7cf-0dea-472a-a819-ffc29bf65c46",
    "author": "PROject_Belgium",
    "id": 50,
    "build": [{
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "resources": {"wood": 0, "build": 0, "stone": 0, "gold": 0, "food": 6},
        "type": "newVillagers"
    }, {
        "count": 3,
        "type": "newVillagers",
        "task": "wood",
        "resources": {"gold": 0, "stone": 0, "build": 0, "wood": 3, "food": 6}
    }, {
        "task": "boar",
        "type": "newVillagers",
        "resources": {"wood": 3, "gold": 0, "food": 7, "stone": 0, "build": 0},
        "count": 1
    }, {
        "task": "berries",
        "resources": {"wood": 3, "build": 0, "stone": 0, "food": 11, "gold": 0},
        "type": "newVillagers",
        "count": 4,
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}]
    }, {
        "type": "lure",
        "animal": "boar",
        "resources": {"wood": 3, "stone": 0, "gold": 0, "build": 0, "food": 11},
        "count": 1
    }, {
        "count": 4,
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"gold": 0, "wood": 3, "stone": 0, "build": 0, "food": 15}
    }, {
        "resources": {"build": 0, "gold": 0, "food": 15, "stone": 0, "wood": 3},
        "tech": ["loom"],
        "type": "research"
    }, {
        "type": "ageUp",
        "resources": {"stone": 0, "gold": 0, "food": 15, "build": 0, "wood": 3},
        "age": "feudalAge"
    }, {
        "to": "wood",
        "from": "sheep",
        "count": 4,
        "resources": {"gold": 0, "food": 11, "stone": 0, "wood": 7, "build": 0},
        "type": "moveVillagers"
    }, {
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"food": 8, "gold": 0, "stone": 0, "build": 3, "wood": 7},
        "count": 3,
        "to": "forward"
    }, {
        "type": "build",
        "resources": {"gold": 0, "food": 8, "build": 3, "wood": 7, "stone": 0},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "age": "feudalAge",
        "resources": {"gold": 0, "wood": 7, "build": 3, "stone": 0, "food": 8},
        "type": "newAge"
    }, {
        "resources": {"wood": 7, "food": 8, "build": 3, "gold": 0, "stone": 0},
        "type": "build",
        "buildings": [{"count": 1, "type": "archeryRange"}]
    }, {
        "type": "research",
        "tech": ["doubleBitAxe"],
        "resources": {"gold": 0, "stone": 0, "wood": 7, "build": 3, "food": 8}
    }, {
        "count": "∞",
        "type": "trainUnit",
        "resources": {"stone": 0, "food": 8, "wood": 7, "gold": 0, "build": 3},
        "unit": "skirmisher"
    }, {
        "resources": {"build": 3, "wood": 7, "food": 8, "gold": 0, "stone": 0},
        "count": "∞",
        "type": "trainUnit",
        "unit": "spearman"
    }, {
        "type": "build",
        "buildings": [{"type": "watchTower", "count": 1}],
        "resources": {"stone": 0, "wood": 7, "food": 8, "gold": 0, "build": 3}
    }, {
        "type": "newVillagers",
        "task": "farm",
        "resources": {"food": 14, "wood": 7, "stone": 0, "build": 3, "gold": 0},
        "count": 6
    }, {
        "resources": {"food": 14, "build": 3, "gold": 0, "wood": 7, "stone": 0},
        "type": "build",
        "buildings": [{"count": 1, "type": "blacksmith"}]
    }, {
        "resources": {"wood": 7, "stone": 0, "build": 3, "food": 14, "gold": 0},
        "tech": ["fletching"],
        "type": "research"
    }, {
        "buildings": [{"count": 1, "type": "stable"}],
        "resources": {"wood": 7, "food": 14, "stone": 0, "gold": 0, "build": 3},
        "type": "build"
    }, {
        "type": "moveVillagers",
        "count": 3,
        "resources": {"build": 0, "wood": 7, "food": 14, "gold": 0, "stone": 3},
        "to": "stone",
        "from": "build"
    }],
    "readyForPublish": true,
    "civilization": "Lithuanians",
    "difficulty": 2,
    "attributes": ["fastFeudal"],
    "title": "Skirm + Spear Rush",
    "uptime": {"feudalAge": "08:50"},
    "pop": {"feudalAge": 19},
    "reference": "https://youtu.be/no2TMECxgW8",
    "image": "Spearman"
}, {
    "build": [{
        "task": "sheep",
        "count": 6,
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "resources": {"wood": 0, "build": 0, "stone": 0, "food": 6, "gold": 0}
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 4, "food": 6, "stone": 0},
        "type": "newVillagers",
        "count": 4,
        "task": "wood"
    }, {
        "count": 2,
        "resources": {"gold": 0, "stone": 0, "food": 8, "wood": 4, "build": 0},
        "type": "newVillagers",
        "task": "boar"
    }, {
        "resources": {"gold": 0, "wood": 4, "food": 12, "stone": 0, "build": 0},
        "task": "berries",
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "type": "newVillagers",
        "count": 4
    }, {
        "count": 1,
        "animal": "boar",
        "resources": {"wood": 4, "food": 12, "stone": 0, "gold": 0, "build": 0},
        "type": "lure"
    }, {
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 4, "food": 12, "build": 0, "gold": 0},
        "count": 1
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 8,
        "resources": {"food": 12, "wood": 12, "build": 0, "gold": 0, "stone": 0}
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"gold": 0, "stone": 0, "wood": 12, "build": 0, "food": 12}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"wood": 12, "stone": 0, "build": 0, "gold": 0, "food": 12}
    }, {
        "count": 2,
        "resources": {"wood": 12, "build": 0, "stone": 0, "gold": 0, "food": 12},
        "to": "berries",
        "type": "moveVillagers",
        "from": "sheep"
    }, {
        "count": 3,
        "from": "sheep",
        "resources": {"wood": 12, "stone": 0, "gold": 3, "food": 9, "build": 0},
        "type": "moveVillagers",
        "to": "gold"
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"gold": 3, "build": 0, "wood": 12, "food": 9, "stone": 0}
    }, {
        "resources": {"food": 9, "wood": 12, "build": 0, "stone": 0, "gold": 3},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "type": "newVillagers",
        "buildings": [{"type": "archeryRange", "count": 2}, {"count": 1, "type": "blacksmith"}],
        "count": 5,
        "task": "gold",
        "resources": {"gold": 8, "food": 9, "stone": 0, "wood": 12, "build": 0}
    }, {
        "type": "research",
        "tech": ["doubleBitAxe", "horseCollar"],
        "resources": {"gold": 8, "wood": 12, "stone": 0, "food": 9, "build": 0}
    }, {
        "type": "research",
        "tech": ["fletching"],
        "resources": {"food": 9, "stone": 0, "gold": 8, "build": 0, "wood": 12}
    }, {
        "type": "newVillagers",
        "count": 9,
        "task": "farm",
        "resources": {"stone": 0, "wood": 12, "build": 0, "gold": 8, "food": 18}
    }, {
        "type": "research",
        "tech": ["wheelbarrow"],
        "resources": {"gold": 8, "stone": 0, "food": 18, "wood": 12, "build": 0}
    }, {"age": "castleAge", "resources": {"food": 18, "wood": 12, "build": 0, "stone": 0, "gold": 8}, "type": "ageUp"}],
    "civilization": "Malay",
    "author": "Cicero",
    "image": "Archer",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7",
    "pop": {"feudalAge": 25, "castleAge": 14},
    "id": 39,
    "readyForPublish": true,
    "uptime": {"castleAge": "17:54", "feudalAge": "10:28"},
    "attributes": ["fastFeudal"],
    "description": "The archer build adapted for the Malay bonus.",
    "difficulty": 2,
    "title": "Archers"
}, {
    "attributes": ["fastFeudal"],
    "civilization": "Malay",
    "readyForPublish": true,
    "image": "Archer",
    "build": [{
        "resources": {"gold": 0, "wood": 0, "build": 0, "stone": 0, "food": 6},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep",
        "count": 6
    }, {
        "buildings": [],
        "resources": {"stone": 0, "wood": 4, "build": 0, "food": 6, "gold": 0},
        "count": 4,
        "type": "newVillagers",
        "task": "wood"
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 1,
        "resources": {"wood": 4, "build": 0, "food": 7, "gold": 0, "stone": 0}
    }, {
        "count": 3,
        "type": "newVillagers",
        "task": "berries",
        "resources": {"build": 0, "food": 10, "stone": 0, "gold": 0, "wood": 4},
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}]
    }, {
        "task": "boar",
        "resources": {"build": 0, "wood": 4, "food": 11, "stone": 0, "gold": 0},
        "type": "newVillagers",
        "count": 1
    }, {
        "task": "berries",
        "type": "newVillagers",
        "resources": {"wood": 4, "stone": 0, "build": 0, "food": 13, "gold": 0},
        "count": 2
    }, {
        "buildings": [{"count": 1, "type": "lumberCamp"}],
        "type": "newVillagers",
        "resources": {"stone": 0, "gold": 0, "wood": 8, "build": 0, "food": 13},
        "task": "wood",
        "count": 4
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"gold": 2, "food": 13, "build": 0, "wood": 8, "stone": 0},
        "count": 2
    }, {
        "resources": {"food": 13, "stone": 0, "gold": 2, "build": 0, "wood": 8},
        "type": "research",
        "tech": ["loom"]
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "food": 13, "gold": 2, "wood": 8, "stone": 0},
        "type": "ageUp"
    }, {
        "resources": {"build": 0, "stone": 0, "wood": 8, "food": 13, "gold": 2},
        "type": "build",
        "buildings": [{"count": 1, "type": "house"}, {"type": "barracks", "count": 1}]
    }, {
        "resources": {"gold": 2, "build": 0, "wood": 8, "food": 13, "stone": 0},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "task": "gold",
        "buildings": [{"type": "archeryRange", "count": 2}],
        "resources": {"wood": 8, "build": 0, "stone": 0, "food": 13, "gold": 8},
        "count": 6,
        "type": "newVillagers"
    }, {
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "resources": {"food": 13, "wood": 8, "stone": 0, "gold": 8, "build": 0},
        "type": "build"
    }, {
        "resources": {"build": 0, "gold": 8, "stone": 0, "wood": 8, "food": 13},
        "type": "research",
        "tech": ["fletching"]
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 4,
        "resources": {"food": 13, "build": 0, "wood": 12, "stone": 0, "gold": 8}
    }],
    "uptime": {"feudalAge": "10:03"},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7",
    "title": "Fast Archers",
    "pop": {"feudalAge": 24},
    "difficulty": 2,
    "id": 54,
    "description": "This is a 24 pop Malay archers build order that is a bit quicker than the 25 pop standard one but doesn't account for early eco upgrades. Get them when you can.",
    "author": "Lohabquas",
    "reference": "https://youtu.be/CoBeucC9a-Q"
}, {
    "author": "Cicero",
    "civilization": "Malay",
    "attributes": ["fastCastle", "arena"],
    "image": "Fast Castle",
    "pop": {"feudalAge": 31, "castleAge": 2},
    "uptime": {"feudalAge": "12:33", "castleAge": "14:59"},
    "id": 40,
    "description": "The Fast Castle build adapted for the Malay bonus.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Castle.png?alt=media&token=a12d6e5f-f68b-4f5d-bf8b-9b7670beb357",
    "title": "Fast Castle",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "difficulty": 1,
    "build": [{
        "task": "sheep",
        "type": "newVillagers",
        "count": 6,
        "buildings": [{"type": "house", "count": 2}],
        "resources": {"wood": 0, "stone": 0, "food": 6, "gold": 0, "build": 0}
    }, {
        "count": 4,
        "resources": {"build": 0, "stone": 0, "wood": 4, "food": 6, "gold": 0},
        "task": "wood",
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "build": 0, "gold": 0, "stone": 0, "food": 7},
        "task": "boar",
        "count": 1,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "berries",
        "count": 4,
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"food": 11, "gold": 0, "wood": 4, "build": 0, "stone": 0}
    }, {
        "count": 3,
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"build": 0, "gold": 0, "food": 14, "stone": 0, "wood": 4}
    }, {
        "type": "moveVillagers",
        "to": "farm",
        "resources": {"stone": 0, "build": 0, "food": 14, "gold": 0, "wood": 4},
        "from": "sheep",
        "count": 2
    }, {
        "task": "wood",
        "count": 8,
        "resources": {"food": 14, "build": 0, "gold": 0, "stone": 0, "wood": 12},
        "type": "newVillagers"
    }, {
        "to": "berries",
        "type": "moveVillagers",
        "count": 2,
        "resources": {"wood": 12, "stone": 0, "food": 14, "build": 0, "gold": 0},
        "from": "sheep"
    }, {
        "resources": {"gold": 0, "build": 0, "food": 14, "stone": 0, "wood": 12},
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "count": 3
    }, {
        "task": "gold",
        "count": 4,
        "type": "newVillagers",
        "resources": {"wood": 12, "food": 14, "build": 0, "gold": 4, "stone": 0}
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"food": 14, "gold": 4, "wood": 12, "stone": 0, "build": 0}
    }, {
        "task": "gold",
        "type": "newVillagers",
        "resources": {"stone": 0, "food": 14, "build": 0, "gold": 6, "wood": 12},
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "count": 2
    }, {"age": "castleAge", "resources": {"build": 0, "wood": 12, "food": 14, "stone": 0, "gold": 6}, "type": "ageUp"}],
    "readyForPublish": true
}, {
    "author": "Survivalist",
    "description": "A battle elephant rush build that makes use of two Malay bonuses: cheaper elephants and 66% faster age uptime. This build makes sure you can pump out elephants and keep villager production from one TC going at the same time.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FBattle%20Elephant.png?alt=media&token=26255c3d-0df1-41d3-a4f0-76d2529f3342",
    "id": 51,
    "build": [{
        "count": 6,
        "resources": {"food": 6, "stone": 0, "build": 0, "gold": 0, "wood": 0},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep"
    }, {
        "task": "wood",
        "count": 3,
        "type": "newVillagers",
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 6, "wood": 3}
    }, {
        "count": 1,
        "resources": {"gold": 0, "food": 7, "wood": 3, "build": 0, "stone": 0},
        "type": "newVillagers",
        "task": "boar"
    }, {
        "type": "newVillagers",
        "count": 3,
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"wood": 3, "build": 0, "food": 10, "gold": 0, "stone": 0},
        "task": "berries"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 1,
        "resources": {"gold": 0, "wood": 4, "food": 10, "build": 0, "stone": 0}
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "boar",
        "resources": {"wood": 4, "build": 0, "food": 11, "stone": 0, "gold": 0}
    }, {
        "count": 2,
        "task": "berries",
        "type": "newVillagers",
        "resources": {"food": 13, "build": 0, "gold": 0, "stone": 0, "wood": 4}
    }, {
        "count": 2,
        "from": "sheep",
        "resources": {"build": 0, "gold": 0, "food": 13, "wood": 4, "stone": 0},
        "to": "farm",
        "type": "moveVillagers"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 4,
        "resources": {"gold": 0, "food": 13, "build": 0, "wood": 8, "stone": 0}
    }, {
        "resources": {"build": 0, "stone": 0, "food": 13, "wood": 8, "gold": 2},
        "type": "newVillagers",
        "task": "gold",
        "count": 2
    }, {
        "count": 4,
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"wood": 8, "build": 0, "gold": 2, "food": 17, "stone": 0}
    }, {
        "type": "moveVillagers",
        "from": "sheep",
        "to": "farm",
        "count": 5,
        "resources": {"gold": 2, "food": 17, "build": 0, "wood": 8, "stone": 0}
    }, {
        "resources": {"build": 0, "stone": 0, "wood": 8, "food": 17, "gold": 2},
        "type": "research",
        "tech": ["loom"]
    }, {
        "resources": {"build": 0, "gold": 2, "food": 17, "stone": 0, "wood": 8},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "to": "stragglerTree",
        "resources": {"gold": 2, "stone": 0, "food": 12, "build": 0, "wood": 13},
        "type": "moveVillagers",
        "from": "sheep",
        "count": 5
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "type": "build",
        "resources": {"build": 0, "gold": 2, "stone": 0, "wood": 13, "food": 12}
    }, {
        "resources": {"wood": 13, "build": 0, "food": 12, "stone": 0, "gold": 2},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "resources": {"stone": 0, "food": 12, "build": 0, "gold": 2, "wood": 16},
        "task": "stragglerTree",
        "count": 3,
        "buildings": [{"count": 1, "type": "blacksmith"}, {"type": "stable", "count": 1}],
        "type": "newVillagers"
    }, {
        "resources": {"gold": 2, "stone": 0, "wood": 16, "build": 0, "food": 12},
        "tech": ["doubleBitAxe"],
        "type": "research"
    }, {
        "type": "ageUp",
        "resources": {"gold": 2, "build": 0, "food": 12, "wood": 16, "stone": 0},
        "age": "castleAge"
    }, {
        "tech": ["horseCollar"],
        "type": "research",
        "resources": {"wood": 16, "food": 12, "gold": 2, "stone": 0, "build": 0}
    }, {
        "count": 8,
        "from": "wood",
        "resources": {"stone": 0, "gold": 2, "build": 0, "wood": 8, "food": 20},
        "to": "farm",
        "type": "moveVillagers"
    }, {
        "to": "gold",
        "resources": {"food": 16, "gold": 6, "stone": 0, "wood": 8, "build": 0},
        "type": "moveVillagers",
        "from": "berries",
        "count": 4
    }, {
        "type": "newAge",
        "resources": {"stone": 0, "food": 16, "wood": 8, "build": 0, "gold": 6},
        "age": "castleAge"
    }, {
        "tech": ["bowSaw"],
        "resources": {"build": 0, "gold": 6, "wood": 8, "food": 16, "stone": 0},
        "type": "research"
    }, {
        "resources": {"wood": 8, "gold": 6, "stone": 0, "food": 16, "build": 0},
        "unit": "battleElephant",
        "type": "trainUnit",
        "count": "∞"
    }, {
        "resources": {"stone": 0, "food": 16, "gold": 6, "wood": 9, "build": 0},
        "count": 1,
        "type": "newVillagers",
        "task": "wood"
    }, {
        "type": "newVillagers",
        "task": "farm",
        "count": 3,
        "resources": {"food": 19, "wood": 9, "build": 0, "stone": 0, "gold": 6}
    }, {
        "tech": ["goldMining"],
        "resources": {"build": 0, "gold": 6, "wood": 9, "stone": 0, "food": 19},
        "type": "research"
    }, {
        "resources": {"build": 0, "stone": 0, "wood": 9, "food": 19, "gold": 6},
        "text": "Elephants + Scorpions",
        "type": "decision"
    }, {
        "resources": {"food": 19, "build": 0, "gold": 6, "stone": 0, "wood": 9},
        "type": "build",
        "buildings": [{"count": 1, "type": "siegeWorkshop"}]
    }, {
        "resources": {"gold": 12, "wood": 9, "build": 0, "food": 19, "stone": 0},
        "type": "newVillagers",
        "task": "gold",
        "count": 6
    }, {
        "resources": {"build": 0, "food": 19, "gold": 6, "wood": 9, "stone": 0},
        "text": "Elephants + Monks",
        "type": "decision"
    }, {
        "buildings": [{"type": "monastery", "count": 1}],
        "resources": {"gold": 6, "stone": 0, "build": 0, "wood": 9, "food": 19},
        "type": "build"
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"food": 19, "build": 0, "wood": 9, "stone": 0, "gold": 11},
        "count": 5
    }, {
        "type": "decision",
        "text": "Elephants + Pikemen",
        "resources": {"food": 19, "build": 0, "stone": 0, "gold": 6, "wood": 9}
    }, {
        "resources": {"wood": 9, "build": 0, "stone": 0, "food": 24, "gold": 6},
        "count": 5,
        "type": "newVillagers",
        "task": "farm"
    }, {
        "type": "research",
        "resources": {"wood": 9, "food": 24, "build": 0, "stone": 0, "gold": 6},
        "tech": ["pikeman", "scaleMailArmor"]
    }],
    "civilization": "Malay",
    "readyForPublish": true,
    "difficulty": 2,
    "pop": {"feudalAge": 28, "castleAge": 3},
    "attributes": ["fastCastle"],
    "image": "Battle Elephant",
    "uptime": {"feudalAge": "11:43", "castleAge": "14:34"},
    "title": "Fast Elephants",
    "reference": "https://youtu.be/gB2vrWk2lZA"
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FBattle%20Elephant.png?alt=media&token=26255c3d-0df1-41d3-a4f0-76d2529f3342",
    "attributes": ["fastCastle"],
    "uptime": {"castleAge": "14:34", "feudalAge": "12:08"},
    "pop": {"castleAge": 2, "feudalAge": 30},
    "author": "HumzaCrumza",
    "readyForPublish": true,
    "build": [{
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"food": 6, "stone": 0, "gold": 0, "wood": 0, "build": 0},
        "count": 6,
        "buildings": [{"type": "house", "count": 2}]
    }, {
        "task": "wood",
        "resources": {"wood": 4, "gold": 0, "food": 6, "stone": 0, "build": 0},
        "count": 4,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"food": 7, "gold": 0, "stone": 0, "build": 0, "wood": 4},
        "count": 1,
        "task": "boar"
    }, {
        "resources": {"gold": 0, "build": 0, "stone": 0, "wood": 4, "food": 7},
        "count": 3,
        "type": "lure",
        "animal": "deer"
    }, {
        "count": 1,
        "resources": {"stone": 0, "wood": 4, "build": 0, "food": 8, "gold": 0},
        "type": "newVillagers",
        "task": "boar"
    }, {
        "task": "berries",
        "count": 2,
        "type": "newVillagers",
        "resources": {"gold": 0, "build": 0, "wood": 4, "stone": 0, "food": 10},
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}]
    }, {
        "animal": "boar",
        "resources": {"stone": 0, "food": 10, "wood": 4, "build": 0, "gold": 0},
        "count": 1,
        "type": "lure"
    }, {
        "type": "newVillagers",
        "count": 4,
        "resources": {"food": 14, "stone": 0, "wood": 4, "gold": 0, "build": 0},
        "task": "sheep"
    }, {
        "resources": {"gold": 0, "wood": 9, "stone": 0, "build": 0, "food": 14},
        "task": "wood",
        "type": "newVillagers",
        "count": 5
    }, {
        "type": "moveVillagers",
        "resources": {"build": 0, "wood": 9, "stone": 0, "gold": 0, "food": 14},
        "to": "berries",
        "count": 5,
        "from": "sheep"
    }, {
        "task": "gold",
        "type": "newVillagers",
        "count": 6,
        "resources": {"wood": 9, "build": 0, "food": 14, "stone": 0, "gold": 6}
    }, {
        "resources": {"stone": 0, "food": 14, "gold": 6, "build": 0, "wood": 9},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"food": 14, "build": 0, "wood": 9, "gold": 6, "stone": 0},
        "type": "build"
    }, {
        "type": "newAge",
        "resources": {"wood": 9, "food": 14, "stone": 0, "gold": 6, "build": 0},
        "age": "feudalAge"
    }, {
        "type": "newVillagers",
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "stable"}],
        "task": "wood",
        "count": 2,
        "resources": {"build": 0, "food": 14, "wood": 11, "gold": 6, "stone": 0}
    }, {
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "resources": {"stone": 0, "gold": 6, "build": 0, "food": 14, "wood": 11},
        "count": 6
    }, {
        "resources": {"stone": 0, "wood": 11, "gold": 6, "food": 14, "build": 0},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "type": "build",
        "resources": {"stone": 0, "gold": 6, "food": 14, "build": 0, "wood": 11},
        "buildings": [{"type": "stable", "count": 1}]
    }, {
        "age": "castleAge",
        "resources": {"stone": 0, "build": 0, "food": 14, "gold": 6, "wood": 11},
        "type": "newAge"
    }, {
        "count": "∞",
        "unit": "battleElephant",
        "type": "trainUnit",
        "resources": {"gold": 6, "food": 14, "build": 0, "wood": 11, "stone": 0}
    }, {
        "tech": ["husbandry", "scaleBardingArmor"],
        "resources": {"build": 0, "gold": 6, "wood": 11, "food": 14, "stone": 0},
        "type": "research"
    }],
    "reference": "https://youtu.be/YOo9puOyiHM",
    "civilization": "Malay",
    "difficulty": 2,
    "description": "An all-in battle elephant rush build that makes use of two Malay bonuses: cheaper elephants and 66% faster age uptime. After reaching the Castle Age, the TC will be idled to maintain two stable elephant production.",
    "image": "Battle Elephant",
    "id": 56,
    "title": "Fast Elephants"
}, {
    "author": "Cicero",
    "civilization": "Malay",
    "readyForPublish": true,
    "attributes": ["fastCastle", "arena"],
    "description": "The Fast Castle build adapted for the Malay bonus with a focus on the economy.",
    "image": "Fast Castle",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "id": 41,
    "difficulty": 1,
    "title": "FC + Eco",
    "build": [{
        "count": 6,
        "resources": {"gold": 0, "stone": 0, "wood": 0, "build": 0, "food": 6},
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"food": 6, "gold": 0, "build": 0, "wood": 3, "stone": 0},
        "task": "wood",
        "count": 3
    }, {
        "type": "newVillagers",
        "task": "boar",
        "resources": {"food": 7, "wood": 3, "stone": 0, "build": 0, "gold": 0},
        "count": 1
    }, {
        "buildings": [{"type": "house", "count": 2}, {"count": 1, "type": "mill"}],
        "count": 4,
        "task": "berries",
        "resources": {"gold": 0, "food": 11, "build": 0, "stone": 0, "wood": 3},
        "type": "newVillagers"
    }, {
        "task": "sheep",
        "count": 3,
        "resources": {"gold": 0, "stone": 0, "food": 14, "build": 0, "wood": 3},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"gold": 0, "build": 0, "wood": 7, "stone": 0, "food": 14},
        "count": 4,
        "task": "wood"
    }, {
        "resources": {"food": 14, "gold": 0, "stone": 0, "wood": 7, "build": 0},
        "age": "feudalAge",
        "type": "ageUp"
    }, {
        "type": "moveVillagers",
        "to": "wood",
        "from": "sheep",
        "count": 3,
        "resources": {"gold": 0, "stone": 0, "wood": 10, "build": 0, "food": 11}
    }, {
        "count": 5,
        "type": "newVillagers",
        "resources": {"build": 0, "wood": 10, "stone": 0, "gold": 0, "food": 16},
        "task": "sheep"
    }, {
        "from": "sheep",
        "to": "farm",
        "count": 12,
        "type": "moveVillagers",
        "resources": {"wood": 10, "food": 16, "gold": 0, "build": 0, "stone": 0}
    }, {
        "type": "newVillagers",
        "task": "gold",
        "resources": {"wood": 10, "stone": 0, "food": 16, "build": 0, "gold": 5},
        "count": 5
    }, {
        "resources": {"wood": 10, "stone": 0, "build": 0, "food": 16, "gold": 5},
        "tech": ["wheelbarrow"],
        "type": "research"
    }, {"resources": {"gold": 5, "wood": 10, "stone": 0, "build": 0, "food": 16}, "type": "ageUp", "age": "castleAge"}],
    "uptime": {"feudalAge": "08:48", "castleAge": "14:34"},
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Castle.png?alt=media&token=a12d6e5f-f68b-4f5d-bf8b-9b7670beb357",
    "pop": {"castleAge": 10, "feudalAge": 22}
}, {
    "build": [{
        "resources": {"food": 6, "stone": 0, "gold": 0, "build": 0, "wood": 0},
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "resources": {"stone": 0, "food": 6, "gold": 0, "wood": 4, "build": 0},
        "task": "wood",
        "count": 4,
        "type": "newVillagers"
    }, {
        "resources": {"gold": 0, "stone": 0, "wood": 4, "food": 7, "build": 0},
        "count": 1,
        "task": "boar",
        "type": "newVillagers"
    }, {
        "count": 4,
        "task": "berries",
        "resources": {"gold": 0, "wood": 4, "build": 0, "food": 11, "stone": 0},
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}]
    }, {
        "resources": {"stone": 0, "wood": 4, "build": 0, "gold": 0, "food": 14},
        "task": "sheep",
        "type": "newVillagers",
        "count": 3
    }, {
        "to": "farm",
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 4, "food": 14},
        "count": 2
    }, {
        "type": "newVillagers",
        "task": "wood",
        "resources": {"stone": 0, "build": 0, "gold": 0, "food": 14, "wood": 8},
        "count": 4
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 8, "food": 14, "stone": 0},
        "type": "research",
        "tech": ["loom"]
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "gold": 0, "food": 14, "wood": 8, "stone": 0},
        "type": "ageUp"
    }, {
        "resources": {"food": 12, "gold": 0, "build": 0, "wood": 10, "stone": 0},
        "count": 2,
        "type": "moveVillagers",
        "to": "wood",
        "from": "sheep"
    }, {
        "resources": {"stone": 0, "gold": 0, "build": 0, "wood": 10, "food": 12},
        "buildings": [{"count": 1, "type": "barracks"}],
        "type": "build"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"food": 12, "build": 0, "wood": 10, "stone": 0, "gold": 0}
    }, {
        "type": "research",
        "resources": {"build": 0, "stone": 0, "wood": 10, "food": 12, "gold": 0},
        "tech": ["doubleBitAxe", "horseCollar"]
    }],
    "pop": {"feudalAge": 23},
    "description": "The scout build adapted for the Malay bonus.",
    "image": "Scout",
    "author": "Cicero",
    "uptime": {"feudalAge": "09:38"},
    "title": "Scouts",
    "attributes": ["fastFeudal"],
    "id": 38,
    "readyForPublish": true,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "civilization": "Malay",
    "difficulty": 2
}, {
    "attributes": ["fastFeudal"],
    "uptime": {"castleAge": "17:20", "feudalAge": "10:05"},
    "author": "Hera",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773",
    "pop": {"castleAge": 11, "feudalAge": 23},
    "image": "Man-at-Arms",
    "id": 17,
    "readyForPublish": true,
    "difficulty": 3,
    "title": "Men-at-Arms → Archers",
    "build": [{
        "type": "research",
        "tech": ["loom"],
        "resources": {"wood": 0, "gold": 0, "food": 0, "build": 0, "stone": 0}
    }, {
        "type": "newVillagers",
        "resources": {"food": 6, "wood": 0, "gold": 0, "build": 0, "stone": 0},
        "count": 6,
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}]
    }, {
        "task": "wood",
        "resources": {"food": 6, "gold": 0, "stone": 0, "wood": 4, "build": 0},
        "count": 4,
        "type": "newVillagers"
    }, {
        "resources": {"stone": 0, "food": 7, "gold": 0, "build": 0, "wood": 4},
        "type": "newVillagers",
        "count": 1,
        "task": "boar"
    }, {
        "task": "berries",
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 0, "food": 11},
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "count": 4
    }, {
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 4, "food": 12},
        "count": 1,
        "task": "boar",
        "type": "newVillagers"
    }, {
        "task": "build",
        "type": "newVillagers",
        "buildings": [{"type": "barracks", "count": 1}],
        "count": 1,
        "resources": {"wood": 4, "stone": 0, "food": 12, "build": 1, "gold": 0}
    }, {
        "resources": {"food": 15, "wood": 4, "build": 1, "gold": 0, "stone": 0},
        "type": "newVillagers",
        "count": 3,
        "task": "sheep"
    }, {
        "from": "build",
        "count": 1,
        "resources": {"wood": 5, "gold": 0, "build": 0, "stone": 0, "food": 15},
        "to": "wood",
        "type": "moveVillagers"
    }, {
        "count": 2,
        "type": "newVillagers",
        "task": "gold",
        "resources": {"food": 15, "build": 0, "wood": 5, "stone": 0, "gold": 2}
    }, {
        "resources": {"food": 15, "stone": 0, "gold": 2, "build": 0, "wood": 5},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "to": "wood",
        "type": "moveVillagers",
        "count": 3,
        "resources": {"build": 0, "stone": 0, "wood": 8, "gold": 2, "food": 12},
        "from": "sheep"
    }, {
        "type": "build",
        "buildings": [{"type": "house", "count": 1}, {"count": 1, "type": "wall"}],
        "resources": {"wood": 8, "gold": 2, "build": 0, "food": 12, "stone": 0}
    }, {
        "count": 4,
        "type": "trainUnit",
        "unit": "militia",
        "resources": {"stone": 0, "wood": 8, "build": 0, "gold": 2, "food": 12}
    }, {
        "resources": {"wood": 8, "stone": 0, "build": 0, "food": 12, "gold": 2},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "tech": ["manAtArms", "doubleBitAxe"],
        "resources": {"gold": 2, "stone": 0, "build": 0, "wood": 8, "food": 12},
        "type": "research"
    }, {
        "type": "newVillagers",
        "buildings": [{"type": "archeryRange", "count": 1}],
        "resources": {"stone": 0, "wood": 8, "food": 12, "gold": 5, "build": 0},
        "task": "gold",
        "count": 3
    }, {
        "resources": {"stone": 0, "gold": 5, "food": 12, "wood": 8, "build": 0},
        "type": "moveVillagers",
        "from": "sheep",
        "count": 8,
        "to": "farm"
    }, {
        "type": "build",
        "resources": {"gold": 5, "wood": 8, "stone": 0, "build": 0, "food": 12},
        "buildings": [{"count": 1, "type": "blacksmith"}]
    }, {
        "resources": {"build": 0, "food": 12, "stone": 0, "gold": 5, "wood": 8},
        "tech": ["fletching"],
        "type": "research"
    }, {
        "count": 5,
        "resources": {"build": 0, "food": 17, "gold": 5, "stone": 0, "wood": 8},
        "type": "newVillagers",
        "task": "farm"
    }, {
        "count": 10,
        "type": "trainUnit",
        "unit": "archer",
        "resources": {"wood": 8, "build": 0, "stone": 0, "food": 17, "gold": 5}
    }, {
        "type": "newVillagers",
        "resources": {"gold": 8, "food": 17, "wood": 8, "stone": 0, "build": 0},
        "count": 3,
        "task": "gold"
    }, {
        "tech": ["wheelbarrow"],
        "resources": {"gold": 8, "wood": 8, "build": 0, "food": 17, "stone": 0},
        "type": "research"
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"gold": 8, "stone": 0, "wood": 8, "food": 17, "build": 0}
    }, {
        "to": "wood",
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 12, "build": 0, "gold": 8, "food": 13},
        "from": "berries",
        "count": 4
    }, {
        "type": "newAge",
        "resources": {"wood": 12, "stone": 0, "gold": 8, "food": 13, "build": 0},
        "age": "castleAge"
    }, {
        "type": "research",
        "tech": ["bowSaw", "horseCollar"],
        "resources": {"wood": 12, "build": 0, "stone": 0, "gold": 8, "food": 13}
    }, {
        "type": "research",
        "resources": {"build": 0, "stone": 0, "wood": 12, "gold": 8, "food": 13},
        "tech": ["crossbowman", "bodkinArrow", "paddedArcherArmor"]
    }, {
        "type": "moveVillagers",
        "count": 2,
        "to": "wood",
        "from": "farm",
        "resources": {"wood": 14, "food": 11, "build": 0, "gold": 8, "stone": 0}
    }, {
        "resources": {"gold": 8, "food": 11, "wood": 14, "build": 0, "stone": 0},
        "type": "build",
        "buildings": [{"type": "townCenter", "count": 1}]
    }],
    "reference": "https://www.youtube.com/watch?v=I0KcM7ExlbM",
    "civilization": "Mayans",
    "description": "A man-at-arms build that focuses on transitioning into one range archers and focusing on economy to reach the next age quicker before going for a second range. A sub 20 min castle age after rushing with men-at-arms and fast fletching archers is insane and will allow you to flat out end games immediately."
}, {
    "build": [{
        "type": "newVillagers",
        "task": "sheep",
        "resources": {"wood": 0, "food": 6, "gold": 0, "build": 0, "stone": 0},
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}]
    }, {
        "count": 4,
        "task": "wood",
        "resources": {"gold": 0, "build": 0, "stone": 0, "food": 6, "wood": 4},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 1,
        "resources": {"build": 0, "gold": 0, "wood": 4, "stone": 0, "food": 7},
        "task": "boar"
    }, {
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "type": "newVillagers",
        "count": 4,
        "resources": {"gold": 0, "build": 0, "food": 11, "wood": 4, "stone": 0},
        "task": "berries"
    }, {
        "task": "sheep",
        "count": 3,
        "resources": {"stone": 0, "wood": 4, "build": 0, "food": 14, "gold": 0},
        "type": "newVillagers"
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "resources": {"food": 14, "gold": 0, "stone": 0, "build": 1, "wood": 4},
        "task": "build",
        "type": "newVillagers",
        "count": 1
    }, {
        "count": 2,
        "resources": {"wood": 4, "stone": 0, "build": 1, "gold": 2, "food": 14},
        "task": "gold",
        "type": "newVillagers"
    }, {
        "tech": ["loom"],
        "resources": {"gold": 2, "stone": 0, "build": 1, "wood": 4, "food": 14},
        "type": "research"
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"gold": 2, "stone": 0, "food": 14, "wood": 4, "build": 1}
    }, {
        "resources": {"food": 14, "wood": 4, "build": 1, "stone": 0, "gold": 2},
        "count": 3,
        "unit": "militia",
        "type": "trainUnit"
    }, {
        "from": "sheep",
        "to": "farm",
        "count": 2,
        "type": "moveVillagers",
        "resources": {"wood": 4, "build": 1, "food": 14, "stone": 0, "gold": 2}
    }, {
        "from": "sheep",
        "to": "wood",
        "resources": {"build": 1, "gold": 2, "wood": 11, "food": 7, "stone": 0},
        "count": 7,
        "type": "moveVillagers"
    }, {
        "resources": {"gold": 2, "food": 7, "stone": 0, "wood": 11, "build": 1},
        "count": 1,
        "from": "sheep",
        "to": "berries",
        "type": "moveVillagers"
    }, {
        "to": "berries",
        "resources": {"food": 8, "gold": 2, "build": 0, "wood": 11, "stone": 0},
        "type": "moveVillagers",
        "from": "build",
        "count": 1
    }, {
        "age": "feudalAge",
        "resources": {"build": 0, "stone": 0, "wood": 11, "food": 8, "gold": 2},
        "type": "newAge"
    }, {
        "resources": {"stone": 0, "gold": 2, "build": 0, "wood": 11, "food": 8},
        "type": "research",
        "tech": ["doubleBitAxe", "manAtArms"]
    }, {
        "count": 1,
        "resources": {"food": 8, "wood": 12, "stone": 0, "gold": 2, "build": 0},
        "type": "newVillagers",
        "task": "wood"
    }, {
        "task": "gold",
        "type": "newVillagers",
        "resources": {"build": 0, "wood": 12, "stone": 0, "food": 8, "gold": 8},
        "buildings": [{"type": "archeryRange", "count": 2}, {"type": "blacksmith", "count": 1}],
        "count": 6
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "gold": 8, "build": 0, "food": 18, "wood": 12},
        "task": "farm",
        "count": 10
    }, {
        "type": "research",
        "resources": {"food": 18, "stone": 0, "gold": 8, "wood": 12, "build": 0},
        "tech": ["wheelbarrow"]
    }, {"type": "ageUp", "age": "castleAge", "resources": {"gold": 8, "wood": 12, "stone": 0, "build": 0, "food": 18}}],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773",
    "difficulty": 3,
    "description": "This build allows creating at least 3 militia while advancing and researching the men-at-arms upgrade upon hitting Feudal. Men-at-arms have no effective counter until the opponent can start producing from ranges, and they can cause major disruption if they are not walled out. This build is one way of buying time to mass archers since your opponent is usually forced to deal with the men-at-arms in their base first. This build is quite tight (and therefore difficult), meaning horse collar usually needs to be delayed.",
    "pop": {"feudalAge": 22, "castleAge": 17},
    "title": "Men-at-Arms → Archers",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "author": "Cicero",
    "id": 7,
    "readyForPublish": true,
    "civilization": "Generic",
    "uptime": {"feudalAge": "10:05", "castleAge": "19:50"},
    "image": "Man-at-Arms",
    "attributes": ["fastFeudal"]
}, {
    "description": "This build is one way of buying time to mass archers since your opponent is usually forced to deal with the men-at-arms in their base first.",
    "author": "Hera",
    "difficulty": 3,
    "pop": {"castleAge": 14, "feudalAge": 22},
    "reference": "https://www.youtube.com/watch?v=5Rir2BEaYOE",
    "title": "Men-at-Arms → Archers",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773",
    "id": 11,
    "attributes": ["fastFeudal"],
    "readyForPublish": true,
    "image": "Man-at-Arms",
    "build": [{
        "resources": {"gold": 0, "stone": 0, "wood": 0, "build": 0, "food": 6},
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep",
        "type": "newVillagers",
        "count": 6
    }, {
        "task": "wood",
        "resources": {"food": 6, "stone": 0, "build": 0, "wood": 4, "gold": 0},
        "count": 4,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 1,
        "resources": {"stone": 0, "food": 7, "gold": 0, "wood": 4, "build": 0},
        "task": "boar"
    }, {
        "task": "berries",
        "buildings": [{"type": "house", "count": 1}, {"type": "mill", "count": 1}],
        "count": 3,
        "resources": {"food": 10, "build": 0, "stone": 0, "gold": 0, "wood": 4},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "gold": 0, "food": 11, "stone": 0, "build": 0},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "type": "newVillagers",
        "count": 1,
        "resources": {"food": 12, "wood": 4, "gold": 0, "stone": 0, "build": 0},
        "task": "berries",
        "buildings": [{"count": 1, "type": "house"}]
    }, {
        "count": 2,
        "resources": {"stone": 0, "gold": 0, "food": 14, "wood": 4, "build": 0},
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "resources": {"stone": 0, "gold": 0, "build": 0, "wood": 4, "food": 14},
        "buildings": [{"count": 1, "type": "barracks"}],
        "type": "build"
    }, {
        "type": "newVillagers",
        "task": "wood",
        "resources": {"food": 14, "gold": 0, "stone": 0, "build": 0, "wood": 5},
        "count": 1
    }, {
        "resources": {"build": 0, "gold": 2, "stone": 0, "wood": 5, "food": 14},
        "type": "newVillagers",
        "count": 2,
        "task": "gold"
    }, {
        "type": "ageUp",
        "resources": {"wood": 5, "food": 14, "build": 0, "gold": 2, "stone": 0},
        "age": "feudalAge"
    }, {
        "buildings": [{"count": 1, "type": "lumberCamp"}],
        "type": "build",
        "resources": {"gold": 2, "build": 0, "stone": 0, "food": 14, "wood": 5}
    }, {
        "resources": {"gold": 2, "build": 0, "wood": 5, "food": 14, "stone": 0},
        "unit": "militia",
        "count": 3,
        "type": "trainUnit"
    }, {
        "count": 5,
        "to": "wood",
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"build": 0, "stone": 0, "food": 9, "gold": 2, "wood": 10}
    }, {
        "from": "sheep",
        "count": 2,
        "resources": {"food": 9, "build": 0, "wood": 10, "stone": 0, "gold": 2},
        "type": "moveVillagers",
        "to": "farm"
    }, {
        "resources": {"build": 0, "food": 9, "gold": 2, "wood": 10, "stone": 0},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "tech": ["doubleBitAxe"],
        "resources": {"build": 0, "wood": 10, "food": 9, "gold": 2, "stone": 0},
        "type": "research"
    }, {
        "tech": ["manAtArms"],
        "resources": {"gold": 2, "build": 0, "stone": 0, "food": 9, "wood": 10},
        "type": "research"
    }, {
        "buildings": [{"type": "archeryRange", "count": 2}],
        "resources": {"wood": 10, "food": 9, "stone": 0, "build": 0, "gold": 7},
        "type": "newVillagers",
        "count": 5,
        "task": "gold"
    }, {
        "resources": {"food": 9, "wood": 10, "gold": 7, "stone": 0, "build": 0},
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "type": "build"
    }, {
        "resources": {"build": 0, "wood": 10, "food": 9, "gold": 7, "stone": 0},
        "type": "research",
        "tech": ["fletching"]
    }, {
        "type": "newVillagers",
        "resources": {"food": 18, "wood": 10, "build": 0, "stone": 0, "gold": 7},
        "count": 9,
        "task": "farm"
    }, {
        "type": "research",
        "resources": {"wood": 10, "food": 18, "build": 0, "stone": 0, "gold": 7},
        "tech": ["wheelbarrow"]
    }, {"resources": {"build": 0, "wood": 10, "stone": 0, "food": 18, "gold": 7}, "age": "castleAge", "type": "ageUp"}],
    "uptime": {"castleAge": "18:10", "feudalAge": "09:40"},
    "civilization": "Generic"
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FTower.png?alt=media&token=3ca603df-e3b3-4e1a-a32e-80c8e50bea65",
    "uptime": {"feudalAge": "10:05"},
    "description": "This build allows creating at least 3 militia while advancing and researching the men-at-arms upgrade upon hitting Feudal. Men-at-arms have no effective counter until the opponent can start producing from ranges, and they can cause major disruption if they are not walled out. This build is quite tight (and therefore difficult), meaning horse collar usually needs to be delayed. Towers can be used to deny map control and resources, and since men-at-arms have no counter in early Feudal, they are ideal for protecting forward villagers. This is one of the most effective ways of executing a tower rush.",
    "difficulty": 3,
    "author": "Cicero",
    "image": "Tower",
    "title": "Men-at-Arms → Towers",
    "attributes": ["fastFeudal"],
    "civilization": "Generic",
    "build": [{
        "task": "sheep",
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"wood": 0, "food": 6, "build": 0, "stone": 0, "gold": 0},
        "count": 6
    }, {
        "type": "newVillagers",
        "task": "wood",
        "resources": {"stone": 0, "wood": 4, "food": 6, "gold": 0, "build": 0},
        "count": 4
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 0, "wood": 4, "gold": 0, "food": 7},
        "task": "boar",
        "count": 1
    }, {
        "task": "berries",
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "count": 4,
        "resources": {"food": 11, "build": 0, "gold": 0, "wood": 4, "stone": 0},
        "type": "newVillagers"
    }, {
        "task": "sheep",
        "count": 3,
        "resources": {"gold": 0, "stone": 0, "food": 14, "build": 0, "wood": 4},
        "type": "newVillagers"
    }, {
        "count": 1,
        "task": "build",
        "type": "newVillagers",
        "resources": {"gold": 0, "stone": 0, "food": 14, "wood": 4, "build": 1},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "type": "collectGold",
        "resources": {"food": 14, "wood": 4, "stone": 0, "build": 1, "gold": 2},
        "task": "collect40GoldWithTwoNewVillagers",
        "count": 2,
        "subType": "newVillagers"
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"build": 1, "gold": 2, "food": 14, "stone": 0, "wood": 4}
    }, {
        "resources": {"build": 1, "gold": 2, "wood": 4, "food": 14, "stone": 0},
        "loom": false,
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "resources": {"wood": 4, "build": 1, "stone": 0, "food": 14, "gold": 2},
        "count": 3,
        "unit": "militia",
        "type": "trainUnit"
    }, {
        "to": "berries",
        "resources": {"stone": 0, "food": 14, "wood": 4, "build": 1, "gold": 2},
        "type": "moveVillagers",
        "from": "sheep",
        "count": 1
    }, {
        "from": "build",
        "count": 1,
        "resources": {"build": 0, "food": 15, "gold": 2, "stone": 0, "wood": 4},
        "to": "berries",
        "type": "moveVillagers"
    }, {
        "from": "sheep",
        "count": 5,
        "to": "stone",
        "resources": {"gold": 2, "stone": 5, "build": 0, "food": 10, "wood": 4},
        "type": "moveVillagers"
    }, {
        "type": "moveVillagers",
        "resources": {"build": 3, "wood": 4, "stone": 5, "food": 7, "gold": 2},
        "from": "sheep",
        "to": "forward",
        "count": 3
    }, {
        "to": "forward",
        "type": "moveVillagers",
        "resources": {"wood": 4, "build": 5, "stone": 5, "food": 7, "gold": 0},
        "count": 2,
        "from": "gold"
    }, {
        "resources": {"food": 7, "build": 5, "stone": 5, "gold": 0, "wood": 4},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "tech": ["manAtArms", "doubleBitAxe"],
        "type": "research",
        "resources": {"wood": 4, "build": 5, "food": 7, "gold": 0, "stone": 5}
    }],
    "id": 8,
    "pop": {"feudalAge": 22},
    "readyForPublish": true,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470"
}, {
    "pop": {"feudalAge": 22},
    "description": "Straight eagle scouts; allows constant production from two barracks upon reaching Feudal. Requires both blacksmith upgrades early on for them to be effective. Could be followed either by ranges for archer transition or a third barracks for full eagles. Usually not viable against experienced opponents, with men-at-arms - eagles being a better (but still uncommon) option. Aztecs are the most viable for this build due to the shorter creation time. (More commonly, eagle scouts would begin massing in late Feudal, so there is an army ready to upgrade upon reaching Castle.)",
    "civilization": "Meso",
    "attributes": ["fastFeudal"],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FEagle.png?alt=media&token=3fd48dcc-84cd-43d8-ae79-6abd1839549b",
    "difficulty": 1,
    "readyForPublish": true,
    "build": [{
        "resources": {"food": 6, "gold": 0, "build": 0, "stone": 0, "wood": 0},
        "task": "sheep",
        "type": "newVillagers",
        "count": 6,
        "buildings": [{"type": "house", "count": 2}]
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 4,
        "resources": {"wood": 4, "build": 0, "stone": 0, "food": 6, "gold": 0}
    }, {
        "resources": {"build": 0, "food": 7, "gold": 0, "wood": 4, "stone": 0},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "task": "berries",
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "resources": {"wood": 4, "food": 11, "gold": 0, "stone": 0, "build": 0},
        "count": 4
    }, {
        "resources": {"food": 11, "stone": 0, "wood": 4, "build": 0, "gold": 0},
        "count": 1,
        "type": "lure",
        "animal": "boar"
    }, {
        "count": 3,
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"food": 14, "build": 0, "stone": 0, "wood": 4, "gold": 0}
    }, {
        "type": "moveVillagers",
        "resources": {"stone": 0, "gold": 0, "wood": 4, "build": 0, "food": 14},
        "count": 2,
        "to": "farm",
        "from": "sheep"
    }, {
        "resources": {"stone": 0, "build": 0, "wood": 7, "food": 14, "gold": 0},
        "task": "wood",
        "count": 3,
        "type": "newVillagers"
    }, {
        "type": "research",
        "resources": {"gold": 0, "food": 14, "wood": 7, "stone": 0, "build": 0},
        "tech": ["loom"]
    }, {
        "type": "ageUp",
        "resources": {"food": 14, "gold": 0, "stone": 0, "build": 0, "wood": 7},
        "age": "feudalAge"
    }, {
        "from": "sheep",
        "resources": {"wood": 7, "food": 10, "gold": 4, "stone": 0, "build": 0},
        "type": "moveVillagers",
        "count": 4,
        "to": "gold"
    }, {
        "type": "build",
        "resources": {"food": 10, "gold": 4, "stone": 0, "build": 0, "wood": 7},
        "buildings": [{"count": 2, "type": "barracks"}]
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"wood": 7, "build": 0, "stone": 0, "food": 10, "gold": 4}
    }, {
        "type": "newVillagers",
        "count": 3,
        "resources": {"wood": 10, "food": 10, "gold": 4, "build": 0, "stone": 0},
        "task": "wood",
        "buildings": [{"count": 1, "type": "blacksmith"}]
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 2,
        "resources": {"stone": 0, "build": 0, "wood": 10, "gold": 6, "food": 10}
    }],
    "title": "Eagles",
    "author": "Cicero",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "id": 24,
    "uptime": {"feudalAge": "10:05"},
    "image": "Eagle"
}, {
    "civilization": "Meso",
    "pop": {"feudalAge": 23},
    "id": 63,
    "title": "Eagles",
    "author": "Karanrimé",
    "attributes": ["fastFeudal"],
    "readyForPublish": true,
    "reference": "https://youtu.be/-ojYu7m-7V8",
    "uptime": {"feudalAge": "10:30"},
    "image": "Eagle",
    "build": [{
        "type": "newVillagers",
        "task": "sheep",
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "resources": {"wood": 0, "stone": 0, "build": 0, "gold": 0, "food": 6}
    }, {
        "count": 4,
        "type": "newVillagers",
        "task": "wood",
        "resources": {"food": 6, "wood": 4, "build": 0, "gold": 0, "stone": 0}
    }, {
        "count": 1,
        "type": "newVillagers",
        "task": "boar",
        "resources": {"gold": 0, "wood": 4, "build": 0, "stone": 0, "food": 7}
    }, {
        "resources": {"wood": 4, "stone": 0, "food": 11, "gold": 0, "build": 0},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "count": 4,
        "task": "berries"
    }, {
        "resources": {"gold": 0, "wood": 4, "food": 11, "build": 0, "stone": 0},
        "animal": "boar",
        "count": 1,
        "type": "lure"
    }, {
        "task": "sheep",
        "count": 1,
        "resources": {"wood": 4, "stone": 0, "build": 0, "gold": 0, "food": 12},
        "type": "newVillagers"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 3,
        "resources": {"wood": 7, "stone": 0, "food": 12, "build": 0, "gold": 0}
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 3,
        "resources": {"wood": 7, "build": 0, "gold": 3, "food": 12, "stone": 0}
    }, {
        "type": "research",
        "resources": {"build": 0, "gold": 3, "stone": 0, "wood": 7, "food": 12},
        "tech": ["loom"]
    }, {
        "resources": {"gold": 3, "build": 0, "wood": 7, "stone": 0, "food": 12},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "buildings": [{"count": 2, "type": "barracks"}],
        "resources": {"build": 0, "food": 12, "stone": 0, "gold": 3, "wood": 7},
        "type": "build"
    }, {
        "from": "sheep",
        "count": 1,
        "type": "moveVillagers",
        "to": "wood",
        "resources": {"build": 0, "gold": 3, "wood": 8, "food": 11, "stone": 0}
    }, {
        "count": 2,
        "resources": {"wood": 8, "food": 9, "build": 0, "stone": 0, "gold": 5},
        "from": "sheep",
        "type": "moveVillagers",
        "to": "gold"
    }, {
        "age": "feudalAge",
        "type": "newAge",
        "resources": {"gold": 5, "build": 0, "stone": 0, "wood": 8, "food": 9}
    }, {
        "count": "∞",
        "type": "trainUnit",
        "unit": "eagleScout",
        "resources": {"food": 9, "gold": 5, "build": 0, "stone": 0, "wood": 8}
    }, {
        "tech": ["doubleBitAxe"],
        "type": "research",
        "resources": {"build": 0, "gold": 5, "stone": 0, "wood": 8, "food": 9}
    }, {
        "type": "newVillagers",
        "task": "gold",
        "count": 2,
        "resources": {"wood": 8, "build": 0, "food": 9, "gold": 7, "stone": 0},
        "buildings": [{"count": 1, "type": "blacksmith"}]
    }],
    "description": "A straight Eagles build that will enable you to produce out of two barracks upon hitting the Feudal Age. Additional barracks can be added after you stabilize your food productions with a bunch of farms. Getting Forging in Feudal Age is also recommended.",
    "difficulty": 1,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FEagle.png?alt=media&token=3fd48dcc-84cd-43d8-ae79-6abd1839549b"
}, {
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "difficulty": 3,
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "title": "Fast Scouts",
    "id": 25,
    "build": [{
        "type": "newVillagers",
        "count": 6,
        "resources": {"stone": 0, "gold": 0, "build": 0, "food": 6, "wood": 0},
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}]
    }, {
        "resources": {"stone": 0, "food": 6, "gold": 0, "build": 0, "wood": 3},
        "type": "newVillagers",
        "task": "wood",
        "count": 3
    }, {
        "task": "boar",
        "resources": {"gold": 0, "wood": 3, "build": 0, "stone": 0, "food": 7},
        "count": 1,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"gold": 0, "wood": 3, "food": 11, "stone": 0, "build": 0},
        "count": 4,
        "task": "berries"
    }, {
        "type": "lure",
        "count": 1,
        "animal": "boar",
        "resources": {"wood": 3, "food": 11, "gold": 0, "build": 0, "stone": 0}
    }, {
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"gold": 0, "stone": 0, "food": 14, "wood": 3, "build": 0},
        "count": 3
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"food": 14, "wood": 3, "stone": 0, "gold": 0, "build": 0}
    }, {
        "resources": {"build": 0, "wood": 3, "gold": 0, "stone": 0, "food": 14},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "type": "moveVillagers",
        "from": "sheep",
        "to": "wood",
        "count": 5,
        "resources": {"build": 0, "gold": 0, "food": 9, "stone": 0, "wood": 8}
    }, {
        "type": "build",
        "resources": {"stone": 0, "build": 0, "food": 9, "gold": 0, "wood": 8},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "resources": {"food": 9, "stone": 0, "wood": 8, "gold": 0, "build": 0},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "type": "build",
        "resources": {"gold": 0, "food": 9, "stone": 0, "wood": 8, "build": 0},
        "buildings": [{"count": 1, "type": "stable"}]
    }, {
        "type": "trainUnit",
        "resources": {"gold": 0, "build": 0, "wood": 8, "food": 9, "stone": 0},
        "count": 4,
        "unit": "scout"
    }],
    "author": "Cicero",
    "uptime": {"feudalAge": "08:25"},
    "image": "Scout",
    "attributes": ["fastFeudal"],
    "description": "The Mongol scout rush is their signature strategy and an important one to learn since after their fast start they get few other advantages until mid-late imp.",
    "pop": {"feudalAge": 18},
    "civilization": "Mongols",
    "readyForPublish": true
}, {
    "author": "Bodkin Arrow",
    "readyForPublish": true,
    "uptime": {"feudalAge": "09:15"},
    "title": "Douche",
    "description": "An early game rush that includes deleting and rebuilding your town center next to your opponent's town center. This strategy can only be executed with Persians since their town center has twice the HP.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FTown%20Center.png?alt=media&token=65f446d8-5fca-4001-965d-b13636fe7d76",
    "pop": {"feudalAge": 20},
    "civilization": "Persians",
    "id": 27,
    "attributes": ["meme"],
    "image": "Town Center",
    "build": [{
        "type": "newVillagers",
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}],
        "count": 6,
        "resources": {"stone": 0, "food": 6, "wood": 0, "build": 0, "gold": 0}
    }, {
        "task": "wood",
        "count": 3,
        "resources": {"wood": 3, "food": 6, "stone": 0, "gold": 0, "build": 0},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 3, "stone": 0, "food": 7, "gold": 0, "build": 0},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "resources": {"wood": 3, "build": 0, "food": 10, "stone": 0, "gold": 0},
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "task": "berries",
        "count": 3,
        "type": "newVillagers"
    }, {
        "count": 6,
        "resources": {"wood": 3, "stone": 0, "food": 16, "build": 0, "gold": 0},
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "animal": "boar",
        "resources": {"gold": 0, "food": 16, "build": 0, "stone": 0, "wood": 3},
        "count": 1,
        "type": "lure"
    }, {
        "tech": ["loom"],
        "resources": {"gold": 0, "build": 0, "stone": 0, "food": 16, "wood": 3},
        "type": "research"
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"gold": 0, "build": 0, "stone": 0, "wood": 3, "food": 16}
    }, {
        "type": "moveVillagers",
        "from": "sheep",
        "count": 10,
        "to": "forward",
        "resources": {"food": 6, "stone": 0, "gold": 0, "build": 10, "wood": 3}
    }, {"age": "feudalAge", "type": "newAge", "resources": {"wood": 3, "stone": 0, "food": 6, "build": 10, "gold": 0}}],
    "difficulty": 2,
    "reference": "https://www.youtube.com/watch?v=OOll8XtqB9k&feature=youtu.be"
}, {
    "description": "A Pre-mill drush is when you are going for 3 militia in Dark Age, but build your barracks before you build your mill. This leads to an earlier attack timing and can be quite deadly. Not too many players are used to be disrupted so early and sometimes might not even have loom by the time the drush arrives.",
    "build": [{
        "buildings": [{"type": "house", "count": 2}],
        "type": "newVillagers",
        "resources": {"food": 6, "gold": 0, "build": 0, "wood": 0, "stone": 0},
        "count": 6,
        "task": "sheep"
    }, {
        "count": 4,
        "task": "wood",
        "resources": {"gold": 0, "food": 6, "stone": 0, "build": 0, "wood": 4},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "food": 7, "gold": 0, "build": 0, "stone": 0},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "task": "build",
        "resources": {"build": 1, "wood": 4, "gold": 0, "stone": 0, "food": 7},
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "barracks"}],
        "count": 1,
        "type": "newVillagers"
    }, {
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"gold": 0, "stone": 0, "build": 1, "wood": 4, "food": 9},
        "count": 2
    }, {
        "count": 1,
        "task": "collect10GoldWithNewVillager",
        "resources": {"stone": 0, "food": 9, "gold": 1, "build": 1, "wood": 4},
        "type": "collectGold",
        "subType": "newVillagers"
    }, {
        "type": "trainUnit",
        "count": 3,
        "resources": {"wood": 4, "build": 1, "stone": 0, "food": 9, "gold": 1},
        "unit": "militia"
    }, {
        "resources": {"build": 2, "gold": 0, "stone": 0, "food": 9, "wood": 4},
        "to": "build",
        "type": "moveVillagers",
        "count": 1,
        "from": "gold"
    }, {
        "resources": {"stone": 0, "build": 2, "food": 9, "gold": 0, "wood": 4},
        "type": "build",
        "buildings": [{"count": 1, "type": "wall"}]
    }, {
        "resources": {"stone": 0, "food": 10, "build": 2, "gold": 0, "wood": 4},
        "type": "newVillagers",
        "task": "boar",
        "count": 1
    }, {
        "type": "newVillagers",
        "buildings": [{"type": "mill", "count": 1}],
        "count": 6,
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 2, "food": 16},
        "task": "berries"
    }, {
        "to": "wood",
        "count": 4,
        "from": "sheep",
        "resources": {"wood": 8, "stone": 0, "food": 12, "gold": 0, "build": 2},
        "type": "moveVillagers"
    }, {
        "count": 6,
        "resources": {"wood": 8, "food": 18, "build": 2, "stone": 0, "gold": 0},
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "count": 8,
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "resources": {"stone": 0, "food": 18, "wood": 8, "build": 2, "gold": 0}
    }, {
        "tech": ["loom"],
        "type": "research",
        "resources": {"stone": 0, "wood": 8, "food": 18, "gold": 0, "build": 2}
    }, {
        "resources": {"wood": 8, "food": 18, "build": 2, "stone": 0, "gold": 0},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "resources": {"build": 2, "wood": 8, "stone": 0, "food": 14, "gold": 4},
        "from": "sheep",
        "type": "moveVillagers",
        "count": 4,
        "to": "gold"
    }, {
        "resources": {"build": 2, "gold": 4, "stone": 0, "wood": 8, "food": 14},
        "age": "feudalAge",
        "type": "newAge"
    }, {
        "type": "newVillagers",
        "count": 2,
        "resources": {"wood": 8, "food": 14, "stone": 0, "build": 2, "gold": 6},
        "task": "gold",
        "buildings": [{"type": "blacksmith", "count": 1}, {"type": "archeryRange", "count": 1}]
    }, {
        "age": "castleAge",
        "type": "ageUp",
        "resources": {"wood": 8, "stone": 0, "build": 2, "food": 14, "gold": 6}
    }, {
        "resources": {"food": 14, "gold": 6, "build": 2, "stone": 0, "wood": 8},
        "tech": ["doubleBitAxe", "horseCollar"],
        "type": "research"
    }, {
        "type": "build",
        "resources": {"stone": 0, "wood": 8, "food": 14, "build": 2, "gold": 6},
        "buildings": [{"type": "archeryRange", "count": 1}]
    }, {
        "resources": {"build": 2, "gold": 6, "wood": 8, "stone": 0, "food": 14},
        "type": "research",
        "tech": ["fletching"]
    }, {
        "type": "trainUnit",
        "unit": "archer",
        "resources": {"build": 2, "stone": 0, "wood": 8, "food": 14, "gold": 6},
        "count": "∞"
    }, {
        "from": "sheep",
        "to": "farm",
        "type": "moveVillagers",
        "count": 2,
        "resources": {"build": 2, "gold": 6, "stone": 0, "food": 14, "wood": 8}
    }, {"age": "castleAge", "resources": {"gold": 6, "wood": 8, "build": 2, "food": 14, "stone": 0}, "type": "newAge"}],
    "title": "Pre-Mill Drush → FC",
    "civilization": "Generic",
    "author": "HumzaCrumza",
    "difficulty": 3,
    "id": 2,
    "image": "Mill",
    "readyForPublish": true,
    "uptime": {"feudalAge": "13:00", "castleAge": "16:30"},
    "reference": "https://youtu.be/uzUc9my3VLA",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMill.png?alt=media&token=c7005f6e-ddec-4990-8fd8-92be8c377867",
    "pop": {"castleAge": 2, "feudalAge": 29},
    "attributes": ["drush", "fastCastle"]
}, {
    "author": "TaToH",
    "attributes": ["fastFeudal", "meme"],
    "civilization": "Saracens",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FArcher.png?alt=media&token=049d898a-7322-4520-8597-da91446238e7",
    "reference": "",
    "uptime": {"feudalAge": "09:15"},
    "difficulty": 3,
    "readyForPublish": true,
    "id": 52,
    "pop": {"feudalAge": 20},
    "image": "Archer",
    "title": "Tati Rush",
    "build": [{
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers",
        "resources": {"gold": 0, "stone": 0, "food": 6, "build": 0, "wood": 0},
        "task": "sheep"
    }, {
        "type": "newVillagers",
        "count": 3,
        "resources": {"build": 0, "wood": 3, "stone": 0, "gold": 0, "food": 6},
        "task": "wood"
    }, {
        "resources": {"stone": 0, "gold": 0, "build": 0, "wood": 3, "food": 7},
        "count": 1,
        "type": "newVillagers",
        "task": "boar"
    }, {
        "type": "newVillagers",
        "count": 7,
        "task": "sheep",
        "resources": {"food": 14, "stone": 0, "gold": 0, "build": 0, "wood": 3}
    }, {
        "to": "gold",
        "count": 3,
        "from": "sheep",
        "type": "moveVillagers",
        "resources": {"wood": 3, "gold": 3, "food": 11, "build": 0, "stone": 0}
    }, {
        "resources": {"gold": 3, "wood": 3, "food": 13, "stone": 0, "build": 0},
        "count": 2,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"food": 13, "stone": 0, "gold": 3, "build": 0, "wood": 3}
    }, {
        "type": "ageUp",
        "resources": {"stone": 0, "food": 13, "gold": 3, "wood": 3, "build": 0},
        "age": "feudalAge"
    }, {
        "from": "sheep",
        "resources": {"gold": 3, "food": 4, "stone": 0, "wood": 12, "build": 0},
        "to": "wood",
        "count": 9,
        "type": "moveVillagers"
    }, {
        "resources": {"gold": 5, "food": 2, "build": 0, "wood": 12, "stone": 0},
        "from": "sheep",
        "count": 2,
        "type": "moveVillagers",
        "to": "gold"
    }, {
        "from": "sheep",
        "resources": {"build": 2, "wood": 12, "gold": 5, "food": 0, "stone": 0},
        "type": "moveVillagers",
        "to": "forward",
        "count": 2
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"food": 0, "wood": 12, "build": 2, "stone": 0, "gold": 5}
    }, {
        "resources": {"wood": 12, "food": 0, "gold": 5, "stone": 0, "build": 2},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "resources": {"food": 0, "gold": 5, "stone": 0, "build": 2, "wood": 12},
        "type": "build",
        "buildings": [{"count": 2, "type": "archeryRange"}]
    }, {
        "buildings": [{"count": 1, "type": "blacksmith"}],
        "type": "build",
        "resources": {"stone": 0, "wood": 12, "food": 0, "build": 2, "gold": 5}
    }, {
        "resources": {"stone": 0, "wood": 12, "build": 2, "food": 0, "gold": 5},
        "type": "research",
        "tech": ["fletching"]
    }, {
        "type": "build",
        "resources": {"build": 2, "gold": 5, "stone": 0, "food": 0, "wood": 12},
        "buildings": [{"count": 1, "type": "archeryRange"}]
    }, {
        "resources": {"wood": 7, "food": 0, "gold": 10, "build": 2, "stone": 0},
        "to": "gold",
        "type": "moveVillagers",
        "count": 5,
        "from": "wood"
    }],
    "description": "The goal is to click up with 20 pop and then cease producing villagers in order to have 3 ranges produce archers constantly. It's played with Saracens because of their archers' bonus. Named after its creator TaToH. Only stay on food as long as needed to afford fletching."
}, {
    "attributes": ["fastFeudal"],
    "readyForPublish": true,
    "image": "Scout",
    "reference": "https://steamcommunity.com/sharedfiles/filedetails/?id=1489568470",
    "description": "Classic fast build - scouts can gain early map control, do early damage before walls go up, and can effectively kill off small groups of archers/skirms. They can also buy time for a player to transition into ranges - which is usually needed since archers once massed will begin to kill off scouts quite easily.",
    "id": 1,
    "pop": {"feudalAge": 21},
    "difficulty": 2,
    "civilization": "Generic",
    "uptime": {"feudalAge": "09:40"},
    "author": "Cicero",
    "build": [{
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "task": "sheep",
        "type": "newVillagers",
        "resources": {"build": 0, "food": 6, "gold": 0, "wood": 0, "stone": 0}
    }, {
        "count": 3,
        "type": "newVillagers",
        "resources": {"food": 6, "build": 0, "wood": 3, "stone": 0, "gold": 0},
        "task": "wood"
    }, {
        "task": "boar",
        "type": "newVillagers",
        "resources": {"stone": 0, "gold": 0, "food": 7, "build": 0, "wood": 3},
        "count": 1
    }, {
        "count": 4,
        "type": "newVillagers",
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"food": 11, "build": 0, "gold": 0, "wood": 3, "stone": 0},
        "task": "berries"
    }, {
        "resources": {"build": 0, "food": 14, "stone": 0, "gold": 0, "wood": 3},
        "task": "sheep",
        "count": 3,
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "count": 3,
        "task": "wood",
        "resources": {"stone": 0, "build": 0, "wood": 6, "food": 14, "gold": 0}
    }, {
        "tech": ["loom"],
        "resources": {"wood": 6, "food": 14, "gold": 0, "build": 0, "stone": 0},
        "type": "research"
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 6, "stone": 0, "food": 14},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "type": "moveVillagers",
        "count": 4,
        "from": "sheep",
        "resources": {"food": 10, "gold": 0, "build": 0, "wood": 10, "stone": 0},
        "to": "wood"
    }, {
        "buildings": [{"count": 1, "type": "barracks"}],
        "resources": {"gold": 0, "stone": 0, "build": 0, "wood": 10, "food": 10},
        "type": "build"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"gold": 0, "stone": 0, "wood": 10, "food": 10, "build": 0}
    }, {
        "resources": {"build": 0, "wood": 10, "food": 10, "stone": 0, "gold": 0},
        "type": "research",
        "tech": ["doubleBitAxe", "horseCollar"]
    }, {
        "task": "farm",
        "count": 8,
        "resources": {"food": 18, "gold": 0, "stone": 0, "build": 0, "wood": 10},
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "stable"}]
    }, {
        "unit": "scout",
        "type": "trainUnit",
        "count": 5,
        "resources": {"wood": 10, "stone": 0, "food": 18, "gold": 0, "build": 0}
    }, {
        "resources": {"build": 0, "wood": 10, "gold": 0, "food": 18, "stone": 0},
        "text": "Scouts → Castle",
        "type": "decision"
    }, {
        "count": 5,
        "task": "gold",
        "buildings": [],
        "resources": {"wood": 10, "build": 0, "stone": 0, "gold": 5, "food": 18},
        "type": "newVillagers"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}],
        "type": "build",
        "resources": {"gold": 5, "build": 0, "stone": 0, "wood": 10, "food": 18}
    }, {
        "tech": ["wheelbarrow"],
        "type": "research",
        "resources": {"build": 0, "gold": 5, "food": 18, "wood": 10, "stone": 0}
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"food": 18, "wood": 10, "stone": 0, "build": 0, "gold": 5}
    }, {
        "text": "Scouts → Archers",
        "resources": {"wood": 10, "stone": 0, "build": 0, "food": 18, "gold": 0},
        "type": "decision"
    }, {
        "task": "gold",
        "buildings": [{"type": "archeryRange", "count": 2}, {"count": 1, "type": "blacksmith"}],
        "count": 8,
        "type": "newVillagers",
        "resources": {"food": 18, "stone": 0, "wood": 10, "gold": 8, "build": 0}
    }, {
        "resources": {"build": 0, "stone": 0, "gold": 8, "wood": 10, "food": 18},
        "tech": ["fletching"],
        "type": "research"
    }, {
        "resources": {"wood": 10, "stone": 0, "food": 18, "build": 0, "gold": 8},
        "type": "research",
        "tech": ["wheelbarrow"]
    }, {
        "age": "castleAge",
        "type": "ageUp",
        "resources": {"wood": 10, "build": 0, "gold": 8, "food": 18, "stone": 0}
    }, {
        "resources": {"wood": 10, "food": 18, "gold": 0, "stone": 0, "build": 0},
        "type": "decision",
        "text": "Scouts → Skirmishers"
    }, {
        "count": 2,
        "task": "wood",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "archeryRange"}],
        "resources": {"wood": 12, "food": 18, "build": 0, "gold": 0, "stone": 0}
    }, {
        "task": "gold",
        "count": 4,
        "buildings": [{"type": "blacksmith", "count": 1}],
        "type": "newVillagers",
        "resources": {"build": 0, "food": 18, "gold": 4, "wood": 12, "stone": 0}
    }, {
        "resources": {"gold": 4, "build": 0, "wood": 12, "food": 18, "stone": 0},
        "type": "research",
        "tech": ["fletching"]
    }, {
        "resources": {"wood": 12, "stone": 0, "food": 18, "build": 0, "gold": 4},
        "type": "research",
        "tech": ["wheelbarrow"]
    }, {"resources": {"stone": 0, "build": 0, "food": 18, "wood": 12, "gold": 4}, "age": "castleAge", "type": "ageUp"}],
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "title": "Scouts"
}, {
    "pop": {"castleAge": 13, "feudalAge": 21},
    "id": 3,
    "uptime": {"feudalAge": "09:40", "castleAge": "17:45"},
    "description": "This strategy is amazing for civs with a cavalry focus. You go for a quick scout rush, full wall, and then try to get to Castle Age faster than your opponent to finish them off with knights.",
    "attributes": ["fastFeudal"],
    "title": "Scouts → Knights",
    "image": "Scout",
    "author": "Hera",
    "civilization": "Generic",
    "difficulty": 1,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505",
    "build": [{
        "task": "sheep",
        "count": 6,
        "resources": {"food": 6, "build": 0, "gold": 0, "wood": 0, "stone": 0},
        "type": "newVillagers",
        "buildings": [{"type": "house", "count": 2}]
    }, {
        "resources": {"gold": 0, "stone": 0, "food": 6, "build": 0, "wood": 3},
        "count": 3,
        "buildings": [{"type": "lumberCamp", "count": 1}],
        "type": "newVillagers",
        "task": "wood"
    }, {
        "count": 2,
        "task": "boar",
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 0, "wood": 3, "food": 8, "gold": 0}
    }, {
        "buildings": [{"count": 2, "type": "house"}, {"count": 1, "type": "mill"}],
        "task": "berries",
        "resources": {"wood": 3, "food": 10, "stone": 0, "build": 0, "gold": 0},
        "type": "newVillagers",
        "count": 2
    }, {
        "task": "boar",
        "type": "newVillagers",
        "resources": {"build": 0, "gold": 0, "stone": 0, "wood": 3, "food": 11},
        "count": 1
    }, {
        "type": "newVillagers",
        "resources": {"wood": 3, "stone": 0, "build": 0, "gold": 0, "food": 12},
        "task": "berries",
        "count": 1
    }, {
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 3, "food": 13},
        "count": 1,
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "resources": {"food": 13, "wood": 7, "build": 0, "gold": 0, "stone": 0},
        "type": "newVillagers",
        "buildings": [{"type": "lumberCamp", "count": 1}],
        "count": 4,
        "task": "wood"
    }, {
        "resources": {"stone": 0, "build": 0, "food": 13, "wood": 7, "gold": 0},
        "type": "research",
        "tech": ["loom"]
    }, {
        "type": "ageUp",
        "age": "feudalAge",
        "resources": {"stone": 0, "build": 0, "wood": 7, "food": 13, "gold": 0}
    }, {
        "count": 3,
        "resources": {"gold": 0, "stone": 0, "build": 0, "wood": 10, "food": 10},
        "to": "wood",
        "from": "sheep",
        "type": "moveVillagers"
    }, {
        "type": "build",
        "resources": {"stone": 0, "build": 0, "gold": 0, "food": 10, "wood": 10},
        "buildings": [{"type": "barracks", "count": 1}]
    }, {
        "resources": {"gold": 0, "wood": 10, "stone": 0, "food": 10, "build": 0},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "tech": ["doubleBitAxe", "horseCollar"],
        "type": "research",
        "resources": {"stone": 0, "build": 0, "food": 10, "gold": 0, "wood": 10}
    }, {
        "resources": {"food": 18, "wood": 10, "build": 0, "stone": 0, "gold": 0},
        "count": 8,
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "stable"}],
        "task": "farm"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}],
        "resources": {"food": 18, "gold": 5, "build": 0, "wood": 10, "stone": 0},
        "task": "gold",
        "count": 5,
        "type": "newVillagers"
    }, {
        "type": "research",
        "tech": ["wheelbarrow"],
        "resources": {"stone": 0, "wood": 10, "food": 18, "gold": 5, "build": 0}
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"gold": 5, "stone": 0, "wood": 10, "food": 18, "build": 0}
    }, {
        "type": "research",
        "tech": ["bloodlines", "scaleBardingArmor"],
        "resources": {"build": 0, "food": 18, "gold": 5, "wood": 10, "stone": 0}
    }, {
        "resources": {"stone": 0, "food": 18, "build": 0, "wood": 10, "gold": 5},
        "type": "research",
        "tech": ["goldMining"]
    }, {
        "type": "moveVillagers",
        "resources": {"stone": 0, "wood": 10, "gold": 7, "build": 0, "food": 16},
        "to": "gold",
        "count": 2,
        "from": "farm"
    }, {
        "resources": {"build": 0, "stone": 0, "wood": 10, "food": 16, "gold": 7},
        "buildings": [{"count": 1, "type": "stable"}],
        "type": "build"
    }, {
        "resources": {"wood": 10, "stone": 0, "gold": 7, "food": 16, "build": 0},
        "age": "castleAge",
        "type": "newAge"
    }],
    "reference": "https://youtu.be/rfifcVq-wME",
    "readyForPublish": true
}, {
    "difficulty": 1,
    "description": "A build that will get you to 50 Sicilian serjeants in under 19 minutes.",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FSerjeant.png?alt=media&token=4ec5c87d-cff6-4afe-87ad-39609896cb0f",
    "pop": {"castleAge": 2, "feudalAge": 29},
    "title": "50 Serjeants in 19 Minutes",
    "id": 61,
    "image": "Serjeant",
    "author": "Morley Games",
    "readyForPublish": true,
    "build": [{
        "count": 6,
        "task": "sheep",
        "buildings": [{"type": "house", "count": 2}],
        "type": "newVillagers",
        "resources": {"wood": 0, "stone": 0, "food": 6, "gold": 0, "build": 0}
    }, {
        "type": "newVillagers",
        "resources": {"wood": 4, "build": 0, "gold": 0, "food": 6, "stone": 0},
        "count": 4,
        "task": "wood"
    }, {
        "task": "boar",
        "count": 1,
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 4, "food": 7},
        "type": "newVillagers"
    }, {
        "buildings": [{"type": "house", "count": 2}, {"type": "mill", "count": 1}],
        "task": "berries",
        "resources": {"gold": 0, "wood": 4, "build": 0, "stone": 0, "food": 12},
        "type": "newVillagers",
        "count": 5
    }, {
        "type": "newVillagers",
        "resources": {"stone": 0, "build": 0, "gold": 0, "wood": 4, "food": 14},
        "count": 2,
        "task": "sheep"
    }, {
        "to": "farm",
        "type": "moveVillagers",
        "from": "sheep",
        "count": 2,
        "resources": {"gold": 0, "wood": 4, "stone": 0, "build": 0, "food": 14}
    }, {
        "count": 6,
        "task": "wood",
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 10, "food": 14},
        "type": "newVillagers"
    }, {
        "task": "gold",
        "type": "newVillagers",
        "count": 2,
        "resources": {"build": 0, "gold": 2, "wood": 10, "food": 14, "stone": 0}
    }, {
        "count": 2,
        "task": "stone",
        "type": "newVillagers",
        "resources": {"wood": 10, "gold": 2, "food": 14, "build": 0, "stone": 2}
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"wood": 10, "stone": 2, "food": 14, "gold": 2, "build": 0}
    }, {
        "count": 3,
        "from": "sheep",
        "to": "stone",
        "resources": {"wood": 10, "food": 11, "stone": 5, "build": 0, "gold": 2},
        "type": "moveVillagers"
    }, {
        "count": 4,
        "resources": {"build": 0, "gold": 2, "wood": 10, "stone": 5, "food": 11},
        "to": "farm",
        "from": "sheep",
        "type": "moveVillagers"
    }, {
        "type": "newAge",
        "age": "feudalAge",
        "resources": {"stone": 5, "food": 11, "gold": 2, "wood": 10, "build": 0}
    }, {
        "task": "stone",
        "count": 2,
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "type": "newVillagers",
        "resources": {"wood": 10, "stone": 7, "food": 11, "gold": 2, "build": 0}
    }, {
        "type": "ageUp",
        "age": "castleAge",
        "resources": {"build": 0, "stone": 7, "wood": 10, "gold": 2, "food": 11}
    }, {
        "to": "wood",
        "type": "moveVillagers",
        "from": "farm",
        "count": 2,
        "resources": {"food": 9, "gold": 2, "stone": 7, "wood": 12, "build": 0}
    }, {
        "resources": {"stone": 7, "gold": 2, "food": 9, "wood": 12, "build": 0},
        "type": "research",
        "tech": ["doubleBitAxe", "stoneMining"]
    }, {
        "type": "moveVillagers",
        "to": "gold",
        "from": "berries",
        "resources": {"stone": 7, "wood": 12, "build": 0, "food": 7, "gold": 4},
        "count": 2
    }, {
        "type": "moveVillagers",
        "from": "berries",
        "count": 3,
        "resources": {"gold": 4, "food": 4, "stone": 10, "wood": 12, "build": 0},
        "to": "stone"
    }, {
        "age": "castleAge",
        "resources": {"build": 0, "gold": 4, "stone": 10, "food": 4, "wood": 12},
        "type": "newAge"
    }, {
        "resources": {"build": 0, "gold": 4, "stone": 10, "wood": 12, "food": 4},
        "buildings": [{"count": 1, "type": "castle"}, {"type": "townCenter", "count": 4}],
        "type": "build"
    }, {
        "resources": {"stone": 10, "build": 0, "wood": 12, "food": 4, "gold": 4},
        "count": 200,
        "resource": "stone",
        "action": "sell",
        "type": "trade"
    }, {
        "resource": "wood",
        "count": 200,
        "type": "trade",
        "resources": {"gold": 4, "build": 0, "wood": 12, "stone": 10, "food": 4},
        "action": "sell"
    }, {
        "resources": {"wood": 12, "stone": 10, "build": 0, "gold": 4, "food": 4},
        "type": "research",
        "tech": ["firstCrusade"]
    }, {
        "buildings": [{"type": "barracks", "count": 1}],
        "type": "build",
        "resources": {"gold": 4, "food": 4, "stone": 10, "wood": 12, "build": 0}
    }, {
        "type": "research",
        "resources": {"wood": 12, "build": 0, "gold": 4, "stone": 10, "food": 4},
        "tech": ["arson", "scaleMailArmor", "forging"]
    }],
    "reference": "https://youtu.be/ccxNQyfSGBk",
    "attributes": ["fastCastle"],
    "uptime": {"feudalAge": "12:35", "castleAge": "16:05"},
    "civilization": "Sicilians"
}, {
    "civilization": "Sicilians",
    "readyForPublish": true,
    "attributes": ["fastFeudal"],
    "uptime": {"feudalAge": "09:15"},
    "image": "Donjon",
    "reference": "https://youtu.be/ASvaa5iOR1g",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FDonjon.png?alt=media&token=45d11f0d-8454-4275-99ec-7e7b19f30c88",
    "id": 59,
    "description": "This build order shows you how to Donjon rush into Serjeants with Sicilians at 20 population.",
    "difficulty": 2,
    "author": "Morley Games",
    "title": "Donjon Rush",
    "pop": {"feudalAge": 20},
    "build": [{
        "task": "sheep",
        "count": 6,
        "buildings": [{"count": 2, "type": "house"}],
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 0, "stone": 0, "food": 6, "build": 0}
    }, {
        "type": "newVillagers",
        "task": "wood",
        "count": 2,
        "resources": {"food": 6, "gold": 0, "wood": 2, "build": 0, "stone": 0}
    }, {
        "count": 2,
        "task": "boar",
        "resources": {"build": 0, "food": 8, "gold": 0, "stone": 0, "wood": 2},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "task": "berries",
        "count": 2,
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "mill"}],
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 10, "wood": 2}
    }, {
        "task": "boar",
        "type": "newVillagers",
        "count": 1,
        "resources": {"wood": 2, "stone": 0, "food": 11, "build": 0, "gold": 0}
    }, {
        "resources": {"build": 0, "stone": 0, "gold": 0, "wood": 2, "food": 15},
        "count": 4,
        "type": "newVillagers",
        "task": "sheep"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "resources": {"gold": 0, "food": 15, "wood": 4, "stone": 0, "build": 0},
        "count": 2
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"wood": 4, "stone": 0, "build": 0, "gold": 0, "food": 15}
    }, {
        "age": "feudalAge",
        "resources": {"stone": 0, "gold": 0, "build": 0, "wood": 4, "food": 15},
        "type": "ageUp"
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 4, "food": 10, "stone": 5},
        "from": "sheep",
        "type": "moveVillagers",
        "to": "stone",
        "count": 5
    }, {
        "type": "moveVillagers",
        "to": "wood",
        "from": "sheep",
        "count": 2,
        "resources": {"build": 0, "food": 8, "gold": 0, "stone": 5, "wood": 6}
    }, {
        "to": "forward",
        "type": "moveVillagers",
        "resources": {"food": 4, "stone": 5, "gold": 0, "build": 4, "wood": 6},
        "count": 4,
        "from": "sheep"
    }, {
        "type": "newAge",
        "resources": {"stone": 5, "wood": 6, "food": 4, "build": 4, "gold": 0},
        "age": "feudalAge"
    }, {
        "count": 2,
        "type": "moveVillagers",
        "to": "farm",
        "from": "sheep",
        "resources": {"wood": 6, "food": 4, "gold": 0, "stone": 5, "build": 4}
    }, {
        "type": "research",
        "tech": ["doubleBitAxe"],
        "resources": {"build": 4, "wood": 6, "food": 4, "stone": 5, "gold": 0}
    }, {
        "type": "build",
        "resources": {"gold": 0, "wood": 6, "stone": 5, "food": 4, "build": 4},
        "buildings": [{"count": 1, "type": "donjon"}]
    }, {
        "resources": {"gold": 0, "build": 4, "food": 8, "wood": 6, "stone": 5},
        "task": "berries",
        "count": 4,
        "type": "newVillagers"
    }, {
        "count": 3,
        "task": "gold",
        "resources": {"wood": 6, "food": 8, "gold": 3, "stone": 5, "build": 4},
        "type": "newVillagers"
    }, {
        "type": "newVillagers",
        "resources": {"stone": 5, "wood": 6, "food": 14, "build": 4, "gold": 3},
        "task": "farm",
        "count": 6
    }, {
        "count": "∞",
        "unit": "serjeant",
        "resources": {"stone": 5, "gold": 3, "food": 14, "build": 4, "wood": 6},
        "type": "trainUnit"
    }]
}, {
    "civilization": "Generic",
    "difficulty": 3,
    "reference": "https://youtu.be/icWFtV5bt24",
    "id": 53,
    "attributes": ["arena", "fastCastle"],
    "build": [{
        "type": "newVillagers",
        "count": 6,
        "resources": {"wood": 0, "food": 6, "gold": 0, "stone": 0, "build": 0},
        "buildings": [{"type": "house", "count": 2}],
        "task": "sheep"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "resources": {"food": 6, "stone": 0, "gold": 0, "wood": 4, "build": 0},
        "count": 4
    }, {
        "count": 1,
        "resources": {"build": 0, "gold": 0, "stone": 0, "food": 7, "wood": 4},
        "task": "boar",
        "type": "newVillagers"
    }, {
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "type": "newVillagers",
        "count": 3,
        "task": "berries",
        "resources": {"food": 10, "wood": 4, "build": 0, "gold": 0, "stone": 0}
    }, {
        "task": "sheep",
        "count": 1,
        "resources": {"build": 0, "food": 11, "wood": 4, "stone": 0, "gold": 0},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 4, "stone": 0, "gold": 0, "food": 14, "build": 0},
        "task": "berries",
        "count": 3,
        "type": "newVillagers"
    }, {
        "animal": "boar",
        "type": "lure",
        "count": 1,
        "resources": {"food": 14, "gold": 0, "wood": 4, "stone": 0, "build": 0}
    }, {
        "buildings": [{"type": "house", "count": 1}],
        "resources": {"wood": 4, "stone": 0, "food": 14, "build": 1, "gold": 0},
        "count": 1,
        "type": "newVillagers",
        "task": "build"
    }, {
        "count": 1,
        "task": "wood",
        "type": "newVillagers",
        "resources": {"wood": 5, "stone": 0, "gold": 0, "food": 14, "build": 1}
    }, {
        "from": "build",
        "resources": {"wood": 6, "build": 0, "stone": 0, "food": 14, "gold": 0},
        "count": 1,
        "type": "moveVillagers",
        "to": "wood"
    }, {
        "count": 1,
        "resources": {"stone": 0, "gold": 0, "food": 15, "wood": 6, "build": 0},
        "task": "sheep",
        "type": "newVillagers"
    }, {
        "count": 3,
        "task": "gold",
        "type": "newVillagers",
        "resources": {"gold": 3, "food": 15, "build": 0, "wood": 6, "stone": 0}
    }, {
        "type": "research",
        "tech": ["loom"],
        "resources": {"stone": 0, "gold": 3, "wood": 6, "build": 0, "food": 15}
    }, {
        "age": "feudalAge",
        "type": "ageUp",
        "resources": {"stone": 0, "gold": 3, "build": 0, "wood": 6, "food": 15}
    }, {
        "age": "feudalAge",
        "resources": {"gold": 3, "build": 0, "wood": 6, "food": 15, "stone": 0},
        "type": "newAge"
    }, {
        "resources": {"gold": 5, "stone": 0, "build": 0, "wood": 6, "food": 15},
        "count": 2,
        "task": "gold",
        "type": "newVillagers",
        "buildings": [{"count": 1, "type": "blacksmith"}, {"count": 1, "type": "archeryRange"}]
    }, {
        "type": "ageUp",
        "resources": {"build": 0, "stone": 0, "wood": 6, "food": 15, "gold": 5},
        "age": "castleAge"
    }, {
        "unit": "archer",
        "type": "trainUnit",
        "resources": {"food": 15, "stone": 0, "gold": 5, "wood": 6, "build": 0},
        "count": "∞"
    }, {
        "type": "research",
        "resources": {"gold": 5, "stone": 0, "food": 15, "build": 0, "wood": 6},
        "tech": ["fletching"]
    }, {
        "count": 3,
        "from": "sheep",
        "to": "wood",
        "resources": {"build": 0, "food": 12, "wood": 9, "stone": 0, "gold": 5},
        "type": "moveVillagers"
    }, {
        "resources": {"gold": 7, "food": 10, "stone": 0, "build": 0, "wood": 9},
        "from": "sheep",
        "type": "moveVillagers",
        "count": 2,
        "to": "gold"
    }, {
        "to": "forward",
        "from": "sheep",
        "count": 2,
        "type": "moveVillagers",
        "resources": {"food": 8, "stone": 0, "gold": 7, "build": 2, "wood": 9}
    }, {
        "resources": {"gold": 7, "food": 8, "build": 2, "wood": 9, "stone": 0},
        "type": "newAge",
        "age": "castleAge"
    }, {
        "resources": {"gold": 7, "stone": 0, "build": 2, "food": 8, "wood": 9},
        "type": "build",
        "buildings": [{"count": 1, "type": "siegeWorkshop"}]
    }, {
        "resources": {"build": 2, "stone": 0, "gold": 7, "food": 8, "wood": 9},
        "tech": ["crossbowman"],
        "type": "research"
    }],
    "author": "Gyeseongyeon",
    "pop": {"castleAge": 2, "feudalAge": 25},
    "title": "Siege Tower + Crossbows",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FSiege%20Tower.png?alt=media&token=91ee5d5f-a9de-40b5-b4ae-14b7f788b3ae",
    "uptime": {"castleAge": "14:50", "feudalAge": "11:20"},
    "description": "An Arena build that is all about getting crossbowmen into the opponent's economy as soon as possible.",
    "readyForPublish": true,
    "image": "Siege Tower"
}, {
    "reference": "https://buildorderguide.com",
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FRattan%20Archer.png?alt=media&token=157a3933-4585-4f20-a877-2069b2f1c56a",
    "description": "Taking advantage of three bonuses, the Vietnamese get to make this quick rush possible. 1. Economic upgrades cost no wood, meaning not as many lumberjacks are needed when hitting Feudal. 2. The enemy position is revealed from the start, which allows pushing two deer with the scout before you send your scout to the enemy's base. 3. Archers have +20% HP, which makes them tankier. Note that the 2nd lumber camp needs to wait until 2 ranges and the blacksmith are up. With this build, you get a constant archer production as with the default archer build - except 1:15 minutes earlier - and a similar Castle time.",
    "build": [{
        "buildings": [{
            "type": "house", "count": 2
        }],
        "resources": {"wood": 0, "stone": 0, "food": 6, "gold": 0, "build": 0},
        "type": "newVillagers",
        "task": "sheep",
        "count": 6
    }, {
        "count": 3,
        "task": "wood",
        "type": "newVillagers",
        "resources": {"stone": 0, "food": 6, "wood": 3, "build": 0, "gold": 0}
    }, {
        "task": "boar",
        "count": 1,
        "type": "newVillagers",
        "resources": {"build": 0, "wood": 3, "food": 7, "stone": 0, "gold": 0}
    }, {
        "task": "berries",
        "buildings": [{"count": 2, "type": "house"}, {"type": "mill", "count": 1}],
        "resources": {"wood": 3, "stone": 0, "build": 0, "gold": 0, "food": 11},
        "count": 4,
        "type": "newVillagers"
    }, {
        "type": "lure",
        "count": 1,
        "resources": {"stone": 0, "food": 11, "build": 0, "wood": 3, "gold": 0},
        "animal": "boar"
    }, {
        "task": "sheep",
        "count": 3,
        "resources": {"build": 0, "food": 14, "wood": 3, "stone": 0, "gold": 0},
        "type": "newVillagers"
    }, {
        "resources": {"wood": 3, "gold": 0, "build": 0, "food": 14, "stone": 0},
        "type": "lure",
        "animal": "deer",
        "count": 2
    }, {
        "count": 2,
        "type": "newVillagers",
        "resources": {"gold": 0, "wood": 5, "food": 14, "build": 0, "stone": 0},
        "task": "wood"
    }, {
        "resources": {"build": 0, "food": 14, "gold": 0, "wood": 5, "stone": 0},
        "type": "research",
        "tech": ["loom"]
    }, {
        "resources": {"food": 14, "build": 0, "wood": 5, "stone": 0, "gold": 0},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "count": 3,
        "from": "sheep",
        "to": "wood",
        "type": "moveVillagers",
        "resources": {"food": 11, "stone": 0, "gold": 0, "build": 0, "wood": 8}
    }, {
        "resources": {"stone": 0, "food": 8, "gold": 3, "build": 0, "wood": 8},
        "type": "moveVillagers",
        "from": "sheep",
        "to": "gold",
        "count": 3
    }, {
        "resources": {"stone": 0, "build": 0, "gold": 3, "food": 8, "wood": 8},
        "buildings": [{"count": 1, "type": "barracks"}],
        "type": "build"
    }, {
        "resources": {"gold": 3, "wood": 8, "build": 0, "food": 8, "stone": 0},
        "type": "newAge",
        "age": "feudalAge"
    }, {
        "buildings": [{"type": "archeryRange", "count": 2}],
        "resources": {"build": 0, "gold": 8, "stone": 0, "food": 8, "wood": 8},
        "type": "newVillagers",
        "count": 5,
        "task": "gold"
    }, {
        "type": "research",
        "resources": {"food": 8, "build": 0, "wood": 8, "gold": 8, "stone": 0},
        "tech": ["doubleBitAxe", "horseCollar"]
    }, {
        "resources": {"food": 8, "wood": 8, "stone": 0, "build": 0, "gold": 8},
        "buildings": [{"type": "blacksmith", "count": 1}],
        "type": "build"
    }, {
        "task": "wood",
        "type": "newVillagers",
        "count": 4,
        "resources": {"wood": 12, "gold": 8, "food": 8, "build": 0, "stone": 0}
    }, {
        "tech": ["fletching"],
        "resources": {"gold": 8, "build": 0, "stone": 0, "wood": 12, "food": 8},
        "type": "research"
    }, {
        "resources": {"gold": 8, "stone": 0, "build": 0, "food": 18, "wood": 12},
        "type": "newVillagers",
        "task": "farm",
        "count": 10
    }, {
        "resources": {"build": 0, "gold": 8, "stone": 0, "wood": 12, "food": 18},
        "type": "research",
        "tech": ["wheelbarrow"]
    }, {"age": "castleAge", "type": "ageUp", "resources": {"food": 18, "build": 0, "gold": 8, "wood": 12, "stone": 0}}],
    "civilization": "Vietnamese",
    "readyForPublish": true,
    "author": "Build Order Guide",
    "pop": {"castleAge": 19, "feudalAge": 20},
    "title": "Fast Archers",
    "id": 32,
    "image": "Rattan Archer",
    "uptime": {"castleAge": "19:50", "feudalAge": "09:15"},
    "difficulty": 3,
    "attributes": ["fastFeudal"]
}, {
    "image": "Longboat",
    "description": "A Fast Castle Longboats build order for the Vikings. Kick-starting the game straight into longboats with a great economy to back it.",
    "readyForPublish": true,
    "imageURL": "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FLongboat.png?alt=media&token=f7d89bb1-1cf4-45b7-b982-b8107cc51819",
    "title": "Fast Longboats",
    "difficulty": 2,
    "id": 55,
    "reference": "https://youtu.be/OgXdPYWuniE",
    "author": "Druzhina AoE",
    "pop": {"feudalAge": 27, "castleAge": 2},
    "attributes": ["fastCastle", "water"],
    "uptime": {"feudalAge": "11:45", "castleAge": "15:15"},
    "civilization": "Vikings",
    "build": [{
        "type": "newVillagers",
        "count": 6,
        "resources": {"food": 6, "wood": 0, "stone": 0, "gold": 0, "build": 0},
        "task": "sheep",
        "buildings": [{"count": 2, "type": "house"}]
    }, {
        "type": "newVillagers",
        "resources": {"build": 0, "gold": 0, "stone": 0, "wood": 4, "food": 6},
        "count": 4,
        "task": "wood"
    }, {
        "resources": {"gold": 0, "build": 0, "wood": 4, "stone": 0, "food": 6},
        "type": "lure",
        "count": 1,
        "animal": "boar"
    }, {
        "resources": {"food": 6, "stone": 0, "build": 1, "wood": 4, "gold": 0},
        "task": "build",
        "buildings": [{"count": 1, "type": "house"}, {"count": 1, "type": "dock"}],
        "count": 1,
        "type": "newVillagers"
    }, {
        "to": "shoreFish",
        "type": "moveVillagers",
        "resources": {"build": 0, "gold": 0, "food": 7, "stone": 0, "wood": 4},
        "from": "build",
        "count": 1
    }, {
        "type": "trainUnit",
        "resources": {"gold": 0, "wood": 4, "food": 7, "build": 0, "stone": 0},
        "unit": "fishingShip",
        "count": "∞"
    }, {
        "resources": {"wood": 4, "build": 0, "food": 7, "stone": 0, "gold": 0},
        "animal": "boar",
        "count": 1,
        "type": "lure"
    }, {
        "task": "sheep",
        "resources": {"gold": 0, "build": 0, "food": 9, "wood": 4, "stone": 0},
        "count": 2,
        "type": "newVillagers"
    }, {
        "count": 4,
        "type": "newVillagers",
        "task": "wood",
        "resources": {"food": 9, "build": 0, "gold": 0, "wood": 8, "stone": 0}
    }, {
        "resources": {"stone": 0, "build": 0, "wood": 14, "food": 9, "gold": 0},
        "buildings": [{"type": "lumberCamp", "count": 1}],
        "task": "wood",
        "type": "newVillagers",
        "count": 6
    }, {
        "type": "newVillagers",
        "task": "build",
        "count": 1,
        "buildings": [{"count": 1, "type": "dock"}],
        "resources": {"wood": 14, "build": 1, "stone": 0, "food": 9, "gold": 0}
    }, {
        "resources": {"wood": 14, "stone": 0, "gold": 2, "food": 9, "build": 1},
        "count": 2,
        "type": "newVillagers",
        "task": "gold"
    }, {
        "resources": {"food": 9, "stone": 0, "gold": 2, "wood": 14, "build": 1},
        "type": "ageUp",
        "age": "feudalAge"
    }, {
        "resources": {"food": 9, "stone": 0, "build": 1, "wood": 14, "gold": 2},
        "buildings": [{"type": "mill", "count": 1}],
        "type": "build"
    }, {
        "resources": {"gold": 2, "wood": 14, "stone": 0, "build": 1, "food": 9},
        "from": "sheep",
        "to": "berries",
        "type": "moveVillagers",
        "count": 8
    }, {
        "type": "newAge",
        "resources": {"stone": 0, "build": 1, "food": 9, "gold": 2, "wood": 14},
        "age": "feudalAge"
    }, {
        "buildings": [{"type": "blacksmith", "count": 1}, {"count": 1, "type": "market"}],
        "count": 2,
        "resources": {"gold": 4, "wood": 14, "build": 1, "food": 9, "stone": 0},
        "type": "newVillagers",
        "task": "gold"
    }, {
        "to": "gold",
        "from": "berries",
        "type": "moveVillagers",
        "resources": {"build": 1, "stone": 0, "wood": 14, "food": 5, "gold": 8},
        "count": 4
    }, {
        "resources": {"food": 5, "gold": 8, "build": 1, "wood": 14, "stone": 0},
        "age": "castleAge",
        "type": "ageUp"
    }, {
        "resources": {"food": 5, "stone": 0, "build": 1, "wood": 14, "gold": 8},
        "tech": ["doubleBitAxe"],
        "type": "research"
    }, {
        "resources": {"build": 1, "gold": 8, "stone": 0, "food": 5, "wood": 14},
        "tech": ["fletching"],
        "type": "research"
    }, {
        "type": "build",
        "buildings": [{"count": 1, "type": "dock"}],
        "resources": {"stone": 0, "wood": 14, "build": 1, "food": 5, "gold": 8}
    }, {
        "age": "castleAge",
        "type": "newAge",
        "resources": {"build": 1, "stone": 0, "food": 5, "gold": 8, "wood": 14}
    }, {
        "count": "∞",
        "type": "trainUnit",
        "resources": {"gold": 8, "stone": 0, "wood": 14, "build": 1, "food": 5},
        "unit": "longboat"
    }, {
        "tech": ["bodkinArrow"],
        "type": "research",
        "resources": {"build": 1, "stone": 0, "wood": 14, "food": 5, "gold": 8}
    }, {
        "type": "research",
        "resources": {"build": 1, "stone": 0, "gold": 8, "food": 5, "wood": 14},
        "tech": ["bowSaw"]
    }, {
        "resources": {"build": 1, "gold": 8, "stone": 0, "food": 5, "wood": 14},
        "type": "build",
        "buildings": [{"type": "university", "count": 1}]
    }, {
        "tech": ["ballistics"],
        "type": "research",
        "resources": {"gold": 8, "build": 1, "stone": 0, "food": 5, "wood": 14}
    }, {
        "tech": ["goldMining"],
        "type": "research",
        "resources": {"wood": 14, "gold": 8, "stone": 0, "build": 1, "food": 5}
    }, {
        "tech": ["careening"],
        "type": "research",
        "resources": {"wood": 14, "food": 5, "stone": 0, "gold": 8, "build": 1}
    }]
}];
