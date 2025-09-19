import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { LiveMatch } from '@app/components/live/live-match';
import { useLobbies } from '@app/api/socket/lobbies';

type MatchPageParams = {
    lobbyId: string;
};

export default function LobbyPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = parseInt(params.lobbyId);

    const matchIds = useMemo(() => [matchId], [matchId]);

    const { lobbies, isLoading: isLoadingLobbies } = useLobbies({ matchIds });

    const lobby = lobbies.length > 0 ? lobbies[0] : null;

    const navigation = useNavigation();

    useEffect(() => {
        // if (match) {
        navigation.setOptions({
            title: 'Lobby',
            // headerTitle: () => <MatchCard match={match} flat={true} />,
            // headerStyle: {
            //     height: 200, // Set your custom height here
            // },
            // headerRight: () => <UserMenu profile={profile} />,
        });
        // }
    }, []);

    if (!lobby) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle="p-4 gap-4">
            <LiveMatch data={lobby} expanded={true} />
        </ScrollView>
    );
}
