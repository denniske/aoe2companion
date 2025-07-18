import { Text } from '@app/components/text';
import TwitchBadge from '@app/view/components/badge/twitch-badge';
import { FontAwesome5 } from '@expo/vector-icons';
import { format, isPast } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { Fragment, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Pressable, Platform } from 'react-native';

import { PlayoffParticipant } from './participant';
import { PlayoffPlayer } from './player';
import { createStylesheet } from '../../../../src/theming-new';
import { useTournamentDetail, useTournamentMatches } from '../../../api/tournaments';
import { findTournamentMatch, getLiveOrUpcomingMatch } from '../../../helper/tournaments';
import BottomSheet from '../../bottom-sheet';
import { MyText } from '../../components/my-text';
import { TournamentMarkdown } from '../tournament-markdown';
import { useTranslation } from '@app/helper/translate';
import { getTwitchChannel } from '@nex/data';

export const PlayoffPopup: React.FC<{ match: IPlayoffMatch; visible: boolean; setVisible: (visible: boolean) => void; tournamentPath?: string }> = ({
    match: selectedMatch,
    visible,
    setVisible,
    tournamentPath,
}) => {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const { data: tournamentMatches } = useTournamentMatches();
    const { data: tournament } = useTournamentDetail(tournamentPath ?? '', !!tournamentPath);
    const match = tournamentPath
        ? findTournamentMatch(
              { ...selectedMatch, participants: [selectedMatch.participants[0], selectedMatch.participants[1] || selectedMatch.participants[0]] },
              tournament
          )
        : selectedMatch;

    const liveOrUpcomingMatch = getLiveOrUpcomingMatch(match, tournamentMatches);
    const isLive = liveOrUpcomingMatch?.startTime && isPast(liveOrUpcomingMatch?.startTime);

    useEffect(() => {
        if (visible && tournamentPath && tournament && !match) {
            setVisible(false);
            router.navigate(`/competitive/tournaments/${encodeURIComponent(tournament.path)}`);
        }
    }, [tournamentPath, match, tournament, visible]);

    const twitch = match?.links
        .find((link) => link.text === 'Twitch')
        ?.url.split('/')
        .pop();

    return (
        <BottomSheet isActive={visible} onClose={() => setVisible(false)} showHandle style={styles.modal}>
            {match ? (
                <>
                    {tournamentPath && tournament && (
                        <View className="flex-row gap-2 justify-center">
                            <Pressable
                                className="flex-row items-center justify-center gap-2 mb-2"
                                onPress={() =>
                                    Platform.OS === 'web'
                                        ? Linking.openURL(`https://liquipedia.net/ageofempires/${tournament.path}`)
                                        : router.navigate(`/competitive/tournaments/${encodeURIComponent(tournament.path)}`)
                                }
                            >
                                {tournament.league?.image && <Image source={{ uri: tournament.league.image }} className="w-6 h-6" />}
                                <Text variant="label-lg">{tournament.name}</Text>
                            </Pressable>

                            {match.header && (
                                <Text variant="body-lg" color="subtle">
                                    {match.header.name}
                                </Text>
                            )}
                        </View>
                    )}
                    <View style={styles.modalHeader}>
                        {match.participants.map((participant, index) => (
                            <Fragment key={index}>
                                <PlayoffParticipant participant={participant} size={18} winner={match.winner === index} reversed={index === 0} />
                                {index === 0 && <MyText style={styles.versus}>{getTranslation('match.versus')}</MyText>}
                            </Fragment>
                        ))}
                    </View>
                    <View className="flex-row items-center justify-center gap-6">
                        {match.startTime && (
                            <Text variant="label" align="center">
                                {format(match.startTime, 'PP - p')}
                            </Text>
                        )}
                        {match.bestOf && (
                            <Text variant="body" align="center">
                                Best of {match.bestOf}
                            </Text>
                        )}
                    </View>

                    {isLive && (
                        <View className="justify-center flex-row gap-4">
                            <Text variant="label" className="uppercase" color="brand">
                                {getTranslation('tournaments.live')}
                            </Text>

                            {twitch && <TwitchBadge channelUrl={twitch} channel={getTwitchChannel(twitch)} />}
                        </View>
                    )}

                    <View style={styles.games}>
                        {match.games.map((game, index) => {
                            const [leftPlayers = [], rightPlayers = []] = game.players ?? [];
                            const notPlayed = (!leftPlayers.length || !rightPlayers.length) && isPast(match.startTime ?? new Date()) && !isLive;

                            return (
                                <View style={styles.game} key={index}>
                                    <View style={styles.playersContainer}>
                                        <View style={styles.players}>
                                            {leftPlayers.map((player, playerIndex) => (
                                                <PlayoffPlayer key={playerIndex} player={player} />
                                            ))}
                                        </View>
                                        <FontAwesome5 name="check" size={16} color={game.winner === 0 ? 'green' : 'transparent'} />
                                    </View>
                                    <MyText style={[styles.map, notPlayed && styles.mapNotPlayed]}>{game.map}</MyText>
                                    <View style={[styles.playersContainer, styles.reversed]}>
                                        <View style={styles.players}>
                                            {rightPlayers.map((player, playerIndex) => (
                                                <PlayoffPlayer key={playerIndex} player={player} reverse />
                                            ))}
                                        </View>
                                        <FontAwesome5 name="check" size={16} color={game.winner === 1 ? 'green' : 'transparent'} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    {match.note && <TournamentMarkdown>{match.note}</TournamentMarkdown>}
                    <View style={styles.linksContainer}>
                        {match.links
                            .filter((link) => link.image && link.url)
                            .map((link) => (
                                <TouchableOpacity key={link.text} onPress={() => Linking.openURL(link.url)}>
                                    <Image source={{ uri: link.image }} alt={link.text} style={styles.linkImage} />
                                </TouchableOpacity>
                            ))}
                    </View>
                </>
            ) : (
                <ActivityIndicator size="large" />
            )}
        </BottomSheet>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        versus: {
            fontSize: 18,
        },
        modal: {
            gap: 12,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            alignItems: 'center',
        },
        games: {
            gap: 12,
        },
        game: {
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
        },
        map: {
            textAlign: 'center',
            fontWeight: '600',
        },
        mapNotPlayed: {
            textDecorationLine: 'line-through',
        },
        linksContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        linkImage: {
            width: 25,
            height: 25,
            resizeMode: 'contain',
        },
        playersContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 8,
        },
        reversed: {
            flexDirection: 'row-reverse',
        },
        players: {
            gap: 2,
            flexShrink: 1,
        },
    } as const)
);
