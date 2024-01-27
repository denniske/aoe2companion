import { Linking, Platform, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { getVerifiedPlayer, isMatchFreeForAll } from '@nex/data';
import { flatten, min, sortBy } from 'lodash';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { AoeSpeed, getSpeedFactor } from '../../helper/speed';
import { appConfig } from '@nex/dataset';
import { useTournamentMatches } from '../../api/tournaments';
import { Text } from '../text';
import { Icon } from '../icon';
import BottomSheet, { BottomSheetProps } from '@app/view/bottom-sheet';
import { MatchCard, MatchCardProps } from './card';
import { MatchPlayer } from './player';
import { getTranslation } from '@app/helper/translate';
import { useRouter } from 'expo-router';

type MatchPopupProps = Omit<MatchCardProps, 'pressable'> & Pick<BottomSheetProps, 'isActive' | 'onClose'>;

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

export function MatchPopup(props: MatchPopupProps) {
    const { match, highlightedUsers, isActive, onClose } = props;
    const router = useRouter();
    const { data: tournamentMatches } = useTournamentMatches();

    const players = flatten(match?.teams.map((t) => t.players));
    const { tournament } = useMemo(
        () =>
            (match &&
                players &&
                tournamentMatches?.find(
                    (tournamentMatch) =>
                        tournamentMatch.startTime &&
                        Math.abs(differenceInMinutes(match.started, tournamentMatch.startTime)) < 240 &&
                        players.every((player) =>
                            tournamentMatch.participants
                                .map((tournamentParticipant) => tournamentParticipant.name?.toLowerCase())
                                .includes(getVerifiedPlayer(player.profileId)?.liquipedia?.toLowerCase() ?? '')
                        )
                )) ?? { tournament: undefined },
        [players, tournamentMatches]
    );
    const freeForAll = isMatchFreeForAll(match);

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    if (appConfig.game !== 'aoe2de') duration = '';

    return (
        <BottomSheet isActive={isActive} onClose={onClose} title="Match">
            <MatchCard {...props} pressable={false} />

            <View>
                {tournament && (
                    <Pressable
                        onPress={() =>
                            Platform.OS === 'web'
                                ? Linking.openURL(`https://liquipedia.net/ageofempires/${tournament.path}`)
                                : router.navigate(`/tournaments/${tournament.path}`)
                        }
                    >
                        {tournament.image && <Image source={{ uri: tournament.image }} className="w-4 h-4" />}
                        <Text>{tournament.name}</Text>
                    </Pressable>
                )}
                {appConfig.game === 'aoe2de' && (
                    <View className="flex-row items-center">
                        <Icon icon="clock" size={11.5} color="subtle" />
                        <Text variant="body-sm" color="subtle">
                            {duration}
                        </Text>
                        <Icon icon="running" size={11.5} color="subtle" />
                        <Text variant="body-sm" color="subtle">
                            {match.speedName}
                        </Text>

                        {match.name !== 'AUTOMATCH' && (
                            <>
                                <Text variant="body-sm" color="subtle" numberOfLines={1}>
                                    {match.name}
                                </Text>
                            </>
                        )}
                    </View>
                )}
                {sortBy(match.teams, ({ teamId, players }, i) => min(players.map((p) => p.color))).map(({ teamId, players }, i) => (
                    <View key={teamId}>
                        {sortBy(players, (p) => p.color).map((player, j) => (
                            <MatchPlayer
                                key={j}
                                highlight={highlightedUsers?.some((hu) => hu === player.profileId)}
                                match={match}
                                player={player}
                                freeForAll={freeForAll}
                                canDownloadRec={player.replay}
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
            </View>
        </BottomSheet>
    );
}
