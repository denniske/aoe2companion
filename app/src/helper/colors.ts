import {playerColorsData} from "../../../dataset2/src/data/colors.data";

const playerColorsBright = [
    '#6EA6EB',
    '#FF6464',
    '#00FF00',
    '#FFFF00',
    '#00FFE1',
    '#DA62D2',
    '#989898',
    '#FFB415',
];

const playerColors = playerColorsData;

export function getPlayerBackgroundColorBright(playerPosition: number) {
    return playerColorsBright[playerPosition - 1];
}

export function getPlayerBackgroundColor(playerPosition: number) {
    return playerColors[playerPosition - 1];
}


const leaderboardColors: Record<number, string> = {
    0: '#757476',
    1: '#D65154',
    2: '#E19659',
    3: '#6188C1',
    4: '#8970AE',
    13: '#D65154',
    14: '#E19659',
    17: '#385c93',
    18: '#5f4e79',
    19: '#95383a',
    20: '#9d693e',
    1001: '#328f18',
    1002: '#328f18',
    1003: '#86d06d',
    1010: '#5084d3',
    1011: '#8560be',
    1012: '#c52026',
    1013: '#ff943d',
};

const darkLeaderboardColors: Record<number, string> = {
    0: '#8e8e8e',
    1: '#D65154',
    2: '#E19659',
    3: '#6188C1',
    4: '#8970AE',
    13: '#D65154',
    14: '#E19659',
    17: '#6188C1',
    18: '#8970AE',
    19: '#D65154',
    20: '#E19659',
    1001: '#328f18',
    1002: '#328f18',
    1003: '#86d06d',
};

export function getLeaderboardColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardColors : leaderboardColors;
    return colors[leaderboard_id];
}

// Darker / More saturated colors for text

const leaderboardTextColors: Record<number, string> = {
    0: '#525152',
    1: '#c52026',
    2: '#ff943d',
    3: '#5084d3',
    4: '#8560be',
    13: '#c52026',
    14: '#ff943d',
    17: '#385c93',
    18: '#5f4e79',
    19: '#95383a',
    20: '#9d693e',
    1001: '#328f18',
    1002: '#328f18',
    1003: '#86d06d',
    1010: '#5084d3',
    1011: '#8560be',
    1012: '#c52026',
    1013: '#ff943d',
};

const darkLeaderboardTextColors: Record<number, string> = {
    0: '#8e8e8e',
    1: '#c52026',
    2: '#ff943d',
    3: '#5084d3',
    4: '#8560be',
    13: '#c52026',
    14: '#ff943d',
    17: '#5084d3',
    18: '#8560be',
    19: '#c52026',
    20: '#ff943d',
    1001: '#328f18',
    1002: '#328f18',
    1003: '#86d06d',
};

export function getLeaderboardTextColor(leaderboard_id: number, darkMode: boolean) {
    console.log('getLeaderboardTextColor', leaderboard_id, darkMode);
    const colors = darkMode ? darkLeaderboardTextColors : leaderboardTextColors;
    return colors[leaderboard_id];
}
