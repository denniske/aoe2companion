import { useOngoing } from '@app/api/socket/ongoing';
import { Text } from '@app/components/text';
import { isMatchFreeForAll } from '@nex/data';
import { Stack } from 'expo-router';
import React, { Fragment, useMemo } from 'react';
import { useTranslation } from '@app/helper/translate';
import { LiveMatch } from '@app/components/live/live-match';
import MatchOptions from '@app/components/match/match-options';
import { getMatchFromOngoingMatch } from '@app/helper/match';
import { ScrollView } from '@app/components/scroll-view';
import { MatchCard } from '@app/components/match/match-card';
import { useLobbies } from '@app/api/socket/lobbies';
import { Card } from '@app/components/card';
import MatchInfo from '@app/components/match/match-info';
import MatchTeams from '@app/components/match/match-teams';
import MatchAnalysis from '@app/view/components/match-map/match-analysis';
import { Button } from '@app/components/button';
import { useAuthProfileId } from '@app/queries/all';

export default function CurrentLobbyOrMatchPage() {
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();

    const profileIds = useMemo(() => (authProfileId ? [authProfileId] : []), [authProfileId]);

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

    console.log('Current matches', matches);
    console.log('Current lobbiesWithMatchIds', lobbiesWithMatchIds);
    console.log('Current lobbies', lobbies);

    let lobby = lobbies.length > 0 ? lobbies[0] : null;
    let match = matches.length > 0 ? getMatchFromOngoingMatch(matches[0]) : null;

    // match = testMatch;
    // lobby = testLobby;

    const freeForAll = match ? isMatchFreeForAll(match) : false;

    console.log('Current match', match);

    return (
        <ScrollView contentContainerStyle="p-4 gap-4">
            <Stack.Screen options={{ title: getTranslation('matches.current.title') }} />

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

            {!lobby && !match && !isLoading && connected && (
                <Card direction="vertical">
                    <Text className="text-center">{getTranslation('matches.current.empty')}</Text>
                </Card>
            )}

            {lobby && <LiveMatch data={lobby} expanded={true} />}

            {match && (
                <>
                    <MatchCard match={match} />
                    <MatchInfo match={match} />
                    <MatchTeams match={match} />
                    <MatchAnalysis match={match} matchError={null} matchLoading={match == null} />
                    <MatchOptions match={match} />
                </>
            )}
        </ScrollView>
    );
}
