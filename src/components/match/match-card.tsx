import { getMapImage } from '@app/helper/maps';
import { isMatchFreeForAll, teamRatio } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { flatten, startCase, uniq } from 'lodash';
import React, { Fragment } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Card } from '../card';
import { Icon } from '../icon';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { MatchProps } from '@app/components/match/match';
import { ElapsedTimeOrDuration } from '@app/components/elapsed-time-or-duration';
import { Link } from 'expo-router';
import { Image } from '@/src/components/uniwind/image';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import MatchTeams from './match-teams';
import { CustomFragment } from '../custom-fragment';

export interface MatchCardProps extends MatchProps {
    clickable?: boolean;
    flat?: boolean;
    linkMap?: boolean;
}

export function MatchCard(props: MatchCardProps) {
    const { flat, match, user, highlightedUsers, expanded = false, showLiveActivity = false, linkMap = false, clickable } = props;
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

    const { isMedium, isLarge } = useBreakpoints();
    const MapLinkComponent = linkMap ? Link : CustomFragment;

    return (
        <Card
            flat={flat}
            href={clickable ? `/matches/${match.matchId}` : undefined}
            header={
                <View className="relative">
                    <MapLinkComponent asChild href={`/explore/maps/${match.map}`}>
                        <TouchableOpacity disabled={!linkMap}>
                            <Image
                                source={getMapImage(match)}
                                className={`w-14 h-14 md:w-20 md:h-20 ${appConfig.game === 'aoe2' ? '' : 'border border-gold-500 rounded'}`}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                    </MapLinkComponent>
                    <View className={`absolute ${appConfig.game === 'aoe2' ? 'top-0 left-0' : 'top-1 left-1'}`}>
                        {players.some((p) => p.profileId === user && p.won === true && (freeForAll || p.team != -1)) && (
                            <Icon size={isMedium ? 20 : 12} icon="crown" color={appConfig.game === 'aoe2' ? 'brand' : 'brand'} />
                        )}

                        {user == null && players.some((p) => p.won != null) && appConfig.game !== 'aoe2' && (
                            <Image className="w-3 h-3 md:w-5 md:h-5" source={require('../../../assets/other/SkullCrown.png')} />
                        )}

                        {players.some((p) => p.profileId === user && p.won === false && (freeForAll || p.team != -1)) && (
                            <Icon size={isMedium ? 20 : 12} icon="skull" color={appConfig.game === 'aoe2' ? 'subtle' : 'subtle'} />
                        )}

                        {Platform.OS === 'web' && !match.finished && (
                            <Link className="pl-1" href={`aoe2de://1/${match.matchId}`} target="_blank">
                                <Icon size={isMedium ? 20 : 12} icon="eye" color="brand" />
                            </Link>
                        )}
                    </View>
                </View>
            }
        >
            <View className="flex-1 lg:flex-none lg:min-w-3xs lg:max-w-3xs">
                <MapLinkComponent asChild href={`/explore/maps/${match.map}`}>
                    <TouchableOpacity disabled={!linkMap}>
                        <Text numberOfLines={1} variant="header-sm">
                            {match.gameVariant === 'ror' && 'RoR - '}
                            {match.mapName}
                            {match.server && <Text> - {match.server}</Text>}
                        </Text>
                    </TouchableOpacity>
                </MapLinkComponent>

                <Text numberOfLines={1}>{attributes.join(' - ')}</Text>

                <ElapsedTimeOrDuration match={match} />
            </View>

            {isLarge && (
                <View className="flex-1 px-4">
                    <MatchTeams match={match} wrap={false} />
                </View>
            )}
        </Card>
    );
}

export const MarchCardSkeleton = () => {
    return (
        <Card
            flat
            header={
                <View className="relative">
                    <Skeleton className="w-14 h-14 md:w-20 md:h-20" />
                </View>
            }
        >
            <View className="flex-1 lg:flex-none lg:min-w-3xs lg:max-w-3xs">
                <SkeletonText variant="header-sm" />
                <SkeletonText />
                <SkeletonText />
            </View>

            <View className="hidden lg:flex flex-1 px-4" />
        </Card>
    );
};
