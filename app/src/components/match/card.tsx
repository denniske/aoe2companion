import { getMapImage } from '@app/helper/maps';
import { formatAgo, isMatchFreeForAll, teamRatio } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { differenceInSeconds } from 'date-fns';
import { Image } from 'expo-image';
import { flatten, startCase } from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { MatchProps } from '.';
import { AoeSpeed, getSpeedFactor } from '../../helper/speed';
import { Card } from '../card';
import { Icon } from '../icon';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';

export interface MatchCardProps extends MatchProps {
    onPress?: () => void;
    flat?: boolean;
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

export function MatchCard(props: MatchCardProps) {
    const { match, user, highlightedUsers, expanded = false, showLiveActivity = false, onPress } = props;
    const players = flatten(match?.teams.map((t) => t.players));
    const freeForAll = isMatchFreeForAll(match);
    const attributes = [teamRatio(match)];

    if (match.leaderboardName?.includes('Unranked')) {
        attributes.push('Unranked');
    } else if (match.leaderboardName?.includes('Quick Play') || match.leaderboardName?.includes('Quick Match')) {
        attributes.push('Quick Play');
    } else {
        attributes.push('Ranked');
    }

    if (match.gameMode) {
        if (match.leaderboardName && !match.leaderboardName.includes(match.gameMode.toString())) {
            attributes.push(match.leaderboardName.replace('1v1', '').replace('Team', ''));
        } else {
            attributes.push(startCase(match.gameMode.toString()));
        }
    }

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    if (appConfig.game !== 'aoe2de') duration = '';

    return (
        <Card
            onPress={onPress}
            header={
                <View className="relative">
                    <Image
                        source={getMapImage(match)}
                        className={`w-14 h-14 ${appConfig.game === 'aoe2de' ? '' : 'border border-gold-500'}`}
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
                    {match.gameVariant === 1 && 'RoR - '}
                    {match.mapName}
                    {match.server && <Text> - {match.server}</Text>}
                </Text>
                <Text numberOfLines={1}>{attributes.join(' - ')}</Text>
                <Text numberOfLines={1}>
                    {match.finished === null && duration}
                    {match.finished || match.finished === undefined ? (match.started ? formatAgo(match.started) : 'none') : null}
                </Text>
            </View>
        </Card>
    );
}

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
