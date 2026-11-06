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

type MatchPageParams = {
    matchId: string;
    /** Set by the recording upload, which lands here once the analysis is ready to load. */
    analyze?: string;
};

export default function MatchPage() {
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = parseInt(params.matchId);

    const { data: match, error: matchError, isPending: matchLoading } = useWithRefetching(useMatch(matchId));

    if (!match) {
        return matchLoading ? <LoadingScreen /> : <NotFound />;
    }

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen options={{ title: match.mapName }} />
            <View className="gap-2">
                <MatchCard match={match} linkMap={true} />
                <MatchInfo match={match} />
                <View className="lg:hidden">
                    <MatchTeams match={match} />
                </View>
                <MatchAnalysis match={match} matchError={matchError} matchLoading={matchLoading} autoAnalyze={!!params.analyze} />
                <MatchOptions match={match} />
            </View>
        </ScrollView>
    );
}
