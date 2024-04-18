import { useOngoing } from '@app/api/ongoing';
import { FlatList } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Match } from '@app/components/match';
import { Text } from '@app/components/text';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { getVerifiedPlayer, getVerifiedPlayerIds } from '@nex/data';
import { Stack } from 'expo-router';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import React, { Fragment } from 'react';
import { View } from 'react-native';

export default function OngoingMatchesPage() {
    const proPlayerIds: number[] = compact(getVerifiedPlayerIds()).map((id) => Number(id));

    const { matches, connected } = useOngoing(proPlayerIds);

    return (
        <>
            <Stack.Screen options={{ title: 'Active Competitive Games' }} />

            <FlatList
                refreshControl={<RefreshControlThemed refreshing={!connected} />}
                refreshing={!connected}
                className="flex-1"
                contentContainerStyle="p-4 gap-2"
                ListEmptyComponent={connected ? <Text>No active games.</Text> : null}
                data={matches}
                renderItem={({ item: match }) => {
                    const highlightedUsers = proPlayerIds.filter((playerId) => match.players.some((player) => player.profileId === playerId));
                    return (
                        <View className="gap-2">
                            <View className="flex-row gap-2 items-center flex-wrap">
                                {highlightedUsers.map((playerId, index) => (
                                    <Fragment key={playerId.toString()}>
                                        {index !== 0 && <Icon prefix="fasr" icon="plus" size={10} />}
                                        <Text variant="label">{getVerifiedPlayer(playerId)?.name}</Text>
                                    </Fragment>
                                ))}
                            </View>
                            <Match
                                user={highlightedUsers[0]}
                                highlightedUsers={highlightedUsers}
                                match={{
                                    ...match,
                                    teams: Object.entries(groupBy(match.players, 'team')).map(([teamId, players]) => ({
                                        teamId: Number(teamId),
                                        players,
                                    })),
                                }}
                            />
                        </View>
                    );
                }}
                keyExtractor={(match) => match.matchId.toString()}
            />
        </>
    );
}
