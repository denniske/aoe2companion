
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

export function getPlayerBackgroundColor(playerPosition: number) {
    return playerColors[playerPosition - 1];
}


const leaderboardColors = [
    '#757476',
    '#D65154',
    '#E19659',
    '#6188C1',
    '#8970AE',
];

const darkLeaderboardColors = [
    '#8e8e8e',
    '#D65154',
    '#E19659',
    '#6188C1',
    '#8970AE',
];

export function getLeaderboardColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardColors : leaderboardColors;
    return colors[leaderboard_id];
}

// Darker / More saturated colors for text

const leaderboardTextColors = [
    '#525152',
    '#c52026',
    '#ff943d',
    '#5084d3',
    '#8560be',
];

const darkLeaderboardTextColors = [
    '#8e8e8e',
    '#c52026',
    '#ff943d',
    '#5084d3',
    '#8560be',
];

export function getLeaderboardTextColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardTextColors : leaderboardTextColors;
    return colors[leaderboard_id];
}
