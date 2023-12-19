import { StyleSheet, View } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { EventParticipant } from 'liquipedia';
import { TournamentParticipant } from './tournament-participant';
import { TournamentMarkdown } from './tournament-markdown';

export const TournamentParticipants: React.FC<{ participants: EventParticipant[]; participantsNote?: string }> = ({
    participants,
    participantsNote,
}) => {
    const styles = useStyles();

    return (
        <View style={styles.participants}>
            <View style={styles.participants}>
                {participants.map((participant) => (
                    <View style={styles.participant} key={participant.name}>
                        <TournamentParticipant size={12} participant={participant} />
                    </View>
                ))}
            </View>
            {participantsNote && <TournamentMarkdown>{participantsNote}</TournamentMarkdown>}
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        participants: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 4,
        },
        participant: {
            width: '30%',
        },
    })
);
