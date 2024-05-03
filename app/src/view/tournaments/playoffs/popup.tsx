import { FontAwesome5 } from '@expo/vector-icons';
import { differenceInMinutes, format, isPast } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { Fragment, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';

import { PlayoffParticipant } from './participant';
import { PlayoffPlayer } from './player';
import { createStylesheet } from '../../../../src/theming-new';
import { useTournamentDetail, useTournamentMatches } from '../../../api/tournaments';
import { findTournamentMatch } from '../../../helper/tournaments';
import { getTranslation } from '../../../helper/translate';
import BottomSheet from '../../bottom-sheet';
import { MyText } from '../../components/my-text';
import { TournamentMarkdown } from '../tournament-markdown';

export const PlayoffPopup: React.FC<{ match: IPlayoffMatch; visible: boolean; setVisible: (visible: boolean) => void; tournamentPath?: string }> = ({
    match: selectedMatch,
    visible,
    setVisible,
    tournamentPath,
}) => {
    const styles = useStyles();
    const { data: tournamentMatches } = useTournamentMatches();
    const { data: tournament } = useTournamentDetail(tournamentPath ?? '', !!tournamentPath);
    const match = tournamentPath
        ? findTournamentMatch(
              { ...selectedMatch, participants: [selectedMatch.participants[0], selectedMatch.participants[1] || selectedMatch.participants[0]] },
              tournament
          )
        : selectedMatch;

    const liveOrUpcomingMatch = tournamentMatches?.find(
        (tournamentMatch) =>
            match?.startTime &&
            tournamentMatch.startTime &&
            Math.abs(differenceInMinutes(match.startTime, tournamentMatch.startTime)) < 150 &&
            match.participants.every((participant) =>
                tournamentMatch.participants.map((tournamentParticipant) => tournamentParticipant.name).includes(participant.name)
            )
    );

    useEffect(() => {
        if (visible && tournamentPath && tournament && !match) {
            setVisible(false);
            router.navigate(`/competitive/tournaments/${encodeURIComponent(tournament.path)}`);
        }
    }, [tournamentPath, match, tournament, visible]);

    return (
        <BottomSheet isActive={visible} onClose={() => setVisible(false)} showHandle style={styles.modal}>
            {match ? (
                <>
                    <View style={styles.modalHeader}>
                        {match.participants.map((participant, index) => (
                            <Fragment key={index}>
                                <PlayoffParticipant participant={participant} size={18} winner={match.winner === index} reversed={index === 0} />
                                {index === 0 && <MyText style={styles.versus}>{getTranslation('match.versus')}</MyText>}
                            </Fragment>
                        ))}
                    </View>
                    {match.startTime && <MyText style={styles.startTime}>{format(match.startTime, 'PP - p')}</MyText>}
                    {liveOrUpcomingMatch?.startTime && isPast(liveOrUpcomingMatch?.startTime) && (
                        <MyText style={styles.startTime}>{getTranslation('tournaments.live')}</MyText>
                    )}

                    <View style={styles.games}>
                        {match.games.map((game, index) => {
                            const [leftPlayers = [], rightPlayers = []] = game.players ?? [];
                            const notPlayed = !leftPlayers.length || !rightPlayers.length;

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
                        {match.links.map((link) => (
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
        startTime: {
            textAlign: 'center',
            fontWeight: '600',
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
    })
);
