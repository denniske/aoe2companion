import React, { Fragment, useMemo } from 'react';
import { Canvas, Rect, vec, Line, Group, Circle, useSVG, ImageSVG } from '@shopify/react-native-skia';
import { ActivityIndicator, Linking, Platform, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis, IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { compact, flatten, sortBy, uniq } from 'lodash';
import { gaiaObjects, getBuildingSize } from '@app/view/components/match-map/map-utils';
import { getPath, getTileMap, setTiles, splitPath } from '@app/view/components/match-map/match-map3';
import groupBy from 'lodash/groupBy';
import { runOnJS, useAnimatedReaction, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import TimeScrubber from '@app/view/components/match-map/time-scrubber';
import Faded from '../../view/components/match-map/draw/faded';
import Wall, { getWallOrigin } from '../../view/components/match-map/draw/wall';
import Building, { getBuildingOrigin } from '@app/view/components/match-map/draw/building';
import Special, { getSpecialOrigin } from '@app/view/components/match-map/draw/special';
import Chat from '@app/view/components/match-map/chat';
import Legend from '../../view/components/match-map/legend';
import Uptimes from '@app/view/components/match-map/uptimes';
import Eapm from '@app/view/components/match-map/eapm';
import { useMatchAnalysis, useMatchAnalysisSvg, useWithRefetching } from '@app/queries/all';
import SkiaLoader from '@app/components/skia-loader';
import { Button } from '@app/components/button';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { Card } from '@app/components/card';
import { ScrollView } from '@app/components/scroll-view';
import { Icon } from '@app/components/icon';
import { appConfig } from '@nex/dataset';
import { useTournamentMatches } from '@app/api/tournaments';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { getVerifiedPlayer } from '@nex/data';
import { AoeSpeed, getSpeedFactor } from '@app/helper/speed';
import { useRouter } from 'expo-router';

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

    const { tournament, format } = tournamentMatch ?? { tournament: undefined, format: undefined };

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }

    return (
        <Card direction="vertical">
            <ScrollView horizontal contentContainerStyle="items-center gap-4">
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
        </Card>
    );
}
