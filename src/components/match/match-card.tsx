import { PressableOpacity } from '@app/components/pressable-opacity';
import { getMapImage } from '@app/helper/maps';
import { isMatchFreeForAll, matchCategory, matchModeLabel, teamRatio } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { flatten, uniq } from 'lodash';
import React, { Fragment } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Card } from '../card';
import { Icon } from '../icon';
import { faBan, faCrown, faEye, faSkull } from '@fortawesome/sharp-solid-svg-icons';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { MatchProps } from '@app/components/match/match';
import { ElapsedTimeOrDuration } from '@app/components/elapsed-time-or-duration';
import { Link } from 'expo-router';
import { Image } from '@/src/components/uniwind/image';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import MatchTeams from './match-teams';
import { CustomFragment } from '../custom-fragment';
import { getProfileIdFromHighlightedUsers } from '@app/utils/match';
import { PressableLink } from '@app/components/pressable-link';

export interface MatchCardProps extends MatchProps {
    clickable?: boolean;
    flat?: boolean;
    linkMap?: boolean;
}

export function MatchCard(props: MatchCardProps) {
    const { flat, match, highlightedUsers, linkMap = false, clickable } = props;
    const players = flatten(match?.teams.map((t) => t.players));
    const freeForAll = isMatchFreeForAll(match);
    let attributes = [teamRatio(match)];

    const user = props.user ?? getProfileIdFromHighlightedUsers(match, highlightedUsers);

    const consoleAffix = match.leaderboardId?.includes('console') ? '🎮 ' : '';
    attributes.push(consoleAffix + matchCategory(match));

    const modeLabel = matchModeLabel(match);
    if (modeLabel) {
        attributes.push(modeLabel);
    }

    attributes = uniq(attributes);

    const { isMedium, isLarge } = useBreakpoints();
    const MapLinkComponent = linkMap ? Link : CustomFragment;

    return (
        <PressableLink href={clickable ? (user ? `/players/${user}/matches/${match.matchId}` : `/matches/${match.matchId}`) : undefined}>
            <Card
                className={clickable ? 'hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors' : ''}
                flat={flat}
                header={
                    <View className="relative">
                        <MapLinkComponent asChild href={`/explore/maps/${match.map}`}>
                            <PressableOpacity disabled={!linkMap}>
                                <Image
                                    source={getMapImage(match)}
                                    className={`w-14 h-14 md:w-20 md:h-20 ${appConfig.game === 'aoe2' ? '' : 'border border-gold-500 rounded'}`}
                                    contentFit="cover"
                                />
                            </PressableOpacity>
                        </MapLinkComponent>
                        <View className={`absolute ${appConfig.game === 'aoe2' ? 'top-0 left-0' : 'top-1 left-1'}`}>
                            {players.some((p) => p.profileId === user && p.won === true && (freeForAll || p.team != -1)) && (
                                <Icon size={isMedium ? 20 : 12} icon={faCrown} color={appConfig.game === 'aoe2' ? 'brand' : 'brand'} />
                            )}

                            {user == null && players.some((p) => p.won != null) && appConfig.game !== 'aoe2' && (
                                <Image className="w-3 h-3 md:w-5 md:h-5" source={require('../../../assets/other/SkullCrown.png')} />
                            )}

                            {players.some((p) => p.profileId === user && p.won === false && (freeForAll || p.team != -1)) && (
                                <Icon size={isMedium ? 20 : 12} icon={faSkull} color={appConfig.game === 'aoe2' ? 'subtle' : 'subtle'} />
                            )}

                            {!!(match.abandoned) && (
                                <Icon size={isMedium ? 20 : 12} icon={faBan} color={appConfig.game === 'aoe2' ? 'subtle' : 'subtle'} />
                            )}

                            {Platform.OS === 'web' && !match.finished && !match.abandoned && appConfig.game === 'aoe2' && (
                                <Link href={`aoe2de://1/${match.matchId}`} target="_blank">
                                    <Icon size={isMedium ? 20 : 12} icon={faEye} color="brand" />
                                    {/*<Icon size={isMedium ? 20 : 12} icon={faSkull} color="brand" />*/}
                                </Link>
                            )}
                        </View>
                    </View>
                }
            >
                <View className="flex-1 lg:flex-none lg:min-w-3xs lg:max-w-3xs">
                    <MapLinkComponent asChild href={`/explore/maps/${match.map}`}>
                        <PressableOpacity disabled={!linkMap}>
                            <Text numberOfLines={1} variant="header-sm">
                                {match.gameVariant === 'ror' && 'RoR - '}
                                {match.mapName}
                                {!!(match.server) && <Text> - {match.server}</Text>}
                            </Text>
                        </PressableOpacity>
                    </MapLinkComponent>

                    <Text numberOfLines={1}>{attributes.join(' - ')}</Text>

                    <ElapsedTimeOrDuration match={match} />
                </View>

                {!!(isLarge) && (
                    <View className="flex-1 px-4">
                        <MatchTeams
                            match={match}
                            wrap={false}
                            canDownloadRecs={!clickable && !!match.finished}
                            highlightedUsers={user ? [user] : highlightedUsers}
                        />
                    </View>
                )}
            </Card>
        </PressableLink>
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
