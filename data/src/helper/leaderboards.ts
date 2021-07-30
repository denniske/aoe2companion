import {getString, getUiTranslation} from '../lib/aoe-data';


export enum LeaderboardId {
    Unranked = 0,
    DM1v1 = 1,
    DMTeam = 2,
    RM1v1 = 3,
    RMTeam = 4,
    EW1v1 = 13,
    EWTeam = 14,
}

const abbreviations = {
    0: 'unranked',
    1: 'dm1v1',
    2: 'dmteam',
    3: 'rm1v1',
    4: 'rmteam',
    13: 'ew1v1',
    14: 'ewteam',
};

export function formatLeaderboardId(leaderboard_id: LeaderboardId) {
    return getUiTranslation(`enum.leaderboardid.${abbreviations[leaderboard_id]}`);
}

export function getLeaderboardOrGameType(leaderboard_id: LeaderboardId, game_type: any) {
    if (leaderboard_id != null) {
        return getString('leaderboard', leaderboard_id);
    }

    const gameTypeStr = getString('game_type', game_type);

    // Random Map exists for both ranked / quick play
    if (game_type == 0) {
        return gameTypeStr + ' (Quick Play)';
    }

    return gameTypeStr;
}
