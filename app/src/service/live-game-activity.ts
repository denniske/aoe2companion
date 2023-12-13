import { LiveActivity } from '../../../modules/widget';
import { useEffect, useMemo } from 'react';
import { IMatchNew } from '../api/helper/api.types';

export interface LiveGameActivity {
    map: string;
    leaderboard: string;
    currentPlayerId: number;
    teams: Team[];
}

interface Team {
    teamId: number;
    players: Player[];
}

interface Player {
    id: number;
    name: string;
    civilization: string;
    rating: number;
    color: number;
}

const liveActivity = new LiveActivity<LiveGameActivity>();

const getCurrentActivityId = (): string | undefined => liveActivity.list()[0]?.id;

export const useLiveGameActivity = (match: IMatchNew, isEnabled: boolean) => {
    const game: LiveGameActivity | undefined = useMemo(
        () =>
            match
                ? {
                      map: match.mapName,
                      leaderboard: match.leaderboardName ?? '',
                      currentPlayerId: 1,
                      teams: match.teams.map((team) => ({
                          teamId: team.teamId ?? 0,
                          players: team.players.map((player) => ({
                              id: player.profileId,
                              name: player.name,
                              civilization: player.civName,
                              rating: player.rating ?? 0,
                              color: player.color,
                          })),
                      })),
                  }
                : undefined,
        [match]
    );

    const end = () => {
        const activityId = getCurrentActivityId();

        if (activityId) {
            liveActivity.end(activityId);
        }
    };

    useEffect(() => {
        if (isEnabled && game) {
            console.log(isEnabled, JSON.stringify(game));

            const activityId = getCurrentActivityId();

            if (activityId) {
                liveActivity.update(activityId, game);
            } else {
                liveActivity.start(game);
            }
        } else {
            end();
        }
    }, [game, isEnabled]);
};
