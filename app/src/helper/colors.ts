import {appConfig} from "@nex/dataset";


export function getLeaderboardColor(leaderboard_id: string, darkMode: boolean) {
    return getLeaderboardTextColor(leaderboard_id, darkMode);
}

const leaderboardTextColorsAoe2: Record<string, string> = {
    'unranked': '#525152',
    'dm_1v1': '#c52026',
    'dm_team': '#ff943d',
    'rm_1v1': '#5084d3',
    'rm_team': '#8560be',
    'ew_1v1': '#c52026',
    'ew_team': '#ff943d',
};

const leaderboardTextColorsAoe4: Record<string, string> = {
    'unranked': '#525152',
    'rm_1v1': '#385c93',
    'rm_2v2': '#5f4e79',
    'rm_3v3': '#95383a',
    'rm_4v4': '#9d693e',
    'rm_solo': '#328f18',
    'rm_team': '#86d06d',
    'qm_1v1': '#5084d3',
    'qm_2v2': '#8560be',
    'qm_3v3': '#c52026',
    'qm_4v4': '#ff943d',
};

const darkLeaderboardTextColors: Record<string, string> = {
    'unranked': '#8e8e8e',
};

export function getLeaderboardTextColor(leaderboard_id: string, darkMode: boolean) {
    if (darkMode && darkLeaderboardTextColors[leaderboard_id]) {
        return darkLeaderboardTextColors[leaderboard_id];
    }
    const colors = appConfig.game === 'aoe2de' ? leaderboardTextColorsAoe2 : leaderboardTextColorsAoe4;
    return colors[leaderboard_id] || '#8e8e8e';
}
