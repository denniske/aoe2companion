import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';
import { EventParticipant } from 'liquipedia';
import { Image } from '@/src/components/uniwind/image';
import { getDifficultyIcon } from '../../helper/difficulties';
import { router } from 'expo-router';
import { FC } from 'react';

interface EventParticipantWithProfileId extends EventParticipant {
    profileId?: string;
}

export const TournamentParticipant: FC<{
    participant: EventParticipantWithProfileId;
    position?: number;
    size?: number;
    style?: ViewStyle;
    bold?: boolean;
    onNavigate?: () => void;
}> = ({ participant, position, size = 14, style, bold = true, onNavigate }) => {
    const styles = useStyles();
    const difficulty = position && Math.abs(position - 4);

    return (
        <TouchableOpacity
            style={[styles.row, style]}
            onPress={() => {
                router.navigate(`/matches/users/${participant.profileId}/main-profile`);
                onNavigate?.();
            }}
            disabled={!participant.profileId}
        >
            {participant.image && <Image source={{ uri: participant.image }} contentFit="contain" style={{ width: size * 2, height: size }} />}
            <MyText
                style={[styles.name, { fontSize: size }, { fontWeight: participant.profileId ? (bold ? 'bold' : '600') : 'normal' }]}
                numberOfLines={1}
            >
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
    } as const)
);
