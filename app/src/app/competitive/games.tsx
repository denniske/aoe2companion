import { useOngoing } from '@app/api/socket/ongoing';
import { FlatList } from '@app/components/flat-list';
import { Icon } from '@app/components/icon';
import { Match } from '@app/components/match/match';
import { Text } from '@app/components/text';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { getVerifiedPlayer, getVerifiedPlayerIds } from '@nex/data';
import { Stack } from 'expo-router';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import React, { Fragment } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

export default function OngoingMatchesPage() {
    const getTranslation = useTranslation();
    const { matches, isLoading } = useOngoing({ verified: true });

    return (
        <>
            <Stack.Screen
                options={{ title: getTranslation('competitive.activeGames.title') }}
            />

            <FlatList
                refreshControl={<RefreshControlThemed refreshing={isLoading} />}
                refreshing={isLoading}
                className="flex-1"
                contentContainerStyle="p-4 gap-2"
                ListEmptyComponent={
                    isLoading ? null : (
                        <Text>{getTranslation('competitive.activeGames.empty')}</Text>
                    )
                }
                data={matches}
                renderItem={({ item: match }) => {
                    const highlightedUsers = match.players.filter(p => p.verified);
                    const highlightedUserIds = match.players.filter(p => p.verified).map(p => p.profileId);
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
                            <Match
                                user={highlightedUserIds[0]}
                                highlightedUsers={highlightedUserIds}
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
