import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';
import { EventParticipant } from 'liquipedia';
import { Image } from 'expo-image';
import { getDifficultyIcon } from '../../helper/difficulties';
import { getVerifiedPlayerBy } from '@nex/data';
import { router } from 'expo-router';

export const TournamentParticipant: React.FC<{
    participant: EventParticipant;
    position?: number;
    size?: number;
    style?: ViewStyle;
    bold?: boolean;
}> = ({ participant, position, size = 14, style, bold = true }) => {
    const styles = useStyles();
    const difficulty = position && Math.abs(position - 4);
    const verifiedPlayer = getVerifiedPlayerBy((player) => player.liquipedia === participant.name || player.name === participant.name);
    const playerId = verifiedPlayer?.platforms.rl?.[0];

    return (
        <TouchableOpacity style={[styles.row, style]} onPress={() => router.navigate(`/matches/users/${playerId}`)} disabled={!playerId}>
            {participant.image && <Image source={{ uri: participant.image }} style={[styles.participantImage, { width: size * 2, height: size }]} />}
            <MyText style={[styles.name, { fontSize: size }, { fontWeight: playerId ? (bold ? 'bold' : '600') : 'normal' }]} numberOfLines={1}>
                {participant.name}
            </MyText>
            {difficulty && <Image source={getDifficultyIcon(difficulty)} style={styles.difficulty} />}
        </TouchableOpacity>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        row: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 5,
        },
        name: {
            flex: 1,
        },
        position: {
            fontWeight: '600',
            paddingLeft: 5,
        },
        difficulty: {
            width: 22,
            height: 22,
        },
        participantImage: {
            resizeMode: 'contain',
        },
    } as const)
);
