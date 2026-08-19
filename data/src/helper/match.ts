import { flatten, groupBy } from 'lodash';
import { IMatchNew } from '@app/api/helper/api.types';

// This variant will put all players in same team when FFA.
// That looks better in the player list in the app version.
export function getMatchTeamsWithFreeForAll(match: IMatchNew) {
    const players = flatten(match.teams.map((t) => t.players));
    const freeForALl = isMatchFreeForAll(match);
    let teamIndex = 5;
    return Object.entries(
        groupBy(players, (p) => {
            if (freeForALl) return -1;
            if (p.team != -1) return p.team;
            return teamIndex++;
        })
    );
}

export function isMatchFreeForAll(match: IMatchNew) {
    const players = flatten(match.teams.map((t) => t.players));
    return players.filter((p) => p.team === -1).length >= players.length - 1;
}

export function teamRatio(match: IMatchNew) {
    if (isMatchFreeForAll(match)) {
        return 'FFA';
    }
    const teamCounts = match.teams.map((team) => team.players.length);

    return teamCounts.join('v');
}

// Derived from the leaderboard enum, not leaderboardName: the leaderboard.* strings are only
// filled in for English, so matching on the name silently falls through to 'Ranked' in every
// other language.
export function matchCategory(match: IMatchNew) {
    const leaderboardId = match.leaderboardId ?? '';
    if (leaderboardId.startsWith('unranked')) return 'Unranked';
    // aoe2 calls it Quick Play (qp_*), aoe4 calls it Quick Match (qm_*).
    if (leaderboardId.startsWith('qp_')) return 'Quick Play';
    if (leaderboardId.startsWith('qm_')) return 'Quick Match';
    return 'Ranked';
}

// What was actually played, without repeating the category. Matchmaking against AI has no
// leaderboard of its own, so it is named after the difficulty the match was played at.
export function matchModeLabel(match: IMatchNew) {
    const leaderboardId = match.leaderboardId ?? '';

    if (leaderboardId.startsWith('qp_vs_ai')) {
        return match.difficultyName ? `AI ${match.difficultyName}` : 'AI';
    }

    // An unmapped match type renders as '[leaderboard.<enum>]' -- fall back to the game mode.
    const leaderboardName = match.leaderboardName?.startsWith('[') ? undefined : match.leaderboardName;

    // 'Quick Play' is already the category and '1v1' is already the team ratio.
    // 'Quick Play Team Random Map' -> 'Team Random Map', '1v1 Random Map' -> 'Random Map'.
    return leaderboardName?.replace('Quick Play ', '').replace('1v1 ', '') || match.gameModeName?.toString();
}

export function matchAttributes(match: IMatchNew) {
    return [teamRatio(match), matchCategory(match)];
}
