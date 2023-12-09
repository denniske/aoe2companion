const difficultyIcons: Record<string | number, any> = {
  1: require("../../../app/assets/difficulties/beginner.png"),
  2: require("../../../app/assets/difficulties/intermediate.png"),
  3: require("../../../app/assets/difficulties/advanced.png"),
};

export const getDifficultyIcon = (difficulty: string | number) =>
  difficultyIcons[difficulty];

const difficultyNames: Record<string | number, any> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

export const getDifficultyName = (difficulty: string | number) =>
  difficultyNames[difficulty];
