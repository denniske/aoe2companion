import { View } from 'react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { formatAgo, isMatchFreeForAll, teamRatio } from '@nex/data';
import { getMapImage } from '@app/helper/maps';
import { flatten, startCase } from 'lodash';
import { differenceInSeconds } from 'date-fns';
import { AoeSpeed, getSpeedFactor } from '../../helper/speed';
import { appConfig } from '@nex/dataset';
import { IMatchNew } from '../../api/helper/api.types';
import { Card } from '../card';
import { Text } from '../text';
import { Icon } from '../icon';
import { MatchProps } from '.';

export interface MatchCardProps extends MatchProps {
    onPress?: () => void;
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
                    <View className="absolute top-0 left-0">
                        {players.some((p) => p.profileId === user && p.won === true && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="crown" color="brand" />
                        )}

                        {user == null && players.some((p) => p.won != null) && (
                            <Image className="w-3 h-3" source={require('../../../assets/other/SkullCrown.png')} />
                        )}

                        {players.some((p) => p.profileId === user && p.won === false && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="skull" color="text-gray-500" />
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
                <Text numberOfLines={1}>
                    {teamRatio(match)} - {match.leaderboardName?.includes('Unranked') ? 'Unranked' : 'Ranked'} -{' '}
                    {startCase(match.gameMode.toString())}
                </Text>
                <Text numberOfLines={1}>
                    {match.finished === null && duration}
                    {match.finished || match.finished === undefined ? (match.started ? formatAgo(match.started) : 'none') : null}
                </Text>
            </View>
        </Card>
    );
}
