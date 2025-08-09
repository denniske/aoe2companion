import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { EventParticipant } from 'liquipedia';
import { MyText } from '../../components/my-text';
import { createStylesheet } from '../../../theming-new';
import { useTranslation } from '@app/helper/translate';

export const PlayoffParticipant: React.FC<{ size?: number; participant: EventParticipant; winner: boolean; reversed?: boolean }> = ({
    participant,
    size = 14,
    winner,
    reversed,
}) => {
    const getTranslation = useTranslation();
    const styles = useStyles();

    return (
        <View style={[styles.nameContainer, reversed && styles.reversed]}>
            {participant.image && <Image source={{ uri: participant.image }} contentFit="contain" style={{ width: size * 2, height: size }} />}
            <MyText numberOfLines={1} style={[{ fontSize: size, flex: 1, textAlign: reversed ? 'right' : 'left' }, winner && styles.winner]}>
                {participant.name || getTranslation('tournaments.tbd')}
            </MyText>
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        nameContainer: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            flex: 1,
        },
        reversed: {
            flexDirection: 'row-reverse',
        },
        winner: {
            fontWeight: '600',
        },
    } as const)
);
