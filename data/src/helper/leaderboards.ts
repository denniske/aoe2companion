import {getString, getUiTranslation} from '../lib/aoe-data';
import {abbreviationsData} from "@nex/dataset";


export enum LeaderboardId {
    Unranked = 0,
    DM1v1 = 1,
    DMTeam = 2,
    RM1v1 = 3,
    RMTeam = 4,
    EW1v1 = 13,
    EWTeam = 14,
}

const abbreviations = abbreviationsData;

export function formatLeaderboardId(leaderboard_id: LeaderboardId) {
    // console.log('getUiTranslation', `enum.leaderboardid.${abbreviations[leaderboard_id]}`, leaderboard_id);
    return getUiTranslation(`enum.leaderboardid.${abbreviations[leaderboard_id]}`);
}

export function getLeaderboardOrGameType(leaderboard_id: LeaderboardId, game_type: any) {
    // console.log('getLeaderboardOrGameType', leaderboard_id, game_type);
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
