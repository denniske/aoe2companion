import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { EventParticipant } from 'liquipedia';
import { MyText } from '../../components/my-text';
import { createStylesheet } from '../../../theming-new';
import { getTranslation } from '../../../helper/translate';
import { getVerifiedPlayerBy } from '@nex/data';
import { CountryImage } from '@app/view/components/country-image';
import { playerNameForSearch } from '@app/helper/tournaments';

export const PlayoffParticipant: React.FC<{ size?: number; participant: EventParticipant; winner: boolean; reversed?: boolean }> = ({
    participant,
    size = 14,
    winner,
    reversed,
}) => {
    const styles = useStyles();
    const verifiedPlayer = getVerifiedPlayerBy(
        (player) => player.liquipedia === participant.name || playerNameForSearch(player.name) === playerNameForSearch(participant.name)
    );

    return (
        <View style={[styles.nameContainer, reversed && styles.reversed]}>
            {participant.image ? (
                <Image source={{ uri: participant.image }} style={[styles.participantImage, { width: size * 2, height: size }]} />
            ) : (
                verifiedPlayer && <CountryImage country={verifiedPlayer.country} />
            )}
            <MyText numberOfLines={1} style={[{ fontSize: size, flex: 1, textAlign: reversed ? 'right' : 'left' }, winner && styles.winner]}>
                {verifiedPlayer?.name ?? (participant.name || getTranslation('tournaments.tbd'))}
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
        participantImage: {
            resizeMode: 'contain',
        },
    } as const)
);
