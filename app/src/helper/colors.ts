
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

const playerColors = [
    '#405BFF',
    '#FF0000',
    '#00FF00',
    '#FFFF00',
    '#00FFFF',
    '#FF57B3',
    '#797979',
    '#FF9600',
];

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
};

const darkLeaderboardColors: Record<number, string> = {
    0: '#8e8e8e',
    1: '#D65154',
    2: '#E19659',
    3: '#6188C1',
    4: '#8970AE',
    13: '#D65154',
    14: '#E19659',
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
};

const darkLeaderboardTextColors: Record<number, string> = {
    0: '#8e8e8e',
    1: '#c52026',
    2: '#ff943d',
    3: '#5084d3',
    4: '#8560be',
    13: '#c52026',
    14: '#ff943d',
};

export function getLeaderboardTextColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardTextColors : leaderboardTextColors;
    return colors[leaderboard_id];
}
