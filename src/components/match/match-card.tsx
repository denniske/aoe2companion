import { getMapImage } from '@app/helper/maps';
import { isMatchFreeForAll, teamRatio } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { flatten, startCase, uniq } from 'lodash';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card } from '../card';
import { Icon } from '../icon';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { MatchProps } from '@app/components/match/match';
import { ElapsedTimeOrDuration } from '@app/components/elapsed-time-or-duration';
import { router } from 'expo-router';

export interface MatchCardProps extends MatchProps {
    onPress?: () => void;
    flat?: boolean;
    linkMap?: boolean;
}

export function MatchCard(props: MatchCardProps) {
    const { flat, match, user, highlightedUsers, expanded = false, showLiveActivity = false, linkMap = false, onPress } = props;
    const players = flatten(match?.teams.map((t) => t.players));
    const freeForAll = isMatchFreeForAll(match);
    let attributes = [teamRatio(match)];

    const consoleAffix = match.leaderboardId?.includes('console') ? '🎮 ' : '';
    if (match.leaderboardName?.includes('Unranked')) {
        attributes.push(consoleAffix + 'Unranked');
    } else if (match.leaderboardName?.includes('Quick Play') || match.leaderboardName?.includes('Quick Match')) {
        attributes.push(consoleAffix + 'Quick Play');
    } else {
        attributes.push(consoleAffix + 'Ranked');
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
                    <TouchableOpacity disabled={!linkMap} onPress={() => router.push(`/explore/maps/${match.map}`)}>
                        <Image
                            source={getMapImage(match)}
                            className={`w-14 h-14 ${appConfig.game === 'aoe2' ? '' : 'border border-gold-500 rounded'}`}
                            contentFit="cover"
                        />
                    </TouchableOpacity>
                    <View className={`absolute ${appConfig.game === 'aoe2' ? 'top-0 left-0' : 'top-1 left-1'}`}>
                        {players.some((p) => p.profileId === user && p.won === true && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="crown" color={appConfig.game === 'aoe2' ? 'brand' : 'brand'} />
                        )}

                        {user == null && players.some((p) => p.won != null) && appConfig.game !== 'aoe2' && (
                            <Image className="w-3 h-3" source={require('../../../assets/other/SkullCrown.png')} />
                        )}

                        {players.some((p) => p.profileId === user && p.won === false && (freeForAll || p.team != -1)) && (
                            <Icon size={12} icon="skull" color={appConfig.game === 'aoe2' ? 'subtle' : 'subtle'} />
                        )}
                    </View>
                </View>
            }
        >
            <View className="flex-1">
                <TouchableOpacity disabled={!linkMap} onPress={() => router.push(`/explore/maps/${match.map}`)}>
                    <Text numberOfLines={1} variant="header-sm">
                        {match.gameVariant === 'ror' && 'RoR - '}
                        {match.mapName}
                        {match.server && <Text> - {match.server}</Text>}
                    </Text>
                </TouchableOpacity>

                <Text numberOfLines={1}>{attributes.join(' - ')}</Text>

                <ElapsedTimeOrDuration match={match} />
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
