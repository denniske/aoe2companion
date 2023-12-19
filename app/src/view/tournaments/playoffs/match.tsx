import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MyText } from '../../components/my-text';
import { PlayoffMatch as IPlayoffMatch } from 'liquipedia';
import { createStylesheet } from '../../../../src/theming-new';
import { useState } from 'react';
import { PlayoffParticipant } from './participant';
import { PlayoffPopup } from './popup';

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

            <PlayoffPopup visible={visible} setVisible={setVisible} match={match} />
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
    })
);
