import { IGetTranslation } from '@app/helper/translate';

const difficultyIcons: Record<string | number, any> = {
    1: require('../../../app/assets/difficulties/beginner.png'),
    2: require('../../../app/assets/difficulties/intermediate.png'),
    3: require('../../../app/assets/difficulties/advanced.png'),
};

export const getDifficultyIcon = (difficulty: string | number) =>
    difficultyIcons[difficulty];

const difficultyNames: Record<string | number, any> = {
    1: 'builds.difficulties.beginner',
    2: 'builds.difficulties.intermediate',
    3: 'builds.difficulties.advanced',
};

export const getDifficultyName = (getTranslation: IGetTranslation, difficulty: string | number) =>
    getTranslation(difficultyNames[difficulty]);
