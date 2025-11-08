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

export function matchAttributes(match: IMatchNew) {
    return [
        teamRatio(match),
        match.leaderboardName?.includes('Unranked')
            ? 'Unranked'
            : match.leaderboardName?.includes('Quick Play') || match.leaderboardName?.includes('Quick Match')
              ? 'Quick Play'
              : 'Ranked',
    ];
}
