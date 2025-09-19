import { ILeaderboardDef } from '@app/api/helper/api.types';

export const leaderboardsByType = (leaderboards: ILeaderboardDef[], leaderboardType: 'pc' | 'xbox') =>
    leaderboards.filter(
        (leaderboard) =>
            (leaderboardType === 'xbox' && leaderboard.abbreviation.includes('🎮')) ||
            (leaderboardType !== 'xbox' && !leaderboard.abbreviation.includes('🎮'))
    );

export const leaderboardIdsByType = (leaderboards: ILeaderboardDef[], leaderboardType: 'pc' | 'xbox') =>
    leaderboardsByType(leaderboards, leaderboardType).map((leaderboard) => leaderboard.leaderboardId);
