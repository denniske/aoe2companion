import { fetchProfiles } from '@app/api/helper/api';
import { useLobbies } from '@app/api/socket/lobbies';
import { useOngoing } from '@app/api/socket/ongoing';
import { useQueueing } from '@app/api/socket/queueing';
import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { LiveMatch } from '@app/components/live/live-match';
import { QueueingPlayer } from '@app/components/live/queueing-player';
import { MatchCard } from '@app/components/match/match-card';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { getMatchFromOngoingMatch } from '@app/helper/match';
import { useLanguage } from '@app/queries/all';
import { faPlus } from '@fortawesome/sharp-regular-svg-icons';
import { Stack } from 'expo-router';
import { uniq } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

/**
 * Every verified player's live state in one page: queueing, in a lobby, in a match. Not linked
 * from anywhere -- reach it at /matches/live/verified. It exists to watch the three subscriptions
 * against real traffic, which the mine and following dashboards cannot do without being the
 * player or following them, so its labels are deliberately untranslated English.
 */
export default function LiveVerifiedPage() {
    const { players: queueingPlayers, isLoading: isLoadingQueueing, connected: connectedQueueing } = useQueueing({ verified: true });

    const {
        lobbies: lobbiesWithMatchIds,
        isLoading: isLoadingLobbiesWithMatchIds,
        connected: connectedLobbiesWithMatchIds,
    } = useLobbies({ verified: true });

    // The server only sends the lobby itself to an unfiltered subscription: a verified or
    // profile-filtered one gets the slot events, which is how the following dashboard discovers
    // the match ids and then asks for those lobbies in full.
    const matchIds = useMemo(() => lobbiesWithMatchIds.map((l) => l.matchId), [lobbiesWithMatchIds]);

    const { lobbies, isLoading: isLoadingLobbies } = useLobbies({ matchIds, enabled: matchIds.length > 0 });

    const { matches, isLoading: isLoadingOngoing, connected: connectedOngoing } = useOngoing({ verified: true });

    const nameOf = useQueueingPlayerNames(queueingPlayers);

    const matchList = matches.map((m) => getMatchFromOngoingMatch(m));

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen options={{ title: 'Verified Players Dashboard' }} />

            <Text variant="header-lg">Queueing ({queueingPlayers.length})</Text>

            {queueingPlayers.map((player) => (
                <QueueingPlayer key={player.advertisementId} player={player} nameOf={nameOf} />
            ))}

            {queueingPlayers.length === 0 && (
                <Card direction="vertical">
                    {/* A socket that never connects leaves isLoading true forever, which on a
                        debugging page should say so rather than show nothing at all. */}
                    <Text className="text-center">
                        {connectedQueueing
                            ? isLoadingQueueing
                                ? 'Loading...'
                                : 'No verified player is queueing right now.'
                            : 'Not connected. The queueing handler needs a deployed socket service.'}
                    </Text>
                </Card>
            )}

            <Text variant="header-lg">Lobbies ({lobbies.length})</Text>

            {lobbies.map((lobby) => (
                <View className="gap-2" key={lobby.matchId}>
                    <View className="flex-row items-center flex-wrap" style={{ columnGap: 8 }}>
                        {lobby.players
                            .filter((p) => p.verified)
                            .map((player, index) => (
                                <Fragment key={player.profileId.toString()}>
                                    {index !== 0 && <Icon icon={faPlus} size={10} />}
                                    <Text variant="label">{player?.name}</Text>
                                </Fragment>
                            ))}
                    </View>
                    <LiveMatch data={lobby} expanded={false} clickable />
                </View>
            ))}

            {lobbies.length === 0 && (
                <Card direction="vertical">
                    <Text className="text-center">
                        {!connectedLobbiesWithMatchIds
                            ? 'Not connected.'
                            : isLoadingLobbiesWithMatchIds || isLoadingLobbies
                              ? 'Loading...'
                              : 'No verified player is in a lobby right now.'}
                    </Text>
                </Card>
            )}

            <Text variant="header-lg">Matches ({matchList.length})</Text>

            {matchList.map((match) => (
                <View className="gap-2" key={match.matchId}>
                    <View className="flex-row items-center flex-wrap" style={{ columnGap: 8 }}>
                        {match.teams
                            .flatMap((t) => t.players)
                            .filter((p) => p.verified)
                            .map((player, index) => (
                                <Fragment key={player.profileId.toString()}>
                                    {index !== 0 && <Icon icon={faPlus} size={10} />}
                                    <Text variant="label">{player?.name}</Text>
                                </Fragment>
                            ))}
                    </View>
                    <MatchCard match={match} clickable />
                </View>
            ))}

            {matchList.length === 0 && (
                <Card direction="vertical">
                    <Text className="text-center">
                        {!connectedOngoing ? 'Not connected.' : isLoadingOngoing ? 'Loading...' : 'No verified player is in a match right now.'}
                    </Text>
                </Card>
            )}
        </ScrollView>
    );
}

/**
 * Queueing events carry profile ids and nothing else. The other two dashboards know the names of
 * the players they subscribed with; here there is no such list, so the names are looked up once
 * per id and kept -- a player who stops queueing and comes back is not fetched again.
 */
function useQueueingPlayerNames(players: { profileId: number; partyProfileIds: number[] }[]) {
    const language = useLanguage();
    const [names, setNames] = useState<Record<number, string>>({});

    const wantedIds = useMemo(
        () => uniq(players.flatMap((player) => [player.profileId, ...player.partyProfileIds])),
        [players]
    );

    useEffect(() => {
        const missingIds = wantedIds.filter((profileId) => !(profileId in names));
        if (missingIds.length === 0 || !language) return;

        let cancelled = false;

        fetchProfiles({ language, profileIds: missingIds }).then((response) => {
            if (cancelled) return;
            setNames((previous) => ({
                ...previous,
                // Every id that was asked for is recorded, so an id the API has no profile for
                // is not requested again on every event batch.
                ...Object.fromEntries(missingIds.map((profileId) => [profileId, profileId.toString()])),
                ...Object.fromEntries(response.profiles.map((profile) => [profile.profileId, profile.name])),
            }));
        });

        return () => {
            cancelled = true;
        };
    }, [wantedIds, names, language]);

    return (profileId: number) => names[profileId];
}
