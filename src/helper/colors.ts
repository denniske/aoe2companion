
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

export function getLeaderboardColor(leaderboard_id: number) {
    return leaderboardColors[leaderboard_id];
}
