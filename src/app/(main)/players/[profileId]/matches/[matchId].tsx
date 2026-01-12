import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MatchCard } from '@app/components/match/match-card';
import { View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';
import { useMatch, useWithRefetching } from '@app/queries/all';
import MatchAnalysis from '@app/view/components/match-map/match-analysis';
import MatchOptions from '@app/components/match/match-options';
import MatchInfo from '@app/components/match/match-info';
import MatchTeams from '@app/components/match/match-teams';
import { LoadingScreen } from '@app/components/loading-screen';
import NotFound from '@app/app/(main)/+not-found';
import { Header } from '@app/components/header';

type MatchPageParams = {
    matchId: string;
    profileId: string;
};

export default function MatchPage() {
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = parseInt(params.matchId);

    const { data: match, error: matchError, isPending: matchLoading } = useWithRefetching(useMatch(matchId));
    const player = match?.teams.find(t => t.players.some(p => p.profileId === Number(params.profileId)))?.players.find(p => p.profileId === Number(params.profileId)) ?? null

    if (!match || !player) {
        return matchLoading ? (
            <>
                <Stack.Screen
                    options={{ header: (props) => <Header {...props} paramReplacements={{ profileId: null }} /> }}
                />

                <LoadingScreen />
            </>
        ) : (
            <NotFound />
        );
    }

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen
                options={{ title: match.mapName, header: (props) => <Header {...props} paramReplacements={{ profileId: player.name }} /> }}
            />
            <View className="gap-2">
                <MatchCard match={match} linkMap={true} user={player.profileId} />
                <MatchInfo match={match} />
                <View className="lg:hidden">
                    <MatchTeams match={match} highlightedUsers={[player.profileId]} />
                </View>
                <MatchAnalysis match={match} matchError={matchError} matchLoading={matchLoading} />
                <MatchOptions match={match} />
            </View>
        </ScrollView>
    );
}
