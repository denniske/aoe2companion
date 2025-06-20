import { getTranslationInternal } from '@app/helper/translate';

const difficultyIcons: Record<string | number, any> = {
    1: require('../../../app/assets/difficulties/beginner.png'),
    2: require('../../../app/assets/difficulties/intermediate.png'),
    3: require('../../../app/assets/difficulties/advanced.png'),
};

export const getDifficultyIcon = (difficulty: string | number) =>
    difficultyIcons[difficulty];

const difficultyNames: Record<string | number, any> = {
    1: getTranslationInternal('builds.difficulties.beginner'),
    2: getTranslationInternal('builds.difficulties.intermediate'),
    3: getTranslationInternal('builds.difficulties.advanced'),
};

export const getDifficultyName = (difficulty: string | number) =>
    difficultyNames[difficulty];
