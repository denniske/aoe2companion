import { ILobbiesMatch, IMatchNew } from '@app/api/helper/api.types';

export const reformatTeamMatch = (match: IMatchNew): ILobbiesMatch => ({
    ...match,
    players: match.teams.flatMap((t) =>
        t.players.map((p) => ({ ...p, matchId: match.matchId }))
    ),
    totalSlotCount: match.totalSlotCount ?? 0,
    blockedSlotCount: match.blockedSlotCount ?? 0,
    averageRating: match.averageRating ?? 0,
    mod: match.mod ?? false,
});
