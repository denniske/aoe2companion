import {getString, getUiTranslation} from '../lib/aoe-data';
import {abbreviationsData, appConfig} from "@nex/dataset";


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
    console.log('formatLeaderboardId', leaderboard_id);
    // console.log('getUiTranslation', `enum.leaderboardid.${abbreviations[leaderboard_id]}`, leaderboard_id);
    return getUiTranslation(`enum.leaderboardid.${abbreviations[leaderboard_id]}`);
}

export function getLeaderboardOrGameType(leaderboard_id: LeaderboardId, game_type: any) {
    // console.log('getLeaderboardOrGameType', leaderboard_id, game_type);
    if (leaderboard_id != null) {

        if (appConfig.game == 'aoe4') {
            const mapping = {
                0: 'Custom',
                17: 'QM 1v1',
                18: 'QM 2v2',
                19: 'QM 3v3',
                20: 'QM 4v4',
                1001: 'RM 1v1',
                1002: 'RM Solo',
                1003: 'RM Team',
            };
            return mapping[leaderboard_id];
        }

        return getString('leaderboard', leaderboard_id);
    }

    const gameTypeStr = getString('game_type', game_type);

    // Random Map exists for both ranked / quick play
    if (game_type == 0) {
        return gameTypeStr + ' (Quick Play)';
    }

    return gameTypeStr;
}
