import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MyText } from '../../components/my-text';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { createStylesheet } from '../../../../src/theming-new';
import { Fragment, useState } from 'react';
import BottomSheet from '../../bottom-sheet';
import { PlayoffParticipant } from './participant';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { FontAwesome5 } from '@expo/vector-icons';
import { TournamentMarkdown } from '../tournament-markdown';
import { PlayoffPlayer } from './player';

export const PlayoffMatch: React.FC<{ match: IPlayoffMatch }> = ({ match }) => {
    const styles = useStyles();
    const [visible, setVisible] = useState(false);

    return (
        <View style={[styles.container, !!match.name && styles.standaloneContainer]}>
            {match.name && <MyText style={styles.name}>{match.name}</MyText>}
            <TouchableOpacity style={styles.contentContainer} onPress={() => setVisible(true)}>
                {match.participants.map((participant, index) => (
                    <View style={[styles.participant, index > 0 && styles.participantBorder]} key={index}>
                        <PlayoffParticipant size={12} participant={participant} winner={match.winner === index} />

                        <MyText style={match.winner === index && styles.winner}>{participant.score}</MyText>
                    </View>
                ))}
            </TouchableOpacity>
            <BottomSheet isActive={visible} onClose={() => setVisible(false)} showHandle style={styles.modal}>
                <View style={styles.modalHeader}>
                    {match.participants.map((participant, index) => (
                        <Fragment key={index}>
                            <PlayoffParticipant participant={participant} size={18} winner={match.winner === index} reversed={index === 0} />
                            {index === 0 && <MyText style={styles.versus}>vs</MyText>}
                        </Fragment>
                    ))}
                </View>
                {match.startTime && <MyText style={styles.startTime}>{format(match.startTime, 'PP - p')}</MyText>}

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
                        <TouchableOpacity key={link.url} onPress={() => Linking.openURL(link.url)}>
                            <Image source={{ uri: link.image }} alt={link.text} style={styles.linkImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            </BottomSheet>
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: { width: '100%' },
        standaloneContainer: {
            position: 'absolute',
            bottom: 0,
        },
        contentContainer: {
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.hoverBackgroundColor,
        },
        name: {
            fontWeight: '500',
            paddingBottom: 6,
        },
        participant: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
        },
        participantBorder: {
            borderTopWidth: 1,
            borderColor: theme.hoverBackgroundColor,
        },
        nameContainer: {
            flexDirection: 'row',
            gap: 2,
        },
        winner: {
            fontWeight: '600',
        },
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
