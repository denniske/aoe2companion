import { View, StyleSheet, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { GroupParticipant as IGroupParticipant } from 'liquipedia';
import { MyText } from '../../components/my-text';
import { createStylesheet } from '../../../theming-new';
import { getTranslation } from '../../../helper/translate';

export const Score: React.FC<{ score: IGroupParticipant['gameScore']; style?: TextStyle }> = ({ score = { win: 0, loss: 0, draw: 0 }, style }) => {
    const styles = useStyles();
    const win = score.win;
    const draw = score.draw > 0 ? `-${score.draw}` : '';
    const loss = `-${score.loss}`;

    return (
        <MyText style={style}>
            {win}
            {loss}
            {draw}
        </MyText>
    );
};

const statusColors: Record<IGroupParticipant['status'], string> = {
    up: '#ddf4dd',
    stayup: '#e5f4c6',
    stay: '#f9f0c7',
    down: '#fbdfdf',
};

export const GroupParticipant: React.FC<{ participant: IGroupParticipant }> = ({ participant }) => {
    const styles = useStyles();

    return (
        <View style={[styles.participant, { backgroundColor: statusColors[participant.status] }]}>
            <View style={styles.nameContainer}>
                {participant.image && <Image source={{ uri: participant.image }} style={styles.participantImage} />}
                <MyText>{participant.name || getTranslation('tournaments.tbd')}</MyText>
            </View>
            <View style={styles.cell}>
                <Score style={styles.bold} score={participant.matchScore} />
            </View>
            <View style={styles.cell}>
                <Score score={participant.gameScore} />
            </View>
            <View style={styles.cell}>
                <MyText style={styles.bold}>{participant.points}</MyText>
            </View>
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        participant: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderColor: theme.borderColor,
            borderTopWidth: 1,
        },
        nameContainer: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            width: '50%',
        },
        participantImage: {
            height: 15,
            aspectRatio: 1.5,
            resizeMode: 'contain',
        },
        cell: {
            flex: 1,
            alignItems: 'center',
        },
        bold: {
            fontWeight: '600',
        },
    })
);
