import { getMapImage } from '@app/helper/maps';
import { formatAgo, isMatchFreeForAll, teamRatio } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { differenceInMilliseconds, differenceInSeconds } from 'date-fns';
import { Image } from 'expo-image';
import { flatten, startCase, uniq } from 'lodash';
import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from '../card';
import { Icon } from '../icon';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { IMatchNew } from '@app/api/helper/api.types';
import { FormatAgoLive } from '@app/components/format-ago-live';
import { useSecondRerender } from '@app/hooks/use-second-rerender';
import { MatchProps } from '@app/components/match/match';

export interface MatchCardProps extends MatchProps {
    onPress?: () => void;
    flat?: boolean;
}

export function matchIsFinishedOrTimedOut(match: IMatchNew) {
    if (match.finished) {
        return true;
    }
    if (match.started) {
        const finished = match.finished || new Date();
        const duration = differenceInSeconds(finished, match.started) * match.speedFactor;
        return duration > 60 * 60 * 24; // 24 hours
    }
    return false;
}

export function matchTimedOut(match: IMatchNew) {
    if (match.finished) {
        return false;
    }
    if (match.started) {
        const finished = match.finished || new Date();
        const duration = differenceInSeconds(finished, match.started) * match.speedFactor;
        return duration > 60 * 60 * 24; // 24 hours
    }
    return false;
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

// const formatDuration = (durationInSeconds: number) => {
//     if (!durationInSeconds) return '00:00:00 h'; // divide-by-0 protection
//
//     const totalSeconds = Math.abs(durationInSeconds);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = Math.floor(totalSeconds % 60);
//
//     const pad = (n: number) => n.toString().padStart(2, '0');
//
//     return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} h`;
// };

export function MatchCard(props: MatchCardProps) {
    const { flat, match, user, highlightedUsers, expanded = false, showLiveActivity = false, onPress } = props;
    const players = flatten(match?.teams.map((t) => t.players));
    const freeForAll = isMatchFreeForAll(match);
    let attributes = [teamRatio(match)];

    if (match.leaderboardName?.includes('Unranked')) {
        attributes.push('Unranked');
    } else if (match.leaderboardName?.includes('Quick Play') || match.leaderboardName?.includes('Quick Match')) {
        attributes.push('Quick Play');
    } else {
        attributes.push('Ranked');
    }

    if (match.gameModeName) {
        if (match.leaderboardName && !match.leaderboardName.includes(match.gameModeName.toString())) {
            attributes.push(match.leaderboardName.replace('1v1', '').replace('Team', ''));
        } else {
            attributes.push(startCase(match.gameModeName.toString()));
        }
    }

    // console.log('match.gameModeName', match.gameModeName);
    // console.log('match.leaderboardName', match.leaderboardName);
    // console.log('match.1', match.leaderboardName?.replace('1v1', '').replace('Team', ''));
    // console.log('match.2', startCase(match.gameModeName.toString()));
    // console.log('attributes', attributes);

    attributes = uniq(attributes);

    return (
        <Card
            flat={flat}
            onPress={onPress}
            header={
                <View className="relative">
                    <Image
                        source={getMapImage(match)}
                        className={`w-14 h-14 ${appConfig.game === 'aoe2de' ? '' : 'border border-gold-500 rounded'}`}
                        contentFit="cover"
                    />
                    <View className={`absolute ${appConfig.game === 'aoe2de' ? 'top-0 left-0' : 'top-1 left-1'}`}>
                        {players.some((p) => p.profileId === user && p.won === true && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="crown" color={appConfig.game === 'aoe2de' ? 'brand' : 'text-gold-500'} />
                        )}

                        {user == null && players.some((p) => p.won != null) && appConfig.game !== 'aoe2de' && (
                            <Image className="w-3 h-3" source={require('../../../assets/other/SkullCrown.png')} />
                        )}

                        {players.some((p) => p.profileId === user && p.won === false && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="skull" color={appConfig.game === 'aoe2de' ? 'text-gray-500' : 'text-gray-300'} />
                        )}
                    </View>
                </View>
            }
        >
            <View className="flex-1">
                <Text numberOfLines={1} variant="header-sm">
                    {match.gameVariant === 'ror' && 'RoR - '}
                    {match.mapName}
                    {match.server && <Text> - {match.server}</Text>}
                </Text>
                <Text numberOfLines={1}>{attributes.join(' - ')}</Text>

                <ElapsedTimeOrDuration match={match} />
            </View>
        </Card>
    );
}

// interface SecondRerenderProps {
//     children: ReactNode;
// }
// const SecondRerender: React.FC<SecondRerenderProps> = ({ children }) => {
//     useSecondRerender();
//     return <>{children}</>;
// };

interface ElapsedTimeOrDurationProps {
    match: IMatchNew;
}
const ElapsedTimeOrDuration: React.FC<ElapsedTimeOrDurationProps> = ({ match }) => {
    useSecondRerender();

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        // It seems the game speed is not exactly 1.7 for normal speed in AoE2:DE, so we need to correct it
        const CORRECTION_FACTOR = appConfig.game === 'aoe2de' ? 1.05416666667 : 1;
        duration = formatDuration(differenceInMilliseconds(finished, match.started) / 1000 * match.speedFactor / CORRECTION_FACTOR);
        // console.log('getSpeedFactor(match.speed as AoeSpeed)', getSpeedFactor(match.speed as AoeSpeed))
    }
    if (appConfig.game !== 'aoe2de') duration = '';

    return (
        <Text numberOfLines={1}>
            {!matchIsFinishedOrTimedOut(match) && duration}
            {matchIsFinishedOrTimedOut(match) ? (match.started ? formatAgo(match.started) : 'none') : null}
        </Text>
    );
};

export const MarchCardSkeleton = () => {
    return (
        <Card
            header={
                <View className="relative">
                    <Skeleton className="w-14 h-[57px]" />
                </View>
            }
        >
            <View className="flex-1">
                <SkeletonText variant="header-sm" />
                <SkeletonText />
                <SkeletonText />
            </View>
        </Card>
    );
};
