import {IMatch, IMatchNew} from '../api/api.types';
import {flatten, groupBy} from 'lodash';

export function getMatchTeams(match: IMatch) {
    let teamIndex = 5;
    return Object.entries(groupBy(match.players, p => {
        if (p.team != -1) return p.team;
        return teamIndex++;
    }));
}

// This variant will put all players in same team when FFA.
// That looks better in the player list in the app version.
export function getMatchTeamsWithFreeForAll(match: IMatchNew) {
    const players = flatten(match.teams.map(t => t.players));
    const freeForALl = isMatchFreeForAll(match);
    let teamIndex = 5;
    return Object.entries(groupBy(players, p => {
        if (freeForALl) return -1;
        if (p.team != -1) return p.team;
        return teamIndex++;
    }));
}

export function isMatchFreeForAll(match: IMatchNew) {
    const players = flatten(match.teams.map(t => t.players));
    return players.filter(p => p.team === -1).length >= players.length-1;
}
