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

            {/* w-60 h-60 scale-y-[0.5] -rotate-45 */}
            {/* border border-gray-700 */}

            <View className="gap-2">

                {/*<MatchMap*/}
                {/*    match={match}*/}
                {/*    analysis={analysis}*/}
                {/*    analysisSvgUrl={analysisSvgUrl}*/}
                {/*    />*/}

                {/*<View className=" border border-gray-700">*/}
                {/*    <SvgUri viewBox="0 0 120 120" width="240px" height="240px" uri={analysisSvgUrl} />*/}
                {/*</View>*/}

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

                {/*<FontAwesome5 name={'check-square'} size={14} color={theme.textNoteColor} />*/}
                {/*<FontAwesome name={'check-square'} size={14} color={theme.textNoteColor} />*/}

                <View className="flex-col gap-1 bg-gray-100 p-5">
                    <Text className="mb-1">{getTranslation('match.gameSettings')}</Text>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.gameMode')}:</Text>
                        <Text>{match.gameModeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.map')}:</Text>
                        <Text>{match.mapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.mapsize')}:</Text>
                        <Text>{match.mapSizeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.aidifficulty')}:</Text>
                        <Text>{match.difficultyName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.resources')}:</Text>
                        <Text>{match.resourcesName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.population')}:</Text>
                        <Text>{match.population}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.gamespeed')}:</Text>
                        <Text>{match.speedName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.revealmap')}:</Text>
                        <Text>{match.revealMapName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.startingage')}:</Text>
                        <Text>{match.startingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.endingage')}:</Text>
                        <Text>{match.endingAgeName}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.treatylength')}:</Text>
                        <Text>{match.treatyLength} minutes</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="w-[120px]">{getTranslation('match.victory')}:</Text>
                        <Text>{match.victoryName}</Text>
                    </View>

                    <View className="flex-row gap-1 mt-2">
                        <View className="flex-col gap-1 w-[50%]">
                            <Text className="mb-1">{getTranslation('match.teamSettings')}</Text>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.lockTeams ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.lockTeams')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.teamTogether ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.teamTogether')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.teamPositions ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.teamPositions')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.sharedExploration ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.sharedExploration')}</Text>
                            </View>
                        </View>
                        <View className="flex-col gap-1">
                            <Text className="mb-1">{getTranslation('match.advancedSettings')}</Text>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.lockSpeed ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.lockSpeed')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.allowCheats ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.allowCheats')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.turboMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.turboMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.fullTechTree ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.fullTechTree')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.empireWarsMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.empireWarsMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.suddenDeathMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.suddenDeathMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.regicideMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.regicideMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.antiquityMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.antiquityMode')}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <FontAwesome5 name={match.recordGame ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                                <Text>{getTranslation('match.recordGame')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Space />

            </View>
        </ScrollView>
    );
}
