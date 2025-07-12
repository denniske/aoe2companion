import { useOngoing } from '@app/api/socket/ongoing';
import { Text } from '@app/components/text';
import { isMatchFreeForAll } from '@nex/data';
import { Stack } from 'expo-router';
import React, { Fragment, useMemo } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { LiveGame } from '@app/view/live/live-game';
import MatchOptions from '@app/view/components/match-map/match-options';
import { min, sortBy } from 'lodash';
import { MatchPlayer } from '@app/components/match/player';
import { getMatchFromOngoingMatch } from '@app/helper/match';
import { ScrollView } from '@app/components/scroll-view';
import { MatchCard } from '@app/components/match/card';
import { useLobbies } from '@app/api/socket/lobbies';
import { useAuthProfileId } from '@app/queries/all';
import { Image } from 'expo-image';
import { Icon } from '@app/components/icon';
import { appConfig } from '@nex/dataset';

export default function CurrentLobbyOrMatchPage() {
    const getTranslation = useTranslation();
    // const authProfileId = 21170885;
    const authProfileId = useAuthProfileId();
    // const profileIds: number[] = authProfileId ? [authProfileId] : [];

    const profileIds = useMemo(
        () => authProfileId ? [authProfileId] : [],
        [authProfileId]
    );

    const { matches, isLoading: isLoadingOngoing } = useOngoing({ profileIds });

    const { lobbies: lobbiesWithMatchIds, isLoading: isLoadingLobbiesWithMatchIds } = useLobbies({ profileIds });

    const matchIds = useMemo(
        () => lobbiesWithMatchIds.map(l => l.matchId),
        [lobbiesWithMatchIds]
    );

    const { lobbies, isLoading: isLoadingLobbies } = useLobbies({ matchIds });

    console.log('Current matches', matches);
    console.log('Current lobbiesWithMatchIds', lobbiesWithMatchIds);
    console.log('Current lobbies', lobbies);

    const match = matches.length > 0 ? getMatchFromOngoingMatch(matches[0]) : null;
    const freeForAll = match ? isMatchFreeForAll(match) : false;

    console.log('Current match', match);

    return (
        <ScrollView contentContainerStyle="p-4 gap-4">
            <Stack.Screen options={{ title: getTranslation('matches.current.title') }} />

            {lobbies && lobbies.length > 0 && !isLoadingLobbies && <LiveGame data={lobbies[0] as any} expanded={true} />}


            {match &&
                <MatchCard match={match} />
            }

            {match && !isLoadingOngoing && (
                <>
                    <ScrollView horizontal contentContainerStyle="items-center gap-4 pb-3">
                        <View className="flex-row items-center gap-1">
                            <Icon icon="clock" size={14} color="subtle" />
                            <Text color="subtle">-</Text>
                        </View>
                        {appConfig.game === 'aoe2de' && (
                            <View className="flex-row items-center gap-1">
                                <Icon icon="running" size={14} color="subtle" />
                                <Text color="subtle">{match.speedName}</Text>
                            </View>
                        )}

                        <View className="flex-row items-center gap-1">
                            <Icon icon="memo-circle-info" size={14} color="subtle" />
                            <Text color="subtle" numberOfLines={1} selectable>
                                {match.matchId}
                            </Text>
                        </View>

                        {match.name !== 'AUTOMATCH' && (
                            <Text color="subtle" numberOfLines={1}>
                                {match.name}
                            </Text>
                        )}
                    </ScrollView>


                    {sortBy(match.teams, ({ teamId, players }, i) => min(players.map((p) => p.color))).map(({ teamId, players }, i) => (
                        <View key={teamId} className="gap-2">
                            {sortBy(players, (p) => p.color).map((player, j) => (
                                <MatchPlayer
                                    key={j}
                                    // highlight={highlightedUsers?.some((hu) => hu === player.profileId)}
                                    match={match}
                                    player={player}
                                    freeForAll={freeForAll}
                                    canDownloadRec={player.replay}
                                    // onClose={onClose}
                                />
                            ))}
                            {i < match.teams.length - 1 && (
                                <View className="flex-row items-center gap-4">
                                    <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                                    <Text variant="header-sm">{getTranslation('match.versus')}</Text>
                                    <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                                </View>
                            )}
                        </View>
                    ))}
                    <MatchOptions match={match} />
                </>
            )}
        </ScrollView>
    );
}
