import { fetchLeaderboard } from '../api/leaderboard';
import { sortBy, sumBy } from 'lodash-es'

export const loadProfile = async (game: string, profile_id: number) => {
    console.log("loading profile", game, profile_id);

    let leaderboards = await Promise.all([
        fetchLeaderboard(game, 0, {count: 1, profile_id}),
        fetchLeaderboard(game, 1, {count: 1, profile_id}),
        fetchLeaderboard(game, 2, {count: 1, profile_id}),
        fetchLeaderboard(game, 3, {count: 1, profile_id}),
        fetchLeaderboard(game, 4, {count: 1, profile_id}),
    ]);

    const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
    const sortedLeaderboardInfos = sortBy(leaderboardInfos, l => l.last_match);
    const mostRecentLeaderboard = sortedLeaderboardInfos[0];

    return {
        clan: mostRecentLeaderboard.clan,
        country: mostRecentLeaderboard.country,
        icon: mostRecentLeaderboard.icon,
        name: mostRecentLeaderboard.name,
        profile_id: mostRecentLeaderboard.profile_id,
        steam_id: mostRecentLeaderboard.steam_id,
        games: sumBy(leaderboardInfos, l => l.games),
        drops: sumBy(leaderboardInfos, l => l.drops),
        leaderboards: leaderboards.filter(l => l.leaderboard?.length > 0),
    };
};
