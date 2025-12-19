import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { useTranslation } from '@app/helper/translate';
import { LiveMatch } from '@app/components/live/live-match';
import { useLobbies } from '@app/api/socket/lobbies';
import { LoadingScreen } from '@app/components/loading-screen';
import NotFound from '@app/app/+not-found';

type MatchPageParams = {
    lobbyId: string;
};

export default function LobbyPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = isNaN(parseInt(params.lobbyId)) ? 0 : parseInt(params.lobbyId);

    const matchIds = useMemo(() => [matchId], [matchId]);

    const { lobbies, isLoading: isLoadingLobbies } = useLobbies({ matchIds });

    const lobby = lobbies.length > 0 ? lobbies[0] : null;

    if (!lobby) {
        return isLoadingLobbies ? <LoadingScreen /> : <NotFound />;
    }

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen options={{title: lobby.mapName}} />
            <LiveMatch data={lobby} expanded={true} />
        </ScrollView>
    );
}
