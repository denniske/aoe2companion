import {getString} from './strings';

export enum LeaderboardId {
    Unranked = 0,
    DM1v1 = 1,
    DMTeam = 2,
    RM1v1 = 3,
    RMTeam = 4,
}

export const leaderboardList: LeaderboardId[] = [3, 4, 1, 2, 0];

const abbreviations = ['Unranked', 'DM 1v1', 'DM Team', 'RM 1v1', 'RM Team'];

export function formatLeaderboardId(leaderboard_id: LeaderboardId) {
    return abbreviations[leaderboard_id];
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
