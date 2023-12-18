import { LiveActivity } from '../../../modules/widget';
import { useEffect, useMemo } from 'react';
import { IMatchNew } from '../api/helper/api.types';
import isEqual from 'lodash/isEqual';
import { Image, Platform } from 'react-native';
import { getMapImage } from '../helper/maps';
import { genericCivIcon, getCivIconLocal } from '../helper/civs';
import { usePrevious } from '@nex/data/hooks';
import { Widget } from '../../../modules/widget/index';
import Constants from 'expo-constants';
import { camelCase } from 'lodash';

const GROUP_NAME = `group.${Constants.expoConfig?.ios?.bundleIdentifier}.widget`;
const widget = new Widget(GROUP_NAME);

export interface LiveGameActivity {
    matchId: number;
    map: string;
    mapImage: string;
    leaderboard: string;
    currentPlayerId: number;
    startTime: number;
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
    image: string;
    rating: number;
    color: number;
}

export const liveActivity = new LiveActivity<LiveGameActivity>();

const getCurrentActivity = (): { data: LiveGameActivity; id: string } | undefined => liveActivity.list()[0];

interface LiveGameActivityHook {
    match: IMatchNew;
    currentPlayerId: number;
    isEnabled: boolean;
}

export const useLiveGameActivity = ({ match, currentPlayerId, isEnabled }: LiveGameActivityHook) => {
    if (Platform.OS === 'web') {
        return null;
    }
    const previouslyEnabled = usePrevious(isEnabled);
    const game: LiveGameActivity | undefined = useMemo(
        () =>
            match && isEnabled
                ? {
                      matchId: match.matchId,
                      map: match.mapName,
                      mapImage: widget.setImage(getMapImage(match).uri, `${camelCase(match.mapName)}.png`),
                      leaderboard: match.leaderboardName ?? '',
                      currentPlayerId,
                      startTime: match.started.getTime() / 1000,
                      teams: match.teams.map((team) => ({
                          teamId: team.teamId ?? 0,
                          players: team.players.map((player) => ({
                              id: player.profileId,
                              name: player.name,
                              civilization: player.civName,
                              image: widget.setImage(
                                  Image.resolveAssetSource(getCivIconLocal(player.civName) ?? genericCivIcon).uri,
                                  `${camelCase(player.civName)}.png`
                              ),
                              rating: player.rating ?? 0,
                              color: player.color,
                          })),
                      })),
                  }
                : undefined,
        [match, isEnabled]
    );

    const end = () => {
        const activityId = getCurrentActivity()?.id;

        if (activityId) {
            liveActivity.end(activityId);
        }
    };

    useEffect(() => {
        if (isEnabled && game) {
            const activity = getCurrentActivity();

            if (activity) {
                if (!isEqual(activity.data, game)) {
                    liveActivity.update(activity.id, game);
                }
            } else {
                liveActivity.start(game);
            }
        }
    }, [game, isEnabled]);

    useEffect(() => {
        if (previouslyEnabled && !isEnabled) {
            end();
        }
    }, [isEnabled]);
};
