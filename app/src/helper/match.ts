import groupBy from 'lodash/groupBy';
import { IMatchesMatch, IMatchNew } from '@app/api/helper/api.types';

export function getMatchFromOngoingMatch(ongoingMatch: IMatchesMatch): IMatchNew {
    return {
        ...ongoingMatch,
        teams: Object.entries(groupBy(ongoingMatch.players, 'team')).map(([teamId, players]) => ({
            teamId: Number(teamId),
            players,
        })),
    };
}
