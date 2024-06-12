import { Card } from '@app/components/card';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { PlayoffParticipant } from './participant';
import { PlayoffPopup } from './popup';
import { MyText } from '../../components/my-text';

export type PlayoffMatchProps = {
    games?: IPlayoffMatch['games'];
    links?: IPlayoffMatch['links'];
} & Omit<IPlayoffMatch, 'games' | 'links'>;

export const PlayoffMatch: React.FC<{ match: PlayoffMatchProps; style?: ViewStyle }> = ({ match, style }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {match.header && (
                <View style={styles.nameContainer}>
                    <MyText style={styles.name}>{match.header?.name}</MyText>
                    <MyText style={styles.format}>{match.header?.format}</MyText>
                </View>
            )}
            <Card direction="vertical" className="gap-0 p-0" onPress={() => setVisible(true)} disabled={match.participants.length < 2}>
                {match.participants.map((participant, index) => (
                    <View
                        style={[styles.participant, index > 0 && styles.participantBorder]}
                        className="border-gray-200 dark:border-gray-800"
                        key={index}
                    >
                        <PlayoffParticipant size={12} participant={participant} winner={match.winner === index} />

                        <MyText style={match.winner === index && styles.winner}>{participant.score}</MyText>
                    </View>
                ))}
            </Card>

            {match.games && match.links && <PlayoffPopup visible={visible} setVisible={setVisible} match={match as IPlayoffMatch} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    participant: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    participantBorder: {
        borderTopWidth: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    name: {
        fontWeight: '500',
        fontSize: 16,
        flex: 1,
    },
    format: {
        fontWeight: '500',
    },
    winner: {
        fontWeight: '600',
    },
});
