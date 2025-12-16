import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { MatchCard } from '@app/components/match/match-card';
import { View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { useMatch, useWithRefetching } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import MatchAnalysis from '@app/view/components/match-map/match-analysis';
import MatchOptions from '@app/components/match/match-options';
import MatchInfo from '@app/components/match/match-info';
import MatchTeams from '@app/components/match/match-teams';
import { containerClassName } from '@app/styles';
import cn from 'classnames';

type MatchPageParams = {
    matchId: string;
};

export default function MatchPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = parseInt(params.matchId);

    const { data: match, error: matchError, isLoading: matchLoading } = useWithRefetching(useMatch(matchId));

    const navigation = useNavigation();

    useEffect(() => {
        if (match) {
            navigation.setOptions({
                title: match.mapName,
                // headerTitle: () => <MatchCard match={match} flat={true} />,
                // headerStyle: {
                //     height: 200, // Set your custom height here
                // },
                // headerRight: () => <UserMenu profile={profile} />,
            });
        }
    }, [match]);

    if (!match) {
        return (
            <View className={cn(containerClassName, 'flex-1 justify-center items-center')}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <View className="gap-2">
                <MatchCard match={match} linkMap={true} />
                <MatchInfo match={match} />
                <View className='lg:hidden'>
                    <MatchTeams match={match} />
                </View>
                <MatchAnalysis match={match} matchError={matchError} matchLoading={matchLoading} />
                <MatchOptions match={match} />
            </View>
        </ScrollView>
    );
}
