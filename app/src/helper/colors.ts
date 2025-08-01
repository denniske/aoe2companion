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

export const aoe2PlayerColors: Record<string, string> = {
    '#405BFF': '#4B4AC8',
    '#FF0000': '#C72321',
    '#00FF00': '#24C821',
    '#FFFF00': '#C8C817',
    '#00FFFF': '#22AFB0',
    '#FF57B3': '#C723C8',
    '#797979': '#797979',
    '#FF9600': '#C78031',
};

export const aoe2PlayerColorsLightModeChatLegend: Record<string, string> = {
    '#405BFF': '#405BFF',
    '#FF0000': '#FF0000',
    '#00FF00': '#00FF00',
    '#FFFF00': '#FFFF00',
    '#00FFFF': '#00FFFF',
    '#FF57B3': '#FF57B3',
    '#797979': '#333333', // Darker gray for better contrast on light mode chat+legend
    '#FF9600': '#FF9600',
};

// export const aoe2PlayerColorsByName: Record<string, string> = {
//     'Blue': '#4B4AC8',
//     'Red': '#C72321',
//     'Green': '#24C821',
//     'Yellow': '#C8C817',
//     'Teal': '#22AFB0',
//     'Purple': '#C723C8',
//     'Gray': '#797979',
//     'Orange': '#C78031',
// };
//
// export const aoe2PlayerColorsByNameOriginal: Record<string, string> = {
//     'Blue': '#405BFF',
//     'Red': '#FF0000',
//     'Green': '#00FF00',
//     'Yellow': '#FFFF00',
//     'Teal': '#00FFFF',
//     'Purple': '#FF57B3',
//     'Gray': '#797979',
//     'Orange': '#FF9600',
// };
