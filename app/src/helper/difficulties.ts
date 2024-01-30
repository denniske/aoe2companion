import { getTranslation } from './translate';

const difficultyIcons: Record<string | number, any> = {
    1: { uri: 'https://www.aoe2companion.com/aoe2/de/civilizations/chinese.png' },
    2: { uri: 'https://www.aoe2companion.com/aoe2/de/civilizations/chinese.png' },
    3: { uri: 'https://www.aoe2companion.com/aoe2/de/civilizations/chinese.png' },
};

export const getDifficultyIcon = (difficulty: string | number) =>
    difficultyIcons[difficulty];

const difficultyNames: Record<string | number, any> = {
    1: getTranslation('builds.difficulties.beginner'),
    2: getTranslation('builds.difficulties.intermediate'),
    3: getTranslation('builds.difficulties.advanced'),
};

export const getDifficultyName = (difficulty: string | number) =>
    difficultyNames[difficulty];
