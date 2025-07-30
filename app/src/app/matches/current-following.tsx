import { useOngoing } from '@app/api/socket/ongoing';
import { Text } from '@app/components/text';
import { Stack, useRouter } from 'expo-router';
import React, { Fragment, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { LiveMatch } from '@app/components/live/live-match';
import { getMatchFromOngoingMatch } from '@app/helper/match';
import { ScrollView } from '@app/components/scroll-view';
import { MatchCard } from '@app/components/match/match-card';
import { useLobbies } from '@app/api/socket/lobbies';
import { useAccount } from '@app/queries/all';
import { Icon } from '@app/components/icon';
import { Card } from '@app/components/card';
import { Button } from '@app/components/button';

export default function CurrentLobbyOrMatchPage() {
    const getTranslation = useTranslation();

    const { data: account, error, isLoading: isLoadingAccount } = useAccount();

    const profileIds = useMemo(() => account?.followedPlayers?.map((f) => f.profileId) || [], [account?.followedPlayers]);

    const {
        matches,
        isLoading: isLoadingOngoing,
        connected: connectedOngoing,
        connect: connectOngoing,
    } = useOngoing({ profileIds, enabled: profileIds.length > 0 });

    const {
        lobbies: lobbiesWithMatchIds,
        isLoading: isLoadingLobbiesWithMatchIds,
        connected: connectedLobbiesWithMatchIds,
        connect: connectLobbiesWithMatchIds,
    } = useLobbies({ profileIds, enabled: profileIds.length > 0 });

    const matchIds = useMemo(() => lobbiesWithMatchIds.map((l) => l.matchId), [lobbiesWithMatchIds]);

    const {
        lobbies,
        isLoading: isLoadingLobbies,
        connected: connectedLobbies,
        connect: connectLobbies,
    } = useLobbies({ matchIds, enabled: matchIds.length > 0 });

    const isLoading = isLoadingOngoing || isLoadingLobbiesWithMatchIds || (matchIds.length > 0 && isLoadingLobbies);
    const connected = connectedOngoing && connectedLobbiesWithMatchIds && (matchIds.length === 0 || connectedLobbies);
    const connect = async () => {
        await connectOngoing();
        await connectLobbiesWithMatchIds();
        await connectLobbies();
    };

    // console.log('Current matches', matches);
    // console.log('Current lobbiesWithMatchIds', lobbiesWithMatchIds);
    // console.log('Current lobbies', lobbies);

    let lobbyList = lobbies;
    let matchList = matches.map((m) => getMatchFromOngoingMatch(m));

    // const freeForAll = match ? isMatchFreeForAll(match) : false;
    // console.log('Current match', match);

    const router = useRouter();

    const openMatch = (matchId: number) => {
        router.push(`/matches/single/${matchId}`);
    };

    const openLobby = (lobbyId: number) => {
        router.push(`/matches/lobby/${lobbyId}`);
    };

    // console.log('isLoading', isLoading);
    // console.log('connected', connected);

    return (
        <ScrollView contentContainerStyle="p-4 gap-4">
            <Stack.Screen options={{ title: getTranslation('matches.currentfollowing.title') }} />

            <Text variant="header-lg">{getTranslation('matches.currentfollowing.lobbies')}</Text>

            {lobbyList.map((lobby) => {
                const highlightedUsers = lobby.players.filter((p) => profileIds.includes(p.profileId));
                return (
                    <View className="gap-2">
                        <View className="flex-row items-center flex-wrap" style={{ columnGap: 8 }}>
                            {highlightedUsers.map((player, index) => (
                                <Fragment key={player.profileId.toString()}>
                                    {index !== 0 && <Icon prefix="fasr" icon="plus" size={10} />}
                                    <Text variant="label">{player?.name}</Text>
                                </Fragment>
                            ))}
                        </View>
                        <LiveMatch data={lobby} expanded={false} onPress={() => openLobby(lobby.matchId)} />
                    </View>
                );
            })}

            {isLoading && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.current.loading')}</Text>
                </Card>
            )}

            {!isLoading && !connected && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.current.connectionlost')}</Text>
                    <Button onPress={connect} className="justify-center">
                        {getTranslation('matches.current.reconnect')}
                    </Button>
                </Card>
            )}

            {lobbyList.length === 0 && !isLoading && connected && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.currentfollowing.lobbies.empty')}</Text>
                </Card>
            )}

            <Text variant="header-lg">{getTranslation('matches.currentfollowing.matches')}</Text>

            {matchList.map((match) => {
                const highlightedUsers = match.teams.flatMap((t) => t.players).filter((p) => profileIds.includes(p.profileId));
                return (
                    <View className="gap-2">
                        <View className="flex-row items-center flex-wrap" style={{ columnGap: 8 }}>
                            {highlightedUsers.map((player, index) => (
                                <Fragment key={player.profileId.toString()}>
                                    {index !== 0 && <Icon prefix="fasr" icon="plus" size={10} />}
                                    <Text variant="label">{player?.name}</Text>
                                </Fragment>
                            ))}
                        </View>
                        <MatchCard match={match} onPress={() => openMatch(match.matchId)} />
                    </View>
                );
            })}

            {isLoading && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.current.loading')}</Text>
                </Card>
            )}

            {!isLoading && !connected && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.current.connectionlost')}</Text>
                    <Button onPress={connect} className="justify-center">
                        {getTranslation('matches.current.reconnect')}
                    </Button>
                </Card>
            )}

            {matchList.length === 0 && !isLoading && connected && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.currentfollowing.matches.empty')}</Text>
                </Card>
            )}

            {/*{match && (*/}
            {/*    <>*/}
            {/*        <Card direction="vertical">*/}
            {/*            <ScrollView horizontal contentContainerStyle="items-center gap-4">*/}
            {/*                <View className="flex-row items-center gap-1">*/}
            {/*                    <Icon icon="clock" size={14} color="subtle" />*/}
            {/*                    <Text color="subtle">-</Text>*/}
            {/*                </View>*/}
            {/*                {appConfig.game === 'aoe2de' && (*/}
            {/*                    <View className="flex-row items-center gap-1">*/}
            {/*                        <Icon icon="running" size={14} color="subtle" />*/}
            {/*                        <Text color="subtle">{match.speedName}</Text>*/}
            {/*                    </View>*/}
            {/*                )}*/}

            {/*                <View className="flex-row items-center gap-1">*/}
            {/*                    <Icon icon="memo-circle-info" size={14} color="subtle" />*/}
            {/*                    <Text color="subtle" numberOfLines={1} selectable>*/}
            {/*                        {match.matchId}*/}
            {/*                    </Text>*/}
            {/*                </View>*/}

            {/*                {match.name !== 'AUTOMATCH' && (*/}
            {/*                    <Text color="subtle" numberOfLines={1}>*/}
            {/*                        {match.name}*/}
            {/*                    </Text>*/}
            {/*                )}*/}
            {/*            </ScrollView>*/}
            {/*        </Card>*/}

            {/*        <Card direction="vertical">*/}
            {/*            {sortBy(match.teams, ({ teamId, players }, i) => min(players.map((p) => p.color))).map(({ teamId, players }, i) => (*/}
            {/*                <View key={teamId} className="gap-2">*/}
            {/*                    {sortBy(players, (p) => p.color).map((player, j) => (*/}
            {/*                        <MatchPlayer*/}
            {/*                            key={j}*/}
            {/*                            // highlight={highlightedUsers?.some((hu) => hu === player.profileId)}*/}
            {/*                            match={match}*/}
            {/*                            player={player}*/}
            {/*                            freeForAll={freeForAll}*/}
            {/*                            canDownloadRec={player.replay}*/}
            {/*                            // onClose={onClose}*/}
            {/*                        />*/}
            {/*                    ))}*/}
            {/*                    {i < match.teams.length - 1 && (*/}
            {/*                        <View className="flex-row items-center gap-4">*/}
            {/*                            <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />*/}
            {/*                            <Text variant="header-sm">{getTranslation('match.versus')}</Text>*/}
            {/*                            <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />*/}
            {/*                        </View>*/}
            {/*                    )}*/}
            {/*                </View>*/}
            {/*            ))}*/}
            {/*        </Card>*/}

            {/*        <Card direction="vertical">*/}
            {/*            <MatchOptions match={match} />*/}
            {/*        </Card>*/}
            {/*    </>*/}
            {/*)}*/}
        </ScrollView>
    );
}
