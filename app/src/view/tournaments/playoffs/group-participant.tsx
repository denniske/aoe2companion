import { Text } from '@app/components/text';
import tw from '@app/tailwind';
import { TextVariant } from '@app/utils/text.util';
import { Image } from 'expo-image';
import { GroupParticipant as IGroupParticipant } from 'liquipedia';
import { View, StyleSheet, TextStyle } from 'react-native';

import { getTranslation } from '../../../helper/translate';
import { createStylesheet } from '../../../theming-new';

export const Score: React.FC<{ score: IGroupParticipant['gameScore']; style?: TextStyle; variant?: TextVariant }> = ({
    score = { win: 0, loss: 0, draw: 0 },
    style,
    variant,
}) => {
    const win = score.win;
    const draw = score.draw > 0 ? `-${score.draw}` : '';
    const loss = `-${score.loss}`;

    return (
        <Text variant={variant} style={style}>
            {win}
            {loss}
            {draw}
        </Text>
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
    const backgroundColor = statusColors[participant.status];
    const textColor = backgroundColor ? 'black' : (tw.style('text-black dark:text-white').color as string);

    return (
        <View style={[styles.participant, { backgroundColor: statusColors[participant.status] }]}>
            <View style={styles.nameContainer}>
                {participant.image && <Image source={{ uri: participant.image }} style={styles.participantImage} />}
                <Text style={{ color: textColor }}>{participant.name || getTranslation('tournaments.tbd')}</Text>
            </View>
            <View style={styles.cell}>
                <Score style={{ color: textColor }} variant="label" score={participant.matchScore} />
            </View>
            <View style={styles.cell}>
                <Score style={{ color: textColor }} score={participant.gameScore} />
            </View>
            <View style={styles.cell}>
                <Text variant="label" style={{ color: textColor }}>
                    {participant.points}
                </Text>
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
            color: 'black',
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
    })
);
