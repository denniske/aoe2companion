import React, { useMemo } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { flatten } from 'lodash';
import { useTranslation } from '@app/helper/translate';
import { Card } from '@app/components/card';
import { ScrollView } from '@app/components/scroll-view';
import { Icon } from '@app/components/icon';
import { appConfig } from '@nex/dataset';
import { tournamentsEnabled, useUpcomingTournamentMatches } from '@app/api/tournaments';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useRouter } from 'expo-router';
import { matchTimedOut } from '@app/components/elapsed-time-or-duration';

interface Props {
    match: IMatchNew;
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

export default function MatchInfo(props: Props) {
    const { match } = props;
    const getTranslation = useTranslation();
    const router = useRouter();

    const { data: tournamentMatches } = useUpcomingTournamentMatches();
    console.log('tournamentMatches', tournamentMatches);

    const players = flatten(match?.teams.map((t) => t.players));
    const tournamentMatch = useMemo(
        () =>
            match &&
            players &&
            tournamentMatches?.find((tournamentMatch) => {
                // console.log(
                //     'player names',
                //     players.map((player) => player.socialLiquipedia?.toLowerCase()?.replaceAll('_', '') ?? '')
                // );
                // console.log(
                //     'tournament names',
                //     tournamentMatch.participants.map((player) => player.name)
                // );
                // console.log('match.started', match.started);
                // console.log('tournamentMatch.startTime', tournamentMatch.startTime);
                // console.log('diff minutes', differenceInMinutes(match.started, tournamentMatch.startTime));

                return tournamentMatch.startTime &&
                Math.abs(differenceInMinutes(match.started, tournamentMatch.startTime)) < 300 &&
                 players.every((player) =>
                    player.socialLiquipedia && tournamentMatch.participants
                        .map((tournamentParticipant) => tournamentParticipant.name?.toLowerCase())
                        .includes(player.socialLiquipedia?.toLowerCase()?.replaceAll('_', '') ?? '')
                );
            }),
        [players, tournamentMatches]
    );

    const { tournament, format } = tournamentMatch ?? { tournament: undefined, format: undefined };

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * match.speedFactor);
    }
    if (matchTimedOut(match)) {
        duration = getTranslation('match.unknown');
    }

    return (
        <Card direction="vertical">
            <ScrollView horizontal contentContainerStyle="items-center gap-4 pb-2">
                {tournament && (
                    <Pressable
                        className="flex-row items-center gap-1"
                        onPress={() =>
                            (Platform.OS === 'web' && !tournamentsEnabled)
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
        </Card>
    );
}
