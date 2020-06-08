import { fetchRatingHistory } from '../api/rating-history';
import { fetchLeaderboard } from '../api/leaderboard';

export const loadProfile = async (game: string, profile_id: number) => {
    console.log("loading profile", game, profile_id);

    let leaderboards = await Promise.all([
        fetchLeaderboard(game, '0', {count: 1, profile_id}),
        fetchLeaderboard(game, '1', {count: 1, profile_id}),
        fetchLeaderboard(game, '2', {count: 1, profile_id}),
        fetchLeaderboard(game, '3', {count: 1, profile_id}),
        fetchLeaderboard(game, '4', {count: 1, profile_id}),
    ]);

    const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
    leaderboardInfos.sort((a, b) => b.last_match.getTime() - a.last_match.getTime());
    const mostRecentLeaderboard = leaderboardInfos[0];

    return {
        clan: mostRecentLeaderboard.clan,
        country: mostRecentLeaderboard.country,
        icon: mostRecentLeaderboard.icon,
        name: mostRecentLeaderboard.name,
        profile_id: mostRecentLeaderboard.profile_id,
        steam_id: mostRecentLeaderboard.steam_id,
        games: leaderboardInfos.map(l => l.games).reduce((pv, cv) => pv + cv, 0),
        drops: leaderboardInfos.map(l => l.drops).reduce((pv, cv) => pv + cv, 0),
        leaderboards: leaderboards.filter(l => l.leaderboard?.length > 0),
    };
};
