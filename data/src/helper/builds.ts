import { buildsData } from '../data/builds';

export function getBuildById(buildId?: string | number) {
    if (!buildId) {
        return;
    }
    return buildsData.find((build) => build.id == buildId);
}

export const sortBuildAges = (ages: [string, any][]) => {
    const sortedAges = ['feudalAge', 'castleAge', 'imperialAge'];
    return ages.sort((a, b) => sortedAges.indexOf(a[0]) - sortedAges.indexOf(b[0]));
};

export interface IBuildOrderBuilding {
    type: string;
    count: number;
}

export type IBuildOrderResources = {
    [key in TaskOutliers]?: null;
} & {
    wood: number;
    build: number;
    stone: number;
    gold: number;
    food: number;
};

export type TaskOutliers =
    | 'collect10GoldAfterBarracksIsBuilt'
    | 'collect10GoldWithNewVillager'
    | 'collect30GoldWithNewVillager'
    | 'collect40GoldWithTwoNewVillagers';

export interface IBuildOrderStep {
    buildings?: IBuildOrderBuilding[];
    type: string;
    subType?: string;
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
    action?: string;
    resource?: string;
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
    avg_rating?: number;
    status: string;
    publisher: string;
    image: string;
    pop: AgeData;
    difficulty: number | string;
    id: string | number;
    uptime: AgeData;
    reference?: string;
    number_of_ratings?: number;
    author: string;
    attributes: string[];
    civilization: string;
    title: string;
    game?: string;
}
