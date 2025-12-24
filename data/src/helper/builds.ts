import { getIcon } from '@app/helper/units';
import { camelCase, upperFirst } from 'lodash';

export const sortBuildAges = (ages: [string, any][]) => {
    const sortedAges = ['feudalAge', 'castleAge', 'imperialAge'];
    return ages.sort((a, b) => sortedAges.indexOf(a[0]) - sortedAges.indexOf(b[0]));
};

export const getBuildIcon = (image?: string) => {
    let iconName = upperFirst(camelCase(image ?? ''));

    if (iconName === 'Eagle') {
        iconName = 'EagleWarrior';
    }

    if (iconName === 'Scout') {
        iconName = 'ScoutCavalry';
    }

    if (iconName === 'Karambit') {
        iconName = 'KarambitWarrior';
    }

    if (iconName === 'NativeMonk') {
        iconName = 'MonkNative';
    }

    if (iconName === 'Tower') {
        iconName = 'WatchTower';
    }

    if (iconName === 'FemaleVillager') {
        iconName = 'Villager';
    }

    if (iconName === 'FastImperial') {
        iconName = 'ImperialAge';
    }

    if (iconName === 'FastFeudal') {
        iconName = 'FeudalAge';
    }

    if (iconName === 'FastCastle') {
        iconName = 'CastleAge';
    }

    return getIcon(iconName);
};

export interface IBuildOrderBuilding {
    type: string;
    count: number;
}

export interface IBuildOrderStandardResources {
    wood: number;
    build: number;
    stone: number;
    gold: number;
    food: number;
}

export type IBuildOrderResources = {
    [key in TaskOutliers]?: null;
} & IBuildOrderStandardResources;

export type TaskOutliers =
    | 'collect10GoldAfterBarracksIsBuilt'
    | 'collect10GoldWithNewVillager'
    | 'collect30GoldWithNewVillager'
    | 'collect40GoldWithTwoNewVillagers';

export interface IBuildOrderStep {
    buildings?: IBuildOrderBuilding[];
    type:
        | 'ageUp'
        | 'build'
        | 'collectGold'
        | 'custom'
        | 'decision'
        | 'lure'
        | 'moveVillagers'
        | 'newAge'
        | 'newVillagers'
        | 'research'
        | 'trade'
        | 'trainUnit';
    subType?: 'moveVillagers' | 'newVillagers';
    task?:
        | 'wood'
        | 'food'
        | 'gold'
        | 'stone'
        | 'boar'
        | 'sheep'
        | 'deer'
        | 'farm'
        | 'berries'
        | 'build'
        | 'forward'
        | 'shoreFish'
        | 'foodUnderTC'
        | 'stragglerTree'
        | TaskOutliers;
    resources: IBuildOrderResources;
    count?: any;
    tech?: string[];
    age?: keyof AgeData;
    loom?: boolean;
    to?: string;
    from?: string;
    unit?: string;
    text?: string;
    animal?: string;
    action?: 'sell' | 'buy';
    resource?: 'wood' | 'food' | 'stone';
}

export interface AgeData {
    feudalAge?: number | string;
    castleAge?: number | string;
    imperialAge?: number | string;
}

export interface IBuildOrder {
    build: IBuildOrderStep[];
    description: string;
    imageURL: string;
    avgRating?: number;
    status: string;
    publisher: string;
    image: string;
    pop: AgeData;
    difficulty: number | string;
    id: string;
    uptime: AgeData;
    reference?: string;
    numberOfRatings?: number;
    author: string;
    attributes: string[];
    civilization: string;
    title: string;
    game?: string;
}
