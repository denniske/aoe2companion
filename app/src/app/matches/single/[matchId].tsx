import React, { useEffect, useMemo } from 'react';
import { MatchProps } from '@app/components/match';
import { BottomSheetProps } from '@app/view/bottom-sheet';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useTournamentMatches } from '@app/api/tournaments';
import { getVerifiedPlayer, isMatchFreeForAll } from '@nex/data';
import { flatten, min, sortBy } from 'lodash';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { AoeSpeed, getSpeedFactor } from '@app/helper/speed';
import { MatchCard } from '@app/components/match/card';
import { Linking, Platform, Pressable, View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';
import { Image } from 'expo-image';
import { Text } from '@app/components/text';
import { Icon } from '@app/components/icon';
import { appConfig } from '@nex/dataset';
import { MatchPlayer } from '@app/components/match/player';
import { useMatch, useMatchAnalysis, useMatchAnalysisSvg, useWithRefetching } from '@app/queries/all';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '@app/theming';
import Space from '@app/view/components/space';
import { useTranslation } from '@app/helper/translate';
import MatchAnalysis from '@app/view/components/match-map/match-analysis';
import MatchOptions from '@app/view/components/match-map/match-options';

type MatchPopupProps = MatchProps & Pick<BottomSheetProps, 'isActive' | 'onClose'>;

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

type MatchPageParams = {
    matchId: string;
};

export default function MatchPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<MatchPageParams>();
    const matchId = parseInt(params.matchId);

    const theme = useAppTheme();

    const { data: match, error: matchError, isLoading: matchLoading } = useWithRefetching(useMatch(matchId));
    // const { data: match, refetch, isRefetching } = useWithRefetching(useMatch(matchId));
    // const { data: analysis } = useWithRefetching(useMatchAnalysis(matchId));
    // const { data: analysisSvgUrl } = useWithRefetching(useMatchAnalysisSvg(matchId, !!analysis));

    // const { match, highlightedUsers, user } = props;

    const router = useRouter();
    const { data: tournamentMatches } = useTournamentMatches();

    const players = flatten(match?.teams.map((t) => t.players));
    const tournamentMatch = useMemo(
        () =>
            match &&
            players &&
            tournamentMatches?.find(
                (tournamentMatch) =>
                    tournamentMatch.startTime &&
                    Math.abs(differenceInMinutes(match.started, tournamentMatch.startTime)) < 240 &&
                    players.every((player) =>
                        tournamentMatch.participants
                            .map((tournamentParticipant) => tournamentParticipant.name?.toLowerCase())
                            .includes(getVerifiedPlayer(player.profileId)?.liquipedia?.toLowerCase()?.replaceAll('_', '') ?? '')
                    )
            ),
        [players, tournamentMatches]
    );

    const navigation = useNavigation();

    useEffect(() => {
        if (match) {
            navigation.setOptions({
                headerTitle: () => <MatchCard match={match} flat={true} />,
                headerStyle: {
                    height: 200, // Set your custom height here
                },
                // headerRight: () => <UserMenu profile={profile} />,
            });
        }
    }, [match]);

    if (!match) {
        return <Text>Loading...</Text>;
    }

    // console.log('match', match);
    // console.log('analysis', analysis);
    // console.log('analysisSvgUrl', analysisSvgUrl);

    // const player = match.teams.flatMap((team) => team.players).find((p) => p.profileId === user);
    const player = match.teams.flatMap((team) => team.players).find((p) => p.profileId === 1);

    const { tournament, format } = tournamentMatch ?? { tournament: undefined, format: undefined };
    const freeForAll = isMatchFreeForAll(match);

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }

    return (
        // <BottomSheet isActive={isActive} onClose={onClose} title={`${name}'s Match`} className="gap-4" showHandle>
        // <ScrollView contentContainerStyle="p-4 gap-4 border border-gray-700">
        <ScrollView contentContainerStyle="p-4 gap-4">
            {/*<MatchCard match={match} />*/}

            <View className="gap-2">

                <ScrollView horizontal contentContainerStyle="items-center gap-4 pb-3">
                    {tournament && (
                        <Pressable
                            className="flex-row items-center gap-1"
                            onPress={() =>
                                Platform.OS === 'web'
                                    ? Linking.openURL(`https://liquipedia.net/ageofempires/${tournament.path}`)
                                    : router.navigate(`/competitive/tournaments/${encodeURIComponent(tournament.path)}`)
                            }
                        >
                            {tournament.image && <Image source={{ uri: tournament.image }} className="w-5 h-5" />}
                            <Text color="subtle">
                                {tournament.name} ({format})
                            </Text>
                        </Pressable>
                    )}
                    <View className="flex-row items-center gap-1">
                        <Icon icon="clock" size={14} color="subtle" />
                        <Text color="subtle">{duration}</Text>
                    </View>
                    {appConfig.game === 'aoe2de' && (
                        <View className="flex-row items-center gap-1">
                            <Icon icon="running" size={14} color="subtle" />
                            <Text color="subtle">{match.speedName}</Text>
                        </View>
                    )}

                    <View className="flex-row items-center gap-1">
                        <Icon icon="memo-circle-info" size={14} color="subtle" />
                        <Text color="subtle" numberOfLines={1} selectable>
                            {match.matchId}
                        </Text>
                    </View>

                    {match.name !== 'AUTOMATCH' && (
                        <Text color="subtle" numberOfLines={1}>
                            {match.name}
                        </Text>
                    )}
                </ScrollView>


                {sortBy(match.teams, ({ teamId, players }, i) => min(players.map((p) => p.color))).map(({ teamId, players }, i) => (
                    <View key={teamId} className="gap-2">
                        {sortBy(players, (p) => p.color).map((player, j) => (
                            <MatchPlayer
                                key={j}
                                // highlight={highlightedUsers?.some((hu) => hu === player.profileId)}
                                match={match}
                                player={player}
                                freeForAll={freeForAll}
                                canDownloadRec={player.replay}
                                // onClose={onClose}
                            />
                        ))}
                        {i < match.teams.length - 1 && (
                            <View className="flex-row items-center gap-4">
                                <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                                <Text variant="header-sm">{getTranslation('match.versus')}</Text>
                                <View className="bg-gray-200 dark:bg-gray-800 h-[1px] flex-1" />
                            </View>
                        )}
                    </View>
                ))}

                <MatchAnalysis
                    match={match}
                    matchError={matchError}
                    matchLoading={matchLoading}
                />

                <MatchOptions
                    match={match}
                />

            </View>
        </ScrollView>
    );
}
